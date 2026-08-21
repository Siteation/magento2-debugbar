/**
 * Reads the page's Magewire, the way the Alpine section reads its Alpine.
 *
 * Magewire is Livewire 2 ported to Magento: the same protocol, the same client, the same
 * global under another name. Every component posts to one URL, so the server can say what a
 * request was for but not what is on the page; this can, and it costs the module no
 * dependency on Magewire to do it.
 *
 * Nothing is stored. A component's state is whatever the customer has typed into it, so it
 * goes through the browser side of the value policy before it is shown, exactly as component
 * state does in the Alpine section.
 */
import { POLICY_NONE, clean, keysOf } from './redact.js'

/** @type {Map<number|string, Element>} */
const elements = new Map()

/** @type {Map<string, {outline: string, offset: string}>} */
const outlines = new Map()

/**
 * @returns {object|null} the page's Magewire, or null where the store does not use it
 */
function instance() {
  const candidate = window.Magewire || window.magewire

  return candidate && typeof candidate === 'object' ? candidate : null
}

/**
 * Livewire keys its components by id in a store the public API does not expose. all()
 * hands back $wire proxies, which are for calling rather than for reading, so the section
 * reads the components themselves. It is internal, and it is the same internal every
 * Livewire devtool uses.
 *
 * @returns {Array<object>}
 */
function components() {
  const magewire = instance()

  try {
    return Object.values(magewire?.components?.componentsById ?? {})
  } catch {
    return []
  }
}

/**
 * How much state travels with the component on every update.
 *
 * The classic Livewire footgun is a public property holding a collection: it is serialised
 * into the page, posted back on every keystroke and returned again, and nothing says so.
 *
 * @param {object} memo
 * @returns {number}
 */
function memoBytes(memo) {
  try {
    return JSON.stringify(memo ?? {}).length
  } catch {
    return 0
  }
}

/**
 * @typedef {object} MagewireComponent
 * @property {string} id
 * @property {string} name
 * @property {string} resolver how Magewire built it
 * @property {string} handle the layout handle it was resolved against
 * @property {number} keys how many public properties it carries
 * @property {number} memo_bytes what its state weighs on the wire
 * @property {number} listeners events it answers
 * @property {number} children nested components
 * @property {string} path where its root element is
 */

/**
 * Every component on the page, cheaply. State is read only when a row is opened, for the
 * reason the Alpine section does the same: a page carries several and walking all of them
 * to fill rows nobody expanded is work for nothing.
 *
 * @param {string} policy
 * @returns {Array<MagewireComponent>}
 */
export function scanComponents(policy) {
  elements.clear()

  return components().map((component) => {
    const fingerprint = component.fingerprint ?? {}
    const memo = component.serverMemo ?? {}
    const id = String(fingerprint.id ?? '')

    if (component.el) elements.set(id, component.el)

    return {
      id,
      name: String(fingerprint.name ?? 'unknown'),
      resolver: String(fingerprint.resolver ?? 'unknown'),
      handle: String(fingerprint.handle ?? ''),
      keys: policy === POLICY_NONE ? 0 : keysOf(memo.data ?? {}).length,
      memo_bytes: memoBytes(memo),
      listeners: (component.effects?.listeners ?? []).length,
      children: Object.keys(memo.children ?? {}).length,
      path: component.el ? describe(component.el) : '',
    }
  })
}

/**
 * @param {Element} element
 * @returns {string}
 */
function describe(element) {
  const tag = element.tagName ? element.tagName.toLowerCase() : '?'

  return element.id ? `${tag}#${element.id}` : tag
}

/**
 * One component's state, redacted and ready to render.
 *
 * @param {string} id
 * @param {string} policy
 * @returns {string} pretty printed JSON, or a sentence explaining why there is none
 */
export function componentState(id, policy) {
  if (policy === POLICY_NONE) {
    return 'The value policy is set to none, so component state is not read.'
  }

  const component = components().find((entry) => String(entry.fingerprint?.id) === String(id))

  if (!component) return 'This component is no longer on the page.'

  try {
    return JSON.stringify(clean(component.serverMemo?.data ?? {}, policy), null, 2)
  } catch (error) {
    return `Could not read this component: ${error && error.message ? error.message : 'threw'}`
  }
}

/**
 * @typedef {object} MagewireHealth
 * @property {boolean} present
 * @property {number} components
 * @property {string} endpoint where updates are posted
 */

/**
 * @returns {MagewireHealth}
 */
export function magewireHealth() {
  return {
    present: instance() !== null,
    components: components().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || ''),
  }
}

/**
 * The round trip the server cannot see.
 *
 * A profile says a component update took 40 ms on the server. What the developer felt is
 * that plus the network and the DOM morph, and only the browser knows the difference.
 *
 * @param {(entry: object) => void} onMessage
 * @returns {boolean} whether the hooks could be registered
 */
export function watchMessages(onMessage) {
  const magewire = instance()

  if (!magewire || typeof magewire.hook !== 'function') return false

  const started = new Map()

  const name = (component) => String(component?.fingerprint?.name ?? 'unknown')
  const key = (message) => String(message?.component?.fingerprint?.id ?? '')

  try {
    magewire.hook('message.sent', (message, component) => {
      started.set(key(message), { at: performance.now(), name: name(component) })
    })

    // received is the response arriving, processed is after the DOM has been morphed. The
    // gap between them is the part a server profile can never account for.
    magewire.hook('message.processed', (message, component) => {
      const start = started.get(key(message))

      started.delete(key(message))

      onMessage({
        component: name(component),
        action: describeUpdates(message),
        duration_ms: start ? Math.round((performance.now() - start.at) * 10) / 10 : null,
        failed: false,
      })
    })

    magewire.hook('message.failed', (message, component) => {
      started.delete(key(message))

      onMessage({
        component: name(component),
        action: describeUpdates(message),
        duration_ms: null,
        failed: true,
      })
    })
  } catch {
    return false
  }

  return true
}

/**
 * What one message asked for, as one readable phrase. The same shape the server puts on a
 * profile, so the two lists read alike.
 *
 * @param {object} message
 * @returns {string}
 */
function describeUpdates(message) {
  const update = (message?.updateQueue ?? [])[0]

  if (!update) return 'refresh'

  // Through payload first. A method and a model action carry their name on the action
  // itself, an event action carries it only in the payload it will post, and reading the
  // wrong one of the three is how this said "on undefined".
  const payload = update.payload ?? {}
  const named = (...keys) => keys.map((key) => payload[key] ?? update[key]).find(Boolean) ?? 'unknown'

  if (update.type === 'callMethod') return `${named('method')}()`
  if (update.type === 'syncInput') return `set ${named('name')}`
  if (update.type === 'fireEvent') return `on ${named('event')}`

  return String(update.type || 'update')
}

/**
 * Outlines the element a row belongs to, which is the fastest way to answer "which one is
 * that". The inline style is put back exactly as it was found.
 *
 * @param {string} id
 * @param {boolean} on
 */
export function outline(id, on) {
  const element = elements.get(String(id))

  if (!element || !element.style) return

  if (on) {
    if (!outlines.has(String(id))) {
      outlines.set(String(id), {
        outline: element.style.outline || '',
        offset: element.style.outlineOffset || '',
      })
    }

    element.style.outline = '2px solid #7f9cf5'
    element.style.outlineOffset = '-2px'

    return
  }

  const previous = outlines.get(String(id))

  if (!previous) return

  element.style.outline = previous.outline
  element.style.outlineOffset = previous.offset
  outlines.delete(String(id))
}
