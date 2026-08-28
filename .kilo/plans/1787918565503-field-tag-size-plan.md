# Reduce Field-Tag Size Plan

## Goal
The field tag (`<div class="academic-project-field">` in `projects/index.html`) currently reuses `.academic-tech-tag`, which inherits `font-size: 0.8rem` from `.academic-project-tech`. The user finds it visually too similar to the title. Make the field tag at least 25% smaller than the project title, keep its position (above the title), and make no other changes.

## Reference Sizes
- Project title: `1.1rem` desktop, `1rem` @ ≤768px, `0.95rem` @ smaller breakpoints (`assets/css/main.css:175`, `264`, `284`).
- 25% smaller than `1.1rem` ≈ `0.825rem`. 25% smaller than `1rem` ≈ `0.75rem`.
- Target: clamp the field tag to **`clamp(0.7rem, 0.6rem + 0.4vw, 0.8rem)`** so it stays below the 25%-smaller threshold at every breakpoint and scales gently between mobile and desktop.

## Confirmed Design Decisions
1. Only the **size** of the field tag changes. Color, font, separator behavior, and position stay identical to today.
2. Field tag stays in its current position: above `<h3 class="academic-project-title">`, inside `.academic-project-content`.
3. Implementation is a new selector scoped to `.academic-project-field .academic-tech-tag` (or an added class on the wrapper) so the tech-tag row below the title is **not** affected.
4. No HTML changes. Existing markup (one or two `<span class="academic-tech-tag">…</span>` per field row) is preserved as-is, including the comma-separator rule that currently applies via `.academic-tech-tag:not(:last-child)::after`.

## Implementation

### 1. CSS change (`assets/css/main.css`)
Add immediately after the existing `.academic-tech-tag` block (around `main.css:231`):

```css
/* Field/area tag above the title — smaller than the project title */
.academic-project-field .academic-tech-tag {
  font-size: clamp(0.7rem, 0.6rem + 0.4vw, 0.8rem);
}
```

That is the only CSS change. The size override sits below `.academic-tech-tag` so it wins by specificity (parent + class beats single class).

### 2. HTML
No changes. Every card already renders:

```html
<div class="academic-project-field">
  <span class="academic-tech-tag">VLSI / Chip Design</span>
</div>
```

…and the new rule automatically applies.

## Files Touched
- `assets/css/main.css` — add the 4-line `.academic-project-field .academic-tech-tag` block.

## Validation
1. Open `projects/index.html` in a browser at desktop and mobile widths.
2. Visually confirm the field tag reads as smaller than the project title in every card (VLSI, Computer Vision, LLM / RAG, IoT, etc.).
3. Confirm the comma separator between two fields (e.g. `Computer Vision, Mobile / AR`) still appears.
4. Confirm the tech-tag row below the title is unchanged in size.
5. Resize across the breakpoints at `768px` and below — the field tag should scale down with the title, never exceeding the 25%-smaller ratio.

## Risks
- Minimal. Only a font-size override on a single selector; no layout, color, or markup changes.
- If the title size changes in the future, the `clamp()` cap/floor keeps the field tag at a sensible absolute size so it never crowds the title.
