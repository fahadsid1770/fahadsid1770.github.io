# Project Field Chips Plan

## Goal
Make the research/engineering field of each project obvious at a glance by adding a small chip row above the title in every project card on `projects/index.html`. No new CSS class, no JS, no new files.

## Scope
- **In scope:** `projects/index.html` only. 15 small insertions (one per card) plus a single short `<style>` rule for spacing.
- **Out of scope:** Other sections (`index.html`, `publications/`, `experiences/`, `achievements/`), introducing a colored chip variant, refactoring tech tags, deriving fields from existing tech tags via JS.

## Confirmed Design Decisions
1. **One chip row per card** showing 1–2 field labels (multi-field allowed).
2. **Reuse the existing `.academic-tech-tag` style** (light-gray rounded pill) so the row matches the tech-tag row below the title and ships with zero new look-and-feel.
3. **No eyebrow label** above the row. Position (above the title) is the only differentiator from the tech tags below. The chip row sits between the GitHub header line and the `<h3>` title; the tech tags sit below the title.
4. **Static, hand-authored** per card. No `data-*` attribute, no JS, no dynamic rendering. The deep-link/highlight/script from the previous plan is untouched and continues to work — chips are in the DOM at parse time, so they appear in screen-reader output, in the initial hash-target flash, and before any JS runs.
5. **Allowed field labels** (fixed vocabulary — keeps the chip row scannable and consistent):

   | Field label            | Used for (examples)                                   |
   | ---------------------- | ----------------------------------------------------- |
   | `Autonomous Systems`   | Sensor-aware trajectory model, Microcontroller/IoT    |
   | `Computer Vision`      | DroneSeg, MedConvFormer, ARScaner, hateful-meme, etc.  |
   | `NLP`                  | Bangla news classification                            |
   | `LLM / RAG`            | Walton-AI, ALTM                                       |
   | `AI for Healthcare`    | MedConvFormer, Chest X-Ray VLM                        |
   | `Cybersecurity`        | Voice Command Fingerprinting                          |
   | `Edge AI`              | Smart Fridge, Walton-AI                               |
   | `IoT`                  | Smart Fridge, Microcontroller/IoT                     |
   | `VLSI / Chip Design`   | 1-Bit SRAM, SAP-1 Microprocessor                      |
   | `Mobile / AR`          | ARScaner                                              |

   The list is intentionally short. Projects can sit in 0–2 of these buckets. The mapping is the only "soft" part of the plan — the user can tweak any row in the table below before implementation.

## Proposed Field Mapping (review and tweak before implementation)
Order matches the current order of `<article class="academic-project">` blocks (top to bottom on the page). **ID is the existing deep-link slug from the previous plan; Field 1 / Field 2 are the chips to insert.**

| # | ID                                                | Field 1            | Field 2             |
|---|---------------------------------------------------|--------------------|---------------------|
| 1 | `sensor-aware-adaptive-linear-trajectory-model`   | Autonomous Systems | —                   |
| 2 | `droneseg`                                        | Computer Vision    | —                   |
| 3 | `arscaner`                                        | Computer Vision    | Mobile / AR         |
| 4 | `aiot-based-smart-fridge`                         | IoT                | Edge AI             |
| 5 | `voice-command-fingerprinting`                    | Cybersecurity      | —                   |
| 6 | `medconvformer`                                   | AI for Healthcare  | Computer Vision     |
| 7 | `walton-ai`                                       | LLM / RAG          | Edge AI             |
| 8 | `altm`                                            | LLM / RAG          | —                   |
| 9 | `chest-xray-vlm`                                  | AI for Healthcare  | Computer Vision     |
| 10| `image-pattern-detection-recognition`             | Computer Vision    | —                   |
| 11| `hateful-meme-fusion`                             | Computer Vision    | NLP                 |
| 12| `bangla-news-fusion`                              | NLP                | —                   |
| 13| `sram-cell-vlsi`                                  | VLSI / Chip Design | —                   |
| 14| `sap-1-microprocessor`                            | VLSI / Chip Design | —                   |
| 15| `microcontroller-iot`                             | IoT                | Autonomous Systems  |

(Items with only one chip render one `<span class="academic-tech-tag">…</span> inside the row. No "—" placeholder, no empty row.)

## Implementation

### 1. New CSS (one rule, in the existing `<style>` block added by the previous plan)
Add a single rule that gives the new wrapper a small bottom margin so the chips don't crowd the title:

```css
.academic-project-field { margin-bottom: 0.35rem; }
```

That's the only CSS change. The chips themselves already look correct because they reuse `.academic-tech-tag`.

### 2. HTML change (one insertion per card)
In each `<article class="academic-project">`, inside `.academic-project-content` and **immediately before** `<div class="academic-project-header">`, insert a new wrapper containing the chip(s).

Pattern for a single-field card:
```html
<div class="academic-project-field">
  <span class="academic-tech-tag">Autonomous Systems</span>
</div>
```

Pattern for a two-field card:
```html
<div class="academic-project-field">
  <span class="academic-tech-tag">Computer Vision</span>
  <span class="academic-tech-tag">Mobile / AR</span>
</div>
```

Why **before** `.academic-project-header` (not after the title, where the tech tags live):
- It puts the field above the title, which is what the user asked for ("a small 'field' above the title").
- The existing tech tags stay immediately under the title, which is the current reading order.
- The two rows are visually distinct only by position; the small margin keeps them readable.

### 3. Updated `aria-label`
Each `<article>` already has an `aria-label` like `aria-label="DroneSeg project"`. Append the field(s) so screen readers announce them:
- `aria-label="DroneSeg project — Computer Vision"`
- `aria-label="ARScaner project — Computer Vision, Mobile / AR"`

Use an em-dash (`—`, U+2014) as separator, comma between fields, matching the rest of the page's typographic style.

## Files to Edit
- `projects/index.html` only.
  - `<style>`: +1 rule (`.academic-project-field { margin-bottom: 0.35rem; }`).
  - 15 `<article>` blocks: +1 wrapper div each (≈4 lines per insertion, so ~60 added lines total).
  - 15 `aria-label` updates (one-line edits).

## Files NOT Touched
- `index.html`, `publications/`, `experiences/`, `achievements/`, all JS/CSS files.
- The existing inline `DOMContentLoaded` script that builds the title-link + Copy link button. **Important:** that script reads `projectCard.querySelector(".academic-project-title")` and replaces its `textContent`, so it will strip the new field chips if they're placed inside the title. By placing the chips in a sibling `.academic-project-field` div (not inside `<h3>`), the script leaves them alone. **No script changes are needed.** (Worth flagging during implementation as a quick check.)

## Validation Steps
1. **Visual scan:** Serve `projects/` locally, confirm:
   - Every card has a chip row above its title.
   - Chip row reads first, then title, then tech tags, then description.
   - Two-chip cards (e.g., ARScaner, Walton-AI) wrap cleanly on narrow viewports (tech tags already wrap, so the same behavior applies).
2. **Screen reader:** In VoiceOver / NVDA, tab to a card and confirm the new `aria-label` includes the field(s), e.g. *"ARScaner project — Computer Vision, Mobile / AR, link, …"*.
3. **Deep-link regression:** Open `/projects/#droneseg` in a fresh tab. The card scrolls into view, the highlight animation plays, **and the new "Computer Vision" chip is visible during the flash** (proves the chip is in the DOM at parse time, not added by JS).
4. **Copy link regression:** Click a card's "Copy link" button — URL still ends in `#<slug>`, button still swaps to "✓ Copied!".
5. **No markup errors:** Run a quick `python3 -m html.parser` check that all 15 new wrapper divs balance.

## Risks & Mitigations
- **Risk:** Chip row makes the card taller / breaks the existing row layout (`.academic-project-row` uses a year + content two-column grid). **Mitigation:** The chips live inside `.academic-project-content`, the right column, so they only push down the right column. The year column is unaffected. Verified by reading the current CSS structure: the year is in `.academic-project-year` (sibling) and the content flows below the header normally.
- **Risk:** Chips and tech tags blur into one undifferentiated mass. **Mitigation:** A 0.35rem margin between them and a clear position gap (the `<h3>` title sits between). If the user later wants stronger separation, swap to a colored variant — but that's out of scope for v1.
- **Risk:** Field label vocabulary drifts over time. **Mitigation:** Plan documents the closed list of 10 labels; future additions go through the same table.

## Out-of-Scope Follow-ups (deferred)
- Colored chip variant for stronger visual hierarchy.
- Adding the same chips to publications / experiences / achievements for cross-page consistency.
- Hover tooltip on each chip explaining the field.

Plan file: `.kilo/plans/1787910540018-project-field-chips-plan.md`
