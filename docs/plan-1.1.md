# Plan: 1.1, the interface

## Context

1.0 collects the right things and reasons about them well. What it does not have is New
Debug Bar's interface, which is the reason this project started. The gap is not polish. It
is a different shape: a floating window with a sidebar, sections that explain themselves, a
waterfall, and a command palette.

This plan is written from their source, not from the screenshots. Paths below refer to
`newdebugbar/newdebugbar` at `dev-main`.

Two additions are ours rather than theirs:

* An **Alpine.js section**, which Hyvä and Nebula both need and which no debug bar has.
* Keeping everything **CSP clean and shadow scoped**, which their Livewire and Tailwind
  build does not have to care about.

## What they actually do

### The window

Their toolbar is not attached to the viewport edge. It floats
(`resources/views/livewire/toolbar.blade.php`):

```
fixed left-1/2 -translate-x-1/2 bottom-3
w-[calc(100vw-24px)] max-w-5xl
rounded-[18px] border border-white/70 bg-white/80
shadow-[0_18px_60px_-18px_rgba(24,24,27,0.4)]
backdrop-blur-xl backdrop-brightness-110 backdrop-saturate-125
```

The glass effect and the 18px radius are most of why it reads as a modern tool rather than
a strip of numbers. `toolbarPlacement` also allows `top-3`, so it can be moved out of the
way of a fixed footer.

The inspector is a modal sheet, not an expanding panel
(`resources/views/livewire/inspector.blade.php:28`):

```
absolute inset-x-0 bottom-0 mx-auto
h-[min(82vh,780px)] max-w-5xl rounded-t-2xl
bg-white/90 backdrop-blur-2xl
shadow-[0_-24px_80px_-28px_rgba(24,24,27,0.5)]
```

It has `role="dialog" aria-modal="true"`, a dimmed backdrop, a focus trap, and it slides up
from `translate-y-full` over 200ms. This is what `lockHost` exists to support, and it is
why porting `lockHost` was pointless until now.

### The header

Left: a method badge, the path, and a second line with status and response size.

```
rounded-md bg-indigo-50 px-1.5 py-0.5
text-[11px] font-bold uppercase tracking-wide text-indigo-700
```

Right: metrics, each an **icon plus a stacked label and value**. Label is
`text-[11px] font-semibold uppercase tracking-wider text-zinc-400`, value is
`text-xs font-bold tabular-nums`. Environment gets a coloured dot, emerald normally and
amber when something is wrong.

Ours puts label and value in the same visual weight and drops the icons, which is why the
strip reads as a wall of numbers.

### The navigation

A 210px sidebar, not tabs. Each item is `h-9 rounded-lg px-2.5 text-xs font-semibold`,
name on the left and count on the right. Above the list sits a **Favorites** heading, and
items can be dragged between the two groups; the indigo `h-1 rounded-full` bars at
`inspector.blade.php:98` and `:103` are the drop indicators.

On mobile the same nav becomes an off-canvas drawer at `w-[82vw] max-w-[280px]`.

### Sections explain themselves

Every section opens with a title and one sentence saying what it is for:

> **Timeline** — Follow important work in the order it happened across the request.
> **Request** — Follow the request from the incoming URL through routing, middleware, and the response.

Cheap to add, and it is the difference between a panel a developer explores and one they
guess at.

### The waterfall

The most substantial missing piece. `src/Analysis/TimelineBuilder.php` merges every
section's items into one ordered list of three kinds:

* `milestone` — request started and finished, `at_ms` only
* `span` — anything with a duration, so `start_ms = at_ms - duration_ms`
* `point` — anything without one

then scales each against the largest `at_ms` to get `at_percent`, `start_percent` and
`duration_percent`, which is all the view needs.

**This is the one change that reaches back into our collectors.** It only works because
every captured item carries `at_ms`, its offset from the start of the request. Ours record
durations but never when anything happened, so we cannot build a waterfall from what we
store today.

### The command palette

`⌘/Ctrl ⇧ P` opens a centered modal listing `Go to <section>` with `ACTIVE SECTION` on the
right, plus theme switches. Footer shows `↑↓ Navigate`, `↵ Select`. The state for it is
already sketched in their `state.js`: `paletteOpen`, `paletteSearch`, `paletteIndex`,
`paletteReturnFocus`.

## What we build

### Phase A: make a waterfall possible

Nothing visual. Every collector stamps `at_ms` on every item, measured from
`ProfileManager::begin()`.

* `ProfileManager` exposes `elapsedMs()`.
* `AbstractCollector::record()` stamps `at_ms` when the item does not already carry one.
* `BlockCollector` already keeps a stack, so it can stamp both start and end honestly.
* `Analysis/TimelineBuilder` merges sections into milestone, span and point entries and
  computes the percentages.
* New `timeline` section in the profile, and a `get_debug_profile_section` value for it.

Doing this first means the interface work has real data to render.

### Phase B: the window

* Move the collapsed bar to a floating, centered, glass panel with an 18px radius.
* Add `top` and `bottom` placement, persisted with the other preferences.
* Rebuild the header: method badge, path, status and response size on the left; icon
  metrics on the right; environment dot; search, theme and window controls.
* Turn the panel into a modal sheet with a backdrop, a focus trap, and the slide up
  transition. **Port `lockHost` now**, since there is finally something to lock behind.
* Add minimise and close, and remember the choice.

Constraint that does not apply to them: all of this stays inside our shadow root and uses
no inline style or script, so the CSP story is unchanged.

### Phase C: navigation and sections

* Replace the tab row with the 210px sidebar, counts right aligned, off-canvas under 640px.
* Favorites: pin sections to a group above the list, drag to reorder, persisted.
* Give every section a title and a one line description.
* Move findings inline: each section shows its own findings at the top, in the callout
  style they use, while the Findings section keeps the full ranked list.
* Sub-tabs inside a section, for Alpine and Request.

### Phase D: the Alpine.js section

Ours, not theirs. Nothing else offers it, and both Hyvä and Nebula are Alpine.

The bar already carries its own Alpine in a shadow root, so it can inspect the page's
Alpine without either instance seeing the other.

* **Components:** every `[x-data]` root, its expression, resolved component name, DOM path,
  and live state read through `Alpine.$data(el)`.
* **Stores:** everything registered through `Alpine.store()`, with live values.
* **Deferred:** which components Hyvä has deferred through `x-defer` or `intersect` and
  whether they have initialised yet, which is a common source of "why is nothing
  happening".
* **Health:** Alpine version, whether the CSP build is in use, and any component whose
  expression threw during init.
* **Live, not stored.** Values update as the page changes.

Two things to decide during the phase:

* Reading arbitrary component state can pull in customer data. It should follow the same
  value policy as the rest of the bar.
* This is the first section whose data comes from the browser rather than a stored profile,
  so it is invisible to MCP. Posting a snapshot back to the profile would fix that and adds
  a write endpoint. Worth doing only if it proves useful in the section first.

### Phase E: comfort

* Command palette on `⌘/Ctrl ⇧ P`, sections and settings, keyboard driven.
* Light theme. The bar is dark only today, which sits badly on a light admin, and their
  light theme is the better looking of the two.
* Syntax highlighting: `highlight.js/lib/core` with `sql`, `json` and a small PHP grammar,
  about 20 kB rather than 900 kB.
* History section listing recent profiles, so the request list is not the only way back to
  an earlier request.

## Order, and why

A before B, because the waterfall is the strongest thing they have and it needs collector
changes that would be disruptive to retrofit under a finished interface.

D can move earlier if the Alpine section is what you actually want first. It is
independent of the rest: it does not touch the profile, the collectors, or MCP.

E last. None of it unblocks anything.

## Cost

Rough, and the interface phases are the uncertain ones because layout work is iterative.

| Phase | Shape of the work |
| --- | --- |
| A | Small, mechanical, touches every collector, needs tests for the builder |
| B | Medium, mostly CSS and one new interaction model |
| C | Medium, sidebar plus favorites persistence plus per section copy |
| D | Medium, all new, all client side |
| E | Small each, four separate pieces |

## What we deliberately do not copy

* **Tailwind.** They prefix every class with `ndb:` because their CSS shares a page. Our
  shadow root already isolates styles in both directions, so hand written CSS stays
  smaller and has no build chain of its own.
* **Livewire.** Their inspector is server rendered per interaction. Ours reads one stored
  JSON document and needs no round trip.
* **Their section list.** Models, Views and Livewire are Laravel. Ours are Blocks,
  Observers, Plugins and Alpine, and the Magento specific ones are the reason to use this
  rather than theirs.
