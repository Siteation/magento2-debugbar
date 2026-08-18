import { watchRequests } from './requests.js'
import { keepFocusWithin, lockHost, unlockHost } from './host.js'
import { SECTIONS, countFor } from './sections.js'

const STORAGE_KEY = 'siteation.debugbar.v1'
const ID_PLACEHOLDER = '__PROFILE_ID__'

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
    placement: 'bottom',
    maximised: false,
    theme: 'system',
    resolvedTheme: 'dark',
    stopWatchingScheme: null,
    favourites: [],
    draggingId: null,
    dropTargetId: null,
    navOpen: false,
    // Deliberately not persisted. Hiding the bar for good with no way back would be a
    // trap, so closing it lasts until the next page load.
    dismissed: false,
    queryFilter: 'all',
    querySearch: '',
    eventFilter: 'all',
    eventSearch: '',
    observerSearch: '',
    blockSearch: '',
    pluginSearch: '',
    timelineFilter: 'key',
    timelineSearch: '',
    returnFocusTo: null,
    payloads: {},
    loading: false,
    loadError: '',
    requests: [],
    activeId: null,
    pageProfile: {},

    init() {
      this.profile = readProfile()

      this.pageProfile = this.profile
      this.activeId = this.profile.id || null

      const preferences = readPreferences()
      this.open = preferences.open
      this.section = preferences.section
      this.placement = preferences.placement === 'top' ? 'top' : 'bottom'
      this.maximised = Boolean(preferences.maximised)
      this.theme = ['system', 'light', 'dark'].includes(preferences.theme)
        ? preferences.theme
        : 'system'
      this.favourites = Array.isArray(preferences.favourites)
        ? preferences.favourites.filter((id) => SECTIONS.some((s) => s.id === id))
        : []
      this.watchColorScheme()

      if (this.open) this.$nextTick(() => this.lock())

      this.requests = watchRequests((entry) => {
        if (this.requests.some((seen) => seen.id === entry.id)) return

        this.requests = [entry, ...this.requests].slice(0, 25)
      }).filter((entry) => entry.id !== this.profile.id)

      if (this.open) this.loadPayloads()
    },

    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(id) {
      const template = document.getElementById('siteation-debugbar')?.dataset.profileUrl

      return template ? template.replace(ID_PLACEHOLDER, encodeURIComponent(id)) : null
    },

    /**
     * Swap the whole bar over to another profile the page has since produced.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async showProfile(id) {
      if (id === this.activeId) return

      const url = this.profileUrlFor(id)

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

        this.profile = full
        this.payloads = payloads
        this.activeId = id
      } catch (error) {
        this.loadError = String(error.message || error)
      } finally {
        this.loading = false
      }
    },

    /** Go back to the request that rendered the page. */
    showPageProfile() {
      if (this.activeId === this.pageProfile.id) return

      this.profile = this.pageProfile
      this.payloads = {}
      this.activeId = this.pageProfile.id || null
      this.loadPayloads()
    },

    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(url) {
      try {
        return new URL(url, window.location.origin).pathname
      } catch {
        return url
      }
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

      const url = this.profileUrlFor(this.profile.id || '')

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
    get timeline() {
      return this.summaryOf('timeline')
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

    /**
     * Key activity hides the long tail of fast points, which on a Magento page is most of
     * the list and none of the answer.
     *
     * @returns {Array<object>}
     */
    get visibleTimeline() {
      const items = this.timelineFilter === 'key'
        ? this.itemsOf('timeline').filter(
          (entry) => entry.kind === 'milestone' || Number(entry.duration_ms || 0) >= 1
        )
        : this.itemsOf('timeline')

      return search(items, this.timelineSearch, ['label', 'section'])
    },

    /** @returns {Array<object>} */
    get timelineAxis() {
      const scale = Number(this.timeline.scale_ms || 0)

      return [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
        percent: fraction * 100,
        label: `${(scale * fraction).toFixed(scale < 10 ? 1 : 0)} ms`,
      }))
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
    get statusPhrase() {
      const status = Number(this.request.status || 0)

      if (status >= 500) return 'Error'
      if (status >= 400) return 'Refused'
      if (status >= 300) return 'Redirect'

      return 'Success'
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

    /** @returns {Array<object>} every section with its count resolved */
    get sections() {
      return SECTIONS.map((section) => ({ ...section, count: countFor(section.id, this) }))
    },

    /** @returns {Array<object>} pinned sections, in the order they were arranged */
    get favouriteSections() {
      return this.favourites
        .map((id) => this.sections.find((section) => section.id === id))
        .filter(Boolean)
    },

    /** @returns {Array<object>} */
    get otherSections() {
      return this.sections.filter((section) => !this.favourites.includes(section.id))
    },

    /** @returns {object} */
    get currentSection() {
      return this.sections.find((section) => section.id === this.section) || this.sections[0]
    },

    /**
     * A section shows its own findings at the top, so the evidence and the conclusion sit
     * together rather than in two different places.
     *
     * @returns {Array<object>}
     */
    get sectionFindings() {
      if (this.section === 'findings') return []

      return this.findings.filter((finding) => finding.section === this.section)
    },

    /** @param {string} id */
    isFavourite(id) {
      return this.favourites.includes(id)
    },

    /** @param {string} id */
    toggleFavourite(id) {
      this.favourites = this.isFavourite(id)
        ? this.favourites.filter((favourite) => favourite !== id)
        : [...this.favourites, id]

      this.persist()
    },

    /** @param {string} id */
    startDrag(id) {
      this.draggingId = id
    },

    /** @param {string} id */
    dragOver(id) {
      if (this.draggingId && id !== this.draggingId) this.dropTargetId = id
    },

    /** @param {string} id */
    drop(id) {
      const from = this.favourites.indexOf(this.draggingId)
      const to = this.favourites.indexOf(id)

      if (from > -1 && to > -1 && from !== to) {
        const next = [...this.favourites]
        next.splice(to, 0, next.splice(from, 1)[0])
        this.favourites = next
        this.persist()
      }

      this.endDrag()
    },

    endDrag() {
      this.draggingId = null
      this.dropTargetId = null
    },

    /**
     * System is the default, so the bar follows the developer's own setting until they
     * say otherwise. The media query stays watched, so changing the OS theme while a page
     * is open takes effect without a reload.
     */
    watchColorScheme() {
      const query = window.matchMedia('(prefers-color-scheme: light)')

      const apply = () => {
        this.resolvedTheme = this.theme === 'system'
          ? (query.matches ? 'light' : 'dark')
          : this.theme
      }

      apply()
      this.stopWatchingScheme?.()
      query.addEventListener('change', apply)
      this.stopWatchingScheme = () => query.removeEventListener('change', apply)
    },

    cycleTheme() {
      const order = ['system', 'light', 'dark']
      this.theme = order[(order.indexOf(this.theme) + 1) % order.length]
      this.watchColorScheme()
      this.persist()
    },

    openInspector() {
      if (this.open) return

      this.returnFocusTo = this.$root.getRootNode().activeElement
      this.open = true
      this.persist()
      this.loadPayloads()
      this.$nextTick(() => this.lock())
    },

    closeInspector() {
      if (!this.open) return

      this.open = false
      this.persist()
      unlockHost()

      if (this.returnFocusTo && typeof this.returnFocusTo.focus === 'function') {
        this.returnFocusTo.focus()
      }
    },

    toggle() {
      this.open ? this.closeInspector() : this.openInspector()
    },

    toggleMaximised() {
      this.maximised = !this.maximised
      this.persist()
    },

    movePlacement() {
      this.placement = this.placement === 'bottom' ? 'top' : 'bottom'
      this.persist()
    },

    dismiss() {
      this.closeInspector()
      this.dismissed = true
    },

    lock() {
      lockHost(document.getElementById('siteation-debugbar'))
      this.$refs.sheet?.focus()
    },

    /** @param {KeyboardEvent} event */
    trapFocus(event) {
      if (event.key === 'Escape') {
        this.closeInspector()

        return
      }

      keepFocusWithin(event, this.$refs.sheet)
    },

    /** @param {string} section */
    select(section) {
      this.section = section
      this.navOpen = false
      this.openInspector()
      this.persist()
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          open: this.open,
          section: this.section,
          placement: this.placement,
          maximised: this.maximised,
          theme: this.theme,
          favourites: this.favourites,
        }))
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
