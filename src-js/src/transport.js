/**
 * Every JSON read the bar makes, and the one place that knows what a profile envelope
 * looks like.
 *
 * The section-payload shape is a contract with three PHP controllers. It used to be decoded
 * in two component methods with eighteen identical lines each, which is two places to fix
 * when the envelope changes and one of them to forget.
 */

/**
 * @param {string} url
 * @returns {Promise<object>} the decoded body
 * @throws {Error} with the endpoint's own message when it sent one
 */
export async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })

  // Parsed before the status is judged, because the endpoints answer a refusal with
  // `{error: ...}` and that sentence is better than the number. A body that is not JSON at
  // all, Magento's own error page, still reports the status rather than a parse failure.
  const body = await response.json().catch(() => null)

  if (!response.ok) throw new Error((body && body.error) || `HTTP ${response.status}`)
  if (body === null) throw new Error('The response was not JSON.')

  return body
}

/**
 * @param {string} url
 * @returns {Promise<{profile: object, payloads: Record<string, object>}>}
 */
export async function fetchProfile(url) {
  const profile = await fetchJson(url)
  const payloads = {}

  Object.entries(profile.sections || {}).forEach(([key, section]) => {
    payloads[key] = section.payload || {}
  })

  return { profile, payloads }
}
