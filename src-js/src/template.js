import { header } from './header.js'
import { navigation } from './nav.js'
import { subTabs } from './tabs.js'
import { icon } from './icons.js'

/**
 * The bar's markup, rendered into the shadow root before Alpine initialises it.
 *
 * Two states share one header. Collapsed, it floats as a centered pill. Open, it is a
 * modal sheet with a backdrop, so the page behind it stops being interactive rather than
 * merely being covered up.
 *
 * Directives use the data-ndb- prefix so the host theme's own Alpine, which reads x-,
 * never sees them.
 *
 * @type {string}
 */
export const template = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme">

  <div class="ndb-dock" data-ndb-show="!open && !dismissed" data-ndb-cloak>
    ${header({ sheet: false })}
  </div>

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${header({ sheet: true })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${icon('menu')}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${navigation()}

        <div class="ndb-nav-scrim" data-ndb-show="navOpen"
             data-ndb-on:click="navOpen = false"></div>

    <div class="ndb-panel-body">

      <header class="ndb-section-head">
        <h2 data-ndb-text="currentSection.label"></h2>
        <p data-ndb-text="currentSection.lead"></p>
      </header>

      <div class="ndb-callout is-warn" data-ndb-show="sectionFindings.length > 0">
        <template data-ndb-for="(finding, index) in sectionFindings" data-ndb-bind:key="index">
          <p>
            <strong data-ndb-text="finding.message"></strong>
            <span data-ndb-text="finding.why"></span>
          </p>
        </template>
      </div>

      <div class="ndb-callout is-clear"
           data-ndb-show="section !== 'findings' && sectionFindings.length === 0">
        <p><strong>No clear problem found.</strong>
          Nothing in this section matched a rule.</p>
      </div>


      <div class="ndb-requests" data-ndb-show="requests.length > 0">
        <span class="ndb-requests-label">Requests</span>
        <button type="button" class="ndb-chip" data-ndb-on:click="showPageProfile()"
                data-ndb-bind:class="activeId === pageProfile.id && 'is-active'">
          Page
        </button>
        <template data-ndb-for="(entry, index) in requests" data-ndb-bind:key="index">
          <button type="button" class="ndb-chip"
                  data-ndb-on:click="showProfile(entry.id)"
                  data-ndb-bind:class="activeId === entry.id && 'is-active'">
            <span data-ndb-text="entry.method"></span>
            <span class="ndb-mono" data-ndb-text="shortUrl(entry.url)"></span>
            <span class="ndb-dim" data-ndb-text="entry.status"></span>
          </button>
        </template>
      </div>

      <p class="ndb-note" data-ndb-show="loading">Loading profile details.</p>
      <p class="ndb-note" data-ndb-show="loadError">
        Could not load profile details: <span data-ndb-text="loadError"></span>
      </p>

      <div data-ndb-show="isSection('findings')">
        <p class="ndb-empty" data-ndb-show="findings.length === 0">
          Nothing worth flagging on this request.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(finding, index) in findings" data-ndb-bind:key="index">
            <li class="ndb-finding" data-ndb-bind:class="'is-' + finding.severity">
              <div class="ndb-finding-head">
                <span class="ndb-severity" data-ndb-bind:class="'is-' + finding.severity"
                      data-ndb-text="finding.severity"></span>
                <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                <code class="ndb-dim ndb-finding-id" data-ndb-text="finding.id"></code>
              </div>
              <p class="ndb-finding-why" data-ndb-text="finding.why"></p>
              <p class="ndb-finding-next">
                <strong>Next</strong> <span data-ndb-text="finding.next"></span>
              </p>
              <p class="ndb-finding-where" data-ndb-show="finding.location">
                <strong>Where</strong> <code data-ndb-text="finding.location"></code>
              </p>
              <button type="button" class="ndb-chip" data-ndb-show="finding.action"
                      data-ndb-on:click="follow(finding.action)"
                      data-ndb-text="finding.action ? finding.action.label : ''"></button>
            </li>
          </template>
        </ol>
      </div>

      <div data-ndb-show="isSection('overview')">
        <p class="ndb-note" data-ndb-show="looksLikeFullPageCacheHit">
          No queries and no events. This page was almost certainly served from the full
          page cache, so the application never ran.
        </p>
        <dl class="ndb-facts">
          <div><dt>Method</dt><dd data-ndb-text="request.method"></dd></div>
          <div><dt>Path</dt><dd class="ndb-mono" data-ndb-text="request.path"></dd></div>
          <div><dt>Route</dt><dd data-ndb-text="request.route || 'unknown'"></dd></div>
          <div><dt>Action</dt><dd class="ndb-mono" data-ndb-text="request.action || 'unknown'"></dd></div>
          <div><dt>Area</dt><dd data-ndb-text="request.area"></dd></div>
          <div><dt>Status</dt><dd data-ndb-text="request.status"></dd></div>
          <div><dt>Duration</dt><dd><span data-ndb-text="number(metrics.duration_ms, 1)"></span> ms</dd></div>
          <div><dt>Memory peak</dt><dd><span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB</dd></div>
          <div><dt>Queries</dt><dd>
            <span data-ndb-text="queries.count || 0"></span> in
            <span data-ndb-text="number(queries.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Events</dt><dd>
            <span data-ndb-text="events.count || 0"></span> dispatched,
            <span data-ndb-text="events.unique_count || 0"></span> unique
          </dd></div>
          <div><dt>Observers</dt><dd>
            <span data-ndb-text="observers.count || 0"></span> in
            <span data-ndb-text="number(observers.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Blocks</dt><dd>
            <span data-ndb-text="blocks.unique_count || 0"></span> rendered in
            <span data-ndb-text="number(blocks.duration_ms, 1)"></span> ms
          </dd></div>
          <div><dt>Cache</dt><dd>
            <span data-ndb-text="cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'"></span>
          </dd></div>
          <div><dt>Profile</dt><dd class="ndb-mono ndb-dim" data-ndb-text="profile.id"></dd></div>
        </dl>
      </div>

      <div data-ndb-show="isSection('timeline')">
        <p class="ndb-section-lead">
          Follow important work in the order it happened across the request.
        </p>

        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'key'"
                  data-ndb-bind:class="timelineFilter === 'key' && 'is-active'">Key activity</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'all'"
                  data-ndb-bind:class="timelineFilter === 'all' && 'is-active'">Everything</button>
          <input class="ndb-search" type="search" placeholder="Filter activity"
                 data-ndb-model="timelineSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleTimeline.length"></span> of
            <span data-ndb-text="timeline.count || 0"></span> across
            <span data-ndb-text="number(timeline.scale_ms, 0)"></span> ms
          </span>
        </div>

        <div class="ndb-wf">
          <div class="ndb-wf-head">
            <span class="ndb-wf-activity">Activity</span>
            <span class="ndb-wf-track">
              <template data-ndb-for="(tick, index) in timelineAxis" data-ndb-bind:key="index">
                <span class="ndb-wf-tick" data-ndb-bind:style="'left:' + tick.percent + '%'"
                      data-ndb-text="tick.label"></span>
              </template>
            </span>
            <span class="ndb-wf-timing">Timing</span>
          </div>

          <template data-ndb-for="(entry, index) in visibleTimeline" data-ndb-bind:key="index">
            <div class="ndb-wf-row" data-ndb-bind:class="'is-' + entry.kind">
              <span class="ndb-wf-activity">
                <span class="ndb-wf-label" data-ndb-text="entry.label"></span>
                <small class="ndb-wf-section" data-ndb-text="entry.section"></small>
              </span>
              <span class="ndb-wf-track">
                <span class="ndb-wf-grid"></span>
                <span class="ndb-wf-bar" data-ndb-show="entry.kind === 'span'"
                      data-ndb-bind:style="'left:' + entry.start_percent + '%;width:' + Math.max(entry.duration_percent, 0.4) + '%'"></span>
                <span class="ndb-wf-dot" data-ndb-show="entry.kind !== 'span'"
                      data-ndb-bind:style="'left:' + entry.at_percent + '%'"></span>
              </span>
              <span class="ndb-wf-timing">
                <span class="ndb-wf-duration"
                      data-ndb-text="entry.duration_ms === null ? number(entry.at_ms, 1) + ' ms' : number(entry.duration_ms, 2) + ' ms'"></span>
                <small class="ndb-dim" data-ndb-show="entry.kind === 'span'"
                       data-ndb-text="number(entry.start_ms, 1) + '–' + number(entry.at_ms, 1) + ' ms'"></small>
              </span>
            </div>
          </template>
        </div>

        <p class="ndb-empty" data-ndb-show="visibleTimeline.length === 0">No activity matches.</p>
      </div>

      <div data-ndb-show="isSection('queries')">
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'all'"
                  data-ndb-bind:class="queryFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'slow'"
                  data-ndb-bind:class="queryFilter === 'slow' && 'is-active'">
            Slow <span class="ndb-pill" data-ndb-text="queries.slow_count || 0"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter SQL"
                 data-ndb-model="querySearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleQueries.length"></span> shown
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="queries.truncated">
          Collector limit reached. <span data-ndb-text="queries.dropped_count"></span>
          of <span data-ndb-text="queries.count"></span> queries were not retained.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(query, index) in visibleQueries" data-ndb-bind:key="index">
            <li class="ndb-query" data-ndb-bind:class="query.slow && 'is-slow'">
              <div class="ndb-query-head">
                <span class="ndb-query-time" data-ndb-text="number(query.duration_ms, 2) + ' ms'"></span>
                <span class="ndb-query-type" data-ndb-text="query.type"></span>
              </div>
              <code class="ndb-query-sql" data-ndb-text="query.sql"></code>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visibleQueries.length === 0">No queries match.</p>
      </div>

      <div data-ndb-show="isSection('events')">
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'all'"
                  data-ndb-bind:class="eventFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'unobserved'"
                  data-ndb-bind:class="eventFilter === 'unobserved' && 'is-active'">
            Unobserved <span class="ndb-pill" data-ndb-text="events.unobserved_count || 0"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter events"
                 data-ndb-model="eventSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleEvents.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Event</th>
              <th class="ndb-num">Dispatched</th>
              <th class="ndb-num">Observers</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(event, index) in visibleEvents" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="event.name"></td>
                <td class="ndb-num" data-ndb-text="event.count"></td>
                <td class="ndb-num" data-ndb-bind:class="event.observer_count === 0 && 'ndb-dim'"
                    data-ndb-text="event.observer_count"></td>
                <td class="ndb-num" data-ndb-text="number(event.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleEvents.length === 0">No events match.</p>
      </div>

      <div data-ndb-show="isSection('observers')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter observers"
                 data-ndb-model="observerSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleObservers.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Observer</th>
              <th>Event</th>
              <th class="ndb-num">Runs</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(observer, index) in visibleObservers" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="observer.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="observer.instance"></small>
                </td>
                <td class="ndb-mono" data-ndb-text="observer.event"></td>
                <td class="ndb-num" data-ndb-text="observer.count"></td>
                <td class="ndb-num" data-ndb-text="number(observer.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleObservers.length === 0">No observers match.</p>
      </div>

      <div data-ndb-show="isSection('cache')">
        <div class="ndb-controls">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="cache.hits || 0"></span> hits,
            <span data-ndb-text="cache.misses || 0"></span> misses,
            <span data-ndb-text="cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'"></span>
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Group</th>
              <th class="ndb-num">Operations</th>
              <th class="ndb-num">Hits</th>
              <th class="ndb-num">Misses</th>
              <th class="ndb-num">Size</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(group, index) in cacheItems" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="group.group"></td>
                <td class="ndb-num" data-ndb-text="group.count"></td>
                <td class="ndb-num" data-ndb-text="group.hits"></td>
                <td class="ndb-num" data-ndb-bind:class="group.misses > group.hits && 'is-warn'"
                    data-ndb-text="group.misses"></td>
                <td class="ndb-num" data-ndb-text="bytes(group.bytes)"></td>
                <td class="ndb-num" data-ndb-text="number(group.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="cacheItems.length === 0">No cache activity.</p>
      </div>

      <div data-ndb-show="isSection('blocks')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter blocks and templates"
                 data-ndb-model="blockSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleBlocks.length"></span> shown, own time excludes children
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Block</th>
              <th class="ndb-num">Renders</th>
              <th class="ndb-num">Own</th>
              <th class="ndb-num">Total</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(block, index) in visibleBlocks" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="block.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block"
                         data-ndb-text="block.template || block.class"></small>
                </td>
                <td class="ndb-num" data-ndb-text="block.count"></td>
                <td class="ndb-num" data-ndb-text="number(block.own_ms, 2) + ' ms'"></td>
                <td class="ndb-num ndb-dim" data-ndb-text="number(block.total_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleBlocks.length === 0">No blocks match.</p>
      </div>

      <div data-ndb-show="isSection('plugins')">
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter types and plugins"
                 data-ndb-model="pluginSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visiblePlugins.length"></span> intercepted types
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="interception.available === false">
          Magento exposes no public API for the plugin list, so this panel reads internals.
          They moved, and the panel switched itself off rather than break the page.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(entry, index) in visiblePlugins" data-ndb-bind:key="index">
            <li class="ndb-intercept">
              <div class="ndb-intercept-type">
                <code data-ndb-text="entry.type"></code>
                <span class="ndb-pill" data-ndb-text="entry.plugin_count"></span>
              </div>
              <ul class="ndb-intercept-plugins">
                <template data-ndb-for="(plugin, pluginIndex) in entry.plugins"
                          data-ndb-bind:key="pluginIndex">
                  <li>
                    <span data-ndb-text="plugin.code"></span>
                    <span class="ndb-dim ndb-mono" data-ndb-text="methodList(plugin)"></span>
                    <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="plugin.class"></small>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visiblePlugins.length === 0">No plugins match.</p>
      </div>

      <div data-ndb-show="isSection('alpine')">
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${subTabs('alpineTab', [
            { id: 'components', label: 'Components', count: 'alpineComponents.length' },
            { id: 'stores', label: 'Stores', count: 'alpineStores.length' },
            { id: 'deferred', label: 'Deferred', count: 'alpineDeferredCount' },
            { id: 'health', label: 'Health', count: 'alpineErrors.length' },
          ])}

          <p class="ndb-note" data-ndb-show="valuePolicy !== 'full'">
            The value policy is set to <span data-ndb-text="valuePolicy"></span>, so
            component state is treated exactly as a stored profile would be.
          </p>

          <div data-ndb-show="alpineTab === 'components' || alpineTab === 'deferred'">
            <div class="ndb-controls">
              <input class="ndb-search" type="search" placeholder="Filter components"
                     data-ndb-model="alpineSearch">
              <button type="button" class="ndb-chip"
                      data-ndb-bind:class="alpineLive && 'is-active'"
                      data-ndb-on:click="alpineLive = !alpineLive"
                      data-ndb-bind:title="alpineLive ? 'Stop reading the page' : 'Read the page again every second'">
                Live
              </button>
              <button type="button" class="ndb-chip" data-ndb-on:click="refreshAlpine()"
                      title="Read the page now">Refresh</button>
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="visibleAlpineComponents.length"></span> shown,
                <span data-ndb-text="alpinePendingCount"></span> not started
              </span>
            </div>

            <p class="ndb-note" data-ndb-show="alpineTab === 'deferred' && alpineDeferredCount === 0">
              Nothing on this page is deferred. Hyva defers a component with x-defer, and
              until it runs the component has no state at all.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="component in visibleAlpineComponents"
                        data-ndb-bind:key="component.id">
                <li class="ndb-alpine">
                  <button type="button" class="ndb-alpine-head"
                          data-ndb-on:click="toggleAlpineComponent(component.id)"
                          data-ndb-on:mouseenter="highlightAlpine(component.id, true)"
                          data-ndb-on:mouseleave="highlightAlpine(component.id, false)"
                          data-ndb-on:focus="highlightAlpine(component.id, true)"
                          data-ndb-on:blur="highlightAlpine(component.id, false)">
                    ${icon('caret', 'ndb-alpine-caret')}
                    <span class="ndb-alpine-name" data-ndb-text="component.name"></span>
                    <span class="ndb-tag is-warn" data-ndb-show="!component.initialised">
                      not started
                    </span>
                    <span class="ndb-tag" data-ndb-show="component.deferred"
                          data-ndb-text="'defer: ' + component.strategy"></span>
                    <span class="ndb-alpine-path ndb-mono ndb-dim ndb-truncate"
                          data-ndb-text="component.path"></span>
                    <span class="ndb-pill" data-ndb-show="component.keys"
                          data-ndb-text="component.keys"></span>
                  </button>

                  <div class="ndb-alpine-body" data-ndb-show="isAlpineExpanded(component.id)">
                    <code class="ndb-alpine-expression" data-ndb-show="component.expression"
                          data-ndb-text="component.expression"></code>
                    <pre class="ndb-json" data-ndb-text="alpineStates[component.id]"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="visibleAlpineComponents.length === 0">
              No components match.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'stores'">
            <div class="ndb-controls">
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="alpineStores.length"></span> registered with
                Alpine.store()
              </span>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="store in alpineStores" data-ndb-bind:key="store.name">
                <li class="ndb-alpine">
                  <div class="ndb-alpine-head is-static">
                    <span class="ndb-alpine-name" data-ndb-text="store.name"></span>
                    <span class="ndb-pill" data-ndb-show="store.keys"
                          data-ndb-text="store.keys"></span>
                  </div>
                  <div class="ndb-alpine-body">
                    <pre class="ndb-json" data-ndb-text="store.value"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="alpineStores.length === 0">
              No stores. Alpine keeps them in module state with no public getter, so an
              empty list can also mean this version does not let the bar reach them.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'health'">
            <dl class="ndb-facts">
              <div><dt>Version</dt><dd data-ndb-text="alpineHealth.version"></dd></div>
              <div><dt>Build</dt><dd data-ndb-text="alpineBuild"></dd></div>
              <div><dt>Prefix</dt><dd class="ndb-mono" data-ndb-text="alpineHealth.prefix"></dd></div>
              <div><dt>Loaded from</dt><dd class="ndb-mono"
                data-ndb-text="alpineHealth.source || 'not a separate file'"></dd></div>
              <div><dt>Components</dt><dd data-ndb-text="alpineComponents.length"></dd></div>
              <div><dt>Not started</dt><dd data-ndb-text="alpinePendingCount"></dd></div>
              <div><dt>Deferred</dt><dd data-ndb-text="alpineDeferredCount"></dd></div>
              <div><dt>Stores</dt><dd data-ndb-text="alpineStores.length"></dd></div>
            </dl>

            <p class="ndb-empty" data-ndb-show="alpineErrors.length === 0">
              No expression errors on this page.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(error, index) in alpineErrors"
                        data-ndb-bind:key="index">
                <li class="ndb-finding is-error">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity is-error"
                          data-ndb-text="error.during_init ? 'init' : 'runtime'"></span>
                    <span class="ndb-finding-message" data-ndb-text="error.message"></span>
                  </div>
                  <p class="ndb-finding-where" data-ndb-show="error.expression">
                    <strong>Expression</strong> <code data-ndb-text="error.expression"></code>
                  </p>
                  <p class="ndb-finding-where" data-ndb-show="error.element">
                    <strong>Where</strong> <code data-ndb-text="error.element"></code>
                  </p>
                </li>
              </template>
            </ol>
          </div>
        </div>
      </div>

      </div>
      </div>
    </div>
  </div>

</div>
`
