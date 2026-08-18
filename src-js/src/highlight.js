/**
 * Syntax highlighting for the three languages the bar actually renders.
 *
 * `highlight.js/lib/core` plus the grammars we need, not the whole package: the full
 * distribution carries nearly two hundred languages and most of a megabyte, for a bar
 * whose entire bundle is smaller than that.
 *
 * PHP is not among them, despite being the language of everything the bar profiles. No
 * panel shows PHP source: a call site is a file and a line, an observer is a class name,
 * and a plugin is a method list. Adding a grammar nothing renders would be paying for a
 * feature that never appears.
 *
 * Output is HTML, so it reaches the DOM through x-html rather than x-text. highlight.js
 * escapes the source it is given, which is what makes that safe.
 */
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

/**
 * Highlighting the same string twice is common: every keystroke in a filter re-renders
 * every row that survives it. The cache is bounded because a profile can hold hundreds of
 * distinct statements and this is a debug bar, not a document store.
 *
 * @type {Map<string, string>}
 */
const cache = new Map()

const MAX_CACHED = 400

/** Longer than this and the highlighter costs more than the colour is worth. */
const MAX_LENGTH = 20000

/**
 * @param {string} value
 * @returns {string}
 */
function escape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * @param {unknown} code
 * @param {string} language one of javascript, json, sql
 * @returns {string} HTML, escaped
 */
export function highlight(code, language) {
  const source = String(code ?? '')

  if (source === '') return ''
  if (source.length > MAX_LENGTH) return escape(source)

  const key = `${language}:${source}`
  const hit = cache.get(key)

  if (hit !== undefined) return hit

  let html

  try {
    html = hljs.highlight(source, { language, ignoreIllegals: true }).value
  } catch {
    // A grammar that trips over its input must not cost the panel its content.
    html = escape(source)
  }

  if (cache.size >= MAX_CACHED) cache.clear()

  cache.set(key, html)

  return html
}
