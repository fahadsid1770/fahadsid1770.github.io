# How to Change Fonts in Your Portfolio

## Quick Steps

1. **Edit `assets/css/main.css`** — this is the main stylesheet that controls fonts.

2. **Change the body font** (line 12):
   ```css
   body { font-family: "YOUR_FONT", sans-serif !important; ... }
   ```
   The `!important` is required because Bootstrap's CSS loads before `main.css` and can override your font without it.

3. **Change project section fonts** (if needed):
   - `.academic-project-year` — year labels
   - `.academic-project-title` — project titles
   - `.academic-project-tech` — tech tags
   - `.academic-project-description` — descriptions

   Example:
   ```css
   .academic-project-title {
     font-family: "YOUR_FONT", sans-serif;
   }
   ```

4. **Add a new font** (if not already loaded):
   Add a Google Fonts link in the `<head>` of each HTML file:
   ```html
   <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=YourFont:300,400,700">
   ```

## Common Font Choices

| Font | Type | Best For |
|------|------|----------|
| `Roboto Slab` | Serif | Academic, professional |
| `Roboto` | Sans-serif | Clean, modern |
| `Trebuchet MS` | Sans-serif | Casual, readable |
| `Georgia` | Serif | Classic, elegant |
| `Inter` | Sans-serif | Tech, minimal |
| `Merriweather` | Serif | Reading-heavy pages |

## Troubleshooting

### Changes not appearing?

1. **Hard refresh**: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. **Clear cache in DevTools**: Open DevTools → Network tab → check "Disable cache" → reload
3. **Verify CSS loaded**: In DevTools, go to Sources → find `main.css` → confirm your changes are there
4. **Check specificity**: If Bootstrap is overriding, add `!important` to your `font-family` rule

### Font looks wrong?

- Make sure the font is loaded in the `<head>` of your HTML files
- Check that the font name matches exactly (case-sensitive)
- Some fonts need specific weights loaded (e.g., `300,400,700`)

## Current Font Setup

- **Body**: `Trebuchet MS, sans-serif`
- **Project titles**: `Trebuchet MS, sans-serif`
- **Project year/tags/descriptions**: `Trebuchet MS, sans-serif`
- **Loaded via**: Google Fonts (`Roboto`, `Roboto Slab`, `Material Icons`)
