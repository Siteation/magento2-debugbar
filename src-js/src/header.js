import { icon } from './icons.js'

/**
 * The header, used twice.
 *
 * The collapsed bar and the top of the inspector show the same thing, so it is built once
 * and interpolated into both. That is also why it carries the window controls: they mean
 * the same in either state.
 *
 * @param {{sheet: boolean}} options
 * @returns {string}
 */
export function header({ sheet }) {
  return `
<div class="ndb-header">
  <button type="button" class="ndb-request" data-ndb-on:click="select('overview')"
          data-ndb-bind:title="request.path">
    <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
    <span class="ndb-request-body">
      <span class="ndb-path" data-ndb-text="request.path || '/'"></span>
      <span class="ndb-request-meta">
        <span data-ndb-bind:class="'is-' + statusTone" data-ndb-text="request.status"></span>
        <span data-ndb-text="statusPhrase"></span>
        <span class="ndb-dim" data-ndb-text="bytes(request.response_bytes)"></span>
      </span>
    </span>
  </button>

  <div class="ndb-stats">
    <button type="button" class="ndb-stat" data-ndb-on:click="select('overview')">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + findingsTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('queries')">
      ${icon('database', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </button>

    <button type="button" class="ndb-stat" data-ndb-on:click="select('timeline')">
      ${icon('clock', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('blocks')">
      ${icon('bolt', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Blocks</span>
        <span class="ndb-stat-value" data-ndb-text="blocks.unique_count || 0"></span>
      </span>
    </button>

    <button type="button" class="ndb-stat is-secondary" data-ndb-on:click="select('overview')">
      ${icon('chip', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </button>
  </div>

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${icon('search')}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="movePlacement()"
            data-ndb-bind:title="placement === 'bottom' ? 'Move to the top' : 'Move to the bottom'">
      ${icon('dock')}
    </button>

    <span class="ndb-controls-divider"></span>

    ${sheet ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${icon('expand')}</span>
      <span data-ndb-show="maximised">${icon('collapse')}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${icon('minimise')}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${icon('expand')}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="dismiss()"
            title="Hide until the next page load">
      ${icon('close')}
    </button>
  </div>
</div>`
}
