# Font Assets

Place the following font files in this folder:

## Required Fonts

### Born Ready (Script Font)
- BornReady-Regular.woff2
- BornReady-Regular.woff

This is a handwritten/script font used for headlines like "Education for" and "Coming up..."

### Averta (Primary Font)
- Averta-Regular.woff2
- Averta-Regular.woff
- Averta-Bold.woff2
- Averta-Bold.woff
- Averta-ExtraBold.woff2
- Averta-ExtraBold.woff

Averta is the primary font family used throughout the design for body text, buttons, and bold headlines.

## Font Licensing

These fonts require proper licensing for web use. Ensure you have the appropriate licenses before using them in production.

### Fallback Fonts

If the custom fonts are not available, the design will fall back to:
- Born Ready → `Dancing Script` (Google Fonts) or `cursive`
- Averta → System sans-serif fonts

## Google Fonts Alternative

For development/testing, you can use Google Fonts as alternatives:
- Born Ready → Dancing Script
- Averta → Inter or Nunito Sans

Add this to your HTML head:
```html
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
```

Then update the CSS variables in `_variables.less`:
```less
@font-family-born-ready: 'Dancing Script', cursive;
@font-family-averta: 'Inter', sans-serif;
```
