/**
 * The browser half of the value policy.
 *
 * Every other section is redacted in PHP before it is written to disk. The Alpine section
 * reads live objects out of the page instead, so the same rules have to exist here or the
 * one section that never touches a file would be the one that leaks. The key pattern, the
 * depth bound and the item bound are the ones in Model/Redactor.php.
 *
 * Strings are cut shorter than PHP cuts them. Nothing here is stored, and 2000 characters
 * of one value would push everything else in the panel off the screen.
 */

export const POLICY_FULL = 'full'
export const POLICY_MASKED = 'masked'
export const POLICY_NONE = 'none'

export const REDACTED = '[redacted]'
export const MASKED = '[masked]'
export const TRUNCATED = '[maximum depth reached]'
export const CIRCULAR = '[circular]'

const SENSITIVE_KEY_PATTERN =
  /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i

const MAX_DEPTH = 5
const MAX_ITEMS = 100
const MAX_STRING = 400

/**
 * @param {unknown} value
 * @returns {string} one of the three policy names, whatever was passed in
 */
export function policyName(value) {
  return [POLICY_FULL, POLICY_MASKED, POLICY_NONE].includes(value) ? value : POLICY_FULL
}

/**
 * @param {string} key
 * @returns {boolean}
 */
export function isSensitiveKey(key) {
  return SENSITIVE_KEY_PATTERN.test(String(key))
}

/**
 * A value fit to show in the panel.
 *
 * @param {unknown} value
 * @param {string} policy
 * @returns {unknown}
 */
export function clean(value, policy = POLICY_FULL) {
  if (policy === POLICY_NONE) return undefined

  return walk(value, policy, 0, new WeakSet())
}

/**
 * @param {string} value
 * @param {string} policy
 * @returns {string}
 */
export function cleanString(value, policy = POLICY_FULL) {
  if (policy === POLICY_NONE) return ''
  if (policy === POLICY_MASKED) return value === '' ? '' : MASKED

  return value.length <= MAX_STRING ? value : `${value.slice(0, MAX_STRING)}...`
}

/**
 * An x-data expression, kept readable but stripped of its literals.
 *
 * The same reasoning as cleanSql in Model/Redactor.php: a server rendered expression puts
 * page data inline, so `initSlider({sku: 'ABC-1'})` carries a value in code's clothing.
 * The shape is what makes it recognisable, and the shape survives.
 *
 * @param {string} expression
 * @param {string} policy
 * @returns {string}
 */
export function cleanExpression(expression, policy = POLICY_FULL) {
  if (policy === POLICY_NONE) return ''

  const stripped = expression
    .replace(/'(?:[^'\\]|\\.)*'/g, "'?'")
    .replace(/"(?:[^"\\]|\\.)*"/g, '"?"')

  // Masking what is left would say nothing: with the literals gone, the shape is all the
  // expression still carries, and shape is what the masked policy keeps.
  return cleanString(stripped, POLICY_FULL)
}

/**
 * @param {unknown} value
 * @param {string} policy
 * @param {number} depth
 * @param {WeakSet<object>} seen
 * @returns {unknown}
 */
function walk(value, policy, depth, seen) {
  if (value === null || value === undefined) return value

  const type = typeof value

  if (type === 'string') return cleanString(value, policy)
  if (type === 'number' || type === 'boolean') return value
  if (type === 'function') return `ƒ ${value.name || 'anonymous'}()`
  if (type === 'symbol') return value.toString()
  if (type === 'bigint') return `${value}n`
  if (type !== 'object') return type

  if (value instanceof Node) return describeNode(value)
  if (value instanceof Date) return value.toISOString()
  if (value instanceof Error) return `${value.name}: ${cleanString(value.message, policy)}`
  if (value instanceof Map) return `Map(${value.size})`
  if (value instanceof Set) return `Set(${value.size})`

  if (depth >= MAX_DEPTH) return TRUNCATED

  // Alpine's own state is full of shared references, and a parent reachable from a child
  // is normal rather than a bug in the page.
  if (seen.has(value)) return CIRCULAR

  seen.add(value)

  return Array.isArray(value)
    ? walkArray(value, policy, depth, seen)
    : walkObject(value, policy, depth, seen)
}

/**
 * @param {Array<unknown>} value
 * @param {string} policy
 * @param {number} depth
 * @param {WeakSet<object>} seen
 * @returns {Array<unknown>}
 */
function walkArray(value, policy, depth, seen) {
  const clean = value.slice(0, MAX_ITEMS).map((item) => walk(item, policy, depth + 1, seen))

  if (value.length > MAX_ITEMS) {
    clean.push(`[${value.length - MAX_ITEMS} more]`)
  }

  return clean
}

/**
 * @param {object} value
 * @param {string} policy
 * @param {number} depth
 * @param {WeakSet<object>} seen
 * @returns {Record<string, unknown>}
 */
function walkObject(value, policy, depth, seen) {
  const keys = keysOf(value)
  // No prototype, so a component property named __proto__ is a key like any other rather
  // than an assignment that silently goes nowhere.
  const clean = Object.create(null)
  let kept = 0

  for (const key of keys) {
    if (kept >= MAX_ITEMS) {
      clean.__truncated__ = keys.length - kept
      break
    }

    if (isSensitiveKey(key)) {
      clean[key] = REDACTED
      kept++

      continue
    }

    // A getter on a component can throw, and reading state is not worth a broken panel.
    try {
      clean[key] = walk(value[key], policy, depth + 1, seen)
    } catch (error) {
      clean[key] = `[unreadable: ${error && error.message ? error.message : 'threw'}]`
    }

    kept++
  }

  return clean
}

/**
 * Alpine hands out a merged proxy for a component's scope, and its ownKeys trap answers
 * over a bare `{}` target. Object.keys asks each key for a descriptor, gets nothing back,
 * and reports an empty object for a component that plainly has state. Reflect.ownKeys
 * takes the trap at its word.
 *
 * @param {object} value
 * @returns {Array<string>}
 */
export function keysOf(value) {
  try {
    const keys = Object.keys(value)

    if (keys.length > 0) return keys

    return Reflect.ownKeys(value)
      .filter((key) => typeof key === 'string' && !key.startsWith('_x_'))
  } catch {
    return []
  }
}

/**
 * @param {Node} node
 * @returns {string}
 */
export function describeNode(node) {
  if (!(node instanceof Element)) return `<${node.nodeName.toLowerCase()}>`

  const id = node.id ? `#${node.id}` : ''
  const classes = typeof node.className === 'string' && node.className.trim()
    ? `.${node.className.trim().split(/\s+/).slice(0, 2).join('.')}`
    : ''

  return `<${node.tagName.toLowerCase()}${id}${classes}>`
}
