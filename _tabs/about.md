---
title: About
title_zh: 关于
icon: fas fa-info-circle
order: 6
---

<div class="lang-en" markdown="1">
## About 磐石笔记
</div>
<div class="lang-zh" markdown="1">
## 关于磐石笔记
</div>

<div class="lang-en" markdown="1">
This is a theological blog focused on Reformed Christianity, exploring the rich heritage of the Reformation and its continued relevance today.
</div>
<div class="lang-zh" markdown="1">
这是一个专注于归正基督教的神学博客，旨在探讨宗教改革的丰厚遗产及其在当代的持续意义。
</div>

<div class="lang-en" markdown="1">
### Our Focus
- **Church History**: From the apostles to the present day
- **Reformed Theology**: Grace, sovereignty, and covenant
- **Historical Timelines**: Visual journeys through theological milestones
- **Doctrinal Development**: Councils, confessions, and controversies
</div>
<div class="lang-zh" markdown="1">
### 我们的关注点
- **教会历史**：从使徒时代至今
- **归正神学**：恩典、主权与圣约
- **历史时间轴**：神学里程碑的视觉之旅
- **教义发展**：大公会议、信条与神学争论
</div>

<div class="lang-en" markdown="1">
### Site Features
Our platform is built for deep study and accessible learning, featuring:
- **Bilingual System v1.5**: Seamlessly switch between English and Chinese at any time.
- **Presentation Mode**: Turn any deep-dive article into a structured slideshow for teaching or personal review.
- **Interactive Timelines**: High-quality historical imagery paired with scholarly context.
</div>
<div class="lang-zh" markdown="1">
### 网站特色
我们的平台专为深入研究和易于学习而设计，具有以下特色：
- **双语系统 v1.5**：随时在英文和中文之间无缝切换。
- **演示模式**：将任何深度文章转化为结构化的幻灯片，方便教学或个人回顾。
- **交互式时间轴**：高质量的历史图像配以专业的学术背景。
</div>

---

<div class="lang-en" markdown="1">
## Creating Bilingual Posts
</div>
<div class="lang-zh" markdown="1">
## 创建双语文章
</div>

<div class="lang-en" markdown="1">
To support our translation system, bilingual posts must follow a specific "interleaved" format.
</div>
<div class="lang-zh" markdown="1">
为了配合我们的翻译系统，双语文章必须遵循特定的“交错”格式。
</div>

<div class="lang-en" markdown="1">
### Writing Rules

1.  **Interleaved Structure**: Write an English paragraph followed immediately by its Chinese translation.
2.  **Language Wrappers**: Every English block must be wrapped in `<div class="lang-en" markdown="1">`. Every Chinese block must be wrapped in `<div class="lang-zh" markdown="1">`.
3.  **Markdown Attribute**: Always include `markdown="1"` in the `div` tag so that headings, lists, and bold text are correctly rendered.
4.  **TOC Filtering**: Our TOC script automatically detects these blocks. If you select "English," the TOC will only show English headings. If you select "Chinese," only the Chinese headings appear.
</div>
<div class="lang-zh" markdown="1">
### 撰写规则

1. **交错结构**：先写一段英文，紧接着写其对应的中文翻译。
2. **语言容器**：每个英文区块必须包含在 `<div class="lang-en" markdown="1">` 中；每个中文区块必须包含在 `<div class="lang-zh" markdown="1">` 中。
3. **Markdown 属性**：务必在 `div` 标签中包含 `markdown="1"`，以便正确渲染标题、列表和加粗文本。
4. **目录 (TOC) 过滤**：我们的 TOC 脚本会自动识别这些区块。如果你选择“English”，目录将只显示英文标题；如果你选择“中文”，则只显示中文标题。
</div>

---

<div class="lang-en" markdown="1">
## Presentation Mode
</div>
<div class="lang-zh" markdown="1">
## 演示模式 (Presentation Mode)
</div>

<div class="lang-en" markdown="1">
Articles with the `slide` tag enable a dedicated presentation view.
</div>
<div class="lang-zh" markdown="1">
带有 `slide` 标签的文章将启用专门的演示视图。
</div>

<div class="lang-en" markdown="1">
### How it Splits Content
- **Horizontal Slides**: Created automatically by H2 (##) and H3 (###) headings.
- **Vertical Slides**: Every single paragraph or content block inside a language container becomes its own vertical slide.
- **Bilingual Layout**: In "Both" mode, English and Chinese paragraphs are automatically paired side-by-side or stacked on the same slide for easy comparison.
</div>
<div class="lang-zh" markdown="1">
### 内容拆分逻辑
- **水平幻灯片**：由 二级标题 (##) 和 三级标题 (###) 自动创建。
- **垂直幻灯片**：语言容器内的每一个段落或内容区块都会自动成为一个独立的垂直幻灯片。
- **双语布局**：在“双语”模式下，英文和中文段落会自动配对，以并排或堆叠的方式显示在同一张幻灯片上，方便对比阅读。
</div>

<div class="lang-en" markdown="1">
### Controls
- **Arrows**: Navigate horizontal and vertical slides.
- **ESC**: Exit presentation mode.
- **O**: Show the global slide overview.
</div>
<div class="lang-zh" markdown="1">
### 控制项
- **方向键**：在水平和垂直幻灯片之间导航。
- **ESC**：退出演示模式。
- **O**：显示全局幻灯片总览。
</div>

<div class="lang-en" markdown="1">
## Special Formatting
</div>
<div class="lang-zh" markdown="1">
## 特殊格式
</div>

<div class="lang-en" markdown="1">
To enhance the beauty and readability of our articles, we use custom code blocks for sacred texts and theological wisdom.

### 1. Bible Block
Use ` ```bible ` to wrap Holy Scripture. This generates a parchment-style background with a golden left border.
```markdown
` ```bible `
"For God so loved the world..." (John 3:16)
` ``` `
```

### 2. Quote Block
Use ` ```quote ` for patristic citations or theological aphorisms. This generates an elegant card with a slate gray accent and a decorative quotation mark.
```markdown
` ```quote `
"Thou didst seek us when we sought Thee not..." (Augustine)
` ``` `
```
</div>
<div class="lang-zh" markdown="1">
为了提升文章的美感和可读性，我们为神圣经文和神学智慧提供了自定义的代码块。

### 1. 经文区块 (Bible Block)
使用 ` ```bible ` 来包裹圣经经文。这将生成一个带有金色左边框的羊皮纸风格背景，视觉上更加庄重。
```markdown
` ```bible `
“神爱世人……” (约翰福音 3:16)
` ``` `
```

### 2. 引用区块 (Quote Block)
使用 ` ```quote ` 来引用教父或神学格言。这将生成一个带石板灰边饰和装饰性大括号的优雅卡片。
```markdown
` ```quote `
“在我们不寻找你时，你寻找了我们……” (奥古斯丁)
` ``` `
```
</div>

---

<div class="lang-en" markdown="1">
## Creating Timelines
</div>
<div class="lang-zh" markdown="1">
## 创建时间轴
</div>

<div class="lang-en" markdown="1">
To create a new interactive timeline post, follow these steps:
</div>
<div class="lang-zh" markdown="1">
要创建一个新的交互式时间轴文章，请按照以下步骤操作：
</div>

<div class="lang-en" markdown="1">
### 1. Create Timeline Data
Add a YAML file to `_data/timelines/`:
```yaml
- date: "Year"
  title: "Event Title"
  description: "Description"
  image: "/assets/img/timeline/file.jpg"
```
</div>
<div class="lang-zh" markdown="1">
### 1. 创建时间轴数据
在 `_data/timelines/` 中添加一个 YAML 文件：
```yaml
- date: "年份"
  title: "事件标题"
  description: "描述"
  image: "/assets/img/timeline/文件名.jpg"
```
</div>

<div class="lang-en" markdown="1">
### 2. Create the Post
Create a new post in `_posts/` and use the timeline include:
```markdown
{% include timeline.html data=site.data.timelines.your-file title="Title" %}
```
</div>
<div class="lang-zh" markdown="1">
### 2. 创建文章
在 `_posts/` 中创建一篇新文章，并使用 timeline 包含文件：
```markdown
{% include timeline.html data=site.data.timelines.your-file title="标题" %}
```
</div>

---


<div class="lang-en" markdown="1">
*All timeline images are from Wikimedia Commons and are in the public domain.*
</div>
<div class="lang-zh" markdown="1">
*所有时间轴图像均来自维基共享资源 (Wikimedia Commons)，属于公有领域。*
</div>