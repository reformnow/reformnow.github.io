---
# the default layout is 'page'
icon: fas fa-info-circle
order: 6
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

## Creating Presentation Mode Posts

Posts with the `slide` tag automatically enable a **Presentation Mode** button in the sidebar. This converts your article into an interactive slideshow using Reveal.js.

### How to Enable Presentation Mode

Add the `slide` tag to your post:

```yaml
---
title: "Your Presentation Title"
layout: post
categories: [Theology]
tags: [slide, presentation]  # <-- Add 'slide' tag
description: Your description
---
```

The "Presentation Mode" button will appear in the left sidebar when viewing the post.

### Slide Structure

Presentation mode automatically converts your content into slides based on heading levels:

- **H2 (##)** and **H3 (###)** headings create new horizontal slides
- Content flows vertically within each slide until a new heading appears
- Use `---` (horizontal rule) to force a new horizontal slide

#### Creating Vertical Slides

To create vertical slides (slides stacked below the current one), simply write **each paragraph** as normal. **Every paragraph automatically becomes its own vertical slide:**

```markdown
## Main Topic

First paragraph becomes the first vertical slide...

Second paragraph becomes the second vertical slide...

Third paragraph becomes the third vertical slide...

Fourth paragraph becomes the fourth vertical slide...
```

**How it works:**
- **Horizontal slides**: Created by H2/H3 headings (navigate with right/left arrows)
- **Vertical slides**: **Each paragraph automatically becomes its own vertical slide** (navigate with up/down arrows)
- This breaks up your content naturally without extra formatting
- Lists, quotes, and code blocks also become their own slides
- Images paired with text create special two-column layout slides

### Slide Types

**1. Regular Slides**
- Created by H2/H3 headings
- Content flows vertically

**2. Cover Slide**
- First slide shows post title, image, and description
- Generated automatically

**3. Image Slides**
- Images appear on left side with text on right
- Created automatically when images are detected

### Best Practices

**1. Clear Structure**
```markdown
## Section 1: Main Topic

Content here...

### Subtopic A

More details...

### Subtopic B

More details...

## Section 2: Next Topic

New slide starts here...
```

**2. Bilingual Presentations**
- Works seamlessly with the language toggle system
- English on left, Chinese on right when "Both" is selected
- Or shows only selected language

**3. Bible Verses**
- Bible references in ` ```bible ` blocks are properly displayed
- Both English and Chinese versions shown side-by-side in "Both" mode

**4. Keep Slides Focused**
- One main idea per slide
- Use bullet points for clarity
- Avoid overly long paragraphs

### Presentation Controls

- **Navigation**: Arrow keys or spacebar
- **Fullscreen**: Click the presentation button
- **Exit**: Press ESC or click the exit button
- **Overview**: Press 'O' to see all slides

### Example Post Structure

```markdown
---
title: "The Order of Salvation"
categories: [Theology]
tags: [slide, salvation]
---

## Introduction

The journey of grace begins with God's calling...

## 1. Effectual Calling

Not all who hear the gospel are called effectively.

```bible
For those whom he predestined he also called... (Romans 8:30)
```

## 2. Regeneration

The Spirit gives life where there was death.

## Conclusion

God completes what He begins.
```

---

*All timeline images are from Wikimedia Commons and are in the public domain.*