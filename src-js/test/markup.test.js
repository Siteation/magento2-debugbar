/**
 * The markup builders are plain string functions, so the parts of them that can fail
 * silently in a browser can be caught here instead.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { SECTIONS, countFor } from '../src/sections.js'
import { facts } from '../src/facts.js'
import { header } from '../src/header.js'
import { navigation } from '../src/nav.js'
import { subTabs } from '../src/tabs.js'
import { template } from '../src/template.js'

/**
 * @param {object} overrides
 * @returns {object} enough of the bar's component for countFor to read
 */
function state(overrides = {}) {
  return {
    findings: [],
    timeline: {},
    queries: {},
    blocks: {},
    observers: {},
    events: {},
    cache: {},
    interception: {},
    alpineComponents: [],
    history: [],
    ...overrides,
  }
}

test('a section with nothing to count gets no badge rather than a zero', () => {
  SECTIONS.forEach((section) => {
    assert.equal(
      countFor(section.id, state()),
      null,
      `${section.id} should show nothing when it has nothing`
    )
  })
})

test('counts come from the summary each section actually has', () => {
  assert.equal(countFor('queries', state({ queries: { count: 12 } })), 12)
  assert.equal(countFor('blocks', state({ blocks: { unique_count: 4 } })), 4)
  assert.equal(countFor('plugins', state({ interception: { plugin_count: 7 } })), 7)
  assert.equal(countFor('alpine', state({ alpineComponents: [{}, {}] })), 2)
  assert.equal(countFor('overview', state({ queries: { count: 12 } })), null)
})

test('every section carries a label and a lead, since the panel prints both', () => {
  SECTIONS.forEach((section) => {
    assert.ok(section.id, 'a section needs an id')
    assert.ok(section.label, `${section.id} needs a label`)
    assert.ok(section.lead, `${section.id} needs a lead`)
  })

  const ids = SECTIONS.map((section) => section.id)
  assert.equal(new Set(ids).size, ids.length, 'section ids must be unique')
})

test('the sidebar loop variable does not shadow the component', () => {
  const markup = navigation()

  // Alpine resolves `this` inside a handler against the merged scope, innermost first, so
  // a loop variable called `section` sends `this.section = id` to the row being rendered
  // instead of to the component. Nothing throws when that happens: the label empties and
  // the panel never changes.
  assert.ok(
    !/data-ndb-for="\(?section[ ,)]/.test(markup),
    'the loop variable must not be named after a component property'
  )
  assert.ok(markup.includes('data-ndb-for="item in favouriteSections"'))
  assert.ok(markup.includes('select(item.id)'))
})

test('sub-tabs bind to the property they are given', () => {
  const markup = subTabs('alpineTab', [
    { id: 'components', label: 'Components', count: 'alpineComponents.length' },
    { id: 'health', label: 'Health' },
  ])

  assert.ok(markup.includes(`data-ndb-on:click="alpineTab = 'components'"`))
  assert.ok(markup.includes(`data-ndb-bind:class="alpineTab === 'health' && 'is-active'"`))
  assert.ok(markup.includes('data-ndb-text="alpineComponents.length"'))
  assert.equal(markup.match(/role="tab"/g).length, 2)
  assert.equal(markup.match(/ndb-pill/g).length, 1, 'a tab without a count gets no pill')
})

test('a count that means trouble does not look like a count that does not', () => {
  const neutral = subTabs('tab', [{ id: 'a', label: 'Components', count: 'components.length' }])
  const toned = subTabs('tab', [{
    id: 'b', label: 'Health', count: 'errors.length', tone: "errors.length ? 'bad' : 'ok'", always: true,
  }])

  assert.ok(!neutral.includes('data-ndb-bind:class="\'is-\''), 'a plain count stays plain')
  assert.ok(neutral.includes('data-ndb-show="components.length"'), 'and hides when it is zero')

  assert.ok(toned.includes(`data-ndb-bind:class="'is-' + (errors.length ? 'bad' : 'ok')"`))
  assert.ok(!toned.includes('data-ndb-show'), 'a toned badge says fine as well as broken')
})

test('a fact renders its value as an expression, not as text', () => {
  const markup = facts([{ label: 'Duration', value: "number(metrics.duration_ms, 2) + ' ms'" }])

  assert.ok(markup.includes('<dt>Duration</dt>'))
  assert.ok(markup.includes(`data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"`))
  assert.ok(!markup.includes('>Duration<span'))
})

test('a fact can be mono, toned, or raw markup', () => {
  const mono = facts([{ label: 'Route', value: 'request.route', mono: true }])
  assert.ok(mono.includes('class="ndb-fact-value ndb-mono"'))

  const toned = facts([{ label: 'Status', value: 'request.status', tone: 'statusTone' }])
  assert.ok(toned.includes(`data-ndb-bind:class="'is-' + (statusTone)"`))

  // Raw is for a value with its own markup, so it must not also be bound as text.
  const raw = facts([{ label: 'Queries', value: '<span data-ndb-text="queries.count"></span>', raw: true }])
  assert.ok(raw.includes('<span data-ndb-text="queries.count"></span>'))
  assert.ok(!raw.includes('data-ndb-text="<span'))
})

test('the overview tells the request as stages rather than as a list', () => {
  const steps = template.match(/<li class="ndb-step">/g) || []

  assert.equal(steps.length, 3, 'received, matched, responded')
  assert.ok(template.includes('<h3>Received</h3>'))
  assert.ok(template.includes('<h3>Matched</h3>'))
  assert.ok(template.includes('<h3>Responded</h3>'))
  assert.ok(template.includes('ndb-summary'), 'the request is restated in one line above')
})

test('the waterfall says what it is and what its marks mean', () => {
  assert.ok(template.includes('<h3>Waterfall</h3>'))
  assert.ok(template.includes('ndb-legend-bar'), 'duration')
  assert.ok(template.includes('ndb-legend-dot'), 'event')
  assert.ok(template.includes('Show activity'), 'the filter says what it filters')
  assert.ok(template.includes('Search activity'))
})

test('the metrics belong to the dock, not to the open sheet', () => {
  const dock = header({ sheet: false })
  const sheet = header({ sheet: true })

  // Collapsed, the numbers are the only reason the bar is on the page. Open, the overview
  // carries all of them and they were taking half the header to repeat it.
  assert.ok(dock.includes('ndb-stat-key'))
  assert.ok(!sheet.includes('ndb-stat-key'))
  assert.ok(sheet.includes('ndb-request'), 'the sheet still says which request this is')
})

test('the theme can be flipped without opening anything', () => {
  // Naming a theme is a different act from flipping one, and this bar renders on a light
  // admin and a dark storefront. Placement is a preference set once, so it stays away.
  const dock = header({ sheet: false })
  const sheet = header({ sheet: true })

  assert.ok(dock.includes('cycleTheme()'))
  assert.ok(sheet.includes('cycleTheme()'))
  assert.ok(!dock.includes('movePlacement'), 'placement is a palette command')
})

test('the whole collapsed bar opens the inspector, and a real button still does too', () => {
  const dock = template.slice(template.indexOf('class="ndb-dock"'), template.indexOf('ndb-overlay'))

  assert.ok(dock.includes('data-ndb-on:click="openFromBar($event)"'))

  // A div that reacts to a click is not reachable by keyboard, so the icon cannot go.
  assert.ok(header({ sheet: false }).includes('openInspector()'))
})

test('a panel with no data yet is not rendered at all', () => {
  // x-show hides an element and evaluates every expression inside it anyway, so a panel
  // bound to a null object throws once per binding on every page load, in silence unless
  // someone opens the console.
  assert.ok(template.includes('data-ndb-if="comparison"'))
  assert.ok(!template.includes('data-ndb-show="comparison"'))

  const guarded = template.slice(template.indexOf('data-ndb-if="comparison"'))
  const before = template.slice(0, template.indexOf('data-ndb-if="comparison"'))

  assert.ok(
    !/data-ndb-(text|for|html)="comparison\./.test(before),
    'every comparison expression belongs inside the guard'
  )
  assert.ok(/data-ndb-text="comparison\./.test(guarded), 'and there are some')
})
