import { SECTIONS, countFor } from './sections.js'
import { icon } from './icons.js'

/**
 * The command palette.
 *
 * Everything the bar can do, in one keyboard driven list, so nothing has to earn a place
 * in the header to be reachable. The dock placement toggle lives here rather than as a
 * sixth icon, and search is this rather than a control of its own.
 *
 * The commands are built as plain descriptors instead of closures. They pass through
 * Alpine's reactive proxy on their way to the template, and a description of what to do
 * survives that better than a function does, besides being readable in a test.
 *
 * @typedef {object} Command
 * @property {string} id
 * @property {string} group
 * @property {string} label
 * @property {string} hint shown right aligned, for state rather than instruction
 * @property {string} keywords matched alongside the label
 * @property {string} kind what runCommand() dispatches on
 * @property {string} arg
 * @property {boolean} leads whether this row opens a new group, and so carries its heading
 */

/**
 * @param {object} state the bar's Alpine component
 * @returns {Array<Command>}
 */
export function commandsFor(state) {
  return [...sectionCommands(state), ...appearanceCommands(state), ...windowCommands(state)]
}

/**
 * @param {object} state
 * @returns {Array<Command>}
 */
function sectionCommands(state) {
  return SECTIONS.map((section) => {
    const count = countFor(section.id, state)

    return {
      id: `section:${section.id}`,
      group: 'Go to',
      label: section.label,
      hint: state.section === section.id ? 'Active section' : (count ? String(count) : ''),
      keywords: section.id,
      kind: 'section',
      arg: section.id,
    }
  })
}

/**
 * @param {object} state
 * @returns {Array<Command>}
 */
function appearanceCommands(state) {
  const themes = [
    { value: 'system', label: 'Follow the system theme' },
    { value: 'light', label: 'Use the light theme' },
    { value: 'dark', label: 'Use the dark theme' },
  ]

  const current = state.currentSection || {}

  return [
    ...themes.map((theme) => ({
      id: `theme:${theme.value}`,
      group: 'Appearance',
      label: theme.label,
      hint: state.theme === theme.value ? 'Current' : '',
      keywords: `theme ${theme.value}`,
      kind: 'theme',
      arg: theme.value,
    })),
    {
      id: 'placement',
      group: 'Appearance',
      label: state.placement === 'bottom' ? 'Move the bar to the top' : 'Move the bar to the bottom',
      hint: '',
      keywords: 'placement dock top bottom move',
      kind: 'placement',
      arg: '',
    },
    {
      id: 'favourite',
      group: 'Appearance',
      label: state.isFavourite(state.section)
        ? `Unpin ${current.label} from favourites`
        : `Pin ${current.label} to favourites`,
      hint: '',
      keywords: 'favourite pin star sidebar',
      kind: 'favourite',
      arg: state.section,
    },
  ]
}

/**
 * @param {object} state
 * @returns {Array<Command>}
 */
function windowCommands(state) {
  return [
    {
      id: 'inspector',
      group: 'Window',
      label: state.open ? 'Minimise the inspector' : 'Open the inspector',
      hint: '',
      keywords: 'open close minimise inspector panel',
      kind: 'inspector',
      arg: '',
    },
    {
      id: 'maximise',
      group: 'Window',
      label: state.maximised ? 'Restore the inspector' : 'Maximise the inspector',
      hint: '',
      keywords: 'maximise restore fullscreen size',
      kind: 'maximise',
      arg: '',
    },
    {
      id: 'dismiss',
      group: 'Window',
      label: 'Hide the bar until the next page load',
      hint: '',
      keywords: 'hide dismiss close',
      kind: 'dismiss',
      arg: '',
    },
  ]
}

/**
 * Plain substring matching over the label, the group and the keywords. Fuzzy matching
 * reorders results in ways nobody can predict, and this list is short enough to read.
 *
 * The list stays flat, because the highlighted row is an index into it and grouping it
 * into arrays would mean two numbers to keep in step. Each row is only told whether it
 * opens a group, and the heading rides along with it.
 *
 * @param {Array<Command>} commands
 * @param {string} term
 * @returns {Array<Command>}
 */
export function matchCommands(commands, term) {
  const needle = String(term || '').trim().toLowerCase()
  const matched = needle
    ? commands.filter((command) => (
      `${command.group} ${command.label} ${command.keywords}`.toLowerCase().includes(needle)
    ))
    : commands

  return matched.map((command, position) => ({
    ...command,
    leads: position === 0 || matched[position - 1].group !== command.group,
  }))
}

/**
 * Shown by a class rather than by x-show. x-show defers every reveal after the first
 * through a setTimeout, so nothing can be timed against it, and the input has to be
 * focused the moment the palette appears. A class lands in the effect itself.
 *
 * @returns {string}
 */
export function palette() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${icon('search')}
      <input class="ndb-palette-input" type="text" data-ndb-ref="paletteInput"
             data-ndb-model="paletteSearch" autocomplete="off" spellcheck="false"
             placeholder="Search sections and settings" aria-label="Search commands">
    </div>

    <ul class="ndb-palette-list">
      <template data-ndb-for="(command, position) in visibleCommands"
                data-ndb-bind:key="command.id">
        <li>
          <p class="ndb-palette-heading" data-ndb-show="command.leads"
             data-ndb-text="command.group"></p>
          <button type="button" class="ndb-palette-item"
                  data-ndb-bind:class="paletteIndex === position && 'is-active'"
                  data-ndb-on:click="runCommand(command)"
                  data-ndb-on:mousemove="paletteIndex = position">
            <span class="ndb-palette-label" data-ndb-text="command.label"></span>
            <span class="ndb-palette-hint" data-ndb-text="command.hint"></span>
          </button>
        </li>
      </template>
    </ul>

    <p class="ndb-palette-empty" data-ndb-show="visibleCommands.length === 0">
      Nothing matches.
    </p>

    <div class="ndb-palette-foot">
      <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
      <span><kbd>&crarr;</kbd> Select</span>
      <span><kbd>Esc</kbd> Close</span>
    </div>
  </div>
</div>`
}
