/**
 * The SEO section's hold on the live page.
 *
 * The checks in seo.js are pure; this is the part that is not. It reads the real document,
 * keeps the elements it found so a row can point at one again, and draws an outline the way
 * the Alpine section does: the inline style is put back exactly as it was found.
 */
import { browserEnvironment, inspectPage } from './seo.js'
import { markupOf } from './schema.js'

/** @type {Record<string, Array<Element>>} */
let found = { headings: [], images: [], links: [], schema: [] }

/** @type {Map<Element, {outline: string, offset: string}>} */
const outlines = new Map()

/**
 * @param {string} robotsHeader the X-Robots-Tag the server recorded for this page
 * @returns {object} the model, safe to put in reactive state
 */
export function readPage(robotsHeader = '') {
  // Outlines belong to elements from the last read. Drop them first, or a re-read would
  // leave one drawn on an element nothing points at any more.
  Array.from(outlines.keys()).forEach((element) => restore(element))

  const { model, elements } = inspectPage(document, {
    url: window.location.href,
    robotsHeader,
    env: browserEnvironment(),
  })

  found = elements

  return model
}

/**
 * @param {Element} element
 */
function restore(element) {
  const previous = outlines.get(element)

  if (!previous) return

  element.style.outline = previous.outline
  element.style.outlineOffset = previous.offset
  outlines.delete(element)
}

/**
 * The page's structured data as it is now, for pasting into a validator that cannot reach
 * this host.
 *
 * @returns {string}
 */
export function structuredMarkup() {
  return markupOf(document)
}

/**
 * @param {string} view headings, images, links or schema
 * @param {number} index
 * @param {boolean} on
 */
export function outline(view, index, on) {
  const element = (found[view] || [])[index]

  if (!element || !element.style) return

  if (!on) {
    restore(element)

    return
  }

  if (!outlines.has(element)) {
    outlines.set(element, {
      outline: element.style.outline || '',
      offset: element.style.outlineOffset || '',
    })
  }

  element.style.outline = '2px solid #7f9cf5'
  element.style.outlineOffset = '2px'
}

/**
 * Scrolls an element into the middle of the screen and outlines it, so "which one is that"
 * has an answer even when it is far down the page.
 *
 * @param {string} view
 * @param {number} index
 */
export function reveal(view, index) {
  const element = (found[view] || [])[index]

  if (!element) return

  element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  outline(view, index, true)
}
