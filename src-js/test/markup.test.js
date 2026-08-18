/**
 * The markup builders are plain string functions, so the parts of them that can fail
 * silently in a browser can be caught here instead.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { SECTIONS, countFor } from '../src/sections.js'
import { navigation } from '../src/nav.js'
import { subTabs } from '../src/tabs.js'

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
