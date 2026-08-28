# Remove GitHub Link for Specific Projects

## Goal
Allow removing GitHub button from specific projects while keeping Copy link. Also allow removing both buttons when needed.

## Current Behavior
- GitHub link is in `<div class="project-links">` wrapper
- Copy link is injected by JS into `.project-links` if it exists, otherwise to header
- No way to skip buttons entirely

## New Approach

### Flexibility Options for Each Project Card

| Scenario | Action |
|----------|--------|
| Keep both GitHub + Copy link | Include `<div class="project-links"><a class="academic-project-github">...</a></div>` |
| Copy link ONLY (no GitHub) | Omit `.project-links` div entirely - JS will add Copy link to header |
| No buttons at all | Add `data-no-links` attribute to `.academic-project-header` |

### JS Changes (lines ~1027-1133)

Update the JS to:
1. Check if header has `data-no-links` attribute - if yes, skip creating Share button entirely
2. If no `.project-links` found, append Share button directly to header (for Copy-link-only projects)

```javascript
// Before creating shareBtn, check for data-no-links
if (header.hasAttribute('data-no-links')) {
  return; // Skip this card entirely
}

// ... existing shareBtn creation code ...

// Update append logic:
var projectLinks = header.querySelector(".project-links");
if (projectLinks) {
  projectLinks.appendChild(shareBtn);
} else {
  header.appendChild(shareBtn);
}
```

## Immediate Changes Needed

### 1. SRAM Cell project (id="sram-cell-vlsi")
Remove the `.project-links` div (lines 837-846) since these projects don't have GitHub repos and you don't want any buttons.

### 2. SAP-1 Microprocessor project (id="sap-1-microprocessor")
Remove the `.project-links` div (lines 897-906) for same reason.

### 3. Update JS
Add the `data-no-links` check in the JS loop.

## Files to Modify
1. `projects/index.html`:
   - Remove `.project-links` div from SRAM Cell project (lines 837-846)
   - Remove `.project-links` div from SAP-1 Microprocessor project (lines 897-906)
   - Update JS to check `data-no-links` attribute

## Validation
- SRAM and SAP-1 projects: No GitHub button, no Copy link button
- Other projects with `.project-links`: Both buttons appear inline after title
- Other projects without `.project-links`: Only Copy link appears after title
