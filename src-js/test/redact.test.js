/**
 * The value policy is the one piece of the bar's JavaScript that has to be right rather
 * than merely look right, because it is the last thing between a component's state and
 * the screen. Its PHP twin has tests; so does it.
 *
 * Node has no DOM, and the module asks whether a value is a Node before it walks it. Two
 * stand-ins are enough: nothing here needs a real one.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

class FakeNode {
  constructor(nodeName) {
    this.nodeName = nodeName
  }
}

class FakeElement extends FakeNode {
  constructor(tagName, id = '', className = '') {
    super(tagName)
    this.tagName = tagName
    this.id = id
    this.className = className
  }
}

globalThis.Node = FakeNode
globalThis.Element = FakeElement

const {
  CIRCULAR,
  MASKED,
  POLICY_FULL,
  POLICY_MASKED,
  POLICY_NONE,
  REDACTED,
  TRUNCATED,
  clean,
  cleanExpression,
  cleanString,
  describeNode,
  isSensitiveKey,
  keysOf,
  policyName,
} = await import('../src/redact.js')

test('an unknown policy falls back to full rather than to nothing', () => {
  assert.equal(policyName('full'), POLICY_FULL)
  assert.equal(policyName('masked'), POLICY_MASKED)
  assert.equal(policyName('none'), POLICY_NONE)
  assert.equal(policyName(undefined), POLICY_FULL)
  assert.equal(policyName('anything else'), POLICY_FULL)
})

test('the sensitive key pattern matches what Model/Redactor.php matches', () => {
  const sensitive = [
    'password', 'passwd', 'user_pwd', 'secret', 'token', 'apiKey', 'api_key', 'api-key',
    'Authorization', 'cookie', 'session_id', 'csrf', 'form_key', 'credit_card',
    'ccNumber', 'cc_number', 'cvv', 'iban', 'ssn', 'private_key',
  ]
  const ordinary = ['name', 'sku', 'qty', 'total', 'items', 'id', 'label', 'email']

  sensitive.forEach((key) => assert.ok(isSensitiveKey(key), `${key} should be sensitive`))
  ordinary.forEach((key) => assert.ok(!isSensitiveKey(key), `${key} should not be sensitive`))
})

test('a sensitive key is redacted at every depth, not only at the top', () => {
  const value = clean({ a: { b: { token: 'sk-live-1', sku: 'ABC' } } }, POLICY_FULL)

  assert.equal(value.a.b.token, REDACTED)
  assert.equal(value.a.b.sku, 'ABC')
})

test('full keeps values, masked keeps only their shape, none keeps nothing', () => {
  const state = { label: 'Add to cart', qty: 2, open: true, empty: '' }

  assert.deepEqual(JSON.parse(JSON.stringify(clean(state, POLICY_FULL))), state)
  assert.deepEqual(JSON.parse(JSON.stringify(clean(state, POLICY_MASKED))), {
    label: MASKED, qty: 2, open: true, empty: '',
  })
  assert.equal(clean(state, POLICY_NONE), undefined)
})

test('functions are named rather than dropped, so a component reads as a component', () => {
  const value = clean({ toggle() {}, anon: () => {} }, POLICY_FULL)

  assert.equal(value.toggle, 'ƒ toggle()')
  assert.equal(value.anon, 'ƒ anon()')
})

test('a DOM node becomes a description instead of being walked', () => {
  const value = clean({ el: new FakeElement('DIV', 'cart', 'a b c') }, POLICY_FULL)

  assert.equal(value.el, '<div#cart.a.b>')
})

test('the walk stops at five levels', () => {
  const value = clean({ a: { b: { c: { d: { e: { f: 1 } } } } } }, POLICY_FULL)

  assert.equal(value.a.b.c.d.e, TRUNCATED)
})

test('a cycle is reported, not followed', () => {
  const parent = { name: 'parent' }
  parent.self = parent

  assert.equal(clean(parent, POLICY_FULL).self, CIRCULAR)
})

test('long arrays and wide objects say how much was left out', () => {
  const list = clean(Array.from({ length: 150 }, (item, index) => index), POLICY_FULL)

  assert.equal(list.length, 101)
  assert.equal(list[100], '[50 more]')

  const wide = {}
  for (let index = 0; index < 150; index += 1) wide[`key${index}`] = index

  assert.equal(clean(wide, POLICY_FULL).__truncated__, 50)
})

test('a long string is cut, a short one is not', () => {
  assert.equal(cleanString('short', POLICY_FULL), 'short')
  assert.equal(cleanString('x'.repeat(400), POLICY_FULL).length, 400)
  assert.equal(cleanString('x'.repeat(401), POLICY_FULL), `${'x'.repeat(400)}...`)
  assert.equal(cleanString('anything', POLICY_MASKED), MASKED)
  assert.equal(cleanString('', POLICY_MASKED), '')
  assert.equal(cleanString('anything', POLICY_NONE), '')
})

test('a getter that throws costs its own key, not the whole component', () => {
  const state = {
    fine: 1,
    get broken() {
      throw new Error('no store')
    },
  }

  const value = clean(state, POLICY_FULL)

  assert.equal(value.fine, 1)
  assert.equal(value.broken, '[unreadable: no store]')
})

test('an x-data expression keeps its shape and loses its literals', () => {
  assert.equal(
    cleanExpression("initSlider({sku: 'ABC-1', label: \"Watch\"})", POLICY_FULL),
    "initSlider({sku: '?', label: \"?\"})"
  )
  assert.equal(cleanExpression("initHeader()", POLICY_FULL), 'initHeader()')
  assert.equal(cleanExpression("f('a\\'b')", POLICY_FULL), "f('?')")
  assert.equal(cleanExpression("f('x')", POLICY_NONE), '')

  // Masked has nothing left to mask once the literals are gone, and [masked] alone would
  // say less than the shape does.
  assert.equal(cleanExpression("f('x')", POLICY_MASKED), "f('?')")
})

test("Alpine's merged scope proxy enumerates through Reflect, not Object.keys", () => {
  const scope = { searchOpen: false, cart: { qty: 2 }, _x_effects: 'internal' }
  // What Alpine hands back from $data: an ownKeys trap answering over a bare target, so
  // every key it names has no descriptor and Object.keys drops all of them.
  const merged = new Proxy({}, {
    ownKeys: () => Reflect.ownKeys(scope),
    get: (target, key) => scope[key],
    has: (target, key) => key in scope,
  })

  assert.deepEqual(Object.keys(merged), [], 'the premise: this is why keysOf exists')
  assert.deepEqual(keysOf(merged), ['searchOpen', 'cart'])
  // Through JSON, which is how the panel renders it: the walked objects have no prototype
  // on purpose, and deepEqual compares those.
  assert.deepEqual(
    JSON.parse(JSON.stringify(clean(merged, POLICY_FULL))),
    { searchOpen: false, cart: { qty: 2 } }
  )
})

test('an ordinary object still enumerates the ordinary way', () => {
  assert.deepEqual(keysOf({ a: 1, b: 2 }), ['a', 'b'])
  assert.deepEqual(keysOf(Object.create(null)), [])
})

test('a node with nothing to describe still describes itself', () => {
  assert.equal(describeNode(new FakeElement('SPAN')), '<span>')
  assert.equal(describeNode(new FakeNode('#text')), '<#text>')
})

test('a property named __proto__ is a property, not an assignment', () => {
  // On a plain object it would vanish: writing __proto__ sets the prototype instead of a
  // key, so the panel would quietly show a component with one fewer property than it has.
  const state = JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}')
  const cleaned = clean(state, POLICY_FULL)

  assert.equal(Object.getPrototypeOf(cleaned), null)
  assert.deepEqual(Object.keys(cleaned), ['__proto__', 'ok'])
  assert.equal({}.polluted, undefined, 'and nothing was polluted on the way through')
})
