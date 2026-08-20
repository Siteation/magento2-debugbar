/**
 * The sections, in their default order.
 *
 * One list drives the sidebar, the headings and the counts, so a section cannot appear in
 * the navigation with a different name than it has at the top of its own panel.
 *
 * `lead` is not decoration. A panel that says what it is for is one a developer explores;
 * one that does not is one they guess at.
 *
 * `graded` is false where no rule can produce a finding, so those panels do not claim that
 * nothing is wrong with a request they are not about.
 *
 * @type {Array<{id: string, label: string, lead: string, graded?: boolean}>}
 */
export const SECTIONS = [
  {
    id: 'findings',
    label: 'Findings',
    lead: 'What is worth your attention on this request, worst first.',
  },
  {
    id: 'overview',
    label: 'Overview',
    lead: 'What was asked for, what came back, and what it cost.',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    lead: 'Follow important work in the order it happened across the request.',
    graded: false,
  },
  {
    id: 'queries',
    label: 'Queries',
    lead: 'Every database query, timed, with the application frame it came from.',
  },
  {
    id: 'blocks',
    label: 'Blocks',
    lead: 'Block render times. Own time excludes anything a block renders inside it.',
  },
  {
    id: 'observers',
    label: 'Observers',
    lead: 'Every observer that actually ran, grouped by event and ranked by cost.',
  },
  {
    id: 'events',
    label: 'Events',
    lead: 'Every dispatched event, including the ones nothing is listening to.',
    graded: false,
  },
  {
    id: 'cache',
    label: 'Cache',
    lead: 'Reads and writes grouped by key prefix, with the hit rate for each.',
  },
  {
    id: 'plugins',
    label: 'Plugins',
    lead: 'Which interceptors were built for this request, and on what.',
    graded: false,
  },
  {
    id: 'alpine',
    label: 'Alpine',
    lead: 'The components on the page right now, their state, and what has not started.',
    graded: false,
  },
  {
    id: 'history',
    label: 'History',
    lead: 'Every request still on disk, so an earlier one is one click away.',
    graded: false,
  },
]

/**
 * Counts shown beside each section in the sidebar. Null means the section has nothing
 * worth counting, so no badge is drawn rather than a misleading zero.
 *
 * Alpine is the one count that does not come from the profile. It is read from the page,
 * so it can change without the request changing.
 *
 * @param {string} id
 * @param {object} state the bar's Alpine component
 * @returns {number|null}
 */
export function countFor(id, state) {
  switch (id) {
    case 'findings': return state.findings.length || null
    case 'overview': return null
    case 'timeline': return state.timeline.count || null
    case 'queries': return state.queries.count || null
    case 'blocks': return state.blocks.unique_count || null
    case 'observers': return state.observers.unique_count || null
    case 'events': return state.events.unique_count || null
    case 'cache': return state.cache.count || null
    case 'plugins': return state.interception.plugin_count || null
    case 'alpine': return state.alpineComponents.length || null
    case 'history': return state.history.length || null
    default: return null
  }
}
