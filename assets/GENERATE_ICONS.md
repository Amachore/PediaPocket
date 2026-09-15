# Asset Generation Guide for PediaPocket

## Quick Option: Use Online Icon Generator (5 minutes)

### Method 1: icon.kitchen (Recommended)
1. Go to https://icon.kitchen/
2. **Icon Type**: Select "Clipart" or "Text"
3. **If Clipart**: Search for "baby" or "book" icon
4. **If Text**: Enter "PP" (PediaPocket)
5. **Background**: 
   - Shape: Square with rounded corners
   - Color: `#E8F2FF` (baby blue from our theme)
6. **Foreground Color**: `#5C6BC0` (indigo for contrast)
7. Click "Generate" and download:
   - `icon.png` (1024x1024) → Save as `assets/icon.png`
   - `adaptive-icon.png` (Android) → Save as `assets/adaptive-icon.png`
   - `favicon.png` (Web) → Save as `assets/favicon.png`

### Method 2: Canva (Free, High Quality)
1. Go to https://www.canva.com
2. Create custom size: **1024 x 1024 px**
3. Set background color: `#E8F2FF` (baby blue)
4. Add element:
   - Option A: Search "baby icon" in Elements tab
   - Option B: Add text "PediaPocket" or "PP" with rounded font
5. Center the design
6. Download as PNG
7. Rename to `icon.png` and place in `assets/` folder
8. Duplicate and rename for other required files

---

## Required Asset Files

You need to create these files in the `assets/` folder:

### 1. App Icon (iOS & Android)
- **File**: `icon.png`
- **Size**: 1024x1024 px
- **Background**: #E8F2FF (baby blue)
- **Content**: Baby icon or "PP" text in #5C6BC0
- **Format**: PNG with transparency removed

### 2. Android Adaptive Icon
- **File**: `adaptive-icon.png`
- **Size**: 1024x1024 px (with safe zone in center 432x432)
- **Same design as icon.png** but ensure critical content is in center circle
- **Format**: PNG

### 3. Splash Screen
- **File**: `splash.png`
- **Size**: 1284x2778 px (iPhone 14 Pro Max dimensions)
- **Background**: #E8F2FF (baby blue)
- **Content**: 
  - Centered logo/icon (300x300 px)
  - "PediaPocket" text below
  - Keep design in safe center area (828x1792 px)
- **Format**: PNG

### 4. Web Favicon
- **File**: `favicon.png`
- **Size**: 48x48 px
- **Same design as icon.png** but smaller
- **Format**: PNG

---

## Design Specifications

### Color Palette (from theme.js)
- **Primary Background**: `#E8F2FF` (baby blue)
- **Primary Dark**: `#B3D9FF` (darker blue)
- **Foreground/Icon**: `#5C6BC0` (indigo)
- **Accent**: `#FFE8F0` (soft pink)

### Recommended Icons/Symbols
1. **Baby bottle** 🍼 - Universal baby care symbol
2. **Book with baby icon** - References "PediaPocket" name
3. **Heart with plus** - Medical care theme
4. **"PP" monogram** - Simple, professional, scalable

### Design Guidelines
- Keep it simple and recognizable at small sizes
- Use rounded corners (16px border radius for 1024x1024)
- High contrast between background and foreground
- No fine details (won't scale well)
- Test at multiple sizes (from 16x16 to 1024x1024)

---

## Temporary Placeholder (Use This Now)

If you need to test immediately, use Expo's placeholder generator:

```bash
# This creates basic placeholders automatically
npx expo start
```

Expo will generate default icons temporarily. Replace them before submitting to app stores or showing judges.

---

## Quick SVG-to-PNG Conversion (If you have SVG)

If you create SVG files, convert them using:

### Online Tools:
- https://svgtopng.com/ (bulk conversion)
- https://cloudconvert.com/svg-to-png
- https://www.adobe.com/express/feature/image/convert/svg-to-png

### Command Line (if you have ImageMagick):
```bash
magick convert icon.svg -resize 1024x1024 icon.png
magick convert icon.svg -resize 48x48 favicon.png
```

---

## Validation Checklist

Before finalizing, verify:
- [ ] All PNG files are in `assets/` folder
- [ ] icon.png is exactly 1024x1024 px
- [ ] splash.png is 1284x2778 px or larger
- [ ] favicon.png is 48x48 px
- [ ] No transparency artifacts on solid backgrounds
- [ ] Colors match theme (#E8F2FF background)
- [ ] Text/icons are readable at small sizes (test at 16x16)
- [ ] Files are optimized (use TinyPNG.com to compress)

---

## For Production (Post-Hackathon)

Use professional tools:
- **Figma** + export plugin
- **Sketch** + icon export
- **Adobe Illustrator** + asset export
- Hire a designer on Fiverr ($5-20 for app icon set)

**Estimated time**: 5-15 minutes with online generator
