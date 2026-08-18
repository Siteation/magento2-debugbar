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
    </nav>

    <div class="ndb-panel-body">

      <div data-ndb-show="isSection('overview')">
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
          <div><dt>Profile</dt><dd class="ndb-mono ndb-dim" data-ndb-text="profile.id"></dd></div>
        </dl>
      </div>

      <div data-ndb-show="isSection('queries')" class="ndb-queries">
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

    <button type="button" class="ndb-metric" data-ndb-on:click="select('overview')">
      <span class="ndb-metric-key">Memory</span>
      <span class="ndb-metric-value">
        <span data-ndb-text="number(metrics.memory_peak_mb, 1)"></span> MB
      </span>
    </button>
  </div>

</div>
`
