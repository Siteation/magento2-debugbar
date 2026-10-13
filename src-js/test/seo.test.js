/**
 * The SEO checks, against small pages.
 *
 * linkedom parses the fixture and has no layout, so everything a browser would measure
 * comes from the stub environment instead. That split is the point: what a check decides
 * is tested here, and what a browser draws is the one thing left to the browser suite.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseHTML } from 'linkedom'

import {
  canonical,
  canonicalDifference,
  emptyModel,
  headings,
  hreflang,
  images,
  inspectPage,
  languageProblem,
  links,
  looksLikeFilename,
  overview,
  quickLinks,
  robots,
  social,
  wordCount,
} from '../src/seo.js'

const URL_HERE = 'https://shop.test/women/tops.html'

/**
 * @param {string} head
 * @param {string} body
 * @param {string} [htmlAttributes]
 * @returns {Document}
 */
function page(head, body = '', htmlAttributes = 'lang="en"') {
  return parseHTML(`<!doctype html><html ${htmlAttributes}><head>${head}</head><body>${body}</body></html>`).document
}

/**
 * Everything visible, on the first screen, drawn at its real size, unless an element says
 * otherwise through data attributes the stub reads.
 *
 * @returns {import('../src/seo.js').Environment}
 */
function env() {
  return {
    viewportHeight: 800,
    pixelRatio: 1,
    measure(element) {
      const number = (name, fallback) => Number(element.getAttribute(name) ?? fallback)

      return {
        visible: element.getAttribute('data-hidden') === null,
        top: number('data-top', 0),
        width: number('data-drawn', 100),
        height: number('data-drawn-height', 100),
        naturalWidth: number('data-natural', 0),
        naturalHeight: number('data-natural-height', 0),
      }
    },
  }
}

const HEAD = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Women's tops, shirts and blouses for every season</title>
  <meta name="description" content="Tops, shirts and blouses in cotton and linen, with free returns on every order over fifty euros.">
  <link rel="canonical" href="${URL_HERE}">`

test('a well formed head has nothing to say', () => {
  const result = overview(page(HEAD), URL_HERE)

  assert.deepEqual(result.warnings, [])
  assert.equal(result.title.hint, '')
  assert.equal(result.description.hint, '')
  assert.equal(result.lang.value, 'en')
  assert.equal(result.charset.declared, true)
})

test('title and description lengths are judged both ways', () => {
  const short = overview(page('<title>Tops</title><meta name="description" content="Tops.">'), URL_HERE)

  assert.match(short.title.hint, /too short/)
  assert.match(short.description.hint, /too short/)

  const long = overview(page(`<title>${'x'.repeat(61)}</title>`), URL_HERE)

  assert.match(long.title.hint, /too long/)
  assert.equal(long.description.hint, 'missing')
})

test('a page with no canonical says so', () => {
  assert.deepEqual(canonical(page(''), URL_HERE).warnings, ['No canonical URL.'])
})

test('two canonical links are one warning, and the first is the one judged', () => {
  const result = canonical(page(`<link rel="canonical" href="${URL_HERE}"><link rel="Canonical" href="${URL_HERE}">`), URL_HERE)

  assert.equal(result.count, 2, 'rel is matched without regard to case')
  assert.equal(result.warnings.length, 1)
  assert.match(result.warnings[0], /2 canonical links/)
})

test('a relative canonical is flagged even when it resolves to this page', () => {
  const result = canonical(page('<link rel="canonical" href="/women/tops.html">'), URL_HERE)

  assert.equal(result.resolved, URL_HERE)
  assert.equal(result.warnings.length, 1)
  assert.match(result.warnings[0], /relative/)
})

test('a canonical that differs says why', () => {
  const here = new URL('https://shop.test/women/tops.html?color=red')
  const reason = (href) => canonicalDifference(new URL(href), here)

  assert.match(reason('https://shop.test/women/tops.html'), /query string \(\?color=red\)/)
  assert.match(reason('http://shop.test/women/tops.html?color=red'), /uses http and this page uses https/)
  assert.match(reason('https://www.shop.test/women/tops.html?color=red'), /another host, www\.shop\.test/)
  assert.match(reason('https://shop.test/women/tops.html/?color=red'), /trailing slash/)
  assert.match(reason('https://shop.test/women.html'), /points to \/women\.html/)
  assert.match(
    canonicalDifference(new URL('https://shop.test/a.html?p=2'), new URL('https://shop.test/a.html')),
    /adds a query string \(\?p=2\)/
  )
  assert.equal(reason('https://shop.test/women/tops.html?color=red#reviews'), '', 'a fragment is the same page')
})

test('robots directives from the tag and the header are both read', () => {
  const tag = robots(page('<meta name="robots" content="NOINDEX, follow">'))

  assert.equal(tag.meta, 'NOINDEX, follow')
  assert.deepEqual(tag.warnings, ['This page asks not to be indexed.'])

  const header = robots(page(''), 'none')

  assert.equal(header.header, 'none')
  assert.equal(header.warnings.length, 2, 'none is noindex and nofollow at once')
})

test('hreflang wants a self reference, an x-default and real codes', () => {
  const doc = page(`
    <link rel="alternate" hreflang="nl" href="https://shop.test/nl/tops.html">
    <link rel="alternate" hreflang="en-UK" href="https://shop.test/uk/tops.html">
    <link rel="alternate" hreflang="english" href="https://shop.test/en/tops.html">`)
  const result = hreflang(doc, URL_HERE)

  assert.equal(result.items.length, 3)
  assert.ok(result.warnings.some((warning) => /points to this page/.test(warning)))
  assert.ok(result.warnings.some((warning) => /x-default/.test(warning)))
  assert.ok(result.warnings.some((warning) => /use GB/.test(warning)))
  assert.ok(result.warnings.some((warning) => /"english" is not a valid/.test(warning)))
})

test('a complete hreflang set passes', () => {
  const doc = page(`
    <link rel="alternate" hreflang="en" href="${URL_HERE}">
    <link rel="alternate" hreflang="nl-NL" href="https://shop.test/nl/tops.html">
    <link rel="alternate" hreflang="x-default" href="${URL_HERE}">`)

  assert.deepEqual(hreflang(doc, URL_HERE).warnings, [])
})

test('a page with no hreflang has nothing to fix there', () => {
  assert.deepEqual(hreflang(page(''), URL_HERE), { items: [], warnings: [] })
})

test('language codes', () => {
  assert.equal(languageProblem('en'), '')
  assert.equal(languageProblem('zh-Hant-TW'), '')
  assert.equal(languageProblem('es-419'), '')
  assert.equal(languageProblem(''), 'missing')
  assert.match(languageProblem('en_US'), /not a valid/)
})

test('missing lang, viewport and charset are each named', () => {
  const result = overview(page('<title>x</title>', '', ''), URL_HERE)

  assert.ok(result.warnings.includes('<html lang> missing.'))
  assert.ok(result.warnings.some((warning) => /viewport/.test(warning)))
  assert.ok(result.warnings.some((warning) => /charset/.test(warning)))
})

test('the word count leaves out scripts and styles', () => {
  const doc = page('', `<p>Free returns on every order.</p><script>var a = "not words"</script>
    <style>.x { color: red }</style><p>Linen&nbsp;shirt, men's.</p>`)

  assert.equal(wordCount(doc.body), 8)
})

test('headings: no H1, a skipped level, an empty one and a hidden one', () => {
  const doc = page('', '<h2>Shop</h2><h4>Skipped</h4><h3></h3><h3 data-hidden>Gone</h3>')
  const result = headings(doc, env())

  assert.equal(result.items.length, 4)
  assert.equal(result.elements.length, 4)
  assert.ok(result.warnings.includes('No H1.'))
  assert.deepEqual(result.items[1].warnings, ['skips from h2 to h4'])
  assert.deepEqual(result.items[2].warnings, ['empty'])
  assert.deepEqual(result.items[3].warnings, ['hidden from view'])
})

test('two H1s are one warning, and going back up a level is not a skip', () => {
  const doc = page('', '<h1>One</h1><h2>a</h2><h3>b</h3><h1>Two</h1><h2>c</h2>')
  const result = headings(doc, env())

  assert.deepEqual(result.warnings, ['2 H1 headings. One page, one main heading.'])
})

test('alt text that is a file name', () => {
  assert.equal(looksLikeFilename('IMG_2041', '/media/x.jpg'), true)
  assert.equal(looksLikeFilename('hero.webp', '/media/hero.webp'), true)
  assert.equal(looksLikeFilename('wb04-blue-0', '/media/catalog/w/b/wb04-blue-0.jpg?v=2'), true)
  assert.equal(looksLikeFilename('Blue linen shirt', '/media/wb04-blue-0.jpg'), false)
  assert.equal(looksLikeFilename('', '/media/x.jpg'), false)
})

test('images: alt, dimensions, oversize and lazy on the first screen', () => {
  const doc = page('', `
    <img src="/a.jpg" alt="A shirt" width="100" height="100">
    <img src="/b.jpg" width="100" height="100">
    <img src="/c.jpg" alt="" width="100" height="100">
    <img src="/d.jpg" alt="Dress">
    <img src="/e.jpg" alt="Hero" width="100" height="100" data-drawn="300" data-natural="2400" data-natural-height="1200">
    <img src="/f.jpg" alt="Above" width="100" height="100" loading="lazy" data-top="200">
    <img src="/g.jpg" alt="Below" width="100" height="100" loading="lazy" data-top="2000">`)
  const result = images(doc, env())
  const warningsOf = (index) => result.items[index].warnings

  assert.deepEqual(warningsOf(0), [])
  assert.equal(result.items[1].alt, null)
  assert.deepEqual(warningsOf(1), ['no alt attribute'])
  assert.match(warningsOf(2)[0], /decorative/)
  assert.match(warningsOf(3)[0], /width and height/)
  assert.deepEqual(warningsOf(4), ['2400px wide but drawn at 300px'])
  assert.match(warningsOf(5)[0], /first screen/)
  assert.deepEqual(warningsOf(6), [], 'lazy below the first screen is what lazy is for')
  assert.equal(result.warnings[0], '5 of 7 images have a problem.')
})

test('an image drawn for a retina screen is not oversized', () => {
  const doc = page('', '<img src="/x.jpg" alt="Shirt" width="1" height="1" data-drawn="400" data-natural="800">')
  const retina = { ...env(), pixelRatio: 2 }

  assert.deepEqual(images(doc, retina).items[0].warnings, [])
})

test('links: counts, nofollow and every kind of bad link', () => {
  const doc = page('', `
    <a href="/women.html">Women</a>
    <a href="https://shop.test/men.html" rel="nofollow">Men</a>
    <a href="https://example.com/">Elsewhere</a>
    <a href="http://example.com/" rel="NoFollow sponsored">Insecure</a>
    <a href="#">Top</a>
    <a href="javascript:void(0)">Open</a>
    <a href="/cart"></a>
    <a href="/wishlist"><img src="/heart.svg" alt="Wishlist"></a>
    <a href="mailto:hi@shop.test">Mail</a>`)
  const result = links(doc, URL_HERE)
  const warningsOf = (index) => result.items[index].warnings

  assert.deepEqual(result.counts, { internal: 5, external: 2, nofollow: 2 })
  assert.deepEqual(warningsOf(0), [])
  assert.deepEqual(warningsOf(1), ['internal link marked nofollow'])
  assert.deepEqual(warningsOf(3), ['http: on an https: page'])
  assert.deepEqual(warningsOf(4), ['goes nowhere'])
  assert.match(warningsOf(5)[0], /javascript:/)
  assert.deepEqual(warningsOf(6), ['no text'])
  assert.equal(result.items[7].text, 'Wishlist', 'an image alt names the link')
  assert.equal(result.items[8].kind, 'other')
})

test('social: each required tag that is missing, and a relative og:image', () => {
  const doc = page(`
    <meta property="og:title" content="Tops">
    <meta name="og:type" content="website">
    <meta property="og:image" content="/media/tops.jpg">
    <meta name="twitter:title" content="Tops">`)
  const result = social(doc)

  assert.equal(result.openGraph.length, 3)
  assert.equal(result.x.length, 1)
  assert.deepEqual(result.warnings, [
    'Missing og:url.',
    'Missing twitter:card, so X shows a bare link.',
    'og:image is not a full URL, and link previews will not fetch it.',
  ])
})

test('quick links are built from the page origin, without the fragment', () => {
  const result = quickLinks('https://shop.test/tops.html?a=1#reviews')

  assert.equal(result[0].href, 'https://shop.test/robots.txt')
  assert.equal(result[1].href, 'https://shop.test/sitemap.xml')
  assert.equal(result[2].href, 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fshop.test%2Ftops.html%3Fa%3D1')
})

test('the page read keeps elements out of the model and counts every problem', () => {
  const doc = page(HEAD, `
    <h1>Tops</h1>
    <img src="/a.jpg">
    <a href="#">Top</a><a href="/x">Fine</a>`)
  const { model, elements } = inspectPage(doc, { url: URL_HERE, env: env() })

  assert.equal(elements.headings.length, 1)
  assert.equal(elements.images.length, 1)
  assert.equal(elements.links.length, 2)
  assert.equal(model.headings.elements, undefined, 'a page element in reactive state gets proxied')
  assert.doesNotThrow(() => JSON.stringify(model))

  // Missing og:title, og:type, og:image, og:url and twitter:card, one image, one link.
  assert.deepEqual(model.counts, { overview: 0, headings: 0, images: 1, links: 1, schema: 0, social: 5 })
  assert.equal(model.warningCount, 7)
})

test('the empty model has every key the panel reads', () => {
  const { model } = inspectPage(page(HEAD), { url: URL_HERE, env: env() })
  const empty = emptyModel()
  const shape = (value) => (value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]))
    : Array.isArray(value) ? 'array' : typeof value)

  assert.deepEqual(shape(empty), shape(model))
})
