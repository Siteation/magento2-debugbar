import { icon } from './icons.js'

/**
 * One sidebar row.
 *
 * Favourites can be dragged to reorder, so those rows carry the drag handlers and a drop
 * indicator. Everything else is a plain button.
 *
 * @param {string} collection  'favouriteSections' or 'otherSections'
 * @param {boolean} draggable
 * @returns {string}
 */
function rows(collection, draggable) {
  return `
<template data-ndb-for="section in ${collection}" data-ndb-bind:key="section.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === section.id && 'is-drop-target'"
       ${draggable ? `
       draggable="true"
       data-ndb-on:dragstart="startDrag(section.id)"
       data-ndb-on:dragover.prevent="dragOver(section.id)"
       data-ndb-on:drop.prevent="drop(section.id)"
       data-ndb-on:dragend="endDrag()"` : ''}>
    <button type="button" class="ndb-nav-item"
            data-ndb-bind:class="isSection(section.id) && 'is-active'"
            data-ndb-on:click="select(section.id)">
      <span class="ndb-nav-label" data-ndb-text="section.label"></span>
      <span class="ndb-nav-count" data-ndb-show="section.count"
            data-ndb-text="section.count"></span>
    </button>
    <button type="button" class="ndb-nav-pin"
            data-ndb-bind:class="isFavourite(section.id) && 'is-on'"
            data-ndb-on:click="toggleFavourite(section.id)"
            data-ndb-bind:title="isFavourite(section.id) ? 'Unpin' : 'Pin to favourites'">
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
