/**
 * Sub-tabs within a section.
 *
 * Deferred out of the navigation work until there was something to switch between. The
 * sidebar is for sections; this is for the views inside one, which is a different question
 * and reads better as a segmented control than as more sidebar rows.
 *
 * A count is a neutral fact until it is not. `tone` makes a badge say which: an error
 * count that looks like a component count is a number nobody reads twice.
 *
 * @param {string} model the component property holding the active tab
 * @param {Array<{id: string, label: string, count?: string, tone?: string, always?: boolean}>} items
 *   count and tone are expressions, evaluated in the component, not values
 * @returns {string}
 */
export function subTabs(model, items) {
  const buttons = items.map((item) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${model} === '${item.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${model} === '${item.id}' && 'is-active'"
          data-ndb-on:click="${model} = '${item.id}'">
    <span>${item.label}</span>
    ${item.count
      ? `<span class="ndb-pill"${item.tone ? ` data-ndb-bind:class="'is-' + (${item.tone})"` : ''}
            ${item.always ? '' : `data-ndb-show="${item.count}"`}
            data-ndb-text="${item.count}"></span>`
      : ''}
  </button>`).join('')

  return `<div class="ndb-subtabs" role="tablist">${buttons}</div>`
}
