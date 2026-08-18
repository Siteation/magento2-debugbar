/**
 * Installs the request watcher before anything else on the page can run.
 *
 * The bar itself loads as a deferred module at the end of the body, by which time the
 * theme has already fetched its private content. Wrapping fetch and XMLHttpRequest from a
 * blocking script in the head is the only way to see those requests at all.
 *
 * Deliberately tiny and dependency free: it buffers what it sees and does nothing else.
 * The bar drains the buffer when it boots.
 */
(function () {
  const HEADER = 'x-siteation-debugbar-profile'
  const state = { requests: [], onRequest: null, frontName: 'siteation_debugbar' }

  window.__siteationDebugBar = state

  function report(id, method, url, status) {
    if (!id || String(url).indexOf('/' + state.frontName + '/') !== -1) return

    const entry = {
      id: id,
      method: String(method || 'GET').toUpperCase(),
      url: String(url),
      status: status,
    }

    if (state.requests.some((seen) => seen.id === entry.id)) return

    state.requests.unshift(entry)
    state.requests = state.requests.slice(0, 25)

    if (typeof state.onRequest === 'function') state.onRequest(entry)
  }

  const nativeFetch = window.fetch

  if (typeof nativeFetch === 'function') {
    window.fetch = function () {
      const args = arguments

      return nativeFetch.apply(this, args).then(function (response) {
        try {
          const method = (args[1] && args[1].method)
            || (typeof Request !== 'undefined' && args[0] instanceof Request ? args[0].method : 'GET')

          report(response.headers.get(HEADER), method, response.url || args[0], response.status)
        } catch (error) {
          // Never let watching a request break it.
        }

        return response
      })
    }
  }

  const open = XMLHttpRequest.prototype.open
  const send = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__ndbMethod = method
    this.__ndbUrl = url

    return open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function () {
    const request = this

    request.addEventListener('load', function () {
      try {
        report(
          request.getResponseHeader(HEADER),
          request.__ndbMethod,
          request.__ndbUrl,
          request.status
        )
      } catch (error) {
        // As above.
      }
    })

    return send.apply(this, arguments)
  }
})()
