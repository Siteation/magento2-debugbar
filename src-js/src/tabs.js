/**
 * Sub-tabs within a section.
 *
 * Deferred out of the navigation work until there was something to switch between. The
 * sidebar is for sections; this is for the views inside one, which is a different question
 * and reads better as a segmented control than as more sidebar rows.
 *
 * @param {string} model the component property holding the active tab
 * @param {Array<{id: string, label: string, count?: string}>} items count is an
 *   expression, evaluated in the component, not a value
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
      ? `<span class="ndb-pill" data-ndb-show="${item.count}" data-ndb-text="${item.count}"></span>`
      : ''}
  </button>`).join('')

  return `<div class="ndb-subtabs" role="tablist">${buttons}</div>`
}
