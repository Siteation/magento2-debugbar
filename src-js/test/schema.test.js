/**
 * The structured data checks, against small pages.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseHTML } from 'linkedom'

import {
  duplicates,
  errorLocation,
  isPublicHost,
  jsonLd,
  markupOf,
  microdata,
  schema,
  typeNames,
  validatorLinks,
} from '../src/schema.js'
import { emptyModel, inspectPage } from '../src/seo.js'

const URL_HERE = 'https://shop.test/joust-duffle-bag.html'

/**
 * @param {string} body
 * @returns {Document}
 */
function page(body) {
  return parseHTML(`<!doctype html><html lang="en"><head></head><body>${body}</body></html>`).document
}

/**
 * @param {unknown} data
 * @returns {string}
 */
function ld(data) {
  return `<script type="application/ld+json">${typeof data === 'string' ? data : JSON.stringify(data)}</script>`
}

const PRODUCT = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Joust Duffle Bag',
  sku: '24-MB01',
  image: 'https://shop.test/media/bag.jpg',
  description: 'A bag.',
  brand: { '@type': 'Brand', name: 'Luma' },
  offers: { '@type': 'Offer', price: '34.00', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: URL_HERE, itemCondition: 'https://schema.org/NewCondition' },
}

test('type names drop the schema.org prefix, whichever scheme it was written with', () => {
  assert.deepEqual(typeNames('https://schema.org/Product'), ['Product'])
  assert.deepEqual(typeNames('http://schema.org/Offer'), ['Offer'])
  assert.deepEqual(typeNames(['Product', 'https://schema.org/Thing']), ['Product', 'Thing'])
  assert.deepEqual(typeNames('http://schema.org/Product http://schema.org/Car'), ['Product', 'Car'])
  assert.deepEqual(typeNames(undefined), [])
})

test('a complete product has no required finding', () => {
  const { model } = schema(page(ld(PRODUCT)), URL_HERE)

  assert.equal(model.entities.length, 1)
  assert.equal(model.entities[0].type, 'Product')
  assert.equal(model.entities[0].name, 'Joust Duffle Bag')
  assert.deepEqual(model.entities[0].findings, [])
  assert.deepEqual(model.warnings, [])
})

test('a product without offers, a review or a rating is not eligible, and says which to add', () => {
  const { model } = schema(page(ld({ '@type': 'Product', name: 'Bag' })), URL_HERE)
  const required = model.entities[0].findings.filter((finding) => finding.level === 'required')

  assert.deepEqual(required.map((finding) => finding.message), ['Needs one of offers, review, aggregateRating.'])
  assert.match(required[0].docs, /product-snippet/)
  assert.deepEqual(model.warnings, ['Product: Needs one of offers, review, aggregateRating.'])
})

test('a nested offer is held to the offer rules, with the path that leads to it', () => {
  const product = { ...PRODUCT, offers: { '@type': 'Offer', price: '€34,00' } }
  const { model } = schema(page(ld(product)), URL_HERE)

  assert.deepEqual(model.warnings, [
    'Product > offers > Offer: Missing priceCurrency.',
    'Product > offers > Offer: The price "€34,00" is not a plain number. Use a dot for decimals and leave out the currency sign.',
  ])
})

test('a currency that is not an ISO code is named', () => {
  const product = { ...PRODUCT, offers: { ...PRODUCT.offers, priceCurrency: '€' } }
  const { model } = schema(page(ld(product)), URL_HERE)

  assert.deepEqual(model.warnings, ['Product > offers > Offer: "€" is not a three letter ISO 4217 currency code.'])
})

test('a rating needs a count, and either count will do', () => {
  const rated = (rating) => schema(page(ld({ ...PRODUCT, aggregateRating: { '@type': 'AggregateRating', ...rating } })), URL_HERE).model.warnings

  assert.deepEqual(rated({ ratingValue: 4 }), ['Product > aggregateRating > AggregateRating: Needs one of ratingCount, reviewCount.'])
  assert.deepEqual(rated({ ratingValue: 4, reviewCount: 3 }), [])
  assert.deepEqual(rated({ ratingValue: 4, ratingCount: 3 }), [])
})

test('@graph members are entities of their own and keep the block context', () => {
  const doc = page(ld({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: 'Shop', url: 'https://shop.test/' },
      { '@type': 'Organization', name: 'Shop BV', url: 'https://shop.test/', logo: 'https://shop.test/logo.png', sameAs: ['https://x.com/shop'] },
    ],
  }))
  const { blocks, entities } = jsonLd(doc)

  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].entities, 2)
  assert.deepEqual(entities.map((entity) => entity.data['@type']), ['WebSite', 'Organization'])
  assert.equal(entities[0].data['@context'], 'https://schema.org')
})

test('a top level array is a list of entities', () => {
  const { entities } = jsonLd(page(ld([PRODUCT, { '@type': 'BreadcrumbList', itemListElement: [] }])))

  assert.deepEqual(entities.map((entity) => entity.data['@type']), ['Product', 'BreadcrumbList'])
})

test('a block that does not parse says why and where, and the others still count', () => {
  const broken = '{\n  "@type": "Product",\n  "name": "Bag",\n}'
  const { model } = schema(page(ld(broken) + ld(PRODUCT)), URL_HERE)

  assert.equal(model.blocks.length, 2)
  assert.notEqual(model.blocks[0].error, '')
  assert.deepEqual(model.blocks[0].at, { line: 4, column: 1 })
  assert.equal(model.blocks[0].excerpt, '}')
  assert.equal(model.entities.length, 1)
  assert.match(model.warnings[0], /^JSON-LD block 1 does not parse at line 4, column 1: /)
})

test('an empty block is reported rather than skipped', () => {
  const { model } = schema(page('<script type="application/ld+json">  </script>'), URL_HERE)

  assert.deepEqual(model.warnings, ['JSON-LD block 1 does not parse: The block is empty.'])
})

test('a parse error location is read from each browser\'s message', () => {
  const source = 'line one\nline two\nthree'

  assert.deepEqual(errorLocation('Unexpected token } in JSON at position 12', source), { line: 2, column: 4 })
  assert.deepEqual(errorLocation('JSON.parse: expected property name at line 3 column 5 of the JSON data', source), { line: 3, column: 5 })
  assert.equal(errorLocation('JSON Parse error: Unexpected identifier', source), null)
})

test('microdata becomes the same shape as JSON-LD, with nested items and spec values', () => {
  const doc = page(`
    <div itemscope itemtype="http://schema.org/Product" itemid="#product">
      <h1 itemprop="name"> Joust   Duffle Bag </h1>
      <img itemprop="image" src="https://shop.test/bag.jpg" alt="">
      <a itemprop="url" href="https://shop.test/bag.html">bag</a>
      <div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
        <span itemprop="price" content="34.00">€34,00</span>
        <meta itemprop="priceCurrency" content="EUR">
        <link itemprop="availability" href="http://schema.org/InStock">
      </div>
      <span itemprop="color">Blue</span><span itemprop="color">Black</span>
    </div>`)
  const { entities, elements } = microdata(doc)

  assert.equal(elements.length, 1)
  assert.deepEqual(entities[0].data, {
    '@type': 'Product',
    '@id': '#product',
    name: 'Joust Duffle Bag',
    image: 'https://shop.test/bag.jpg',
    url: 'https://shop.test/bag.html',
    offers: {
      '@type': 'Offer',
      price: '34.00',
      priceCurrency: 'EUR',
      availability: 'http://schema.org/InStock',
    },
    color: ['Blue', 'Black'],
  })
})

test('a nested item is not also a top level one, and its properties stay its own', () => {
  const doc = page(`
    <div itemscope itemtype="https://schema.org/Product">
      <span itemprop="name">Bag</span>
      <div itemprop="review" itemscope itemtype="https://schema.org/Review">
        <span itemprop="name">Great</span>
      </div>
    </div>`)
  const { entities } = microdata(doc)

  assert.equal(entities.length, 1)
  assert.equal(entities[0].data.name, 'Bag')
  assert.equal(entities[0].data.review.name, 'Great')
})

test('the same product in JSON-LD and microdata is a duplicate', () => {
  const doc = page(ld(PRODUCT) + `
    <div itemscope itemtype="http://schema.org/Product">
      <span itemprop="name">Joust Duffle Bag</span>
      <meta itemprop="sku" content="24-MB01">
    </div>`)
  const { model } = schema(doc, URL_HERE)

  assert.ok(model.warnings.includes(
    'Product "Joust Duffle Bag" is described in both JSON-LD and microdata. Usually a theme and a module both write it; keep one.'
  ), model.warnings.join('\n'))
})

test('a product declared on <body> and again inside it is one warning, not three', () => {
  // The shape Magento and a theme produce together: core puts itemtype on <body> for
  // every product page, and the theme marks up its own product block inside it.
  const doc = page(`
    <div id="html-body" itemtype="http://schema.org/Product" itemscope="itemscope">
      <div class="c-pdp c-pdp--gallery" itemscope itemtype="https://schema.org/Product">
        <h1 itemprop="name">Screw Pack</h1>
      </div>
    </div>`)
  const { model } = schema(doc, URL_HERE)

  assert.deepEqual(model.warnings, [
    'Product is declared on <div id="html-body"> and again on <div class="c-pdp"> inside it. Its properties go to the inner one, so the outer one is a second, empty Product. Remove one itemscope.',
    'Product: Needs one of offers, review, aggregateRating.',
  ])
  assert.deepEqual(model.entities.map((entity) => [entity.where, entity.wrapper]), [
    ['<div id="html-body">', true],
    ['<div class="c-pdp">', false],
  ])
})

test('two JSON-LD blocks for one product are a duplicate too', () => {
  const { model } = schema(page(ld(PRODUCT) + ld(PRODUCT)), URL_HERE)

  assert.ok(model.warnings.includes(
    'Product "Joust Duffle Bag" is described 2 times in JSON-LD. Usually a theme and a module both write it; keep one.'
  ))
})

test('two different breadcrumb trails and two different products are each named', () => {
  const crumbs = (name) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name, item: 'https://shop.test/' }],
  })
  const warnings = duplicates([
    { source: 'json-ld', type: 'BreadcrumbList', name: '', data: crumbs('Home') },
    { source: 'json-ld', type: 'BreadcrumbList', name: '', data: crumbs('Start') },
    { source: 'json-ld', type: 'Product', name: 'A', data: { '@type': 'Product', name: 'A' } },
    { source: 'json-ld', type: 'Product', name: 'B', data: { '@type': 'Product', name: 'B' } },
  ])

  assert.deepEqual(warnings, [
    '2 BreadcrumbList entities on one page. A page has one; keep the one that is right.',
    '2 different top level products. A product page describes one; a list of products belongs in an ItemList.',
  ])
})

test('breadcrumbs need a name on every crumb, a URL on all but the last, and positions from 1', () => {
  const { model } = schema(page(ld({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shop.test/' },
      { '@type': 'ListItem', position: 3, name: 'Bags' },
      { '@type': 'ListItem', position: 4 },
    ],
  })), URL_HERE)

  assert.deepEqual(model.warnings, [
    'BreadcrumbList: Crumb 2 has no item URL.',
    'BreadcrumbList: Crumb 3 has no name.',
    'BreadcrumbList: The crumb positions do not count up from 1.',
  ])
})

test('a SearchAction target has to hold the placeholder its query-input names', () => {
  const site = (target) => schema(page(ld({
    '@type': 'WebSite',
    name: 'Shop',
    url: 'https://shop.test/',
    potentialAction: { '@type': 'SearchAction', target, 'query-input': 'required name=search_term_string' },
  })), URL_HERE).model

  assert.deepEqual(site('https://shop.test/catalogsearch/result/?q={search_term_string}').warnings, [])
  assert.deepEqual(site({ '@type': 'EntryPoint', urlTemplate: 'https://shop.test/search?q={search_term_string}' }).warnings, [])
  assert.deepEqual(site('https://shop.test/catalogsearch/result/?q={query}').warnings, [
    'WebSite: The SearchAction target has no {search_term_string} for the query-input to fill.',
  ])

  // The note is not a warning: nothing on the page is wrong.
  assert.ok(site('x').entities[0].findings.some((finding) => finding.level === 'note'))
})

test('an FAQ needs each question answered', () => {
  const { model } = schema(page(ld({
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Returns?', acceptedAnswer: { '@type': 'Answer', text: '30 days.' } },
      { '@type': 'Question', name: 'Shipping?' },
    ],
  })), URL_HERE)

  assert.deepEqual(model.warnings, ['FAQPage > mainEntity > Question: Missing acceptedAnswer.'])
})

test('subtypes are held to the rules of the type they extend', () => {
  const { model } = schema(page(ld({ '@type': 'BlogPosting' })), URL_HERE)

  assert.ok(model.entities[0].findings.some((finding) => finding.message === 'No headline.'))
})

test('Google\'s tools get the URL only when they can reach it', () => {
  assert.equal(isPublicHost('https://shop.test/a.html'), false)
  assert.equal(isPublicHost('https://localhost:8080/'), false)
  assert.equal(isPublicHost('http://192.168.1.4/'), false)
  assert.equal(isPublicHost('https://shop.local/'), false)
  assert.equal(isPublicHost('https://www.example.com/a.html'), true)

  assert.deepEqual(validatorLinks('https://shop.test/a.html').tools.map((tool) => tool.href), [
    'https://search.google.com/test/rich-results',
    'https://validator.schema.org/',
  ])
  assert.deepEqual(validatorLinks('https://www.shop.nl/a.html').tools.map((tool) => tool.href), [
    'https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.shop.nl%2Fa.html',
    'https://validator.schema.org/#url=https%3A%2F%2Fwww.shop.nl%2Fa.html',
  ])
})

test('the copied markup holds every block and every top level item, ready to paste', () => {
  const markup = markupOf(page(ld(PRODUCT) + '<div itemscope itemtype="https://schema.org/Organization"><span itemprop="name">Shop</span></div><p>not this</p>'))

  assert.match(markup, /^<script type="application\/ld\+json">\{"@context"/)
  assert.match(markup, /<div itemscope="" itemtype="https:\/\/schema.org\/Organization">|<div itemscope itemtype="https:\/\/schema.org\/Organization">/)
  assert.doesNotMatch(markup, /not this/)
})

test('the SEO section carries the schema view, and its warnings count', () => {
  const env = { viewportHeight: 800, pixelRatio: 1, measure: () => ({ visible: true, top: 0, width: 1, height: 1, naturalWidth: 0, naturalHeight: 0 }) }
  const { model, elements } = inspectPage(page(ld({ '@type': 'Product', name: 'Bag' })), { url: URL_HERE, env })

  assert.equal(model.counts.schema, 1)
  assert.equal(model.schema.entities.length, 1)
  assert.equal('data' in model.schema.entities[0], false)
  assert.ok(Array.isArray(elements.schema))
  assert.deepEqual(Object.keys(emptyModel().schema).sort(), Object.keys(model.schema).sort())
})
