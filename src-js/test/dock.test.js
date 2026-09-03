import { test } from 'node:test'
import assert from 'node:assert/strict'

import { clampDockPosition, isDockPosition, placementForDock } from '../src/dock.js'

test('a moved dock stays one gap inside every viewport edge', () => {
  const dock = { width: 400, height: 60 }
  const viewport = { width: 1000, height: 800 }

  assert.deepEqual(clampDockPosition({ left: -50, top: -20 }, dock, viewport), {
    left: 12,
    top: 12,
  })
  assert.deepEqual(clampDockPosition({ left: 900, top: 900 }, dock, viewport), {
    left: 588,
    top: 728,
  })
})

test('only finite stored coordinates are restored', () => {
  assert.equal(isDockPosition({ left: 120, top: 240 }), true)
  assert.equal(isDockPosition({ left: '120', top: 240 }), false)
  assert.equal(isDockPosition({ left: 120 }), false)
  assert.equal(isDockPosition(null), false)
})

test('a moved dock opens the inspector from its nearest edge', () => {
  const dock = { height: 60 }

  assert.equal(placementForDock({ top: 100 }, dock, 800), 'top')
  assert.equal(placementForDock({ top: 700 }, dock, 800), 'bottom')
})
