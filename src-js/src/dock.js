/** Keep a moved dock clear of the viewport edge, matching its default inset. */
export const DOCK_GAP = 12

/**
 * Only restore coordinates written by this version of the bar.
 *
 * @param {unknown} position
 * @returns {position is {left: number, top: number}}
 */
export function isDockPosition(position) {
  return Boolean(
    position
    && typeof position === 'object'
    && Number.isFinite(position.left)
    && Number.isFinite(position.top)
  )
}

/**
 * Fit the dock inside the current viewport. The dock is already no wider than the
 * viewport minus two gaps in CSS; Math.max also keeps this safe while it is being laid out.
 *
 * @param {{left: number, top: number}} position
 * @param {{width: number, height: number}} dock
 * @param {{width: number, height: number}} viewport
 * @returns {{left: number, top: number}}
 */
export function clampDockPosition(position, dock, viewport) {
  const maxLeft = Math.max(DOCK_GAP, viewport.width - dock.width - DOCK_GAP)
  const maxTop = Math.max(DOCK_GAP, viewport.height - dock.height - DOCK_GAP)

  return {
    left: Math.min(Math.max(position.left, DOCK_GAP), maxLeft),
    top: Math.min(Math.max(position.top, DOCK_GAP), maxTop),
  }
}

/**
 * The inspector and bubble still open against an edge. Use the edge nearest the moved
 * dock, so opening it never travels to the opposite side of the viewport.
 *
 * @param {{top: number}} position
 * @param {{height: number}} dock
 * @param {number} viewportHeight
 * @returns {'top'|'bottom'}
 */
export function placementForDock(position, dock, viewportHeight) {
  return position.top + (dock.height / 2) < viewportHeight / 2 ? 'top' : 'bottom'
}

/** Pointer travel before a press on the grip counts as a drag rather than a click. */
export const DRAG_THRESHOLD = 3

/**
 * @param {number} dx
 * @param {number} dy
 * @returns {boolean}
 */
export function exceedsDragThreshold(dx, dy) {
  return Math.hypot(dx, dy) >= DRAG_THRESHOLD
}
