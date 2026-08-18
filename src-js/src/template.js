/**
 * The bar's markup, rendered into the shadow root before Alpine initialises it.
 *
 * Directives use the data-ndb- prefix so the host theme's own Alpine, which reads x-,
 * never sees them.
 *
 * @type {string}
 */
export const template = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak>

  <section class="ndb-panel" data-ndb-show="open" data-ndb-cloak>
    <nav class="ndb-tabs">
      <button type="button" class="ndb-tab" data-ndb-on:click="select('overview')"
              data-ndb-bind:class="isSection('overview') && 'is-active'">Overview</button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('queries')"
              data-ndb-bind:class="isSection('queries') && 'is-active'">
        Queries <span class="ndb-pill" data-ndb-text="queries.count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('events')"
              data-ndb-bind:class="isSection('events') && 'is-active'">
        Events <span class="ndb-pill" data-ndb-text="events.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('observers')"
              data-ndb-bind:class="isSection('observers') && 'is-active'">
        Observers <span class="ndb-pill" data-ndb-text="observers.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('blocks')"
              data-ndb-bind:class="isSection('blocks') && 'is-active'">
        Blocks <span class="ndb-pill" data-ndb-text="blocks.unique_count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('cache')"
              data-ndb-bind:class="isSection('cache') && 'is-active'">
        Cache <span class="ndb-pill" data-ndb-text="cache.count || 0"></span>
      </button>
      <button type="button" class="ndb-tab" data-ndb-on:click="select('plugins')"
              data-ndb-bind:class="isSection('plugins') && 'is-active'">
        Plugins <span class="ndb-pill" data-ndb-text="interception.plugin_count || 0"></span>
      </button>
    </nav>

    <div class="ndb-panel-body">

      <p class="ndb-note" data-ndb-show="loading">Loading profile details.</p>
      <p class="ndb-note" data-ndb-show="loadError">
        Could not load profile details: <span data-ndb-text="loadError"></span>
      </p>

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

    </div>
  </section>

  <div class="ndb-strip">
    <button type="button" class="ndb-brand" data-ndb-on:click="toggle()"
            data-ndb-bind:aria-expanded="open ? 'true' : 'false'">
      <span class="ndb-logo">S</span>
      <span class="ndb-caret" data-ndb-bind:class="open && 'is-open'"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key" data-ndb-text="request.method"></span>
      <span class="ndb-metric-value ndb-mono ndb-truncate" data-ndb-text="request.path"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Status</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + statusTone"
            data-ndb-text="request.status"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Time</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + durationTone">
        <span data-ndb-text="number(metrics.duration_ms, 0)"></span> ms
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('queries')">
      <span class="ndb-metric-key">Queries</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + queryTone">
        <span data-ndb-text="queries.count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(queries.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('observers')">
      <span class="ndb-metric-key">Observers</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="observers.count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(observers.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('blocks')">
      <span class="ndb-metric-key">Blocks</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="blocks.unique_count || 0"></span>
        <span class="ndb-dim">/ <span data-ndb-text="number(blocks.duration_ms, 0)"></span> ms</span>
      </span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('cache')">
      <span class="ndb-metric-key">Cache</span>
      <span class="ndb-metric-value" data-ndb-bind:class="'is-' + cacheTone"
            data-ndb-text="cache.hit_rate === null ? '-' : number(cache.hit_rate, 0) + '%'"></span>
    </button>

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Memory</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB
      </span>
    </button>
  </div>

</div>
`
