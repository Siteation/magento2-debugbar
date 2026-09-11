import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  clampDockPosition,
  exceedsDragThreshold,
  isDockPosition,
  placementForDock,
} from '../src/dock.js'

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

test('a press only becomes a drag once the pointer has travelled', () => {
  // A press that never moves has to stay a click, or clicking the grip would pin a dock
  // that was centring itself and nothing would say why it stopped.
  assert.equal(exceedsDragThreshold(0, 0), false)
  assert.equal(exceedsDragThreshold(2, 0), false)
  assert.equal(exceedsDragThreshold(-2, 2), false)
  assert.equal(exceedsDragThreshold(0, 3), true)
  assert.equal(exceedsDragThreshold(40, -40), true)
})
