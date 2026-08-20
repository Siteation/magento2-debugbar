/**
 * The formatters, which used to live on a 1300-line component that node cannot import.
 *
 * Two of them are worth more than their size. editorUrl's scheme check is the only thing
 * between an admin-configured template and a link worth not clicking, and it had no coverage
 * in any suite: the browser test that touches it skips itself when no editor is configured.
 * deltaLabel computes the +/- sign itself while the verdict comes from the server, so an
 * inverted sign reports a regression as an improvement in the one feature built to say
 * whether a change helped.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  ago,
  bytes,
  deltaLabel,
  editorUrl,
  locationUrl,
  methodList,
  metricValue,
  number,
  plural,
  requestLabel,
  shortUrl,
} from '../src/format.js'

const ROOT = '/var/www/store'

test('an editor template without a scheme produces no link', () => {
  assert.equal(editorUrl('', ROOT, 'app/code/A.php', 10), '')
  assert.equal(editorUrl('open/%f:%l', ROOT, 'app/code/A.php', 10), '')
  assert.equal(editorUrl('phpstorm:%f', ROOT, 'app/code/A.php', 10), '', 'a scheme needs //')
})

test('a scheme that runs code rather than opening a file produces no link', () => {
  for (const template of [
    'javascript://%0aalert(1)',
    'JavaScript://x/%f',
    'data://text/html,%f',
    'vbscript://%f',
  ]) {
    assert.equal(editorUrl(template, ROOT, 'app/code/A.php', 10), '', template)
  }
})

test('a relative path is resolved against the root, an absolute one is left alone', () => {
  assert.equal(
    editorUrl('phpstorm://open?file=%f&line=%l', ROOT, 'app/code/A.php', 12),
    'phpstorm://open?file=/var/www/store/app/code/A.php&line=12'
  )
  assert.equal(
    editorUrl('phpstorm://open?file=%f&line=%l', ROOT, '/opt/other/B.php', 3),
    'phpstorm://open?file=/opt/other/B.php&line=3'
  )
})

test('a replacement pattern inside a path survives the replacement', () => {
  // $& and $1 mean something to String.replace, so a path holding one would eat itself if
  // the replacement were a string rather than a function.
  const url = editorUrl('vscode://file/%f:%l', ROOT, 'app/code/$&$1/A.php', 7)

  assert.ok(url.includes('$&$1'), url)
  assert.ok(url.endsWith(':7'))
})

test('a missing line number becomes line one rather than line zero', () => {
  assert.ok(editorUrl('vscode://file/%f:%l', ROOT, 'a.php', 0).endsWith(':1'))
})

test('a location only becomes a link when it is a file and a line', () => {
  const template = 'vscode://file/%f:%l'

  assert.ok(locationUrl(template, ROOT, 'app/code/A.php:120').includes('A.php'))
  assert.equal(locationUrl(template, ROOT, 'Magento\\Framework\\App\\Http'), '')
  assert.equal(locationUrl(template, ROOT, ''), '')
})

test('a delta keeps the sign the server did not send', () => {
  assert.equal(deltaLabel({ delta: -12.5, unit: 'ms', decimals: 1 }), '-12.5 ms')
  assert.equal(deltaLabel({ delta: 12.5, unit: 'ms', decimals: 1 }), '+12.5 ms')
  assert.equal(deltaLabel({ delta: 0, unit: 'ms', decimals: 1 }), 'no change')
})

test('a metric one side never measured is not a change of zero', () => {
  // Cache hit rate is null on a request that read no cache. Signed, it printed "-0" over a
  // number nobody wrote down.
  assert.equal(deltaLabel({ delta: null, unit: '%', decimals: 1 }), 'not comparable')
  assert.equal(metricValue({ baseline: null, unit: '%', decimals: 1 }, 'baseline'), 'none')
  assert.equal(metricValue({ subject: 80, unit: '%', decimals: 1 }, 'subject'), '80.0 %')
})

test('a delta in bytes is sized rather than counted', () => {
  assert.equal(deltaLabel({ delta: -2048, unit: 'B' }), '-2.0 kB')
})

test('bytes cross their thresholds where they should', () => {
  assert.equal(bytes(0), '0 B')
  assert.equal(bytes(1023), '1023 B')
  assert.equal(bytes(1024), '1.0 kB')
  assert.equal(bytes(1048575), '1024.0 kB')
  assert.equal(bytes(1048576), '1.0 MB')
  assert.equal(bytes(null), '0 B')
})

test('a long path keeps its last two segments, a short one keeps all of them', () => {
  const origin = 'https://store.test'

  assert.equal(shortUrl('/checkout/cart/', origin), '/checkout/cart/')
  assert.equal(
    shortUrl('/rest/default/V1/carts/mine-0000-0000-0000/shipping-information', origin),
    '…/mine-0000-0000-0000/shipping-information'
  )
  // Nothing to resolve against, so there is no path to shorten and the input stands.
  const unresolvable = '/some/very/long/path/that/keeps/going/and/going'
  assert.equal(shortUrl(unresolvable, ''), unresolvable)
})

test('a Magewire update is named by its component, everything else by its path', () => {
  // Every component posts to one URL, so the path is the one thing that cannot tell two of
  // them apart.
  assert.equal(
    requestLabel({ path: '/magewire/post/livewire', magewire: { component: 'cart', action: 'refresh()' } }),
    'cart refresh()'
  )
  assert.equal(
    requestLabel({ path: '/magewire/post/livewire', magewire: { component: 'cart' } }),
    'cart',
    'a component with no action is still a name'
  )
  assert.equal(requestLabel({ path: '/checkout/cart/' }), '/checkout/cart/')
  assert.equal(requestLabel({ path: '/x', magewire: { component: '' } }), '/x')
  assert.equal(requestLabel({}), '/')
  assert.equal(requestLabel(null), '/')
})

test('elapsed time reads in the largest unit that fits', () => {
  const now = 10_000

  assert.equal(ago(now - 5, now), '5s ago')
  assert.equal(ago(now - 120, now), '2m ago')
  assert.equal(ago(now - 7200, now), '2h ago')
  assert.equal(ago(now + 60, now), '0s ago', 'a clock skew is not a negative age')
})

test('the small formatters answer the edges', () => {
  assert.equal(number(null, 2), '0.00')
  assert.equal(number(1.005, 2), '1.00')
  assert.equal(plural(1, 'query', 'queries'), '1 query')
  assert.equal(plural(0, 'query', 'queries'), '0 queries')
  assert.equal(methodList({ methods: { save: 'around', load: 'before' } }), 'around save, before load')
  assert.equal(methodList({}), '')
})
