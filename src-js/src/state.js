const STORAGE_KEY = 'siteation.debugbar.v1'

/**
 * The profile the response embedded as JSON.
 *
 * @returns {object}
 */
function readProfile() {
  const node = document.getElementById('siteation-debugbar-profile')

  if (!node) return {}

  try {
    return JSON.parse(node.textContent || '{}')
  } catch {
    return {}
  }
}

/**
 * Preferences survive navigation, so the bar does not reopen or collapse on every page.
 *
 * @returns {{open: boolean, section: string}}
 */
function readPreferences() {
  const fallback = { open: false, section: 'overview' }

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return fallback
  }
}

/**
 * @param {Array<object>} items
 * @param {string} term
 * @param {Array<string>} fields
 * @returns {Array<object>}
 */
function search(items, term, fields) {
  const needle = term.trim().toLowerCase()

  if (!needle) return items

  return items.filter((item) => fields.some(
    (field) => String(item[field] ?? '').toLowerCase().includes(needle)
  ))
}

/**
 * The bar's Alpine component.
 *
 * @returns {object} Alpine component definition
 */
export function debugBar() {
  return {
    profile: {},
    open: false,
    section: 'overview',
    queryFilter: 'all',
    querySearch: '',
    eventFilter: 'all',
    eventSearch: '',
    observerSearch: '',

    init() {
      this.profile = readProfile()

      const preferences = readPreferences()
      this.open = preferences.open
      this.section = preferences.section
    },

    /**
     * @param {string} key
     * @returns {object}
     */
    summaryOf(key) {
      return this.profile.sections?.[key]?.summary || {}
    },

    /**
     * @param {string} key
     * @returns {Array<object>}
     */
    itemsOf(key) {
      return this.profile.sections?.[key]?.payload?.items || []
    },

    /** @returns {object} */
    get request() {
      return this.summaryOf('request')
    },

    /** @returns {object} */
    get queries() {
      return this.summaryOf('queries')
    },

    /** @returns {object} */
    get events() {
      return this.summaryOf('events')
    },

    /** @returns {object} */
    get observers() {
      return this.summaryOf('observers')
    },

    /** @returns {object} */
    get cache() {
      return this.summaryOf('cache')
    },

    /** @returns {object} */
    get metrics() {
      return this.profile.metrics || {}
    },

    /** @returns {Array<object>} */
    get visibleQueries() {
      const items = this.queryFilter === 'slow'
        ? this.itemsOf('queries').filter((query) => query.slow)
        : this.itemsOf('queries')

      return search(items, this.querySearch, ['sql'])
    },

    /** @returns {Array<object>} */
    get visibleEvents() {
      const items = this.eventFilter === 'unobserved'
        ? this.itemsOf('events').filter((event) => event.observer_count === 0)
        : this.itemsOf('events')

      return search(items, this.eventSearch, ['name'])
    },

    /** @returns {Array<object>} */
    get visibleObservers() {
      return search(this.itemsOf('observers'), this.observerSearch, ['name', 'event', 'instance'])
    },

    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf('cache')
    },

    /** @returns {string} */
    get statusTone() {
      const status = Number(this.request.status || 0)

      if (status >= 500) return 'bad'
      if (status >= 400) return 'warn'

      return 'ok'
    },

    /** @returns {string} */
    get durationTone() {
      return Number(this.metrics.duration_ms || 0) >= 1000 ? 'warn' : 'ok'
    },

    /** @returns {string} */
    get queryTone() {
      return Number(this.queries.slow_count || 0) > 0 ? 'warn' : 'ok'
    },

    /** @returns {string} */
    get cacheTone() {
      const rate = this.cache.hit_rate

      if (rate === null || rate === undefined) return 'ok'

      return rate < 50 ? 'warn' : 'ok'
    },

    /**
     * A cached page never reaches most of the application, so an empty profile is the
     * expected result rather than a sign the bar is broken.
     *
     * @returns {boolean}
     */
    get looksLikeFullPageCacheHit() {
      return Number(this.queries.count || 0) === 0
        && Number(this.events.count || 0) === 0
    },

    toggle() {
      this.open = !this.open
      this.persist()
    },

    /** @param {string} section */
    select(section) {
      this.section = section
      this.open = true
      this.persist()
    },

    /**
     * @param {string} section
     * @returns {boolean}
     */
    isSection(section) {
      return this.section === section
    },

    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ open: this.open, section: this.section })
        )
      } catch {
        // A blocked localStorage is not a reason to lose the bar.
      }
    },

    /**
     * @param {number} value
     * @param {number} decimals
     * @returns {string}
     */
    number(value, decimals = 0) {
      return Number(value || 0).toFixed(decimals)
    },

    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(bytes) {
      const value = Number(bytes || 0)

      if (value < 1024) return `${value} B`
      if (value < 1048576) return `${(value / 1024).toFixed(1)} kB`

      return `${(value / 1048576).toFixed(1)} MB`
    },
  }
}
