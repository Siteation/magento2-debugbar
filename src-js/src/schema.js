/**
 * Reads the structured data on a page: JSON-LD blocks and microdata, as one list of
 * entities, checked against what Google needs to show a rich result.
 *
 * Like seo.js, every function takes a Document so `node --test` can hand it a fixture, and
 * like seo.js nothing is redacted: this is markup the page sends to every visitor and every
 * crawler, so there is no one left to hide it from.
 */

/** A whole page's markup past this is cut, so one huge block cannot stall the panel. */
const MAX_MARKUP = 200000

const SCHEMA_ORG = /^https?:\/\/(www\.)?schema\.org\//i

/**
 * What Google needs before it will draw a rich result, per type.
 *
 * `required` must all be present. `oneOf` lists groups where at least one member must be.
 * `recommended` only adds to the result. A dotted name looks inside the value, so
 * `author.name` checks the author's name rather than that there is an author.
 *
 * Kept as one table so a rule Google changes is changed in one place, next to the link to
 * the page it came from.
 *
 * @type {Record<string, {docs: string, required?: Array<string>, oneOf?: Array<Array<string>>, recommended?: Array<string>, note?: string}>}
 */
export const RICH_RESULT_RULES = {
  Product: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/product-snippet',
    required: ['name'],
    oneOf: [['offers', 'review', 'aggregateRating']],
    recommended: ['image', 'description', 'sku', 'brand'],
  },
  Offer: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/merchant-listing',
    oneOf: [['price', 'priceSpecification']],
    required: ['priceCurrency'],
    recommended: ['availability', 'url', 'itemCondition'],
  },
  AggregateOffer: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/product-snippet',
    required: ['lowPrice', 'priceCurrency'],
    recommended: ['highPrice', 'offerCount'],
  },
  AggregateRating: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/review-snippet',
    required: ['ratingValue'],
    oneOf: [['ratingCount', 'reviewCount']],
    recommended: ['bestRating', 'worstRating'],
  },
  Review: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/review-snippet',
    required: ['author', 'reviewRating'],
    recommended: ['datePublished', 'author.name'],
  },
  BreadcrumbList: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
    required: ['itemListElement'],
  },
  ListItem: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
    required: ['position'],
  },
  Organization: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/organization',
    recommended: ['name', 'url', 'logo', 'sameAs'],
  },
  WebSite: {
    docs: 'https://developers.google.com/search/docs/appearance/site-names',
    required: ['name', 'url'],
    recommended: ['alternateName'],
    note: 'Google stopped drawing the sitelinks search box in November 2024, so a SearchAction here no longer changes the result. The site name still comes from this block.',
  },
  FAQPage: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    required: ['mainEntity'],
    note: 'Google shows FAQ rich results only for well known government and health sites since August 2023.',
  },
  Question: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    required: ['name', 'acceptedAnswer'],
  },
  Answer: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
    required: ['text'],
  },
  Article: {
    docs: 'https://developers.google.com/search/docs/appearance/structured-data/article',
    recommended: ['headline', 'image', 'datePublished', 'dateModified', 'author', 'author.name'],
  },
}

/** Subtypes Google treats as the type they extend. */
const TYPE_ALIASES = {
  NewsArticle: 'Article',
  BlogPosting: 'Article',
  ProductGroup: 'Product',
  Corporation: 'Organization',
  OnlineStore: 'Organization',
  OnlineBusiness: 'Organization',
  LocalBusiness: 'Organization',
  Store: 'Organization',
}

/**
 * Types a page has one of. Two of them is a theme and a module both writing the same
 * block, not two of the thing.
 */
const ONE_PER_PAGE = ['BreadcrumbList', 'WebSite', 'Organization', 'FAQPage']

/**
 * @param {unknown} type a @type, an itemtype URL, or a list of either
 * @returns {Array<string>} short names, `Product` rather than `https://schema.org/Product`
 */
export function typeNames(type) {
  const list = Array.isArray(type) ? type : String(type ?? '').split(/\s+/)

  return list
    .map((name) => String(name ?? '').trim().replace(SCHEMA_ORG, ''))
    .filter(Boolean)
}

/**
 * @param {Array<string>} types
 * @returns {string} the type a rule exists for, '' when none does
 */
function ruleType(types) {
  for (const type of types) {
    const known = TYPE_ALIASES[type] || type

    if (RICH_RESULT_RULES[known]) return known
  }

  return ''
}

/**
 * Where a JSON parse failed, as a line and column. Chrome and Node say "at position N",
 * Firefox says "at line L column C", Safari says neither.
 *
 * @param {string} message
 * @param {string} source
 * @returns {{line: number, column: number}|null}
 */
export function errorLocation(message, source) {
  const lineColumn = /line (\d+) column (\d+)/i.exec(message)

  if (lineColumn) return { line: Number(lineColumn[1]), column: Number(lineColumn[2]) }

  const position = /position (\d+)/i.exec(message)

  if (!position) return null

  const before = source.slice(0, Number(position[1])).split('\n')

  return { line: before.length, column: before[before.length - 1].length + 1 }
}

/**
 * @typedef {object} Entity
 * @property {string} source json-ld or microdata
 * @property {number} block which JSON-LD block or which microdata item, counted from 0
 * @property {string} where the element a microdata item is declared on, '' for JSON-LD
 * @property {number} inside the microdata item of the same type around this one, or -1
 * @property {boolean} wrapper another item of its type is declared inside it
 * @property {string} type every type it declares, joined
 * @property {string} name what it is called, for the list
 * @property {object} data the entity itself, in JSON-LD shape
 * @property {Array<Finding>} findings
 */

/**
 * @typedef {object} Finding
 * @property {string} level required, recommended or note
 * @property {string} path where in the entity, `offers > Offer`
 * @property {string} message
 * @property {string} docs
 */

/**
 * @typedef {object} Block
 * @property {number} index
 * @property {string} error why it did not parse, '' when it did
 * @property {{line: number, column: number}|null} at
 * @property {string} excerpt the line the parser stopped on
 * @property {number} entities how many entities it holds
 */

/**
 * Every application/ld+json block, parsed, with `@graph` opened up so each member is an
 * entity of its own.
 *
 * @param {Document} doc
 * @returns {{blocks: Array<Block>, entities: Array<{source: string, block: number, data: object}>}}
 */
export function jsonLd(doc) {
  const blocks = []
  const entities = []

  Array.from(doc.querySelectorAll('script[type]'))
    .filter((script) => script.getAttribute('type').trim().toLowerCase() === 'application/ld+json')
    .forEach((script, index) => {
      const source = String(script.textContent || '')
      const block = { index, error: '', at: null, excerpt: '', entities: 0 }

      blocks.push(block)

      if (source.trim() === '') {
        block.error = 'The block is empty.'

        return
      }

      let parsed

      try {
        parsed = JSON.parse(source)
      } catch (error) {
        block.error = String((error && error.message) || error)
        block.at = errorLocation(block.error, source)
        block.excerpt = block.at ? (source.split('\n')[block.at.line - 1] || '').trim().slice(0, 160) : ''

        return
      }

      const roots = Array.isArray(parsed) ? parsed : [parsed]

      roots.forEach((root) => {
        if (!root || typeof root !== 'object') return

        const members = Array.isArray(root['@graph']) ? root['@graph'] : [root]
        const context = root['@context']

        members.forEach((member) => {
          if (!member || typeof member !== 'object') return

          // A @graph member inherits the context of the block it sits in, so it is shown
          // with it rather than looking like a block that forgot to declare one.
          const data = context && !member['@context'] && member !== root
            ? { '@context': context, ...member }
            : member

          entities.push({ source: 'json-ld', block: index, data })
          block.entities += 1
        })
      })
    })

  return { blocks, entities }
}

/**
 * What one itemprop element says, by the rules of the HTML microdata spec.
 *
 * @param {Element} element
 * @returns {string}
 */
function propertyValue(element) {
  const tag = element.tagName.toLowerCase()
  const read = (name) => (element.getAttribute(name) || '').trim()

  if (tag === 'meta') return read('content')
  if (['a', 'area', 'link'].includes(tag)) return read('href')
  if (['audio', 'embed', 'iframe', 'img', 'source', 'track', 'video'].includes(tag)) return read('src')
  if (tag === 'object') return read('data')
  if (['data', 'meter'].includes(tag)) return read('value')
  if (tag === 'time' && element.hasAttribute('datetime')) return read('datetime')

  // content= is not in the spec for other elements, but schema.org's own examples use it on
  // a span for a price, and every validator reads it, so a theme that does it is right.
  if (element.hasAttribute('content')) return read('content')

  return String(element.textContent || '').replace(/\s+/g, ' ').trim()
}

/**
 * @param {Element} scope an element with itemscope
 * @returns {object} the item, in the same shape a JSON-LD block would have it
 */
function microdataItem(scope) {
  const item = {}
  const types = typeNames(scope.getAttribute('itemtype'))

  if (types.length === 1) item['@type'] = types[0]
  else if (types.length > 1) item['@type'] = types

  if (scope.getAttribute('itemid')) item['@id'] = scope.getAttribute('itemid')

  const add = (name, value) => {
    if (!(name in item)) item[name] = value
    else if (Array.isArray(item[name])) item[name].push(value)
    else item[name] = [item[name], value]
  }

  const walk = (node) => {
    Array.from(node.children).forEach((child) => {
      const names = (child.getAttribute('itemprop') || '').trim().split(/\s+/).filter(Boolean)
      const nested = child.hasAttribute('itemscope')

      names.forEach((name) => add(name, nested ? microdataItem(child) : propertyValue(child)))

      // A nested scope owns everything inside it, whether or not it is a property here.
      if (!nested) walk(child)
    })
  }

  walk(scope)

  return item
}

/**
 * Top level microdata items: those that are not a property of another item.
 *
 * @param {Document} doc
 * @returns {{entities: Array<{source: string, block: number, data: object}>, elements: Array<Element>}}
 */
export function microdata(doc) {
  const elements = Array.from(doc.querySelectorAll('[itemscope]'))
    .filter((element) => !element.hasAttribute('itemprop'))

  return {
    entities: elements.map((element, index) => {
      const types = typeNames(element.getAttribute('itemtype'))
      // The nearest item around this one that declares the same type. Magento puts
      // itemtype="Product" on <body> for every product page, so a theme that marks up its
      // own product block declares the product twice, and the outer one is left empty.
      const outer = elements.findIndex((other) => other !== element
        && other.contains(element)
        && typeNames(other.getAttribute('itemtype')).some((type) => types.includes(type)))

      return {
        source: 'microdata',
        block: index,
        where: describe(element),
        inside: outer,
        data: microdataItem(element),
      }
    }),
    elements,
  }
}

/**
 * @param {Element} element
 * @returns {string} `<body id="html-body">` or `<div class="c-pdp">`, enough to find it
 */
function describe(element) {
  const tag = element.tagName.toLowerCase()
  const id = element.getAttribute('id')
  const classes = (element.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)

  if (id) return `<${tag} id="${id}">`
  if (classes.length > 0) return `<${tag} class="${classes[0]}">`

  return `<${tag}>`
}

/**
 * @param {unknown} value
 * @returns {boolean} whether a property counts as given
 */
function present(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.some(present)

  return true
}

/**
 * @param {object} data
 * @param {string} path a property name, or names joined by dots to look inside the value
 * @returns {boolean}
 */
function has(data, path) {
  const [head, ...rest] = path.split('.')
  const value = data[head]

  if (rest.length === 0) return present(value)

  const values = Array.isArray(value) ? value : [value]

  return values.some((inner) => inner && typeof inner === 'object' && has(inner, rest.join('.')))
}

/**
 * Checks one typed object and everything typed inside it, so an Offer inside a Product is
 * held to the Offer rules.
 *
 * @param {object} data
 * @param {string} path
 * @param {Array<Finding>} findings
 * @param {number} depth
 */
function check(data, path, findings, depth = 0) {
  if (depth > 6) return

  const types = typeNames(data['@type'])
  const type = ruleType(types)
  const here = path ? `${path} > ${types[0] || 'item'}` : (types[0] || 'item')
  const rule = RICH_RESULT_RULES[type]

  if (rule) {
    const report = (level, message) => findings.push({ level, path: here, message, docs: rule.docs })

    ;(rule.required || []).filter((name) => !has(data, name)).forEach((name) => {
      report('required', `Missing ${name}.`)
    })

    ;(rule.oneOf || []).filter((group) => !group.some((name) => has(data, name))).forEach((group) => {
      report('required', `Needs one of ${group.join(', ')}.`)
    })

    ;(rule.recommended || []).filter((name) => !has(data, name)).forEach((name) => {
      report('recommended', `No ${name}.`)
    })

    if (rule.note) report('note', rule.note)

    if (type === 'BreadcrumbList') breadcrumbs(data, report)
    if (type === 'WebSite') searchAction(data, report)
    if (type === 'Offer' || type === 'AggregateOffer') price(data, report)
  }

  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('@')) return

    const values = Array.isArray(value) ? value : [value]

    values.forEach((inner) => {
      if (inner && typeof inner === 'object' && inner['@type']) {
        check(inner, `${here} > ${key}`, findings, depth + 1)
      }
    })
  })
}

/**
 * @param {object} data a BreadcrumbList
 * @param {(level: string, message: string) => void} report
 */
function breadcrumbs(data, report) {
  const items = Array.isArray(data.itemListElement) ? data.itemListElement : [data.itemListElement]
  const listed = items.filter((item) => item && typeof item === 'object')

  listed.forEach((item, index) => {
    const named = has(item, 'name') || has(item, 'item.name')
    const linked = has(item, 'item')

    if (!named) report('required', `Crumb ${index + 1} has no name.`)

    // The last crumb is the page itself and may leave its URL out; every other one needs it.
    if (!linked && index < listed.length - 1) report('required', `Crumb ${index + 1} has no item URL.`)
  })

  const positions = listed.map((item) => Number(item.position))

  if (positions.some((position, index) => position !== index + 1)) {
    report('required', 'The crumb positions do not count up from 1.')
  }
}

/**
 * @param {object} data a WebSite
 * @param {(level: string, message: string) => void} report
 */
function searchAction(data, report) {
  const actions = (Array.isArray(data.potentialAction) ? data.potentialAction : [data.potentialAction])
    .filter((action) => action && typeof action === 'object' && typeNames(action['@type']).includes('SearchAction'))

  actions.forEach((action) => {
    const target = typeof action.target === 'object' && action.target
      ? String(action.target.urlTemplate || '')
      : String(action.target || '')
    const input = String(action['query-input'] || '')
    const name = (/name=([\w-]+)/.exec(input) || [])[1] || ''

    if (!target) report('required', 'The SearchAction has no target.')
    else if (name && !target.includes(`{${name}}`)) {
      report('required', `The SearchAction target has no {${name}} for the query-input to fill.`)
    }
  })
}

/**
 * @param {object} data an Offer or AggregateOffer
 * @param {(level: string, message: string) => void} report
 */
function price(data, report) {
  const value = data.price ?? data.lowPrice

  if (present(value) && !/^\d+(\.\d+)?$/.test(String(value).trim())) {
    report('required', `The price "${value}" is not a plain number. Use a dot for decimals and leave out the currency sign.`)
  }

  const currency = String(data.priceCurrency || '').trim()

  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    report('required', `"${currency}" is not a three letter ISO 4217 currency code.`)
  }
}

/**
 * What an entity is called in the list: its name, or something close to one.
 *
 * @param {object} data
 * @returns {string}
 */
function nameOf(data) {
  const value = data.name ?? data.headline ?? data.url ?? data['@id'] ?? ''
  const first = Array.isArray(value) ? value[0] : value

  return typeof first === 'string' ? first.replace(/\s+/g, ' ').trim().slice(0, 120) : ''
}

/**
 * What makes two entities the same one: the same type and the same id, URL, SKU or name.
 *
 * @param {object} data
 * @returns {string} '' when there is nothing to tell it by
 */
function identity(data) {
  const types = typeNames(data['@type']).map((type) => TYPE_ALIASES[type] || type).sort()
  const key = data['@id'] || data.sku || data.url || data.name

  if (types.length === 0 || !key || typeof key !== 'string') return ''

  return `${types.join('+')}|${key.trim().toLowerCase()}`
}

/**
 * @param {Array<Entity>} entities
 * @returns {boolean} whether they are all one entity, which nothing anonymous can be
 */
function sameEntity(entities) {
  const keys = entities.map((entity) => identity(entity.data))

  return keys[0] !== '' && keys.every((key) => key === keys[0])
}

/**
 * @param {Array<Entity>} entities
 * @returns {Array<string>}
 */
export function duplicates(entities) {
  const warnings = []
  const byIdentity = new Map()
  const microdataItems = entities.filter((entity) => entity.source === 'microdata')
  // An item another item of its type sits inside. It is reported once, below, and is not
  // counted again as a second product: it is the same product declared twice.
  const wrappers = new Set()

  microdataItems.forEach((entity) => {
    if (entity.inside === undefined || entity.inside < 0) return

    const outer = microdataItems.find((other) => other.block === entity.inside)

    if (!outer) return

    wrappers.add(outer)
    warnings.push(`${entity.type} is declared on ${outer.where} and again on ${entity.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${entity.type}. Remove one itemscope.`)
  })

  entities = entities.filter((entity) => !wrappers.has(entity))

  entities.forEach((entity) => {
    const key = identity(entity.data)

    if (!key) return

    byIdentity.set(key, [...(byIdentity.get(key) || []), entity])
  })

  byIdentity.forEach((same) => {
    if (same.length < 2) return

    const sources = [...new Set(same.map((entity) => (entity.source === 'json-ld' ? 'JSON-LD' : 'microdata')))]
    const where = sources.length > 1 ? `in both ${sources.join(' and ')}` : `${same.length} times in ${sources[0]}`

    warnings.push(`${same[0].type} "${same[0].name}" is described ${where}. Usually a theme and a module both write it; keep one.`)
  })

  ONE_PER_PAGE.forEach((type) => {
    const all = entities.filter((entity) => typeNames(entity.data['@type']).some((name) => (TYPE_ALIASES[name] || name) === type))
    // Already reported above when they are all the same entity.
    if (all.length > 1 && !sameEntity(all)) {
      warnings.push(`${all.length} ${type} entities on one page. A page has one; keep the one that is right.`)
    }
  })

  const products = entities.filter((entity) => ruleType(typeNames(entity.data['@type'])) === 'Product')

  if (products.length > 1 && !sameEntity(products)) {
    warnings.push(`${products.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`)
  }

  return warnings
}

/**
 * A host Google's tools can fetch: not a dev shop, not a private address.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isPublicHost(url) {
  let host

  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    return false
  }

  if (host === 'localhost' || !host.includes('.')) return false
  if (/\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(host)) return false
  if (/^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(host)) return false
  if (host.startsWith('[')) return false

  return true
}

/**
 * Where to check this markup outside the bar. URL mode only for a host Google can reach;
 * otherwise the tool's own page, where the copied markup is pasted in.
 *
 * @param {string} url
 * @returns {{public: boolean, tools: Array<{label: string, href: string}>}}
 */
export function validatorLinks(url) {
  const reachable = isPublicHost(url)
  const encoded = encodeURIComponent(url)

  return {
    public: reachable,
    tools: [
      {
        label: 'Rich Results Test',
        href: reachable
          ? `https://search.google.com/test/rich-results?url=${encoded}`
          : 'https://search.google.com/test/rich-results',
      },
      {
        label: 'Schema Markup Validator',
        href: reachable
          ? `https://validator.schema.org/#url=${encoded}`
          : 'https://validator.schema.org/',
      },
    ],
  }
}

/**
 * The page's structured data as one paste: every JSON-LD block and every top level
 * microdata item, which is what the validators accept in their code mode.
 *
 * @param {Document} doc
 * @returns {string}
 */
export function markupOf(doc) {
  const scripts = Array.from(doc.querySelectorAll('script[type]'))
    .filter((script) => script.getAttribute('type').trim().toLowerCase() === 'application/ld+json')
    .map((script) => `<script type="application/ld+json">${script.textContent}</script>`)
  const items = microdata(doc).elements.map((element) => element.outerHTML)
  const markup = [...scripts, ...items].join('\n')

  return markup.length > MAX_MARKUP ? markup.slice(0, MAX_MARKUP) : markup
}

/**
 * Everything the Schema view shows, from one read of the page.
 *
 * @param {Document} doc
 * @param {string} url
 * @returns {{model: object, elements: Array<Element>}}
 */
export function schema(doc, url) {
  const ld = jsonLd(doc)
  const md = microdata(doc)

  const entities = [...ld.entities, ...md.entities].map((entity, index) => {
    const findings = []

    check(entity.data, '', findings)

    return {
      index,
      source: entity.source,
      block: entity.block,
      where: entity.where || '',
      inside: entity.inside ?? -1,
      type: typeNames(entity.data['@type']).join(', ') || 'untyped',
      name: nameOf(entity.data),
      json: JSON.stringify(entity.data, null, 2),
      data: entity.data,
      findings,
    }
  })

  const warnings = []

  ld.blocks.filter((block) => block.error).forEach((block) => {
    const at = block.at ? ` at line ${block.at.line}, column ${block.at.column}` : ''

    warnings.push(`JSON-LD block ${block.index + 1} does not parse${at}: ${block.error}`)
  })

  warnings.push(...duplicates(entities))

  entities.forEach((entity) => {
    entity.wrapper = entity.source === 'microdata'
      && entities.some((other) => other.source === 'microdata' && other.inside === entity.block)
  })

  entities.forEach((entity) => {
    // The empty outer item already has its warning: declared twice. Listing everything it
    // lacks as well would bury the one fix under the symptoms it causes.
    if (entity.wrapper) return

    entity.findings.filter((finding) => finding.level === 'required').forEach((finding) => {
      warnings.push(`${finding.path}: ${finding.message}`)
    })
  })

  // The data is shown as text and used for nothing else, and Alpine would proxy every
  // nested object if it stayed in.
  entities.forEach((entity) => { delete entity.data })

  return {
    model: {
      blocks: ld.blocks,
      entities,
      warnings,
      links: validatorLinks(url),
    },
    elements: md.elements,
  }
}

/** @returns {object} */
export function emptySchema() {
  return { blocks: [], entities: [], warnings: [], links: { public: false, tools: [] } }
}
