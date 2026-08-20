/**
 * Installs the request watcher before anything else on the page can run.
 *
 * The bar itself loads as a deferred module at the end of the body, by which time the
 * theme has already fetched its private content. Wrapping fetch and XMLHttpRequest from a
 * blocking script in the head is the only way to see those requests at all.
 *
 * It also watches for Alpine's expression errors, for the same reason: components
 * initialise long before the bar loads, so an error thrown during init is over by the
 * time anything could ask about it.
 *
 * Deliberately tiny and dependency free: it buffers what it sees and does nothing else.
 * The bar drains the buffer when it boots.
 */
(function () {
  const HEADER = 'x-siteation-debugbar-profile'
  // What the request was, when the URL does not say. Every Magewire component posts to the
  // same one, so without this the list is a column of identical rows.
  const LABEL_HEADER = 'x-siteation-debugbar-label'
  const MAX_ERRORS = 25
  const state = {
    requests: [],
    onRequest: null,
    alpineErrors: [],
    alpineReady: false,
  }

  window.__siteationDebugBar = state

  function report(id, method, url, status, label) {
    // No URL filter for the bar's own endpoints: RequestEligibility::isOwnRequest excludes
    // them from collection, so their responses carry no profile header and the id check
    // above has already returned.
    if (!id) return

    const entry = {
      id: id,
      method: String(method || 'GET').toUpperCase(),
      // Without the query string. A section load carries ids and a search carries what was
      // typed, and this list only ever needs to say which request it was.
      url: String(url).split('?')[0],
      status: status,
      label: label ? String(label).slice(0, 240) : '',
    }

    if (state.requests.some((seen) => seen.id === entry.id)) return

    state.requests.unshift(entry)
    state.requests = state.requests.slice(0, 25)

    if (typeof state.onRequest === 'function') state.onRequest(entry)
  }

  window.addEventListener('alpine:initialized', function () {
    state.alpineReady = true
  }, { once: true, passive: true })

  function describe(element) {
    if (!element || !element.tagName) return ''

    const classes = typeof element.className === 'string' ? element.className.trim() : ''

    return element.tagName.toLowerCase()
      + (element.id ? '#' + element.id : '')
      + (classes ? '.' + classes.split(/\s+/).slice(0, 2).join('.') : '')
  }

  // Alpine 3.14.3, which Hyva ships, has no setErrorHandler, so the warning it writes is
  // the only place an expression error surfaces. The original is always called.
  const nativeWarn = console.warn

  console.warn = function (message) {
    try {
      if (typeof message === 'string'
        && message.indexOf('Alpine') === 0
        && state.alpineErrors.length < MAX_ERRORS) {
        state.alpineErrors.push({
          message: message,
          element: describe(arguments[1]),
          during_init: !state.alpineReady,
        })
      }
    } catch (error) {
      // Watching for an error must never become one.
    }

    return nativeWarn.apply(console, arguments)
  }

  const nativeFetch = window.fetch

  if (typeof nativeFetch === 'function') {
    window.fetch = function () {
      const args = arguments

      return nativeFetch.apply(this, args).then(function (response) {
        try {
          const method = (args[1] && args[1].method)
            || (typeof Request !== 'undefined' && args[0] instanceof Request ? args[0].method : 'GET')

          report(
            response.headers.get(HEADER),
            method,
            response.url || args[0],
            response.status,
            response.headers.get(LABEL_HEADER)
          )
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
          request.status,
          request.getResponseHeader(LABEL_HEADER)
        )
      } catch (error) {
        // As above.
      }
    })

    return send.apply(this, arguments)
  }
})()
