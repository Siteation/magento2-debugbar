/**
 * highlight() is the only escaping boundary in front of nine data-ndb-html sinks, and the
 * strings that reach it are page controlled: a product name in a component's live state, an
 * unquoted identifier in a query. Its output goes to the DOM as HTML rather than as text.
 *
 * The escaping is real today, but it is an assumption about a third-party library, and both
 * fallbacks hand-roll their own. These pin all three paths.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { highlight } from '../src/highlight.js'

const PAYLOAD = '<img src=x onerror=alert(1)>'

test('a tag in highlighted source never reaches the DOM as a tag', () => {
  const html = highlight(`SELECT * FROM t WHERE name = '${PAYLOAD}'`, 'sql')

  assert.ok(!html.includes('<img'), 'the payload survived as markup')
  assert.ok(html.includes('&lt;img'), 'and it is still readable as text')
})

test('the length fallback escapes rather than passing the source through', () => {
  // Above MAX_LENGTH the highlighter is skipped entirely, so this branch does its own
  // escaping and is the one most likely to be forgotten.
  const long = `${PAYLOAD}${' '.repeat(20001)}`
  const html = highlight(long, 'sql')

  assert.ok(!html.includes('<img'))
  assert.ok(html.startsWith('&lt;img'))
})

test('a language the highlighter does not know still escapes', () => {
  // hljs.highlight throws on an unregistered language, which is the catch that must not
  // hand the source back untouched.
  const html = highlight(PAYLOAD, 'no-such-language')

  assert.ok(!html.includes('<img'))
  assert.ok(html.includes('&lt;img'))
})

test('an ampersand is escaped once, not twice', () => {
  assert.ok(!highlight('a & b', 'sql').includes('&amp;amp;'))
})

test('nothing in becomes nothing out, rather than the string "null"', () => {
  assert.equal(highlight(null, 'sql'), '')
  assert.equal(highlight(undefined, 'sql'), '')
  assert.equal(highlight('', 'sql'), '')
})
