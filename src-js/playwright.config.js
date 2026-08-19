import { defineConfig } from '@playwright/test'

/**
 * The browser suite, which needs a running store. `npm test` does not: keeping them apart
 * is why the unit tests stay a second long and need nothing installed.
 *
 * Chrome rather than a downloaded Chromium, because this is a developer tool being tested
 * on a developer machine and 150 MB of browser is a poor trade for testing a bar that is
 * 60 kB. Set NDB_BROWSER_CHANNEL to something else if that assumption stops holding.
 */
export default defineConfig({
  testDir: './test/browser',
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: process.env.NDB_BASE_URL || 'https://mage-debugbar.test',
    channel: process.env.NDB_BROWSER_CHANNEL || 'chrome',
    // A local store's certificate is its own.
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write'],
    viewport: { width: 1440, height: 900 },
  },
})
