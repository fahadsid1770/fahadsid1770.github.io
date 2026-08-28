# Responsive GitHub/Copy Link Button Positioning

## Goal
Position GitHub and Copy link buttons using `position: absolute` so they don't shift with card size changes. Provide 3 responsive breakpoints: desktop, tablet, and mobile (where buttons stack vertically).

## Current State
- Both buttons are inside `.academic-project-header` alongside the title
- They currently use `inline-flex` with `margin-left` which causes position drift as cards resize
- Copy link button is dynamically injected via JavaScript

## Implementation

### 1. Wrap buttons in a container div
In each card, wrap GitHub link and Copy link button in a new `<div class="project-links">` container. This container will be absolutely positioned.

HTML structure:
```html
<div class="academic-project-header">
  <h3 class="academic-project-title">...</h3>
  <div class="project-links">
    <a class="academic-project-github">...</a>
    <button class="academic-project-share">...</button>
  </div>
</div>
```

### 2. CSS for `.project-links` container (inline `<style>` in index.html)
```css
.project-links {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Desktop: buttons side by side */
@media (min-width: 769px) {
  .project-links {
    position: absolute;
    right: 0;
    top: 0;
  }
}

/* Tablet (≤768px): same as desktop */
@media (max-width: 768px) {
  .project-links {
    position: absolute;
    right: 0;
    top: 0;
  }
}

/* Mobile (≤480px): buttons stacked vertically */
@media (max-width: 480px) {
  .project-links {
    position: absolute;
    right: 0;
    top: 0;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
  }
}
```

### 3. Style `.academic-project-header` to be `position: relative`
Add to inline styles:
```css
.academic-project-header {
  position: relative;
  /* keep existing display: flex, justify-content: space-between, align-items: center */
}
```

### 4. Remove margin-left from buttons (since position is now absolute)
Buttons should NOT have `margin-left` since positioning is now explicit via `right: 0`.

### 5. Handle Copy link button injection (JavaScript)
The JavaScript at line 1034 creates shareBtn with class `academic-project-share`. The script appends it to `header` (line 1077). Modify to append to `project-links` div instead.

## Files to Modify
1. `index.html`: Add `.project-links` wrapper div around buttons in all 15 cards
2. `index.html`: Add CSS rules in inline `<style>` block
3. `index.html`: Modify JavaScript to find `.project-links` instead of `.academic-project-header` when appending shareBtn

## Validation
- Desktop: Both buttons in top-right corner, side by side
- Tablet: Same as desktop
- Mobile (≤480px): Buttons stacked vertically, GitHub above Copy link
