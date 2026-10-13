/**
 * Reads the page the way a search engine or a link preview would.
 *
 * Every check is a plain function that takes a Document, so `node --test` can hand it a
 * fixture. The few questions only a browser can answer (is it visible, how big is it drawn,
 * is it on screen when the page loads) go through `measure`, which a test replaces.
 *
 * Nothing here is stored and no value policy is applied. Everything this section shows is
 * markup the page already rendered for the person looking at the bar: the title, the
 * headings, the link text. Masking it would hide nothing from anyone and leave the section
 * with nothing to say. The Alpine section is different because component state holds data
 * the page never draws.
 */
import { emptySchema, schema } from './schema.js'

/** Lengths past which a search result is cut, and below which it says too little. */
export const TITLE_RANGE = { min: 30, max: 60 }
export const DESCRIPTION_RANGE = { min: 70, max: 160 }

/** The four tags ogp.me calls required, and the one tag X needs to draw a card at all. */
export const REQUIRED_OPEN_GRAPH = ['og:title', 'og:type', 'og:image', 'og:url']
export const REQUIRED_X = ['twitter:card']

/** Shown smaller than this share of its real width, an image is sending bytes nobody sees. */
const OVERSIZE_RATIO = 2

/** Below this many real pixels of waste, an oversized image is not worth a warning. */
const OVERSIZE_MIN_PX = 200

const MAX_TEXT = 160

/**
 * A BCP 47 tag of the shape hreflang and `<html lang>` use: language, then an optional
 * script, then an optional region. Anything longer is legal BCP 47 that search engines
 * ignore, which is the same as wrong for this purpose.
 */
const LANGUAGE_TAG = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i

/**
 * What a browser can tell about one element and nothing else can.
 *
 * @typedef {object} Measurement
 * @property {boolean} visible drawn, with a size, and not clipped to nothing
 * @property {number} top distance from the top of the document, in CSS pixels
 * @property {number} width drawn width, in CSS pixels
 * @property {number} height drawn height, in CSS pixels
 * @property {number} naturalWidth an image's own width, 0 for anything else or not loaded
 * @property {number} naturalHeight
 */

/**
 * @typedef {object} Environment
 * @property {(element: Element) => Measurement} measure
 * @property {number} viewportHeight the height of the first screen, in CSS pixels
 * @property {number} pixelRatio device pixels per CSS pixel
 */

/**
 * @param {Element} element
 * @returns {Measurement}
 */
export function measureInBrowser(element) {
  const rect = element.getBoundingClientRect()
  const view = element.ownerDocument.defaultView
  const style = view ? view.getComputedStyle(element) : null

  // The usual way to hide something from sight and keep it for screen readers is a 1px box
  // that clips its content away. It has a size, so the size alone would call it visible.
  const clipped = Boolean(style)
    && (style.clip === 'rect(0px, 0px, 0px, 0px)' || style.clipPath === 'inset(50%)')
  const drawn = typeof element.checkVisibility === 'function'
    ? element.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    : rect.width > 0 && rect.height > 0

  return {
    visible: drawn && !clipped && rect.width > 1 && rect.height > 1,
    top: rect.top + (view ? view.scrollY : 0),
    width: rect.width,
    height: rect.height,
    naturalWidth: Number(element.naturalWidth || 0),
    naturalHeight: Number(element.naturalHeight || 0),
  }
}

/** @returns {Environment} */
export function browserEnvironment() {
  return {
    measure: measureInBrowser,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
  }
}

/**
 * Collapsed and cut, so one long heading cannot push the rest of a list off the screen.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function text(value) {
  const collapsed = String(value || '').replace(/\s+/g, ' ').trim()

  return collapsed.length <= MAX_TEXT ? collapsed : `${collapsed.slice(0, MAX_TEXT)}...`
}

/**
 * @param {string} href
 * @param {string} base
 * @returns {URL|null}
 */
function resolve(href, base) {
  try {
    return new URL(href, base)
  } catch {
    return null
  }
}

/**
 * A rel or similar token list, which HTML matches without regard to case.
 *
 * @param {Element} element
 * @param {string} attribute
 * @returns {Array<string>}
 */
function tokens(element, attribute) {
  return String(element.getAttribute(attribute) || '').toLowerCase().split(/\s+/).filter(Boolean)
}

/**
 * @param {Document} doc
 * @param {string} name
 * @returns {Array<Element>}
 */
function metaNamed(doc, name) {
  return Array.from(doc.querySelectorAll('meta')).filter((meta) => {
    const key = meta.getAttribute('name') || meta.getAttribute('property') || ''

    return key.toLowerCase() === name
  })
}

/**
 * @param {number} length
 * @param {{min: number, max: number}} range
 * @returns {string} '' when the length is fine
 */
function lengthHint(length, range) {
  if (length === 0) return 'missing'
  if (length < range.min) return `too short, under ${range.min} characters`
  if (length > range.max) return `too long, over ${range.max} characters, so it will be cut`

  return ''
}

/**
 * @param {string} tag
 * @returns {string} why the tag is not usable, '' when it is
 */
export function languageProblem(tag) {
  if (tag === '') return 'missing'
  if (!LANGUAGE_TAG.test(tag)) return `"${tag}" is not a valid language code`

  // The one mistake common enough to name. UK is reserved and means nothing; the United
  // Kingdom is GB.
  if (/-uk$/i.test(tag)) return `"${tag}" uses UK, which is not a region code; use GB`

  return ''
}

/**
 * The same page, as a search engine would decide it. The fragment never reaches a server.
 *
 * @param {URL} url
 * @returns {string}
 */
function comparable(url) {
  return `${url.protocol}//${url.host}${url.pathname}${url.search}`
}

/**
 * Why a canonical URL names a page other than this one, in the words a developer would
 * use to fix it.
 *
 * @param {URL} canonical
 * @param {URL} current
 * @returns {string} '' when they are the same page
 */
export function canonicalDifference(canonical, current) {
  if (comparable(canonical) === comparable(current)) return ''

  if (canonical.protocol !== current.protocol) {
    return `it uses ${canonical.protocol.replace(':', '')} and this page uses ${current.protocol.replace(':', '')}`
  }

  if (canonical.host !== current.host) return `it points to another host, ${canonical.host}`

  const sameWithoutSlash = canonical.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '')

  if (canonical.pathname !== current.pathname && sameWithoutSlash) {
    return 'only the trailing slash differs'
  }

  if (canonical.pathname !== current.pathname) return `it points to ${canonical.pathname}`

  if (current.search && !canonical.search) {
    return `this URL has a query string (${current.search}) that the canonical leaves out`
  }

  if (canonical.search && !current.search) {
    return `it adds a query string (${canonical.search}) that this URL does not have`
  }

  return 'the query string differs'
}

/**
 * @typedef {object} Canonical
 * @property {string} href as written
 * @property {string} resolved
 * @property {number} count how many canonical links the page has
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {string} url the page's own address
 * @returns {Canonical}
 */
export function canonical(doc, url) {
  const links = Array.from(doc.querySelectorAll('link[rel]'))
    .filter((link) => tokens(link, 'rel').includes('canonical'))
  const warnings = []

  if (links.length === 0) {
    return { href: '', resolved: '', count: 0, warnings: ['No canonical URL.'] }
  }

  if (links.length > 1) {
    warnings.push(`${links.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`)
  }

  const href = (links[0].getAttribute('href') || '').trim()
  const target = resolve(href, url)
  const current = resolve(url, url)

  if (href === '' || !target) {
    warnings.push('The canonical link has no usable URL.')

    return { href, resolved: '', count: links.length, warnings }
  }

  if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    warnings.push('The canonical URL is relative. Use the full URL, with the scheme and host.')
  }

  const difference = current ? canonicalDifference(target, current) : ''

  if (difference) warnings.push(`The canonical URL is not this page: ${difference}.`)

  return { href, resolved: target.href, count: links.length, warnings }
}

/**
 * @typedef {object} Alternate
 * @property {string} lang
 * @property {string} href
 * @property {boolean} self
 * @property {string} problem
 */

/**
 * @param {Document} doc
 * @param {string} url
 * @returns {{items: Array<Alternate>, warnings: Array<string>}}
 */
export function hreflang(doc, url) {
  const current = resolve(url, url)
  const items = Array.from(doc.querySelectorAll('link[hreflang]'))
    .filter((link) => tokens(link, 'rel').includes('alternate'))
    .map((link) => {
      const lang = (link.getAttribute('hreflang') || '').trim()
      const target = resolve(link.getAttribute('href') || '', url)

      return {
        lang,
        href: target ? target.href : '',
        self: Boolean(target && current && comparable(target) === comparable(current)),
        problem: lang.toLowerCase() === 'x-default' ? '' : languageProblem(lang),
      }
    })

  if (items.length === 0) return { items, warnings: [] }

  const warnings = []

  if (!items.some((item) => item.self)) {
    warnings.push('No hreflang link points to this page. Every page in the set has to list itself.')
  }

  if (!items.some((item) => item.lang.toLowerCase() === 'x-default')) {
    warnings.push('No x-default alternate, so visitors whose language is not listed get no fallback.')
  }

  items.filter((item) => item.problem).forEach((item) => {
    warnings.push(`hreflang ${item.problem}.`)
  })

  return { items, warnings }
}

/**
 * Words a visitor can read, which leaves out scripts, styles and anything in a template.
 *
 * @param {Node|null} node
 * @returns {number}
 */
export function wordCount(node) {
  if (!node) return 0

  let count = 0
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG'])
  const walk = (current) => {
    current.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        count += (child.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length
      } else if (child.nodeType === 1 && !skip.has(child.nodeName.toUpperCase())) {
        walk(child)
      }
    })
  }

  walk(node)

  return count
}

/**
 * @typedef {object} Robots
 * @property {string} meta
 * @property {string} header
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {string} header the X-Robots-Tag the server sent, '' when it sent none
 * @returns {Robots}
 */
export function robots(doc, header = '') {
  const meta = [...metaNamed(doc, 'robots'), ...metaNamed(doc, 'googlebot')]
    .map((tag) => (tag.getAttribute('content') || '').trim())
    .filter(Boolean)
    .join(', ')
  const warnings = []
  const directives = `${meta}, ${header}`.toLowerCase()

  if (/\b(noindex|none)\b/.test(directives)) {
    warnings.push('This page asks not to be indexed.')
  }

  if (/\b(nofollow|none)\b/.test(directives)) {
    warnings.push('This page asks search engines not to follow its links.')
  }

  return { meta, header: String(header || ''), warnings }
}

/**
 * @typedef {object} Overview
 * @property {{value: string, length: number, hint: string}} title
 * @property {{value: string, length: number, hint: string}} description
 * @property {Canonical} canonical
 * @property {Robots} robots
 * @property {{items: Array<Alternate>, warnings: Array<string>}} hreflang
 * @property {{value: string, problem: string}} lang
 * @property {string} viewport
 * @property {{value: string, declared: boolean}} charset
 * @property {number} words
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {string} url
 * @param {string} robotsHeader
 * @returns {Overview}
 */
export function overview(doc, url, robotsHeader = '') {
  const titleNode = doc.querySelector('head title') || doc.querySelector('title')
  const title = text(titleNode ? titleNode.textContent : '')
  const descriptionTag = metaNamed(doc, 'description')[0]
  const description = text(descriptionTag ? descriptionTag.getAttribute('content') : '')
  const lang = (doc.documentElement.getAttribute('lang') || '').trim()
  const viewport = metaNamed(doc, 'viewport')[0]
  const declaredCharset = doc.querySelector('meta[charset]')
    || Array.from(doc.querySelectorAll('meta[http-equiv]'))
      .find((meta) => /charset=/i.test(meta.getAttribute('content') || ''))

  const result = {
    title: { value: title, length: title.length, hint: lengthHint(title.length, TITLE_RANGE) },
    description: {
      value: description,
      length: description.length,
      hint: lengthHint(description.length, DESCRIPTION_RANGE),
    },
    canonical: canonical(doc, url),
    robots: robots(doc, robotsHeader),
    hreflang: hreflang(doc, url),
    lang: { value: lang, problem: languageProblem(lang) },
    viewport: viewport ? (viewport.getAttribute('content') || '').trim() : '',
    charset: {
      value: String(doc.characterSet || doc.charset || ''),
      declared: Boolean(declaredCharset),
    },
    words: wordCount(doc.body),
    warnings: [],
  }

  if (result.title.hint) result.warnings.push(`Title ${result.title.hint}.`)
  if (result.description.hint) result.warnings.push(`Meta description ${result.description.hint}.`)
  if (result.lang.problem) result.warnings.push(`<html lang> ${result.lang.problem}.`)
  if (!result.viewport) result.warnings.push('No viewport meta tag, so phones draw the desktop layout.')
  if (!result.charset.declared) result.warnings.push('No charset declared in the markup.')

  result.warnings.push(
    ...result.canonical.warnings,
    ...result.robots.warnings,
    ...result.hreflang.warnings,
  )

  return result
}

/**
 * @typedef {object} Heading
 * @property {number} index position on the page, which is also how to find it again
 * @property {number} level 1 to 6
 * @property {string} text
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {Environment} env
 * @returns {{items: Array<Heading>, warnings: Array<string>, elements: Array<Element>}}
 */
export function headings(doc, env) {
  const elements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  let previous = 0

  const items = elements.map((element, index) => {
    const level = Number(element.tagName.slice(1))
    const label = text(element.textContent)
    const warnings = []

    if (label === '') warnings.push('empty')
    if (previous > 0 && level > previous + 1) warnings.push(`skips from h${previous} to h${level}`)
    if (!env.measure(element).visible) warnings.push('hidden from view')

    previous = level

    return { index, level, text: label, warnings }
  })

  const h1s = items.filter((item) => item.level === 1).length
  const warnings = []

  if (h1s === 0) warnings.push('No H1.')
  if (h1s > 1) warnings.push(`${h1s} H1 headings. One page, one main heading.`)

  items.forEach((item) => item.warnings.forEach((warning) => {
    warnings.push(`H${item.level} ${item.text ? `"${item.text}"` : `#${item.index + 1}`}: ${warning}.`)
  }))

  return { items, warnings, elements }
}

/**
 * Alt text that is really a file name, which tells a screen reader nothing it can use.
 *
 * @param {string} alt
 * @param {string} src
 * @returns {boolean}
 */
export function looksLikeFilename(alt, src) {
  const value = alt.trim().toLowerCase()

  if (value === '') return false
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(value)) return true
  if (/^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(value)) return true

  const file = String(src || '').split(/[?#]/)[0].split('/').pop().toLowerCase()
  const stem = file.replace(/\.[a-z0-9]+$/, '')

  return stem !== '' && value === stem
}

/**
 * @typedef {object} PageImage
 * @property {number} index
 * @property {string} src
 * @property {string|null} alt null when the attribute is missing
 * @property {string} size drawn size against real size, when both are known
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {Environment} env
 * @returns {{items: Array<PageImage>, warnings: Array<string>, elements: Array<Element>}}
 */
export function images(doc, env) {
  const elements = Array.from(doc.querySelectorAll('img'))

  const items = elements.map((element, index) => {
    const src = element.currentSrc || element.getAttribute('src') || element.getAttribute('data-src') || ''
    const alt = element.hasAttribute('alt') ? element.getAttribute('alt') : null
    const box = env.measure(element)
    const warnings = []

    if (alt === null) warnings.push('no alt attribute')
    else if (alt.trim() === '') warnings.push('empty alt, which is right only for a decorative image')
    else if (looksLikeFilename(alt, src)) warnings.push('alt text is a file name')

    if (!element.hasAttribute('width') || !element.hasAttribute('height')) {
      warnings.push('no width and height, so the page shifts when it loads')
    }

    const needed = box.width * env.pixelRatio

    if (box.visible && box.width > 0 && box.naturalWidth > needed * OVERSIZE_RATIO
        && box.naturalWidth - needed > OVERSIZE_MIN_PX) {
      warnings.push(`${box.naturalWidth}px wide but drawn at ${Math.round(box.width)}px`)
    }

    if ((element.getAttribute('loading') || '').toLowerCase() === 'lazy'
        && box.visible && box.top < env.viewportHeight) {
      warnings.push('lazy loaded but visible on the first screen, which delays it')
    }

    return {
      index,
      src,
      alt: alt === null ? null : text(alt),
      size: box.naturalWidth && box.width
        ? `${Math.round(box.width)} × ${Math.round(box.height)} of ${box.naturalWidth} × ${box.naturalHeight}`
        : '',
      warnings,
    }
  })

  const flagged = items.filter((item) => item.warnings.length > 0)
  const warnings = flagged.length > 0
    ? [`${flagged.length} of ${items.length} images have a problem.`]
    : []

  return { items, warnings, elements }
}

/**
 * The words a link is known by: its text, or failing that what an image or a label inside
 * it says.
 *
 * @param {Element} link
 * @returns {string}
 */
function linkText(link) {
  const own = text(link.textContent)

  if (own) return own

  const image = Array.from(link.querySelectorAll('img[alt]')).map((img) => img.getAttribute('alt')).find(Boolean)

  return text(link.getAttribute('aria-label') || image || link.getAttribute('title') || '')
}

/**
 * @typedef {object} PageLink
 * @property {number} index
 * @property {string} href as written
 * @property {string} text
 * @property {string} kind internal, external or other
 * @property {boolean} nofollow
 * @property {Array<string>} warnings
 */

/**
 * @param {Document} doc
 * @param {string} url
 * @returns {{items: Array<PageLink>, counts: {internal: number, external: number, nofollow: number}, warnings: Array<string>, elements: Array<Element>}}
 */
export function links(doc, url) {
  const current = resolve(url, url)
  const elements = Array.from(doc.querySelectorAll('a[href]'))
  const counts = { internal: 0, external: 0, nofollow: 0 }

  const items = elements.map((element, index) => {
    const href = (element.getAttribute('href') || '').trim()
    const target = resolve(href, url)
    const nofollow = tokens(element, 'rel').includes('nofollow')
    const label = linkText(element)
    const warnings = []
    let kind = 'other'

    if (target && /^https?:$/.test(target.protocol)) {
      kind = current && target.host === current.host ? 'internal' : 'external'
    }

    if (kind !== 'other') counts[kind] += 1
    if (nofollow) counts.nofollow += 1

    if (label === '') warnings.push('no text')
    if (href === '' || href === '#') warnings.push('goes nowhere')
    if (/^javascript:/i.test(href)) warnings.push('a javascript: link, which is a button pretending')
    if (kind === 'internal' && nofollow) warnings.push('internal link marked nofollow')

    if (current && current.protocol === 'https:' && target && target.protocol === 'http:') {
      warnings.push('http: on an https: page')
    }

    return { index, href, text: label, kind, nofollow, warnings }
  })

  const flagged = items.filter((item) => item.warnings.length > 0)
  const warnings = flagged.length > 0
    ? [`${flagged.length} of ${items.length} links have a problem.`]
    : []

  return { items, counts, warnings, elements }
}

/**
 * @typedef {object} SocialTag
 * @property {string} name
 * @property {string} value
 */

/**
 * @param {Document} doc
 * @returns {{openGraph: Array<SocialTag>, x: Array<SocialTag>, warnings: Array<string>}}
 */
export function social(doc) {
  const tags = Array.from(doc.querySelectorAll('meta')).map((meta) => ({
    name: (meta.getAttribute('property') || meta.getAttribute('name') || '').trim().toLowerCase(),
    value: text(meta.getAttribute('content')),
  }))
  const openGraph = tags.filter((tag) => tag.name.startsWith('og:'))
  const x = tags.filter((tag) => tag.name.startsWith('twitter:'))
  const has = (name) => tags.some((tag) => tag.name === name && tag.value !== '')
  const warnings = []

  REQUIRED_OPEN_GRAPH.filter((name) => !has(name)).forEach((name) => {
    warnings.push(`Missing ${name}.`)
  })

  REQUIRED_X.filter((name) => !has(name)).forEach((name) => {
    warnings.push(`Missing ${name}, so X shows a bare link.`)
  })

  const image = openGraph.find((tag) => tag.name === 'og:image')

  if (image && image.value && !/^https?:\/\//i.test(image.value)) {
    warnings.push('og:image is not a full URL, and link previews will not fetch it.')
  }

  return { openGraph, x, warnings }
}

/**
 * Links a developer reaches for while looking at this, all built from the page's own URL.
 *
 * View source is left out on purpose: browsers refuse to open a view-source: URL from a
 * link, so it would be a link that does nothing.
 *
 * @param {string} url
 * @returns {Array<{label: string, href: string}>}
 */
export function quickLinks(url) {
  const current = resolve(url, url)

  if (!current) return []

  return [
    { label: 'robots.txt', href: `${current.origin}/robots.txt` },
    { label: 'sitemap.xml', href: `${current.origin}/sitemap.xml` },
    {
      label: 'PageSpeed Insights',
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(comparable(current))}`,
    },
  ]
}

/**
 * Everything the section shows, from one read of the page.
 *
 * The elements come back beside the model rather than inside it. The model goes into the
 * bar's reactive state, and Alpine would wrap every page element it found there in a proxy.
 *
 * @param {Document} doc
 * @param {object} options
 * @param {string} options.url
 * @param {string} [options.robotsHeader]
 * @param {Environment} options.env
 * @returns {{model: object, elements: Record<string, Array<Element>>}}
 */
export function inspectPage(doc, { url, robotsHeader = '', env }) {
  const { elements: headingElements, ...headingView } = headings(doc, env)
  const { elements: imageElements, ...imageView } = images(doc, env)
  const { elements: linkElements, ...linkView } = links(doc, url)
  const { elements: schemaElements, model: schemaView } = schema(doc, url)
  const flagged = (view) => view.items.filter((item) => item.warnings.length > 0).length

  const counts = {
    overview: 0,
    headings: headingView.warnings.length,
    images: flagged(imageView),
    links: flagged(linkView),
    schema: schemaView.warnings.length,
    social: 0,
  }
  const model = {
    overview: overview(doc, url, robotsHeader),
    headings: headingView,
    images: imageView,
    links: linkView,
    schema: schemaView,
    social: social(doc),
    quickLinks: quickLinks(url),
    counts,
  }

  counts.overview = model.overview.warnings.length
  counts.social = model.social.warnings.length
  model.warningCount = Object.values(counts).reduce((total, count) => total + count, 0)

  return {
    model,
    elements: {
      headings: headingElements,
      images: imageElements,
      links: linkElements,
      schema: schemaElements,
    },
  }
}

/**
 * The model's shape with nothing in it, so the panel's bindings have something to read
 * before the first read of the page and after one that failed.
 *
 * @returns {object}
 */
export function emptyModel() {
  const length = { value: '', length: 0, hint: '' }

  return {
    overview: {
      title: length,
      description: length,
      canonical: { href: '', resolved: '', count: 0, warnings: [] },
      robots: { meta: '', header: '', warnings: [] },
      hreflang: { items: [], warnings: [] },
      lang: { value: '', problem: '' },
      viewport: '',
      charset: { value: '', declared: false },
      words: 0,
      warnings: [],
    },
    headings: { items: [], warnings: [] },
    images: { items: [], warnings: [] },
    links: { items: [], counts: { internal: 0, external: 0, nofollow: 0 }, warnings: [] },
    schema: emptySchema(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0,
  }
}
