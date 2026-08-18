/**
 * Bridges the early watcher into the bar.
 *
 * The wrapping happens in early.js, from a blocking script in the head, because by the
 * time this module runs the theme has already made its first requests. All that is left
 * here is to take what was buffered and stay subscribed.
 *
 * @param {(entry: {id: string, method: string, url: string, status: number}) => void} onRequest
 * @returns {Array<object>} everything seen before the bar booted
 */
export function watchRequests(onRequest) {
  const state = window.__siteationDebugBar

  if (!state) return []

  state.onRequest = onRequest

  return state.requests.slice()
}
