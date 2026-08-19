/**
 * The bar, in a browser, against a running store.
 *
 * Every bug found in the interface so far has been of one kind: a binding that throws, an
 * element that renders empty, a control that does nothing. None of them is a wrong answer,
 * so none of them is catchable by a unit test, and all of them are silent unless somebody
 * has the console open. This walks the bar and asks it whether anything threw.
 *
 * The bar answers that itself: early.js watches console.warn for every Alpine on the page,
 * including its own, and the Health tab lists what it caught. That buffer is the assertion.
 *
 * Needs the store at NDB_BASE_URL with the bar enabled. Run with `npm run test:browser`.
 */
import { expect, test } from '@playwright/test'

/** Never full page cached, and it produces queries with call sites. */
const PAGE = '/checkout/cart/'

/**
 * The bar's Alpine component, so a test can read what the panel is showing rather than
 * guessing from the DOM. Its markup lives in a shadow root; Playwright's locators pierce
 * that, but state does not.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(state: object) => unknown} read
 * @returns {Promise<unknown>}
 */
function state(page, read) {
  return page.evaluate(
    (source) => {
      const root = document.getElementById('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')

      // eslint-disable-next-line no-new-func
      return new Function(`return (${source})`)()(root._x_dataStack[0])
    },
    read.toString()
  )
}

/**
 * Waits for the component to satisfy a condition, rather than for a length of time.
 *
 * Selecting a section starts work: history fetches itself, the Alpine section re-reads the
 * page. A test that asks the next question immediately gets the answer from before.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(state: object) => boolean} until
 * @returns {Promise<void>}
 */
async function waitForState(page, until) {
  await page.waitForFunction(
    (source) => {
      const root = document.getElementById('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')

      // eslint-disable-next-line no-new-func
      return Boolean(new Function(`return (${source})`)()(root._x_dataStack[0]))
    },
    until.toString()
  )
}

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array<object>>} what the bar's own error capture collected
 */
function alpineErrors(page) {
  return page.evaluate(() => window.__siteationDebugBar?.alpineErrors ?? [])
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function openBar(page) {
  await page.goto(PAGE)
  await page.waitForFunction(
    () => document.getElementById('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')
      ?._x_dataStack !== undefined
  )
  await page.evaluate(() => {
    const bar = document.getElementById('siteation-debugbar').shadowRoot.querySelector('.ndb')
    const data = bar._x_dataStack[0]

    data.openInspector()
    data.maximised = true
  })
  await expect(page.locator('.ndb-sheet')).toBeVisible()
}

test.describe('the bar', () => {
  test('injects itself and reports the request', async ({ page }) => {
    await openBar(page)

    await expect(page.locator('.ndb-sheet .ndb-path')).toContainText(PAGE)
    await expect(page.locator('.ndb-sheet .ndb-nav-item').first()).toBeVisible()
    expect(await alpineErrors(page)).toEqual([])
  })

  test('every section and sub-tab renders without an expression throwing', async ({ page }) => {
    await openBar(page)

    const sections = await state(page, (data) => data.sections.map((section) => section.id))

    expect(sections.length).toBeGreaterThan(5)

    for (const section of sections) {
      await page.evaluate((id) => {
        document.getElementById('siteation-debugbar').shadowRoot
          .querySelector('.ndb')._x_dataStack[0].section = id
      }, section)

      // The panel has to say what it is, whatever else it does or does not have.
      await expect(page.locator('.ndb-section-head h2')).not.toBeEmpty()

      const errors = await alpineErrors(page)

      expect(errors, `${section} threw: ${JSON.stringify(errors)}`).toEqual([])
    }

    for (const [section, property, tabs] of [
      ['alpine', 'alpineTab', ['components', 'stores', 'deferred', 'health']],
      ['history', 'historyTab', ['recent', 'compare']],
    ]) {
      for (const tab of tabs) {
        await page.evaluate(([id, key, value]) => {
          const data = document.getElementById('siteation-debugbar').shadowRoot
            .querySelector('.ndb')._x_dataStack[0]

          data.section = id
          data[key] = value
        }, [section, property, tab])
        await page.waitForTimeout(150)

        const errors = await alpineErrors(page)

        expect(errors, `${section}/${tab} threw: ${JSON.stringify(errors)}`).toEqual([])
      }
    }
  })

  test('the overview tells the request as stages', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'overview' })

    await expect(page.locator('.ndb-step')).toHaveCount(3)
    await expect(page.locator('.ndb-summary')).toContainText('200')
    await expect(page.locator('.ndb-fact').first()).toBeVisible()
  })

  test('queries carry their call site, and the waterfall has rows', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'queries' })

    const queries = page.locator('.ndb-query')

    await expect(queries.first()).toBeVisible()
    expect(await queries.count()).toBeGreaterThan(0)

    // Collected since 1.0, rendered nowhere until the editor links went in.
    await expect(page.locator('.ndb-query .ndb-callsite').first()).toContainText('.php:')

    await state(page, (data) => { data.section = 'timeline' })
    await expect(page.locator('.ndb-wf-row').first()).toBeVisible()
  })

  test('the palette opens on the shortcut and filters', async ({ page }) => {
    await openBar(page)

    await page.keyboard.press('ControlOrMeta+Shift+KeyP')
    await expect(page.locator('.ndb-palette.is-open')).toBeVisible()
    await expect(page.locator('.ndb-palette-input')).toBeFocused()

    const all = await page.locator('.ndb-palette-item').count()

    await page.locator('.ndb-palette-input').fill('dark')
    await expect(page.locator('.ndb-palette-item')).toHaveCount(1)
    expect(all).toBeGreaterThan(1)

    await page.keyboard.press('Enter')
    await expect(page.locator('.ndb-palette.is-open')).toBeHidden()
    expect(await state(page, (data) => data.theme)).toBe('dark')

    await state(page, (data) => { data.setTheme('system') })
  })

  test('a comparison renders, and its empty state does not throw', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'history'; data.historyTab = 'compare' })

    // The panel used to evaluate against null on every page load, sixteen bindings deep.
    await expect(page.getByText('Pick a request and compare')).toBeVisible()
    expect(await alpineErrors(page)).toEqual([])

    await waitForState(page, (data) => !data.historyLoading && data.historyLoaded)

    const hasBaseline = await state(page, (data) => {
      data.baselineId = data.suggestedBaseline()

      return Boolean(data.baselineId)
    })

    test.skip(!hasBaseline, 'needs a second stored profile to compare against')

    await state(page, (data) => data.compareProfiles())
    await waitForState(page, (data) => data.comparison !== null || data.compareError !== '')

    expect(await state(page, (data) => data.compareError)).toBe('')

    await expect(page.locator('.ndb-compare tbody tr').first()).toBeVisible()
    expect(await alpineErrors(page)).toEqual([])
  })

  test('the report reaches the clipboard', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'overview' })

    await page.locator('.ndb-summary-copy').click()
    await expect(page.locator('.ndb-summary-copy')).toHaveText('Copied')

    const report = await page.evaluate(() => navigator.clipboard.readText())

    expect(report).toContain('# GET ' + PAGE)
    expect(report).toContain('## Findings')
    expect(report).toContain('## Cost')
  })

  test('an editor link points at a file and a line', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'queries' })

    const configured = await state(page, (data) => data.editorTemplate)

    test.skip(!configured, 'no editor configured, so call sites are plain text')

    // A finding's location uses the same class and is empty when it names a class rather
    // than a file, so the query rows are the ones to ask.
    const link = page.locator('.ndb-query .ndb-callsite-link').first()
    const href = await link.getAttribute('href')

    expect(href).toMatch(/^[a-z-]+:\/\//)
    expect(href, 'a path style template must not double the slash').not.toMatch(/file\/\//)
    expect(href).toMatch(/\d+$/)
  })
})
