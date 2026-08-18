import { watchRequests } from './requests.js'
import { keepFocusWithin, lockHost, unlockHost } from './host.js'
import { SECTIONS, countFor } from './sections.js'
import { commandsFor, matchCommands } from './palette.js'
import { policyName } from './redact.js'
import { highlight as highlightCode } from './highlight.js'
import {
  alpineErrors,
  alpineHealth,
  outline,
  scanComponents,
  scanStores,
  stateJson,
} from './alpine.js'

/** How often the Alpine section re-reads the page while it is the one being looked at. */
const LIVE_INTERVAL_MS = 1000

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
    alpineTab: 'components',
    alpineSearch: '',
    alpineLive: true,
    alpineComponents: [],
    alpineStores: [],
    alpineHealth: { present: false, version: '', csp: null, source: '', prefix: '' },
    alpineErrors: [],
    alpineExpanded: [],
    alpineStates: {},
    alpineTimer: null,
    // The Alpine section reads live objects instead of a redacted profile, so it has to
    // apply the policy itself. See Model/Redactor.php for the stored half.
    valuePolicy: 'full',
    timelineFilter: 'key',
    timelineSearch: '',
    returnFocusTo: null,
    paletteOpen: false,
    paletteSearch: '',
    paletteIndex: 0,
    paletteReturnFocus: null,
    payloads: {},
    loading: false,
    loadError: '',
    requests: [],
    history: [],
    historyLoading: false,
    historyError: '',
    historyLoaded: false,
    historyTab: 'recent',
    baselineId: '',
    comparison: null,
    comparing: false,
    compareError: '',
    copyState: '',
    copyFallback: '',
    editorTemplate: '',
    editorRoot: '',
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
      this.valuePolicy = policyName(this.rootElement()?.dataset.valuePolicy)
      this.editorTemplate = this.rootElement()?.dataset.editor || ''
      this.editorRoot = this.rootElement()?.dataset.editorRoot || ''
      this.refreshAlpine()

      this.$watch('alpineLiveWanted', () => this.syncAlpineLive())
      this.syncAlpineLive()

      this.$watch('paletteSearch', () => { this.paletteIndex = 0 })

      // Fetched on arrival rather than on load: it is a second request, and most visits to
      // the bar never open this section.
      this.$watch('section', (value) => {
        if (value === 'history') this.loadHistory()
      })

      if (this.open && this.section === 'history') this.loadHistory()

      // The comparison is against whatever is on screen, so switching profiles invalidates
      // it rather than leaving a diff labelled with the wrong request.
      this.$watch('activeId', () => {
        this.comparison = null
        this.baselineId = ''
      })

      // On the document, not on the bar: the shortcut has to work while the page has
      // focus, which is most of the time. Events from the shadow root are composed, so
      // this sees those too.
      document.addEventListener('keydown', (event) => this.paletteShortcut(event))

      if (this.open) this.$nextTick(() => this.lock())

      this.requests = watchRequests((entry) => {
        if (this.requests.some((seen) => seen.id === entry.id)) return

        this.requests = [entry, ...this.requests].slice(0, 25)
      }).filter((entry) => entry.id !== this.profile.id)

      if (this.open) this.loadPayloads()
    },

    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return document.getElementById('siteation-debugbar')
    },

    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(id) {
      const template = this.rootElement()?.dataset.profileUrl

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

    /**
     * @param {boolean} force refetch even if the list is already loaded
     * @returns {Promise<void>}
     */
    async loadHistory(force = false) {
      if (this.historyLoading || (this.historyLoaded && !force)) return

      const url = this.rootElement()?.dataset.historyUrl

      if (!url) return

      this.historyLoading = true
      this.historyError = ''

      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const body = await response.json()

        this.history = Array.isArray(body.profiles) ? body.profiles : []
        this.historyLoaded = true
      } catch (error) {
        this.historyError = String(error.message || error)
      } finally {
        this.historyLoading = false
      }
    },

    /** @returns {string} */
    get copyLabel() {
      if (this.copyState === 'working') return 'Copying'
      if (this.copyState === 'done') return 'Copied'
      if (this.copyState === 'failed') return 'Copy it yourself'
      if (this.copyState === 'error') return 'Report unavailable'

      return 'Copy for AI'
    },

    /**
     * The profile as markdown, on the clipboard, for an assistant that cannot call the MCP
     * server: a browser tab, a chat window, a colleague. The rendering happens in PHP so
     * there is one definition of the report rather than one per consumer.
     *
     * @returns {Promise<void>}
     */
    async copyReport() {
      const url = this.profileUrlFor(this.activeId || this.profile.id || '')

      if (!url) return

      this.copyState = 'working'
      this.copyFallback = ''

      let report = ''

      try {
        const response = await fetch(`${url}format/markdown/`, { headers: { Accept: 'text/markdown' } })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        report = await response.text()
      } catch {
        this.copyState = 'error'
        setTimeout(() => { this.copyState = '' }, 2500)

        return
      }

      try {
        await navigator.clipboard.writeText(report)
        this.copyState = 'done'
        setTimeout(() => { this.copyState = '' }, 2500)
      } catch {
        // A browser refuses the clipboard for reasons that have nothing to do with us: an
        // unfocused document, a permission not granted. The report is still worth having,
        // so it goes on screen to be selected by hand rather than being lost.
        this.copyState = 'failed'
        this.copyFallback = report
      }
    },

    /**
     * The request to compare against, chosen for the reader: the most recent other profile
     * for the same path, because that is what "what did my change cost" means. Failing
     * that, whatever came before this one.
     *
     * @returns {string}
     */
    suggestedBaseline() {
      const others = this.history.filter((entry) => entry.profile_id !== this.activeId)
      const path = this.request.path
      const samePath = others.find((entry) => entry.path === path)

      return (samePath || others[0])?.profile_id || ''
    },

    /** @returns {Array<object>} everything except the profile being looked at */
    get baselineChoices() {
      return this.history.filter((entry) => entry.profile_id !== this.activeId)
    },

    /**
     * @returns {Promise<void>}
     */
    async compareProfiles() {
      const template = this.rootElement()?.dataset.compareUrl
      const baseline = this.baselineId || this.suggestedBaseline()

      if (!template || !baseline || !this.activeId || baseline === this.activeId) return

      this.baselineId = baseline
      this.comparing = true
      this.compareError = ''

      const url = `${template}baseline/${encodeURIComponent(baseline)}`
        + `/subject/${encodeURIComponent(this.activeId)}/`

      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } })
        const body = await response.json()

        if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`)

        this.comparison = body
      } catch (error) {
        this.comparison = null
        this.compareError = String(error.message || error)
      } finally {
        this.comparing = false
      }
    },

    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(metric) {
      if (!metric || metric.delta === 0) return 'no change'

      const sign = metric.delta > 0 ? '+' : '-'
      const size = metric.unit === 'B'
        ? this.bytes(Math.abs(metric.delta))
        : `${this.number(Math.abs(metric.delta), metric.decimals)}${metric.unit ? ` ${metric.unit}` : ''}`

      return `${sign}${size}`
    },

    /**
     * @param {object} metric
     * @returns {string}
     */
    metricValue(metric, side) {
      const value = metric[side]

      if (value === null || value === undefined) return 'none'

      return metric.unit === 'B'
        ? this.bytes(value)
        : `${this.number(value, metric.decimals)}${metric.unit ? ` ${metric.unit}` : ''}`
    },

    /**
     * Loading one from the history means looking at a different request, so it lands on
     * the overview rather than leaving the reader on a panel about the old one.
     *
     * @param {string} id
     */
    async openFromHistory(id) {
      await this.showProfile(id)

      if (!this.loadError) this.section = 'overview'
    },

    /**
     * @param {number} seconds a unix timestamp
     * @returns {string}
     */
    ago(seconds) {
      const elapsed = Math.max(0, Date.now() / 1000 - Number(seconds || 0))

      if (elapsed < 60) return `${Math.round(elapsed)}s ago`
      if (elapsed < 3600) return `${Math.round(elapsed / 60)}m ago`

      return `${Math.round(elapsed / 3600)}h ago`
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
     * A path short enough to sit in a chip.
     *
     * A REST call carries a masked cart id in the middle and its meaning at the end, so a
     * long path keeps its last two segments rather than its first: `.../shipping-information`
     * says what the request was, `/rest/default/V1/carts` does not.
     *
     * @param {string} url
     * @returns {string}
     */
    shortUrl(url) {
      let path = url

      try {
        path = new URL(url, window.location.origin).pathname
      } catch {
        return url
      }

      if (path.length <= 42) return path

      const segments = path.split('/').filter(Boolean)

      return segments.length > 2 ? `…/${segments.slice(-2).join('/')}` : path
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
      const items = this.itemsOf('queries').filter((query) => {
        if (this.queryFilter === 'slow') return query.slow
        if (this.queryFilter === 'repeated') return Number(query.repeat_count || 1) > 1

        return true
      })

      return search(items, this.querySearch, ['sql'])
    },

    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf('queries').filter((query) => Number(query.repeat_count || 1) > 1).length
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

    /** @returns {Array<object>} */
    get visibleAlpineComponents() {
      const items = this.alpineTab === 'deferred'
        ? this.alpineComponents.filter((component) => component.deferred)
        : this.alpineComponents

      return search(items, this.alpineSearch, ['name', 'expression', 'path'])
    },

    /** @returns {number} */
    get alpineDeferredCount() {
      return this.alpineComponents.filter((component) => component.deferred).length
    },

    /**
     * A deferred component that has not run yet is the usual answer to "why is nothing
     * happening", so it is worth counting on its own.
     *
     * @returns {number}
     */
    get alpinePendingCount() {
      return this.alpineComponents.filter((component) => !component.initialised).length
    },

    /** @returns {string} */
    get alpineBuild() {
      if (this.alpineHealth.csp === null) return 'could not tell'

      return this.alpineHealth.csp ? 'CSP friendly' : 'standard'
    },

    /** @returns {Array<object>} */
    get commands() {
      return commandsFor(this)
    },

    /** @returns {Array<object>} */
    get visibleCommands() {
      return matchCommands(this.commands, this.paletteSearch)
    },

    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === 'alpine'
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

    /**
     * Developer mode is where the bar belongs. Default mode still allows it, and is close
     * enough to production to be worth a colour.
     *
     * @returns {string}
     */
    get modeTone() {
      return this.request.mode === 'developer' ? 'ok' : 'warn'
    },

    /**
     * The one line version of what happened, for the top of the overview.
     *
     * @returns {string}
     */
    get outcomePhrase() {
      const status = Number(this.request.status || 0)
      const took = `${this.number(this.metrics.duration_ms, 2)} ms`

      if (status >= 500) return `Failed after ${took}`
      if (status >= 400) return `Refused after ${took}`
      if (status >= 300) return `Redirected after ${took}`

      return `Completed successfully in ${took}`
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

    /** @param {string} theme */
    setTheme(theme) {
      this.theme = ['system', 'light', 'dark'].includes(theme) ? theme : 'system'
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
      lockHost(this.rootElement())
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
        this.queryFilter = action.filter
        this.querySearch = ''
      }

      this.select(action.section)
    },

    /**
     * The one section whose data is not in the profile, so it is read again rather than
     * waited for.
     */
    refreshAlpine() {
      this.alpineHealth = alpineHealth()
      this.alpineComponents = scanComponents(this.valuePolicy)
      this.alpineStores = scanStores(this.valuePolicy)
      this.alpineErrors = alpineErrors()

      this.alpineExpanded.forEach((id) => {
        this.alpineStates[id] = stateJson(id, this.valuePolicy)
      })
    },

    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        // Nobody is reading a background tab, and its timers are throttled anyway.
        this.alpineTimer = setInterval(() => {
          if (!document.hidden) this.refreshAlpine()
        }, LIVE_INTERVAL_MS)

        return
      }

      if (!this.alpineLiveWanted && this.alpineTimer) {
        clearInterval(this.alpineTimer)
        this.alpineTimer = null
      }
    },

    /**
     * @param {number} id
     * @returns {boolean}
     */
    isAlpineExpanded(id) {
      return this.alpineExpanded.includes(id)
    },

    /**
     * State is read here rather than during the scan, because a page carries dozens of
     * components and walking all of them to fill rows nobody opened is work for nothing.
     *
     * @param {number} id
     */
    toggleAlpineComponent(id) {
      if (this.isAlpineExpanded(id)) {
        this.alpineExpanded = this.alpineExpanded.filter((expanded) => expanded !== id)
        delete this.alpineStates[id]

        return
      }

      this.alpineExpanded = [...this.alpineExpanded, id]
      this.alpineStates[id] = stateJson(id, this.valuePolicy)
    },

    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(id, on) {
      outline(id, on)
    },

    /**
     * The palette does not lock the host itself. When the inspector is open the page is
     * already inert, and when it is not, locking here would have to be undone in the one
     * case where the command that just ran opened the inspector.
     */
    openPalette() {
      if (this.paletteOpen || this.dismissed) return

      this.paletteReturnFocus = this.$root.getRootNode().activeElement
      this.paletteSearch = ''
      this.paletteIndex = 0
      this.paletteOpen = true
      this.$nextTick(() => this.$refs.paletteInput?.focus())
    },

    closePalette() {
      if (!this.paletteOpen) return

      this.paletteOpen = false

      if (typeof this.paletteReturnFocus?.focus === 'function') {
        this.paletteReturnFocus.focus()
      }

      this.paletteReturnFocus = null
    },

    togglePalette() {
      this.paletteOpen ? this.closePalette() : this.openPalette()
    },

    /** @param {KeyboardEvent} event */
    paletteShortcut(event) {
      // KeyP rather than the key itself, so a layout that puts P elsewhere still works.
      if (event.code !== 'KeyP' || !event.shiftKey || !(event.metaKey || event.ctrlKey)) return

      event.preventDefault()
      this.togglePalette()
    },

    /** @param {KeyboardEvent} event */
    paletteKeys(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        this.closePalette()

        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.movePalette(1)

        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.movePalette(-1)

        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        this.runCommand(this.visibleCommands[this.paletteIndex])

        return
      }

      keepFocusWithin(event, this.$refs.palette)
    },

    /** @param {number} step */
    movePalette(step) {
      const total = this.visibleCommands.length

      if (total === 0) return

      this.paletteIndex = (this.paletteIndex + step + total) % total
      this.$nextTick(() => {
        this.$refs.palette?.querySelector('.ndb-palette-item.is-active')
          ?.scrollIntoView({ block: 'nearest' })
      })
    },

    /**
     * The palette closes first, so focus goes back to whatever opened it before the
     * command moves it somewhere else.
     *
     * @param {object} command
     */
    runCommand(command) {
      if (!command) return

      this.closePalette()

      switch (command.kind) {
        case 'section': this.select(command.arg); break
        case 'theme': this.setTheme(command.arg); break
        case 'placement': this.movePlacement(); break
        case 'favourite': this.toggleFavourite(command.arg); break
        case 'inspector': this.toggle(); break
        case 'maximise': this.toggleMaximised(); break
        case 'dismiss': this.dismiss(); break
        case 'copy': this.copyReport(); break
        default: break
      }
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
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(code, language) {
      return highlightCode(code, language)
    },

    /**
     * A link that opens the file at the line, or an empty string when no editor is
     * configured, in which case the call site stays plain text.
     *
     * Stored paths are relative to the application root, so the root is what gets mapped
     * for a container. An absolute path is left alone: it came from outside the root and
     * nothing here knows where it went.
     *
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(file, line) {
      if (!this.editorTemplate || !file) return ''

      const absolute = file.startsWith('/') ? file : `${this.editorRoot}/${file}`

      return this.editorTemplate
        .replace('%f', encodeURI(absolute))
        .replace('%l', String(line || 1))
    },

    /**
     * A finding's location is a class name as often as it is a file, so it only becomes a
     * link when it is one: `path/to/File.php:120`.
     *
     * @param {string} location
     * @returns {string}
     */
    locationUrl(location) {
      const match = String(location || '').match(/^(.+\.php):(\d+)$/)

      return match ? this.editorUrl(match[1], Number(match[2])) : ''
    },

    /**
     * The frame a query came from. The resolver drops framework and generated code, so the
     * first frame left is the application's own.
     *
     * @param {object} query
     * @returns {object|null}
     */
    callSite(query) {
      const frame = query?.callsite?.[0]

      return frame && frame.file ? frame : null
    },

    /**
     * @param {number} count
     * @param {string} one
     * @param {string} many
     * @returns {string}
     */
    plural(count, one, many) {
      return `${count} ${Number(count) === 1 ? one : many}`
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
