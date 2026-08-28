# Project Deep-Link Sharing Plan

## Goal
Allow visitors to share a URL that, when opened, jumps directly to a specific project card on `https://fahadsid1770.github.io/projects/`. Each project gets a stable `id` and a visible "Copy link" button that writes the shareable URL to the clipboard.

## Scope
- **In scope:** `projects/index.html` (HTML + inline script). Tiny CSS additions to handle `scroll-margin-top` and a brief highlight on the targeted card.
- **Out of scope:** Other sections (`index.html`, `publications/`, `experiences/`, `achievements/`), routing to per-project pages, Open Graph image generation, analytics, server-side changes (the site is static — no server changes needed).

## Current State (verified)
- `projects/index.html` renders 16 projects as `<article class="academic-project">` cards.
- The top navigation uses `fixed-top` (body class `fixed-top-nav`), so anchor jumps would land behind the navbar without a `scroll-margin-top` offset.
- An inline `<script>` already rewrites each card title into a link pointing at the GitHub URL. That script can be extended; no second script tag is required.
- No project currently has an `id` attribute, so `#` fragments would be no-ops.

## Design Decisions (confirmed with user)
1. **Expose share UI:** Small "Copy link" button on every card, sitting next to the GitHub icon in `.academic-project-header`.
2. **Button style:** Text + link icon (`🔗 Copy link` → `✓ Copied!`), matching the current minimalist academic look. No new external CSS file.
3. **URL format:** `https://fahadsid1770.github.io/projects/#<project-id>`.
4. **Project ID format:** kebab-case slug derived from the GitHub repo path when present, otherwise from the title. Stable, human-readable, no spaces.

## Planned ID Map
Derived from each card's GitHub URL (falling back to a title slug when `href="#"`):

| # | Slug (id) | Project |
|---|-----------|---------|
| 1 | `sensor-aware-adaptive-linear-trajectory-model` | Sensor-Aware Adaptive Linear Trajectory Model |
| 2 | `droneseg` | DroneSeg |
| 3 | `arscaner` | ARScaner |
| 4 | `aiot-based-smart-fridge` | AIOT-Based-Smart-Fridge |
| 5 | `voice-command-fingerprinting` | Voice Command Fingerprinting - Attack and Defense |
| 6 | `medconvformer` | MedConvFormer |
| 7 | `walton-ai` | Walton-AI |
| 8 | `altm` | AI Long-Term Memory (ALTM) |
| 9 | `chest-xray-vlm` | Automated Chest X-Ray Report Generation Using VLM |
| 10 | `image-pattern-detection-recognition` | Real Time Image Pattern Detection and Recognition |
| 11 | `hateful-meme-fusion` | Early and Late Fusion For Multimedia Hateful Meme Classification |
| 12 | `bangla-news-fusion` | Multi-class Bangla News Classification using Early/Late Fusion |
| 13 | `sram-cell-vlsi` | Design and Analysis of 1-Bit SRAM Cell using Cadence Virtuoso |
| 14 | `sap-1-microprocessor` | Design and Implementation of an SAP-1 Microprocessor with Assembler |
| 15 | `microcontroller-iot` | Microcontroller and IoT Projects |

(The current file actually has 15 `<article class="academic-project">` blocks; if a 16th is added later, the loop assigns the id automatically.)

## Implementation Steps (in order)

### 1. Add per-project `id` attributes
In `projects/index.html`, on each `<article class="academic-project" ...>` add `id="<slug-from-table-above>"`. This is 15 small edits — one per `<article>` opening tag.

### 2. Add a tiny `<style>` block (in `<head>`) for two new behaviors
- `.academic-project { scroll-margin-top: 80px; }` — clears the fixed navbar on anchor jump.
- `.academic-project.is-target { animation: project-flash 1.6s ease-out 1; }` plus a `@keyframes project-flash` that briefly tints the card's left border / background so the user sees where they landed.

### 3. Inject a "Copy link" button into each card
Extend the existing `DOMContentLoaded` script (lines 841–869) to:
- For each `.academic-project`, create a `<button type="button" class="academic-project-share">` containing a link icon (`<i class="fas fa-link">` or `🔗`) + the text `Copy link`.
- Insert it into `.academic-project-header` immediately after the existing GitHub `<a>`.
- Store the project id on the button via `data-project-id` so the click handler can read it.
- Wire a click handler that:
  1. Builds `window.location.origin + window.location.pathname + '#' + id`.
  2. Calls `navigator.clipboard.writeText(url)` with a fallback to a hidden `<textarea>` + `document.execCommand('copy')` for older browsers / insecure contexts (GitHub Pages is HTTPS so the modern API works, but the fallback is cheap insurance).
  3. Updates `window.location.hash` so the browser's address bar reflects the new URL (this also triggers native scroll + the `is-target` flash).
  4. Swaps the button label to `✓ Copied!` for ~1500 ms, then restores it.
- Add `aria-label="Copy link to <project title>"` for screen readers.

### 4. Handle initial load (someone pastes the URL)
A second small effect, in the same script, on `window.load` (after masonry settles):
- If `window.location.hash` exists, find `document.querySelector(window.location.hash)`.
- If found, add the `is-target` class (which both the browser-default scroll and the `scroll-margin-top` rule already handle) and remove it after the flash animation ends.
- This makes opening `…/projects/#droneseg` land on and highlight the DroneSeg card.

### 5. Title-link collision guard
The existing script at lines 841–869 wraps `.academic-project-title` text in an `<a>` pointing at the GitHub URL. The new "Copy link" button lives in `.academic-project-header` (sibling of the `<h3>`), so it will not collide. **No change needed to that block — but the new code must run after it, which is automatic since both are inside the same `DOMContentLoaded` listener.** Add the share-button logic at the end of the existing `projectCards.forEach` callback.

## Files to Edit
- `projects/index.html` — only file touched.
  - `<head>`: add a `<style>` block (≈10 lines).
  - 15 `<article>` opening tags: add `id="…"` (one attribute per card).
  - Inline script at the bottom: extend the `forEach` to inject the share button and wire the click + load handlers (≈35 added lines).

## Files NOT Touched
- `index.html`, `publications/index.html`, `experiences/index.html`, `achievements/index.html` — out of scope.
- No new JS/CSS files. Everything is added inline to keep the change minimal and reviewable in one diff.

## Validation Steps
1. **Local sanity check:** `python3 -m http.server` from the repo root, open `http://localhost:8000/projects/`, click a "Copy link" button, paste somewhere — verify the URL ends in `#<slug>`.
2. **Deep-link jump:** Open `http://localhost:8000/projects/#droneseg` in a fresh tab. Confirm:
   - The page scrolls to the DroneSeg card.
   - The card is not hidden behind the fixed navbar.
   - A brief highlight animation plays.
3. **Direct load (no JS yet):** With JS disabled, the anchor still scrolls to the right card via native browser behavior — `scroll-margin-top` keeps the navbar from covering it.
4. **Cross-browser / clipboard:** Test in Chrome, Safari, Firefox. On Safari over `file://` clipboard write may fail silently — that's fine; the URL is still in the address bar.
5. **Mobile:** Tap the button on a phone — `navigator.share` could be preferred over clipboard on touch devices, but that's an enhancement. v1 uses clipboard only (matches the user's "small Copy link button" choice).
6. **No regressions:** Verify the existing title-to-GitHub link wrapping still works and the GitHub icon still links correctly.

## Risks & Mitigations
- **Risk:** IDs collide with future content (e.g., a future section reuses `droneseg`).
  **Mitigation:** Slugs are derived from GitHub repo names where possible, which are unique. A `projects-` prefix is **not** added to keep URLs short; if collision becomes a concern later, prefixing is a one-line sed.
- **Risk:** Fixed navbar covers the targeted card.
  **Mitigation:** `scroll-margin-top: 80px` (navbar is ~56–70px tall; 80px gives a small gap).
- **Risk:** Clipboard API blocked on insecure contexts.
  **Mitigation:** `window.isSecureContext` check + textarea fallback inside the click handler.
- **Risk:** Bot/scraper overwrites the hash when crawling.
  **Mitigation:** Hash changes only happen on user click, not on page load, so crawlers see the canonical URL (already declared via `<link rel="canonical" href="…/Projects/">`).

## Out-of-Scope Follow-ups (deferred, not required for v1)
- Per-project pages with their own `<title>` and Open Graph tags for richer social previews.
- Web Share API button on mobile (`navigator.share({ url, title })`).
- A small "Back to all projects" link that appears when arriving via a deep link.
- Open Graph `og:url` per project (would require per-page routes, not anchors).

Plan file: `.kilo/plans/1787910023057-project-deep-link-plan.md`
