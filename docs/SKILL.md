---
name: use-siteation-debugbar
description: Inspect Magento requests through Siteation_DebugBar's MCP server. Use when asked why a page is slow, what a request did, which queries or observers ran, or to explain an error on a Magento store running this module.
---

# Use Siteation Debug Bar

Read exact, stored Magento request data instead of guessing from a screenshot or a log.
Every profile is already redacted and bounded. The tools are read only and change nothing.

## Find the right request

1. If you have the `X-Siteation-DebugBar-Profile` response header, use that id directly.
   It is the only reliable way to say which request you are looking at.
2. Otherwise call `list_debug_profiles`. Match on method, path, status and duration.
   **Do not assume the newest profile is the one you want.** Storefront pages fire
   background AJAX, and those are profiled too.
3. Pass `only_with_findings: true` when you are hunting for a problem rather than
   describing a specific request.

## Read in the right order

1. `get_debug_findings` first, always. It is the module's own conclusion about the
   request and it is small.
2. Then the smallest section that tests that conclusion.
3. `inspect_debug_queries` only when the evidence points at the database. Start with
   `filter: "slow"` and `limit: 5`.

Ask for small limits. Start with 10 profiles, 10 findings, 5 items. Increase or page with
`cursor` only when the answer actually needs more.

## Interpret it honestly

* **A finding is a lead, not a verdict.** `query.n_plus_one` is deliberately conservative,
  but chunked and paginated reads still trip it. Confirm before recommending a change.
* **Read the counts, not the list length.** Collectors cap what they retain. A section
  saying `count: 862` with 50 items is not a contradiction, and
  `collector.truncated` says so explicitly.
* **Compare query time against total request time before blaming the database.** If
  queries are a small share, look at `blocks`, `observers` and `cache` instead. Magento
  pages are far more often slow in block rendering than in SQL.
* **A profile with no queries and no events is a full page cache hit**, not a fast page.
  The application never ran. Say so rather than reporting it as a good result.
* **`own_ms` on a block excludes its children.** Use it to find the block worth fixing;
  `total_ms` on a container is just the page.

## Explain the result

Answer in this order, and name the exact profile and request so the developer knows which
one you mean:

1. What happened
2. What is wrong
3. Why
4. Where to look
5. What to check or try next

Prefer a short answer over a dump of the profile. Separate what the data shows from what
you are inferring.
