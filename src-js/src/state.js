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
    section: 'findings',
    queryFilter: 'all',
    querySearch: '',
    eventFilter: 'all',
    eventSearch: '',
    observerSearch: '',
    blockSearch: '',
    pluginSearch: '',
    payloads: {},
    loading: false,
    loadError: '',

    init() {
      this.profile = readProfile()

      const preferences = readPreferences()
      this.open = preferences.open
      this.section = preferences.section

      if (this.open) this.loadPayloads()
    },

    /**
     * Only summaries travel in the page. The items behind them are fetched once, the
     * first time the bar is opened, because a busy uncached page profiles to several
     * hundred kilobytes and that has no business on every response.
     *
     * @returns {Promise<void>}
     */
    async loadPayloads() {
      if (!this.profile.lazy || this.loading || Object.keys(this.payloads).length) return

      const url = document.getElementById('siteation-debugbar')?.dataset.profileUrl

      if (!url) return

      this.loading = true
      this.loadError = ''

      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const full = await response.json()
        const payloads = {}

        Object.entries(full.sections || {}).forEach(([key, section]) => {
          payloads[key] = section.payload || {}
        })

        this.payloads = payloads
      } catch (error) {
        this.loadError = String(error.message || error)
      } finally {
        this.loading = false
      }
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
      return this.payloads[key]?.items
        || this.profile.sections?.[key]?.payload?.items
        || []
    },

    /** @returns {Array<object>} */
    get findings() {
      return this.profile.findings || []
    },

    /** @returns {number} */
    get errorCount() {
      return this.findings.filter((finding) => finding.severity === 'error').length
    },

    /** @returns {number} */
    get warningCount() {
      return this.findings.filter((finding) => finding.severity === 'warning').length
    },

    /** @returns {string} */
    get findingsTone() {
      if (this.errorCount > 0) return 'bad'
      if (this.warningCount > 0) return 'warn'

      return 'ok'
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
    get blocks() {
      return this.summaryOf('blocks')
    },

    /** @returns {object} */
    get interception() {
      return this.summaryOf('interception')
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

    /** @returns {Array<object>} */
    get visibleBlocks() {
      return search(this.itemsOf('blocks'), this.blockSearch, ['name', 'template', 'class'])
    },

    /** @returns {Array<object>} */
    get visiblePlugins() {
      const needle = this.pluginSearch.trim().toLowerCase()

      if (!needle) return this.itemsOf('interception')

      return this.itemsOf('interception').filter((entry) => (
        entry.type.toLowerCase().includes(needle)
        || entry.plugins.some((plugin) => (
          plugin.code.toLowerCase().includes(needle)
          || plugin.class.toLowerCase().includes(needle)
        ))
      ))
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

      if (this.open) this.loadPayloads()
    },

    /** @param {string} section */
    select(section) {
      this.section = section
      this.open = true
      this.persist()
      this.loadPayloads()
    },

    /**
     * Findings are only useful if they lead somewhere, so each one carries the section
     * and filter that hold its evidence.
     *
     * @param {object} action
     */
    follow(action) {
      if (!action) return

      if (action.filter && action.section === 'queries') {
        this.queryFilter = action.filter === 'repeated' ? 'all' : action.filter
        this.querySearch = ''
      }

      this.select(action.section)
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
     * @param {object} plugin
     * @returns {string}
     */
    methodList(plugin) {
      return Object.entries(plugin.methods || {})
        .map(([method, kind]) => `${kind} ${method}`)
        .join(', ')
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
