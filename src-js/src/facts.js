/**
 * A fact grid: a small uppercase label with its value underneath.
 *
 * Taken from New Debug Bar's Request page, and it is the better shape. A label in a left
 * column and a value in a right one wastes half the width on labels and forces one fact
 * per line; label over value fits four across and reads as a row of facts rather than as
 * a form.
 *
 * Values are Alpine expressions, evaluated in the bar's component, not text.
 *
 * @typedef {object} Fact
 * @property {string} label
 * @property {string} value an expression, or markup when `raw` is set
 * @property {boolean} [mono] for paths, class names and anything else that is code
 * @property {boolean} [raw] value is markup to interpolate rather than an expression
 * @property {string} [tone] an expression resolving to ok, warn or bad
 * @property {string} [when] an expression; the fact is left out entirely when it is false
 */

/**
 * @param {Array<Fact>} items
 * @returns {string}
 */
export function facts(items) {
  const cells = items.map((item) => {
    const classes = ['ndb-fact-value', item.mono ? 'ndb-mono' : ''].filter(Boolean).join(' ')
    const tone = item.tone ? ` data-ndb-bind:class="'is-' + (${item.tone})"` : ''
    const value = item.raw
      ? `<dd class="${classes}"${tone}>${item.value}</dd>`
      : `<dd class="${classes}"${tone} data-ndb-text="${item.value}"></dd>`

    // Left out rather than hidden. A fact about a section the store does not collect has no
    // value to show, and "0" is a measurement rather than the absence of one.
    const when = item.when ? ` data-ndb-if="${item.when}"` : ''
    const fact = `
  <div class="ndb-fact">
    <dt>${item.label}</dt>
    ${value}
  </div>`

    return item.when ? `\n  <template${when}>${fact}\n  </template>` : fact
  }).join('')

  return `<dl class="ndb-facts">${cells}\n</dl>`
}
