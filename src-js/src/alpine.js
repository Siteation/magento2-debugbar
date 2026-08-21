/**
 * Reads the page's own Alpine.
 *
 * The bar carries its own Alpine under a data-ndb- prefix inside a shadow root, so the two
 * instances cannot see each other's markup. That isolation is what makes this section
 * possible: the bar can walk the page's components without either instance initialising
 * the other's directives.
 *
 * Nothing here is stored. The section reads live objects, which is also why every value
 * goes through the browser side of the value policy before it is shown.
 *
 * Neither instance tracks the other's reads, because each bundles its own reactivity
 * engine and the effect that is running is module state inside it. Reading a component's
 * state therefore cannot subscribe the bar to it, and a refresh has to be asked for.
 */
import ourAlpine from '@alpinejs/csp'
import { hostAlpine } from './host-alpine.js'
import { POLICY_NONE, clean, cleanExpression, cleanString, keysOf } from './redact.js'

/**
 * Ids are stable across scans, so a component stays expanded while the list refreshes.
 *
 * @type {WeakMap<Element, number>}
 */
const ids = new WeakMap()

/** @type {Map<number, Element>} */
const elements = new Map()

/** @type {Map<number, {outline: string, offset: string}>} */
const outlines = new Map()

let nextId = 0

/**
 * @returns {object|null} the page's Alpine, never the bar's own
 */
function instance() {
  const candidate = hostAlpine || window.Alpine

  if (!candidate || typeof candidate !== 'object' || candidate === ourAlpine) return null

  return candidate
}

/**
 * The page may use a prefix of its own, and the root selector follows it.
 *
 * @param {object} alpine
 * @returns {string}
 */
function dataAttribute(alpine) {
  try {
    return typeof alpine.prefixed === 'function' ? alpine.prefixed('data') : 'x-data'
  } catch {
    return 'x-data'
  }
}

/**
 * Runs something that may make Alpine complain, without the complaint reaching the console
 * or the error list. Used for the two probes below, which expect to fail on one build and
 * not the other.
 *
 * @param {() => unknown} probe
 * @returns {unknown}
 */
function quietly(probe) {
  const warn = console.warn

  try {
    console.warn = () => {}

    return probe()
  } catch {
    return undefined
  } finally {
    console.warn = warn
  }
}

/**
 * The CSP build swaps the evaluator for one that resolves dotted property paths and
 * nothing else, so an expression that is valid JavaScript but not a path tells the two
 * builds apart. Null means the question could not be answered.
 *
 * @param {object} alpine
 * @returns {boolean|null}
 */
function usesCspBuild(alpine) {
  if (typeof alpine.evaluate !== 'function') return null

  const result = quietly(() => alpine.evaluate(document.body, '1'))

  if (result === 1) return false

  return result === undefined ? true : null
}

/**
 * @returns {string} the scripts the page loaded Alpine from
 */
function sourceFiles() {
  return Array.from(document.scripts)
    .map((script) => script.src)
    .filter((src) => /alpine/i.test(src))
    .map((src) => src.split('/').pop().split('?')[0])
    .join(', ')
}

/**
 * Stores are module state inside Alpine with no public getter. Newer versions expose
 * injectMagics, which hands over every magic including $store; 3.14.3, which Hyva ships,
 * does not, and there the evaluator is the only way in. Both builds resolve $store.
 *
 * @param {object} alpine
 * @returns {object|null}
 */
function storeBag(alpine) {
  if (typeof alpine.injectMagics === 'function') {
    const bag = quietly(() => {
      const magics = {}
      alpine.injectMagics(magics, document.body)

      return magics.$store
    })

    if (bag && typeof bag === 'object') return bag
  }

  if (typeof alpine.evaluate === 'function') {
    const bag = quietly(() => alpine.evaluate(document.body, '$store'))

    if (bag && typeof bag === 'object') return bag
  }

  return null
}

/**
 * A component's own name, which is what a developer recognises. Anything registered with
 * Alpine.data is called as `name(...)` or named outright on the CSP build; an object
 * literal has no name and says so.
 *
 * @param {string} expression
 * @returns {string}
 */
function componentName(expression) {
  const match = expression.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/)

  return match ? match[1] : 'inline'
}

/**
 * Enough of a path to find the element again by eye, shortest useful form first.
 *
 * @param {Element} element
 * @returns {string}
 */
function domPath(element) {
  if (element.id) return `#${element.id}`

  const steps = []
  let current = element

  while (current && current !== document.body && steps.length < 4) {
    const parent = current.parentElement
    const tag = current.tagName.toLowerCase()

    if (current.id) {
      steps.unshift(`#${current.id}`)
      break
    }

    if (parent) {
      const sameTag = Array.from(parent.children).filter((child) => child.tagName === current.tagName)
      steps.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(current) + 1})` : tag)
    } else {
      steps.unshift(tag)
    }

    current = parent
  }

  return steps.join(' > ')
}

/**
 * @param {Element} element
 * @returns {number}
 */
function idFor(element) {
  if (!ids.has(element)) {
    nextId += 1
    ids.set(element, nextId)
  }

  return ids.get(element)
}

/**
 * The component's own scope, not the merged one.
 *
 * $data walks up the stack and folds every parent in, which for a nested component means
 * showing state that belongs to something further up the page. The first entry of the
 * stack is the component itself. It is internal, but it is the same internal every Alpine
 * 3 devtool reads, and $data is there as a fallback.
 *
 * @param {object} alpine
 * @param {Element} element
 * @returns {object|null}
 */
function dataOf(alpine, element) {
  const stack = element._x_dataStack

  if (Array.isArray(stack) && stack.length > 0) return stack[0]

  if (typeof alpine.$data !== 'function') return null

  try {
    return alpine.$data(element)
  } catch {
    return null
  }
}

/**
 * @typedef {object} AlpineComponent
 * @property {number} id
 * @property {string} name
 * @property {string} expression
 * @property {string} path
 * @property {boolean} initialised
 * @property {boolean} deferred
 * @property {string} strategy how Hyva deferred it, if it did
 * @property {number} keys how many properties the component holds
 */

/**
 * Every component root on the page, cheaply. State is only read when a row is opened,
 * because a category page carries dozens of components and walking all of them once a
 * second to fill a list nobody has expanded would be work for nothing.
 *
 * @param {string} policy
 * @returns {Array<AlpineComponent>}
 */
export function scanComponents(policy) {
  const alpine = instance()

  elements.clear()

  if (!alpine) return []

  const attribute = dataAttribute(alpine)
  const deferAttribute = `${attribute.replace(/data$/, '')}defer`
  const roots = Array.from(document.querySelectorAll(`[${attribute}]`))

  return roots.map((element) => {
    const id = idFor(element)
    const expression = (element.getAttribute(attribute) || '').trim()
    const strategy = (element.getAttribute(deferAttribute) || '').trim()
    const data = dataOf(alpine, element)

    elements.set(id, element)

    return {
      id,
      name: componentName(expression),
      expression: cleanExpression(expression, policy),
      path: domPath(element),
      initialised: Boolean(element._x_dataStack),
      deferred: element.hasAttribute(deferAttribute),
      strategy: strategy || 'none',
      keys: policy === POLICY_NONE || !data ? 0 : keysOf(data).length,
    }
  })
}



/**
 * One component's live state, redacted and ready to render.
 *
 * @param {number} id
 * @param {string} policy
 * @returns {string} pretty printed JSON, or a sentence explaining why there is none
 */
export function stateJson(id, policy) {
  if (policy === POLICY_NONE) {
    return 'The value policy is set to none, so component state is not read.'
  }

  const alpine = instance()
  const element = elements.get(id)

  if (!alpine || !element) return 'This component is no longer on the page.'
  if (!element._x_dataStack) return 'This component has not initialised, so it has no state yet.'

  const data = dataOf(alpine, element)

  if (!data) return 'Alpine would not hand over this component\'s scope.'

  try {
    return JSON.stringify(clean(data, policy), null, 2)
  } catch (error) {
    return `Could not read this component: ${error && error.message ? error.message : 'threw'}`
  }
}

/**
 * @typedef {object} AlpineStore
 * @property {string} name
 * @property {number} keys
 * @property {string} value pretty printed JSON
 */

/**
 * @param {string} policy
 * @returns {Array<AlpineStore>}
 */
export function scanStores(policy) {
  const alpine = instance()

  if (!alpine) return []

  const bag = storeBag(alpine)

  if (!bag) return []

  return Object.keys(bag).map((name) => {
    let value = bag[name]
    let keys = 0

    keys = value && typeof value === 'object' ? keysOf(value).length : 0

    if (policy === POLICY_NONE) {
      return { name, keys: 0, value: 'The value policy is set to none, so stores are not read.' }
    }

    try {
      value = JSON.stringify(clean(value, policy), null, 2)
    } catch (error) {
      value = `Could not read this store: ${error && error.message ? error.message : 'threw'}`
    }

    return { name, keys, value }
  })
}

/**
 * @typedef {object} AlpineError
 * @property {string} message
 * @property {string} expression the expression Alpine names, when it names one
 * @property {string} element
 * @property {boolean} during_init
 */

/**
 * Expression errors, as they were reported. Alpine 3.14.3 has no setErrorHandler, so
 * early.js watches console.warn instead and this only has to read what it collected.
 *
 * @param {string} policy
 * @returns {Array<AlpineError>}
 */
export function alpineErrors(policy) {
  const buffer = window.__siteationDebugBar

  if (!buffer || !Array.isArray(buffer.alpineErrors)) return []

  return buffer.alpineErrors.map((entry) => {
    const message = String(entry.message || '')
    const expression = message.match(/Expression: "([\s\S]*?)"/)

    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: cleanString(message.split('\n')[0].replace(/^Alpine (Expression )?Error:\s*/, ''), policy),
      expression: expression ? cleanExpression(expression[1], policy) : '',
      element: String(entry.element || ''),
      during_init: Boolean(entry.during_init),
    }
  })
}

/**
 * @typedef {object} AlpineHealth
 * @property {boolean} present
 * @property {string} version
 * @property {boolean|null} csp null when the build could not be determined
 * @property {string} source
 * @property {string} prefix
 */

/**
 * @returns {AlpineHealth}
 */
export function alpineHealth() {
  const alpine = instance()

  if (!alpine) {
    return { present: false, version: '', csp: null, source: sourceFiles(), prefix: '' }
  }

  return {
    present: true,
    version: String(alpine.version || 'unknown'),
    csp: usesCspBuild(alpine),
    source: sourceFiles(),
    prefix: dataAttribute(alpine),
  }
}

/**
 * Outlines the element a row belongs to, which is the fastest way to answer "which one is
 * that". The inline style is put back exactly as it was found.
 *
 * Named for what it draws rather than "highlight", which in this bar means syntax.
 *
 * @param {number} id
 * @param {boolean} on
 */
export function outline(id, on) {
  const element = elements.get(id)

  if (!element || !element.style) return

  if (on) {
    if (!outlines.has(id)) {
      // Both properties, because both are about to be written. Removing the offset on the
      // way out would leave a page that set one of its own without it.
      outlines.set(id, {
        outline: element.style.outline || '',
        offset: element.style.outlineOffset || '',
      })
    }

    element.style.outline = '2px solid #7f9cf5'
    element.style.outlineOffset = '-2px'

    return
  }

  if (!outlines.has(id)) return

  const previous = outlines.get(id)

  element.style.outline = previous.outline
  element.style.outlineOffset = previous.offset
  outlines.delete(id)
}
