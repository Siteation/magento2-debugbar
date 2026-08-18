/**
 * The palette is the only place some commands exist at all, so a command that is built
 * wrong is a feature that is gone. Its list and its filter are plain functions for exactly
 * that reason.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { commandsFor, matchCommands, palette } from '../src/palette.js'
import { SECTIONS } from '../src/sections.js'

/**
 * @param {object} overrides
 * @returns {object} enough of the bar's component for the commands to be built
 */
function state(overrides = {}) {
  const base = {
    section: 'findings',
    theme: 'system',
    placement: 'bottom',
    open: false,
    maximised: false,
    favourites: [],
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

  base.isFavourite = (id) => base.favourites.includes(id)
  base.currentSection = SECTIONS.find((section) => section.id === base.section)

  return base
}

/**
 * @param {Array<object>} commands
 * @param {string} id
 * @returns {object}
 */
function byId(commands, id) {
  return commands.find((command) => command.id === id)
}

test('every section is reachable, and the current one says so', () => {
  const commands = commandsFor(state({ section: 'alpine' }))

  SECTIONS.forEach((section) => {
    const command = byId(commands, `section:${section.id}`)

    assert.ok(command, `${section.id} must be reachable from the palette`)
    assert.equal(command.kind, 'section')
    assert.equal(command.arg, section.id)
  })

  assert.equal(byId(commands, 'section:alpine').hint, 'Active section')
  assert.equal(byId(commands, 'section:queries').hint, '')
})

test('a section with a count shows it, and one without shows nothing', () => {
  const commands = commandsFor(state({ queries: { count: 12 } }))

  assert.equal(byId(commands, 'section:queries').hint, '12')
  assert.equal(byId(commands, 'section:blocks').hint, '')
})

test('the placement command is the only way to move the bar since it left the header', () => {
  const bottom = byId(commandsFor(state({ placement: 'bottom' })), 'placement')
  const top = byId(commandsFor(state({ placement: 'top' })), 'placement')

  assert.equal(bottom.label, 'Move the bar to the top')
  assert.equal(top.label, 'Move the bar to the bottom')
  assert.equal(bottom.kind, 'placement')
})

test('commands that toggle say what they will do, not what is true now', () => {
  const closed = commandsFor(state({ open: false, maximised: false }))
  const opened = commandsFor(state({ open: true, maximised: true }))

  assert.equal(byId(closed, 'inspector').label, 'Open the inspector')
  assert.equal(byId(opened, 'inspector').label, 'Minimise the inspector')
  assert.equal(byId(closed, 'maximise').label, 'Maximise the inspector')
  assert.equal(byId(opened, 'maximise').label, 'Restore the inspector')

  const pinned = state({ section: 'queries', favourites: ['queries'] })
  assert.equal(byId(commandsFor(pinned), 'favourite').label, 'Unpin Queries from favourites')
  assert.equal(
    byId(commandsFor(state({ section: 'queries' })), 'favourite').label,
    'Pin Queries to favourites'
  )
})

test('the current theme is marked and the others are not', () => {
  const commands = commandsFor(state({ theme: 'dark' }))

  assert.equal(byId(commands, 'theme:dark').hint, 'Current')
  assert.equal(byId(commands, 'theme:light').hint, '')
})

test('every command carries a kind the dispatcher handles', () => {
  // Kept in step with the switch in runCommand(). A command with an unknown kind is a row
  // that does nothing when it is chosen.
  const handled = new Set([
    'section', 'theme', 'placement', 'favourite', 'inspector', 'maximise', 'dismiss',
  ])

  commandsFor(state()).forEach((command) => {
    assert.ok(handled.has(command.kind), `${command.id} has an unhandled kind`)
    assert.ok(command.label, `${command.id} needs a label`)
    assert.equal(typeof command.hint, 'string')
  })

  const ids = commandsFor(state()).map((command) => command.id)
  assert.equal(new Set(ids).size, ids.length, 'command ids are keys in the template')
})

test('the filter reads the label, the group and the keywords', () => {
  const commands = commandsFor(state())

  assert.equal(matchCommands(commands, '').length, commands.length)
  assert.equal(matchCommands(commands, '   ').length, commands.length)
  assert.deepEqual(matchCommands(commands, 'dark').map((c) => c.id), ['theme:dark'])
  assert.deepEqual(matchCommands(commands, 'PLUGINS').map((c) => c.id), ['section:plugins'])
  assert.deepEqual(matchCommands(commands, 'star').map((c) => c.id), ['favourite'])
  assert.equal(matchCommands(commands, 'go to').length, SECTIONS.length)
  assert.equal(matchCommands(commands, 'nothing like this').length, 0)
})

test('a group heading is carried by the first row of each group', () => {
  const shown = matchCommands(commandsFor(state()), '')
  const leading = shown.filter((command) => command.leads).map((command) => command.group)

  assert.deepEqual(leading, ['Go to', 'Appearance', 'Window'])

  // Filtering can leave a group with a different first row, and the heading must move.
  const themes = matchCommands(commandsFor(state()), 'theme')
  assert.equal(themes[0].leads, true)
  assert.equal(themes[1].leads, false)
})

test('the palette is shown by a class, not by x-show', () => {
  const markup = palette()

  // x-show defers every reveal after the first through a setTimeout, so the input could
  // not be focused as it appears.
  assert.ok(!markup.includes('data-ndb-show="paletteOpen"'))
  assert.ok(markup.includes(`data-ndb-bind:class="paletteOpen && 'is-open'"`))
  assert.ok(markup.includes('data-ndb-ref="paletteInput"'))
  assert.ok(markup.includes('data-ndb-model="paletteSearch"'))
})

test('the palette loop variables do not shadow a component property', () => {
  const markup = palette()
  const loops = markup.match(/data-ndb-for="\(?([^ ,)]+)/g) || []

  assert.ok(loops.length > 0, 'the list is built with a loop')
  loops.forEach((loop) => {
    const name = loop.replace(/data-ndb-for="\(?/, '')

    assert.ok(
      !['section', 'theme', 'placement', 'open', 'maximised', 'favourites'].includes(name),
      `${name} is also a component property, so writes inside the loop would go to the row`
    )
  })
})
