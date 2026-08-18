import './debugbar.css'
import { hostAlpine } from './host-alpine.js'
import Alpine from 'alpinejs'
import { debugBar } from './state.js'
import { template } from './template.js'

const PREFIX = 'data-ndb-'
const ROOT_ID = 'siteation-debugbar'

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

const host = document.getElementById(ROOT_ID)

if (host && !host.shadowRoot) {
  const root = mount(host)

  Alpine.prefix(PREFIX)
  Alpine.data('debugBar', debugBar)

  // Deliberately not Alpine.start(): a full start attaches a document wide mutation
  // observer that would also claim the host theme's @click and :class shorthands,
  // binding every one of them a second time. Initialising our own root is enough,
  // because x-for and x-if initialise the subtrees they create themselves.
  if (root) {
    Alpine.initTree(root)
  }

  if (hostAlpine) {
    window.Alpine = hostAlpine
  }
}
