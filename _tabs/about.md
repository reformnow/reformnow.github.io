---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

## About 磐石笔记

This is a theological blog focused on Reformed Christianity, exploring the rich heritage of the Reformation and its continued relevance today.

### Our Focus

- **Church History**: From the apostles to the present day
- **Reformed Theology**: Grace, sovereignty, and covenant
- **Historical Timelines**: Visual journeys through theological milestones
- **Doctrinal Development**: Councils, confessions, and controversies

### Timeline Features

Our interactive timelines showcase:
- **Historical Accuracy**: Based on scholarly research and primary sources
- **Visual Richness**: Historical artwork from Wikimedia Commons (public domain)
- **Responsive Design**: Works beautifully on desktop and mobile
- **Interactive Display**: Scroll through centuries of church history
- **Theological Depth**: Major councils, heresies, and doctrinal developments

### Categories Covered

<div class="row">
  <div class="col-md-6">
    <h4>Early Church (33-500)</h4>
    <ul>
      <li>Apostolic Period</li>
      <li>Ecumenical Councils</li>
      <li>Early Heresies</li>
      <li>Church Fathers</li>
    </ul>
  </div>
  <div class="col-md-6">
    <h4>Medieval Period (500-1500)</h4>
    <ul>
      <li>Scholasticism</li>
      <li>East-West Schism</li>
      <li>Reformation Precursors</li>
    </ul>
  </div>
</div>

<div class="row mt-4">
  <div class="col-md-6">
    <h4>Reformation (1500-1700)</h4>
    <ul>
      <li>Luther & Calvin</li>
      <li>Reformed Confessions</li>
      <li>Council of Trent</li>
      <li>Synod of Dort</li>
    </ul>
  </div>
  <div class="col-md-6">
    <h4>Modern Era (1700-Present)</h4>
    <ul>
      <li>Great Awakenings</li>
      <li>Modern Missions</li>
      <li>Neo-Orthodoxy</li>
      <li>New Calvinism</li>
    </ul>
  </div>
</div>

---

## Creating Your Own Timeline

To create a new timeline post:

### Step 1: Create Timeline Data

Create a YAML file in `_data/timelines/`:

```yaml
# _data/timelines/my-timeline.yml
- date: "Year"
  title: "Event Title"
  description: "Event description"
  image: "/assets/img/timeline/image.jpg"
  category: "category"
```

### Step 2: Create Timeline Post

Create a post in `_posts/`:

```yaml
---
title: "My Timeline Title"
layout: post
date: 2025-02-06
categories: [Timelines, My Category]
tags: [timeline, tag1, tag2]
description: Brief description of this timeline
---

## Introduction

Your timeline description here.

{% include timeline.html data=site.data.timelines.my-timeline title="My Timeline" %}
```

### Step 3: Add Images

Add images to `assets/img/timeline/` with matching filenames from your YAML data.

Your timeline will automatically appear in the [Timelines](/timelines/) tab!

---

## Creating Bilingual Posts

To support our English/中文/双语 switching functionality, bilingual posts must follow a specific format.

### Writing Rules

1.  **Interleaved Structure**: Write an English paragraph followed immediately by its Chinese translation.
2.  **Language Wrappers**: Every English block must be wrapped in a specific `div`, and every Chinese block must be wrapped in its own `div`.
    *   **English**: `<div class="lang-en" markdown="1"> ... </div>`
    *   **Chinese**: `<div class="lang-zh" markdown="1"> ... </div>`
3.  **Markdown Attribute**: Always include `markdown="1"` in the `div` tag so that headings, lists, and bold text are correctly rendered.
4.  **Headings**: Provide headings in both languages, either within their respective blocks or as pairs.
5.  **Bible Verses**: Use the ` ```bible ` code block for scripture. Ideally, provide the English verse in the English block and the Chinese verse in the Chinese block, or both together if the context requires.

### Example Format

```markdown
<div class="lang-en" markdown="1">
## The Journey of Grace
Salvation is a gift from God.
</div>

<div class="lang-zh" markdown="1">
## 恩典之旅
救恩是神所赐的礼物。
</div>
```

---

*All timeline images are from Wikimedia Commons and are in the public domain.*