/**
 * Makes the page behind the inspector inert while it is open.
 *
 * Ported from New Debug Bar. Without it the page keeps its scroll, keeps taking focus from
 * Tab, and keeps reacting to clicks that land past the sheet, which is what makes an
 * overlay feel like a div rather than a window.
 *
 * Everything it changes is recorded so it can be put back exactly.
 */
const KEY = '__siteationDebugBarHostLock'

/**
 * @param {HTMLElement} root the bar's own host element, which must stay interactive
 */
export function lockHost(root) {
  if (!root || window[KEY]) return

  const body = document.body
  const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
  const previous = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
    inert: [],
  }

  Array.from(body.children).forEach((element) => {
    if (element === root
      || element.contains(root)
      || !(element instanceof HTMLElement)
      || element.matches('script, style, link')) return

    previous.inert.push([element, element.inert])
    element.inert = true
  })

  body.style.overflow = 'hidden'

  // Replacing the scrollbar's width stops the page jumping sideways as it disappears.
  if (scrollbar > 0) {
    const current = Number.parseFloat(window.getComputedStyle(body).paddingRight || '0')
    body.style.paddingRight = `${current + scrollbar}px`
  }

  window[KEY] = previous
}

export function unlockHost() {
  const previous = window[KEY]

  if (!previous) return

  previous.inert.forEach(([element, wasInert]) => {
    element.inert = wasInert
  })

  document.body.style.overflow = previous.overflow
  document.body.style.paddingRight = previous.paddingRight

  delete window[KEY]
}

/**
 * Keeps Tab inside the sheet, so focus cannot wander onto the inert page.
 *
 * @param {KeyboardEvent} event
 * @param {HTMLElement} container
 */
export function keepFocusWithin(event, container) {
  if (event.key !== 'Tab' || !container) return

  const focusable = Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((element) => element.offsetParent !== null)

  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = container.getRootNode().activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
