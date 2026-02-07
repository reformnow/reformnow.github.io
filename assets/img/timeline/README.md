# Timeline Images Guide

This directory contains images for the Church History Timeline.

## Image Requirements

### Specifications
- **Format:** JPG or PNG
- **Size:** 800x400 pixels (2:1 aspect ratio) for standard display
- **File Size:** Under 200KB per image
- **Style:** Consistent, preferably classical/historical artwork, illustrations, or historical photographs

### Recommended Sources

#### 1. Wikimedia Commons (Public Domain)
Best source for historical artwork and images:
- https://commons.wikimedia.org
- Search: "[Event name]" + "painting" or "artwork"
- Filter by: "Public Domain" or "Creative Commons"

#### 2. Unsplash (Free)
For background textures and conceptual images:
- https://unsplash.com
- Search: "church", "cathedral", "history", "manuscript"

#### 3. British Library (Public Domain)
Historical manuscripts and illustrations:
- https://www.flickr.com/photos/britishlibrary

#### 4. Europeana (Public Domain)
European cultural heritage images:
- https://www.europeana.eu

## Current Images Needed

### Priority 1: Core Events (Must Have)
1. **pentecost.jpg** - Pentecost, tongues of fire
   - Source: Wikimedia Commons "Pentecost painting"
   - Style: Classical religious artwork

2. **council-jerusalem.jpg** - Early church gathering
   - Source: Biblical illustration or early church art
   - Style: Classical or Byzantine art

3. **luther-95-theses.jpg** - Martin Luther at Wittenberg
   - Source: Wikimedia Commons "Luther 95 theses"
   - Style: Historical painting (19th century)

4. **calvin-institutes.jpg** - John Calvin
   - Source: Wikimedia Commons "John Calvin portrait"
   - Style: Renaissance portrait

5. **council-nicaea.jpg** - First Council of Nicaea
   - Source: Wikimedia Commons "Council of Nicaea"
   - Style: Byzantine or Renaissance council scene

6. **council-chalcedon.jpg** - Council of Chalcedon
   - Source: Historical council depictions
   - Style: Byzantine art

### Priority 2: Major Heresies
7. **gnosticism.jpg** - Gnostic texts or symbols
   - Source: Coptic or early Christian manuscripts
   - Style: Ancient manuscript aesthetics

8. **pelagianism.jpg** - Pelagius concept or Augustinian refutation
   - Use existing: Copy from ../posts/augustine_pelagius_header.png
   - Or: Theological concept art

9. **semi-pelagianism.jpg** - Monastic setting in Gaul
   - Source: Medieval monastery illustrations
   - Style: Medieval manuscript illumination

10. **arminius.jpg** - Jacobus Arminius portrait
    - Source: Wikimedia Commons "Jacobus Arminius"
    - Style: Dutch Golden Age portrait

11. **synod-dort.jpg** - Synod of Dort meeting
    - Source: Historical Dutch paintings of synods
    - Style: Dutch Golden Age group portrait

### Priority 3: Ecumenical Councils
12. **council-constantinople.jpg** - First Constantinople
13. **council-ephesus.jpg** - Council of Ephesus
14. **council-constantinople-2.jpg** - Second Constantinople
15. **council-constantinople-3.jpg** - Third Constantinople
16. **council-nicaea-2.jpg** - Second Nicaea
17. **council-trent.jpg** - Council of Trent

### Priority 4: Other Events
18. **fall-of-rome.jpg** - Sack of Rome 410
19. **augustine-death.jpg** - Augustine's death
20. **great-schism.jpg** - East-West split
21. **english-reformation.jpg** - Henry VIII
22. **scottish-reformation.jpg** - John Knox
23. **heidelberg-catechism.jpg** - German Reformation
24. **westminster-assembly.jpg** - Westminster Confession
25. **westminster-confession.jpg** - English Puritan era

## Image Naming Convention

Use kebab-case (lowercase with hyphens):
```
council-nicaea.jpg ✓
Council_of_Nicaea.jpg ✗
councilOfNicaea.jpg ✗
```

## Style Guidelines

### Visual Consistency
- **Color Palette:** Muted, historical colors (browns, golds, deep reds, blues)
- **Tone:** Serious, academic, reverent
- **Subject Matter:** Historical artwork, portraits, manuscript illuminations
- **Avoid:** Modern photographs of people (unless historical), cartoonish illustrations, overly bright colors

### Example Style References
1. **Classical Religious Art** - Renaissance/Baroque biblical scenes
2. **Historical Portraits** - 16th-17th century oil paintings
3. **Manuscript Illuminations** - Medieval decorative text
4. **Architectural Photography** - Cathedrals, churches, ruins (if historical)

## Quick Start

### Download Images from Wikimedia Commons

1. Go to https://commons.wikimedia.org
2. Search event name (e.g., "Council of Nicaea")
3. Filter: Tools → Options → "Only free media"
4. Download and rename
5. Resize to 800x400 pixels
6. Optimize (compress to <200KB)
7. Save to this folder

### Using Existing Images

You already have:
- `augustine_pelagius_header.png` in `../posts/`

You can:
1. Copy it: `cp ../posts/augustine_pelagius_header.png ./pelagianism.jpg`
2. Or create symbolic links (advanced)

## Automation Tools

### Batch Resize
Using ImageMagick:
```bash
for img in *.jpg; do
  convert "$img" -resize 800x400 -quality 85 "timeline-$img"
done
```

### Optimize Images
Using TinyPNG CLI:
```bash
tinypng *.jpg
```

## Legal Considerations

✅ **Safe to Use:**
- Public Domain (published before 1929)
- Creative Commons CC0
- Creative Commons CC BY (with attribution)

❌ **Avoid:**
- Copyrighted images without license
- Modern commercial photographs
- Getty Images, Shutterstock (unless purchased)

## Attribution Template

For CC BY images, add to image alt text or caption:
```
Artist Name, Title, Year
Source: Wikimedia Commons
License: CC BY 4.0
```

## Checklist

Before adding images:
- [ ] Image is public domain or properly licensed
- [ ] Resized to 800x400 pixels
- [ ] File size under 200KB
- [ ] Named with kebab-case
- [ ] Style matches other timeline images
- [ ] Descriptive filename
- [ ] Optimized for web

## Need Help?

If you can't find an appropriate image:
1. Use a placeholder with event name
2. Create a simple text-based image
3. Skip image for that event (timeline works without images)
4. Use a related image (e.g., use "Reformation" image for specific Reformation events)

## Image Resources by Event Type

### Councils
Search: "Council of [Name] painting artwork"
- Byzantine art
- Renaissance council scenes
- Historical reconstructions

### People
Search: "[Name] portrait painting"
- Renaissance portraits (Luther, Calvin)
- Ancient mosaics (Augustine)
- Engravings (Arminius)

### Events
Search: "[Event] historical painting"
- 19th century historical art
- Manuscript illuminations
- Woodcut prints

### Concepts
Search: "[Concept] illustration"
- Medieval theological diagrams
- Manuscript decorations
- Symbolic artwork