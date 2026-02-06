---
title: "Timeline Images Guide"
layout: post
date: 2025-02-06 11:00:00 +0000
categories: [Guides, Timelines]
tags: [timeline, images, tutorial]
description: Complete guide to using images in Jekyll timelines - layouts, sizes, captions, and best practices
---

## Overview

Your timeline supports images with multiple layout options. This guide shows you how to use them effectively.

## Standard Timeline with Images

This is the basic implementation - images appear above the title:

{% include timeline.html data=site.data.timelines.church-history-with-images title="Church History with Images" %}

---

## Image Layout Options

### 1. Standard Layout (Default)

Images appear full-width above the title:

```yaml
- date: "1517"
  title: "95 Theses"
  description: "Event description..."
  image: "/assets/img/timeline/event.jpg"
```

**CSS Class:** `.timeline-image` (automatic)
**Size:** 100% width, max-height: 200px
**Best for:** Landscape photos, documents, artwork

### 2. Large Images

For important events with stunning visuals:

```html
<img src="/assets/img/event.jpg" class="timeline-image timeline-image-large" alt="Event">
```

**CSS Class:** `.timeline-image.timeline-image-large`
**Size:** 100% width, max-height: 300px
**Best for:** Hero images, major historical moments

### 3. Thumbnail Layout

Small image beside text (good for portraits):

```html
<div class="timeline-item">
  <div class="timeline-content">
    <img src="/assets/img/portrait.jpg" class="timeline-image-thumb" alt="Portrait">
    <div class="timeline-date">1517</div>
    <h3 class="timeline-title">95 Theses</h3>
    <p class="timeline-description">Text wraps around the image...</p>
  </div>
</div>
```

**CSS Class:** `.timeline-image-thumb`
**Size:** Max 200px wide, 120px tall, floats left
**Best for:** Portraits, small icons

### 4. Side-by-Side Layout

Image and text side by side:

```html
<div class="timeline-item">
  <div class="timeline-content">
    <div class="timeline-with-image">
      <img src="/assets/img/event.jpg" class="timeline-image" alt="Event">
      <div class="timeline-text">
        <div class="timeline-date">1517</div>
        <h3 class="timeline-title">95 Theses</h3>
        <p class="timeline-description">Description...</p>
      </div>
    </div>
  </div>
</div>
```

**CSS Class:** `.timeline-with-image`
**Layout:** 40% image, 60% text
**Best for:** Events where visual and text are equally important

### 5. Circular Images (Portraits)

Perfect for people:

```html
<img src="/assets/img/luther.jpg" class="timeline-image-circle" alt="Martin Luther">
```

**CSS Class:** `.timeline-image-circle`
**Size:** 100px diameter circle
**Best for:** Portraits of people

### 6. Image with Caption

Add context below the image:

```html
<div class="timeline-image-wrapper">
  <img src="/assets/img/document.jpg" alt="95 Theses">
  <div class="timeline-image-caption">
    The original 95 Theses nailed to the Wittenberg door
  </div>
</div>
```

**CSS Classes:** `.timeline-image-wrapper`, `.timeline-image-caption`
**Best for:** Historical documents, artwork needing context

### 7. Image Grid (Multiple Images)

For events with multiple visuals:

```html
<div class="timeline-image-grid">
  <img src="/assets/img/main.jpg" alt="Main image">
  <img src="/assets/img/detail1.jpg" alt="Detail 1">
  <img src="/assets/img/detail2.jpg" alt="Detail 2">
</div>
```

**CSS Class:** `.timeline-image-grid`
**Layout:** 2x2 grid, first image spans full width
**Best for:** Events with multiple photos

---

## Best Practices

### Image Size Guidelines

| Layout Type | Recommended Size | File Format |
|-------------|------------------|-------------|
| Standard | 800x400px | JPG/WebP |
| Large | 1200x600px | JPG/WebP |
| Thumbnail | 200x120px | JPG/WebP |
| Portrait/Circle | 200x200px | JPG/PNG |

### Image Optimization

**1. Compress Images**
```bash
# Use tools like:
- tinypng.com (online)
- ImageOptim (Mac)
- Squoosh (web)
```

**2. Use Appropriate Formats**
- **JPG:** Photos, complex images
- **PNG:** Graphics, transparency needed
- **WebP:** Modern format (smaller files)

**3. Organize Files**
```
assets/
  img/
    timeline/          # Timeline-specific images
      luther-95-theses.jpg
      calvin-portrait.jpg
      augustine-painting.jpg
    posts/             # Post header images
      ...
```

### Accessibility

**Always include alt text:**
```yaml
# In data file, the alt text comes from the title:
image: "/assets/img/timeline/event.jpg"
# Alt text automatically set to: event.title

# For custom HTML:
<img src="image.jpg" alt="Descriptive text about the image" class="timeline-image">
```

### Responsive Behavior

Images automatically adapt:
- **Desktop:** Full timeline layout with alternating sides
- **Tablet:** May stack depending on width
- **Mobile:** Single column, images remain proportional

---

## Adding Images to Your Timeline

### Step 1: Add Image to Data

```yaml
# _data/timelines/my-timeline.yml
- date: "1517"
  title: "95 Theses"
  description: "Description here..."
  category: "reformation"
  image: "/assets/img/timeline/luther-95-theses.jpg"  # ← Add this line
```

### Step 2: Place Image in Assets

```bash
# Copy image to correct location
cp ~/Downloads/luther.jpg assets/img/timeline/
```

### Step 3: Rebuild and Test

```bash
bundle exec jekyll serve
# Visit http://127.0.0.1:4000/posts/your-timeline-post/
```

---

## Advanced: Custom Image Styles

### Custom CSS per Timeline

You can add custom styles for specific timelines:

```css
/* In your post's front matter or custom CSS */
.timeline-church-history .timeline-image {
  max-height: 250px;
  border: 2px solid #8b6914;
}

.timeline-reformation .timeline-image {
  filter: sepia(30%);  /* Vintage look */
}
```

### Conditional Image Display

Show images only on certain events:

```liquid
{% for event in site.data.timelines.church-history %}
  <div class="timeline-item {% if event.image %}has-image{% endif %}">
    <!-- content -->
  </div>
{% endfor %}
```

---

## Examples Summary

| Use Case | CSS Class | Example |
|----------|-----------|---------|
| Standard photo | `.timeline-image` | Historical paintings |
| Hero image | `.timeline-image-large` | Major events |
| Portrait | `.timeline-image-circle` | People, theologians |
| Thumbnail | `.timeline-image-thumb` | Small icons |
| Side-by-side | `.timeline-with-image` | Photo + text |
| With caption | `.timeline-image-wrapper` | Documents |
| Multiple photos | `.timeline-image-grid` | Photo series |

---

## Troubleshooting

**Image not showing?**
1. Check file path: `assets/img/timeline/filename.jpg`
2. Verify file exists: `ls assets/img/timeline/`
3. Check case sensitivity: `Image.jpg` ≠ `image.jpg`
4. Rebuild site: `bundle exec jekyll build`

**Image too large/small?**
- Adjust CSS max-height values
- Use appropriate image classes
- Optimize image file size

**Images stretching?**
- Use `object-fit: cover` (already in CSS)
- Ensure images have proper aspect ratios
- Don't use very wide or tall images

---

## Ready to Use!

Your timeline now supports rich visual storytelling. Mix and match layouts to create engaging historical narratives!