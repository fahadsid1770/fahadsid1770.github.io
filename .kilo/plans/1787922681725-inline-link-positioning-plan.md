# Remove GitHub Link for Specific Projects

## Goal
Remove GitHub button from SRAM and SAP-1 projects while keeping Copy link. Provide flexibility for future projects.

## Current Behavior
- `.project-links` div contains GitHub link
- Copy link JS appends to `.project-links` if found, otherwise directly to `.academic-project-header`

## Solution

### SRAM and SAP-1 Projects
Simply remove the `.project-links` div (which contains GitHub link). The JS already handles this:
- No `.project-links` found → Copy link is appended to header instead
- Result: Copy link appears without GitHub button

### Future Project Flexibility
| Want | Action |
|------|--------|
| Both GitHub + Copy link | Include `<div class="project-links"><a class="academic-project-github">...</a></div>` |
| Copy link ONLY | Omit `.project-links` div entirely |
| No buttons | Add `data-no-links` attribute to `.academic-project-header` |

### JS Enhancement (for data-no-links support)
Add check to skip button creation when `data-no-links` is present:

```javascript
projectCards.forEach(function (projectCard) {
  // ... existing code ...
  
  var header = projectCard.querySelector(".academic-project-header");
  if (!header) return;
  
  // NEW: Skip if data-no-links is set
  if (header.hasAttribute('data-no-links')) {
    return;
  }
  
  // ... rest of shareBtn creation ...
```

## Tasks

1. **Remove `.project-links` div from SRAM Cell project** (lines 837-846)
2. **Remove `.project-links` div from SAP-1 Microprocessor project** (lines 897-906)
3. **Update JS** to check for `data-no-links` attribute (around line 1027)

## Validation
- SRAM and SAP-1: Only Copy link button appears after title (no GitHub)
- Projects with `.project-links`: Both buttons appear
- Projects with `data-no-links`: No buttons appear
