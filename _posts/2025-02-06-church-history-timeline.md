---
title: "Church History Timeline"
layout: post
date: 2025-02-06 10:00:00 +0000
categories: [Timelines, Church History]
tags: [timeline, church-history, slide]
description: A comprehensive timeline of church history from Pentecost to the Reformation
---

## Overview

This timeline showcases major events in church history, from the birth of the Christian church to the Protestant Reformation.

## Using This Timeline

The timeline below is generated from a YAML data file and rendered using custom CSS. It's fully compatible with GitHub Pages and requires no JavaScript.

{% include timeline.html data=site.data.timelines.church-history title="Key Events in Church History" %}

## How to Create Your Own Timeline

### Method 1: Data Files (Recommended)

1. Create a YAML file in `_data/timelines/`:

```yaml
# _data/timelines/my-timeline.yml
- date: "2026"
  title: "Event Title"
  description: "Event description"
  category: "category"
  image: "/assets/img/event.jpg"  # optional
  link: "/posts/post-url/"       # optional
```

2. Include it in your post:

```liquid
{% raw %}{% include timeline.html data=site.data.timelines.my-timeline title="My Timeline" %}{% endraw %}
```

### Method 2: Pure Markdown

For simple timelines, use HTML directly in Markdown:

```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-content">
      <div class="timeline-date">1517</div>
      <h3 class="timeline-title">95 Theses</h3>
      <p class="timeline-description">Martin Luther nails 95 theses...</p>
    </div>
  </div>
</div>
```

### Method 3: Inline Data

You can also define timeline data directly in the post:

```yaml
---
timeline_data:
  - date: "1517"
    title: "95 Theses"
    description: "Martin Luther's protest"
  - date: "1536"
    title: "Institutes"
    description: "Calvin's magnum opus"
---

{% raw %}{% include timeline.html data=page.timeline_data %}{% endraw %}
```

## Features

- ✅ **GitHub Pages Compatible** - No plugins or JavaScript required
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Customizable** - Easy to modify colors and styling
- ✅ **Multiple Timelines** - Create unlimited timelines via data files
- ✅ **Categories** - Color-code events by category
- ✅ **Images & Links** - Add images and link to related posts
- ✅ **Accessible** - Semantic HTML structure

## Styling Options

The timeline CSS file includes several variants:

- **Default** - Vertical alternating timeline
- **Compact** - Smaller padding and fonts: `{% raw %}{% include timeline.html data=site.data.timelines.church-history compact=true %}{% endraw %}`
- **Horizontal** - For simple chronological displays

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (all versions)
- Firefox (all versions)
- Safari (all versions)
- Mobile browsers

No JavaScript required!