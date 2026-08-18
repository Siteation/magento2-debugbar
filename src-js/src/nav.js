import { icon } from './icons.js'

/**
 * One sidebar row.
 *
 * Favourites can be dragged to reorder, so those rows carry the drag handlers and a drop
 * indicator. Everything else is a plain button.
 *
 * The loop variable must not be called `section`. Alpine resolves `this` inside a handler
 * against the merged scope, innermost first, so a loop variable of that name shadows the
 * component's own `section` and `this.section = id` writes over the row being rendered
 * instead of changing the panel.
 *
 * @param {string} collection  'favouriteSections' or 'otherSections'
 * @param {boolean} draggable
 * @returns {string}
 */
function rows(collection, draggable) {
  return `
<template data-ndb-for="item in ${collection}" data-ndb-bind:key="item.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === item.id && 'is-drop-target'"
       ${draggable ? `
       draggable="true"
       data-ndb-on:dragstart="startDrag(item.id)"
       data-ndb-on:dragover.prevent="dragOver(item.id)"
       data-ndb-on:drop.prevent="drop(item.id)"
       data-ndb-on:dragend="endDrag()"` : ''}>
    <button type="button" class="ndb-nav-item"
            data-ndb-bind:class="isSection(item.id) && 'is-active'"
            data-ndb-on:click="select(item.id)">
      <span class="ndb-nav-label" data-ndb-text="item.label"></span>
      <span class="ndb-nav-count" data-ndb-show="item.count"
            data-ndb-text="item.count"></span>
    </button>
    <button type="button" class="ndb-nav-pin"
            data-ndb-bind:class="isFavourite(item.id) && 'is-on'"
            data-ndb-on:click="toggleFavourite(item.id)"
            data-ndb-bind:title="isFavourite(item.id) ? 'Unpin' : 'Pin to favourites'">
      ${icon('star')}
    </button>
  </div>
</template>`
}

/**
 * @returns {string}
 */
export function navigation() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${rows('favouriteSections', true)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${rows('otherSections', false)}
</nav>`
}
