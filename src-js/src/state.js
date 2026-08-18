const STORAGE_KEY = 'siteation.debugbar.v1'

/**
 * Read the profile the response embedded as JSON.
 *
 * @param {ShadowRoot|Document} scope
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
  try {
    return { open: false, section: 'overview', ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return { open: false, section: 'overview' }
  }
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

    init() {
      this.profile = readProfile()

      const preferences = readPreferences()
      this.open = preferences.open
      this.section = preferences.section
    },

    /** @returns {object} */
    get request() {
      return this.profile.sections?.request?.summary || {}
    },

    /** @returns {object} */
    get queries() {
      return this.profile.sections?.queries?.summary || {}
    },

    /** @returns {object} */
    get metrics() {
      return this.profile.metrics || {}
    },

    /** @returns {Array<object>} */
    get queryItems() {
      return this.profile.sections?.queries?.payload?.items || []
    },

    /** @returns {Array<object>} */
    get visibleQueries() {
      const search = this.querySearch.trim().toLowerCase()

      return this.queryItems.filter((query) => {
        if (this.queryFilter === 'slow' && !query.slow) return false
        if (search && !String(query.sql).toLowerCase().includes(search)) return false

        return true
      })
    },

    /** @returns {boolean} */
    get hasProfile() {
      return Boolean(this.profile.id)
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

    toggle() {
      this.open = !this.open
      this.persist()
    },

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ open: this.open, section: this.section }))
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
  }
}
