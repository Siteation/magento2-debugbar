# User guide

Siteation_DebugBar records what one Magento request actually did, and gives you three ways
to read it: a bar in the page, a markdown report, and an MCP server for a coding agent.

This guide is about using it. If you are working on the module itself, read the
[developer guide](developer-guide.md).

## What a profile is

Every request that the module is allowed to profile writes one JSON file under
`var/siteation_debugbar/`. That file is the profile: the request line, timings, every query
with the application frame it came from, the events and observers that ran, the blocks that
rendered, the cache reads and writes, the plugins that were built, and the module's own
findings about all of it.

The profile is bounded and redacted as it is written, not when it is read. Sensitive keys
are masked at record time, string literals are stripped from SQL, and each collector keeps a
capped number of items. Nothing you read later can be larger or franker than what was
stored.

Files are pruned to the newest 20 or the last 60 minutes, whichever comes first, and are
written `0600` inside a `0700` directory. A profile past that window is refused on read as
well as swept, so the retention holds whether or not anything has triggered a sweep.

## Switching it on

```
bin/magento config:set siteation_debugbar/general/enabled 1
```

Settings live under **Stores > Configuration > Siteation > Debug Bar**. They apply to the
whole installation: the decision to collect is made before the store is known, so a per
website or per store value is ignored rather than half honoured.

In developer mode that is all it takes. In any other mode the bar also needs an access key,
which is covered under [Debugging a live site](#debugging-a-live-site).

## Finding the request you mean

Every profiled response carries its id:

```
X-Siteation-DebugBar-Profile: 4ae570c5-d45f-418c-92a7-5cda582be81e
```

Use that header rather than assuming the newest profile is yours. A storefront page fires
background XHR, and those are profiled too.

## The bar in the page

The bar renders in a shadow root, so it cannot collide with the theme's CSS or its Alpine,
and it works on a page whose own JavaScript has failed.

**Collapsed**, it is a floating pill carrying the request line, the deploy mode, the query
count and time, the duration and the peak memory. Clicking anywhere on it opens the
inspector.

**Open**, it is a modal sheet with a sidebar. The page behind it is made inert, so a click
lands where you meant it rather than on the store.

**The bubble.** Closing the bar with the X collapses it to a small circle in the corner. It
keeps the findings count, so you can tell at a glance whether reopening is worth it, and it
follows the top or bottom placement setting. Clicking it brings the bar back. This is
remembered across pages, because being out of the way is a preference rather than a decision
about one page.

To take the bar off the screen entirely, for a screenshot or to test a sticky footer, use
**Hide the bar until the next page load** in the palette. That one is not remembered, because
nothing would be left on screen to undo it.

### Keyboard

| | |
| --- | --- |
| `Cmd/Ctrl Shift P` | Open the command palette |
| `Escape` | Close the inspector, or the palette if it is open |
| `Tab` | Cycles inside the sheet while it is open |

The palette holds everything: every section, the three themes, the top or bottom placement,
pinning a section to favourites, the window controls, copying the report, and hiding the bar.
Filter it by typing.

## The sections

| Section | What it answers |
| --- | --- |
| Findings | What is worth your attention on this request, worst first |
| Overview | What was asked for, what came back, and what it cost |
| Timeline | Important work in the order it happened, as a waterfall |
| Queries | Every query, timed, with the application frame it came from |
| Blocks | Block render times, with own time excluding children |
| Observers | Every observer that actually ran, grouped by event |
| Events | Every dispatched event, including ones nothing listens to |
| Cache | Reads and writes grouped by key prefix, with hit rates |
| Plugins | Which interceptors were built for this request, and on what |
| Alpine | The components on the page right now, and their live state |
| Magewire | The components on the page, their state, and each update's cost |
| History | Every profile still on disk, so an earlier request is one click away |

Alpine and Magewire read the live page rather than the stored profile, so they show what is
in the browser now. Everything else is the profile.

Only summaries travel with the page, about 1.5 kB. A section's contents are fetched the
first time you open it.

You can switch sections off entirely in the configuration. A section that is off is not
collected either, so turning off Blocks on a page that renders four hundred of them makes
the request you are measuring cheaper as well as the panel quieter. Findings and Overview
are always on.

## Reading findings

Findings are the module's own conclusions, worst first. Each one says what is wrong, why it
matters, where it came from, and what to look at next. Clicking one takes you to the section
and filter holding its evidence.

| Finding | Means |
| --- | --- |
| `request.error` | The response was a 4xx or 5xx |
| `request.exception` | Something threw; the finding names it and the frame it stopped at |
| `request.slow` | The request passed the slow request threshold |
| `query.slow` | A single query passed the slow query threshold |
| `query.repeated` | The same query shape ran three or more times |
| `query.n_plus_one` | A repeated shape that looks like a loop over ids |
| `block.slow` | A block's own render time stands out |
| `observer.slow` | An observer's time stands out |
| `cache.high_miss_rate` | A key prefix is missing far more often than it hits |
| `collector.truncated` | A collector hit its cap, so its list is shorter than its count |

A finding is a lead, not a verdict. `query.n_plus_one` is deliberately conservative and
chunked reads still trip it. Confirm before changing anything.

Two habits worth keeping:

- **Read the counts, not the list length.** Collectors cap what they keep. A section saying
  `count: 862` with 50 items is not a contradiction.
- **A profile with no queries and no events is a full page cache hit**, not a fast page. The
  application never ran.

## Comparing two requests

The History section's Compare tab answers "what did my change cost". Profile a page, make
the change, load it again, and compare the two profiles: duration, memory, queries, cache
and findings, plus the query shapes that were added or removed.

"The same query" means the same shape, with values and numbers normalised, so an N+1 built
from interpolated ids reads as one shape that ran ninety times rather than ninety queries.

## Requests that cannot carry a bar

AJAX, GraphQL and REST responses are profiled, but nothing can be injected into them. They
still return the profile header, and the bar lists them: the request list in the collapsed
bar's header shows what the page has fired since it loaded, and clicking one loads that
profile into the inspector.

Magewire updates are named by component and action rather than by URL, because every
component posts to the same endpoint and a page using it would otherwise produce a list of
identical rows.

## Using it from a coding agent

The same profiles are readable over MCP, so an agent reads exact stored data instead of
guessing from a screenshot.

```
claude mcp add --scope local siteation-debugbar -- php /abs/path/to/bin/magento siteation:debugbar:mcp
```

Or, for anything that speaks MCP over stdio:

```json
{
  "mcpServers": {
    "siteation-debugbar": {
      "command": "php",
      "args": ["/abs/path/to/bin/magento", "siteation:debugbar:mcp"]
    }
  }
}
```

Five read only tools: `list_debug_profiles`, `get_debug_findings`,
`get_debug_profile_section`, `inspect_debug_queries` and `compare_debug_profiles`. The server
reads files and never opens a database connection, so it starts in about 0.2 seconds.

Responses are bounded by item count and byte budget. On an 817 kB profile from a category
page, findings answer in 7 kB and queries in 16 kB.

Every successful response carries a `recorded_data` line saying what the payload is: values
captured from requests to your store, which anyone who can reach the store can write. It is
data to read, never instructions to follow.

`docs/SKILL.md` is an agent skill describing how to use the tools well. Point your agent at
it, or copy it into your own skills directory.

### For an assistant that cannot call MCP

A browser tab, a chat window, or an agent with a shell but no MCP server configured. Any of
them can read the same profile as markdown:

```
bin/magento siteation:debugbar:report                        # the newest profile
bin/magento siteation:debugbar:report --id=<profile-id>
bin/magento siteation:debugbar:report --baseline=<other-id>  # with the comparison
```

The bar's **Copy for AI** button puts the same markdown on your clipboard.

## Open in your editor

Every query names the application frame it came from. Name an editor and that frame becomes
a link that opens the file at the line:

```
bin/magento config:set siteation_debugbar/general/editor zed
```

Eight editors are named as a convenience. Anything with a URL scheme works:

```
bin/magento config:set siteation_debugbar/general/editor custom
bin/magento config:set siteation_debugbar/general/editor_template 'myeditor://open?file=%f&line=%l'
```

`%f` is the absolute file and `%l` the line. Paths are stored relative to the application
root and the link is built in the browser, so your editor never ends up inside a stored
profile. If the application runs somewhere your editor cannot see, a container for instance,
map the root:

```
bin/magento config:set siteation_debugbar/general/editor_path_map '/var/www/html:/Users/you/dev/shop'
```

## Debugging a live site

The configuration switch is per store, which on a live site is the wrong shape: it would
turn the bar on for every visitor. The access key is the per request half.

```
bin/magento config:set siteation_debugbar/general/access_key "$(openssl rand -hex 32)"
bin/magento config:set siteation_debugbar/general/enabled 1
```

With a key set, a request that does not present it is an ordinary visitor's: no profile is
written, no bar is injected, and the endpoints answer 404 as though the module were not
installed.

```
curl -H "X-Siteation-DebugBar-Key: <key>" https://your-store.test/
open "https://your-store.test/?siteation_debugbar_key=<key>"
```

The second swaps the key for an HttpOnly cookie lasting an hour, which is how long a profile
lives, so the key leaves the address bar after one request.

**The key must be at least 32 characters, or empty.** Anything shorter is refused when you
save it and refused again when the configuration resolves, so writing one straight into the
database is no way around it. Outside developer mode the key is the entire reason the bar may
run, and "on for whoever holds the key" means nothing when the key is `x`.

**Wrong keys are counted per address.** Ten from one address inside fifteen minutes and that
address stops being answered at all until fifteen minutes after the last one, so the
endpoints cannot be used as an oracle. Only a request that presented something counts, so
ordinary customer traffic never fills the bucket. Behind a load balancer every client shares
one bucket, which is a reason to keep the key long rather than to lean on the counter.
`cache:flush` clears it.

Two more things follow from a key being set:

- **Production and default mode are allowed, but only behind a key.** Developer mode is the
  only one that runs keyless, because it is the only one that is not somebody's live site.
  Default mode is what `MAGE_MODE` falls back to, so it is treated as live.
- **Any response carrying a bar or a profile id is marked `no-store`** and stripped of its
  `X-Magento-Tags`, so Varnish and any CDN refuse to keep it. A page with your bar in it is
  one developer's view of one request and must never reach a second person.

An IP allowlist can be combined with the key. On its own it is not enough behind a proxy: the
address the module trusts is `REMOTE_ADDR`, never a forwarded header, because an allowlist
that trusts a client supplied header is not an allowlist.

Rotate the key with the same command when you are done, or empty it to close production
again.

## Settings

All under `siteation_debugbar/general/`.

| Setting | Default | |
| --- | --- | --- |
| `enabled` | `0` | Off until asked for |
| `areas` | all four | Which of storefront, admin, GraphQL, REST produce a profile |
| `sections` | all | What is collected and shown; off means not gathered either |
| `slow_query_ms` | `100` | Threshold behind `query.slow` |
| `slow_request_ms` | `1000` | Threshold behind `request.slow` |
| `allowed_ips` | empty | Comma separated; empty allows every address |
| `value_policy` | `full` | `full`, `masked` or `none` for captured values |
| `access_key` | empty | 32 characters or more; required outside developer mode |
| `editor` | empty | Editor for call site links |
| `editor_template` | empty | Used when `editor` is `custom` |
| `editor_path_map` | empty | `inside:outside` pairs for containers |

**About `value_policy`.** Query bindings are positional, so a value a customer typed cannot
be recognised by name the way a key can. `full` keeps them, which is what makes SQL readable.
Set `masked` or `none` if the instance is shared.

## What it costs

Collection is guarded by a boolean read, so a request that is not being profiled pays for a
plugin hop and nothing else. A profiled request pays for the collectors that are switched
on, which is why switching a section off stops it being gathered rather than just hidden.

The bar itself embeds about 1.5 kB of summaries in the page and fetches sections on demand.

## Troubleshooting

**No bar on the page.** In order: is it enabled, is the area on the list, is your address on
the allowlist, and outside developer mode is a key set and presented. A response that was
profiled carries `X-Siteation-DebugBar-Profile` even when it cannot carry a bar, so the
header tells you which half is failing.

**No bar behind Varnish.** A Varnish hit never reaches PHP, so no profile is written on
ordinary catalog and CMS pages. You will see the bar on pass-through pages: customer,
checkout, POSTs. Magento's built in full page cache is different: `launch()` still runs and
the bar is injected over the cached body.

**The bar looks stale after a module update.** Static asset URLs carry the built file's
mtime, so a hard reload is enough.

**A profile id returns "not found".** It has expired. Profiles last 20 files or 60 minutes,
and both bounds are enforced on read.

**Findings look wrong after changing a threshold.** Thresholds are read when the profile is
written, not when it is displayed. Load the page again.
