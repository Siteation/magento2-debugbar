import { icon } from './icons.js'

/**
 * The header, used twice.
 *
 * The collapsed bar and the top of the inspector show the same thing, so it is built once
 * and interpolated into both. That is also why it carries the window controls: they mean
 * the same in either state.
 *
 * The metrics belong to the collapsed dock and not to the open sheet. Numbers at a glance
 * are the only reason a collapsed bar exists; once the sheet is open the overview carries
 * every one of them and the sidebar carries the counts. They were taking 480 of the
 * header's 1022 pixels to repeat what was already on the page below.
 *
 * They are text either way. They used to jump to their section, which made the header a
 * second navigation over the same destinations as the sidebar.
 *
 * The mode dot reports the deploy mode and nothing else. It used to take its colour from
 * the worst finding, which is what the findings icon beside it already says, with a count.
 *
 * The theme is here as well as in the palette. It was taken out when the header was
 * crowded, on the grounds that the palette already named all three, and that was a
 * mistake: naming a theme is a different act from flipping one, and a bar that renders on
 * a light admin and a dark storefront gets flipped often. Placement stays in the palette,
 * which is a preference set once.
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

${sheet ? '' : `  <div class="ndb-stats">
    <div class="ndb-stat">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + modeTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </div>

    <div class="ndb-stat">
      ${icon('database', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${icon('clock', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${icon('chip', 'is-accent')}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${icon('search')}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${icon('monitor')}</span>
      <span data-ndb-show="theme === 'light'">${icon('sun')}</span>
      <span data-ndb-show="theme === 'dark'">${icon('moon')}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${icon('alert')}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
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
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
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
