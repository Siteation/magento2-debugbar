/**
 * The bar's formatters, as functions rather than as component members.
 *
 * These are the only pure code in the interface and the code most likely to be wrong at an
 * edge: a null delta, a byte threshold, a path with two segments, an editor template that
 * is not a URL. On the component they could only be exercised by driving a browser against
 * a running store; here `node --test` reaches them.
 *
 * Nothing reads the DOM or the clock without being handed it, so every function answers the
 * same way twice.
 */

/**
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function number(value, decimals = 0) {
  return Number(value || 0).toFixed(decimals)
}

/**
 * @param {number} bytes
 * @returns {string}
 */
export function bytes(bytes) {
  const value = Number(bytes || 0)

  if (value < 1024) return `${value} B`
  if (value < 1048576) return `${(value / 1024).toFixed(1)} kB`

  return `${(value / 1048576).toFixed(1)} MB`
}

/**
 * @param {number} count
 * @param {string} one
 * @param {string} many
 * @returns {string}
 */
export function plural(count, one, many) {
  return `${count} ${Number(count) === 1 ? one : many}`
}

/**
 * @param {number} seconds a unix timestamp
 * @param {number} now the unix timestamp to measure against
 * @returns {string}
 */
export function ago(seconds, now = Date.now() / 1000) {
  const elapsed = Math.max(0, now - Number(seconds || 0))

  if (elapsed < 60) return `${Math.round(elapsed)}s ago`
  if (elapsed < 3600) return `${Math.round(elapsed / 60)}m ago`

  return `${Math.round(elapsed / 3600)}h ago`
}

/**
 * A path short enough to sit in a chip.
 *
 * A REST call carries a masked cart id in the middle and its meaning at the end, so a long
 * path keeps its last two segments rather than its first: `.../shipping-information` says
 * what the request was, `/rest/default/V1/carts` does not.
 *
 * @param {string} url
 * @param {string} origin what a relative URL is resolved against
 * @returns {string}
 */
export function shortUrl(url, origin) {
  let path = url

  try {
    path = new URL(url, origin).pathname
  } catch {
    return url
  }

  if (path.length <= 42) return path

  const segments = path.split('/').filter(Boolean)

  return segments.length > 2 ? `…/${segments.slice(-2).join('/')}` : path
}

/**
 * What to call a request in a list.
 *
 * The path is the one thing that does not tell two Magewire updates apart: every component
 * posts to the same URL. Where the collector recognised one, the component and what it was
 * asked to do stand in for it.
 *
 * @param {object} summary a request summary, or a history entry
 * @returns {string}
 */
export function requestLabel(summary) {
  const magewire = summary && summary.magewire

  if (magewire && magewire.component) {
    return `${magewire.component} ${magewire.action || ''}`.trim()
  }

  return (summary && summary.path) || '/'
}

/**
 * @param {object} metric
 * @returns {string} the change, signed, in the metric's own unit
 */
export function deltaLabel(metric) {
  // A null delta is a metric one side never measured, not a change of zero. Signing it
  // would print "-0" over a number nobody wrote down.
  if (!metric || metric.delta === null || metric.delta === undefined) return 'not comparable'
  if (metric.delta === 0) return 'no change'

  const sign = metric.delta > 0 ? '+' : '-'
  const size = metric.unit === 'B'
    ? bytes(Math.abs(metric.delta))
    : `${number(Math.abs(metric.delta), metric.decimals)}${metric.unit ? ` ${metric.unit}` : ''}`

  return `${sign}${size}`
}

/**
 * @param {object} metric
 * @param {'baseline'|'subject'} side which profile's value the cell shows
 * @returns {string}
 */
export function metricValue(metric, side) {
  const value = metric[side]

  if (value === null || value === undefined) return 'none'

  return metric.unit === 'B'
    ? bytes(value)
    : `${number(value, metric.decimals)}${metric.unit ? ` ${metric.unit}` : ''}`
}

/**
 * @param {object} plugin
 * @returns {string}
 */
export function methodList(plugin) {
  return Object.entries(plugin.methods || {})
    .map(([method, kind]) => `${kind} ${method}`)
    .join(', ')
}

/**
 * A link that opens the file at the line, or an empty string when no editor is configured,
 * in which case the call site stays plain text.
 *
 * Stored paths are relative to the application root, so the root is what gets mapped for a
 * container. An absolute path is left alone: it came from outside the root and nothing here
 * knows where it went.
 *
 * @param {string} template the configured editor URL, with %f and %l
 * @param {string} root what a relative path is relative to
 * @param {string} file
 * @param {number} line
 * @returns {string}
 */
export function editorUrl(template, root, file, line) {
  if (!template || !file) return ''

  // Only a scheme that opens an editor. The template comes from configuration, and a
  // javascript: or data: one would turn every call site into a link worth not clicking.
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(template)
    || /^(javascript|data|vbscript):/i.test(template)) {
    return ''
  }

  const absolute = file.startsWith('/') ? file : `${root}/${file}`

  // Function replacements, because $& and $1 in a path are replacement patterns to
  // String.replace and would eat part of the very path they appear in.
  return template
    .replace('%f', () => encodeURI(absolute))
    .replace('%l', () => String(line || 1))
}

/**
 * A finding's location is a class name as often as it is a file, so it only becomes a link
 * when it is one: `path/to/File.php:120`.
 *
 * @param {string} template
 * @param {string} root
 * @param {string} location
 * @returns {string}
 */
export function locationUrl(template, root, location) {
  const match = String(location || '').match(/^(.+\.php):(\d+)$/)

  return match ? editorUrl(template, root, match[1], Number(match[2])) : ''
}
