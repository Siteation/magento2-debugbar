import './debugbar.css'
import { hostAlpine } from './host-alpine.js'
import Alpine from '@alpinejs/csp'
import { debugBar } from './state.js'
import { template } from './template.js'

const PREFIX = 'data-ndb-'
const TAG = 'siteation-debugbar'

/**
 * Build the shadow root and hand back the element Alpine should initialise.
 *
 * A shadow root keeps the bar's styles off the store and the store's styles off the bar.
 * It also hides the bar's markup from the theme's Alpine, which matters because the two
 * instances would otherwise fight over shorthand attributes.
 *
 * @param {HTMLElement} host
 * @returns {HTMLElement|null}
 */
function mount(host) {
  const shadow = host.attachShadow({ mode: 'open' })
  const stylesheet = host.dataset.css

  if (stylesheet) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = stylesheet
    shadow.append(link)
  }

  const holder = document.createElement('div')
  holder.innerHTML = template
  shadow.append(...holder.children)

  return shadow.querySelector('.ndb')
}

/**
 * The element the injector writes before </body>.
 *
 * A custom element rather than a div with a known id: the element mounts itself when the
 * browser upgrades it, so nothing has to find it and nothing depends on this script
 * running after it. The tag name is then the only thing the injector, this bundle and the
 * error capture in early.js have to agree on.
 */
class DebugBarElement extends HTMLElement {
  connectedCallback() {
    // Upgrading, moving and re-inserting all arrive here, and attachShadow throws the
    // second time. The shadow root is the record of having mounted already.
    if (this.shadowRoot) return

    const root = mount(this)

    // Deliberately not Alpine.start(): a full start attaches a document wide mutation
    // observer that would also claim the host theme's @click and :class shorthands,
    // binding every one of them a second time. Initialising our own root is enough,
    // because x-for and x-if initialise the subtrees they create themselves.
    if (root) {
      Alpine.initTree(root)
    }
  }
}

// A second copy of this bundle on the page would throw on define() and take everything
// after it down with it, which the id check this replaced also guarded against.
if (!customElements.get(TAG)) {
  Alpine.prefix(PREFIX)
  Alpine.data('debugBar', debugBar)

  // The CSP build bans x-html outright, so the bar brings its own. The value is HTML the
  // highlighter produced, and highlight() escapes what it is given; nothing here evaluates
  // a string, which is what the policy is actually about.
  Alpine.directive('code', (el, { expression }, { effect, evaluateLater }) => {
    const read = evaluateLater(expression)

    effect(() => read((html) => {
      el.innerHTML = typeof html === 'string' ? html : ''
    }))
  })

  customElements.define(TAG, DebugBarElement)
}

if (hostAlpine) {
  window.Alpine = hostAlpine
}
