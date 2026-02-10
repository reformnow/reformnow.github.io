# Bilingual Site Setup Guide

## ✅ What Was Implemented

### 1. Directory Structure
```
_posts/
├── en/              # English posts
│   ├── 2026-01-28-Augustine-vs-Pelagius.md
│   └── 2025-02-06-church-history-timeline.md
└── zh/              # Chinese posts
    └── 2026-01-28-奥古斯丁与伯拉纠.md
```

### 2. Language Tabs
- **English** tab: Shows all English posts
- **中文** tab: Shows all Chinese posts
- Navigation tabs in sidebar

### 3. Language Switcher
- Automatically appears on posts
- Links between English and Chinese versions
- Badge-style button

## 📝 How to Add New Bilingual Posts

### English Post
```yaml
---
title: "Your Title"
date: 2026-01-28
categories: [Category]
tags: [tag1, tag2]
---
Your content...
```
**Save to:** `_posts/en/`

### Chinese Post
```yaml
---
title: "你的标题"
date: 2026-01-28
categories: [分类]
tags: [标签1, 标签2]
---
你的内容...
```
**Save to:** `_posts/zh/`

### Link Between Versions
Add link at bottom of each post:

**English post:**
```markdown
---
*Read in Chinese: [中文版](/posts/zh/chinese-title/)*
```

**Chinese post:**
```markdown
---
*阅读英文版本：[English Version](/posts/en/english-title/)*
```

## 🎯 Key Features

### Automatic Language Detection
- Posts automatically categorized by directory
- No need to specify `lang` in front matter

### URL Structure
- English: `/posts/en/post-title/`
- Chinese: `/posts/zh/post-title/`

### Navigation
- Two new tabs: "English" and "中文"
- Each shows only posts in that language

## 💡 Best Practices

### 1. Consistent Slugs
Make URL slugs match between languages:
- English: `augustine-vs-pelagius.md`
- Chinese: `奥古斯丁与伯拉纠.md`

### 2. Share Images
Use the same images for both versions:
```yaml
image:
  path: /assets/img/posts/shared-image.jpg
```

### 3. Cross-Link
Always add links between language versions so users can switch.

### 4. Categories
Consider translating categories:
- English: `categories: [History, Theology]`
- Chinese: `categories: [历史, 神学]`

## 🚀 Next Steps

1. **Add more Chinese translations**
2. **Update home page** to show language filter
3. **Add language selector to header**
4. **Translate site interface** (navigation, buttons, etc.)

## 📁 Files Created

- `_posts/en/` - English posts directory
- `_posts/zh/` - Chinese posts directory
- `_tabs/english.md` - English posts listing
- `_tabs/中文.md` - Chinese posts listing
- `_includes/lang-switcher.html` - Language switcher
- `BILINGUAL_SETUP.md` - This guide

## ✅ Testing

Visit these URLs:
- http://127.0.0.1:4001/english/ - English posts
- http://127.0.0.1:4001/中文/ - 中文文章
- http://127.0.0.1:4001/posts/en/augustine-vs-pelagius/ - English post
- http://127.0.0.1:4001/posts/zh/奥古斯丁与伯拉纠/ - 中文文章

Your site is now bilingual! 🎉