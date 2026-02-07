---
layout: page
title: Timelines
icon: fas fa-stream
order: 5
---

## Church History Timelines

Explore interactive timelines tracing major events, councils, reformations, and theological developments from the apostles to the present day.

<div class="row">
  {% assign timeline_posts = site.posts | where_exp: "post", "post.categories contains 'Timelines'" %}
  
  {% for post in timeline_posts %}
  <div class="col-md-6 mb-4">
    <article class="post-preview card h-100">
      <div class="card-body">
        <h3 class="card-title">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        
        {% if post.description %}
        <p class="card-text text-muted">{{ post.description }}</p>
        {% endif %}
        
        <div class="post-meta mt-3">
          <time>{{ post.date | date: "%B %d, %Y" }}</time>
          
          {% if post.categories %}
          <div class="mt-2">
            {% for category in post.categories %}
              {% if category != "Timelines" %}
              <span class="badge bg-secondary">{{ category }}</span>
              {% endif %}
            {% endfor %}
          </div>
          {% endif %}
          
          {% if post.tags %}
          <div class="mt-2">
            {% for tag in post.tags limit: 3 %}
            <span class="badge bg-light text-dark">{{ tag }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        
        <a href="{{ post.url | relative_url }}" class="btn btn-outline-primary btn-sm mt-3">View Timeline</a>
      </div>
    </article>
  </div>
  {% endfor %}
</div>

{% if timeline_posts.size == 0 %}
<p class="text-muted">No timeline posts found. Check back soon!</p>
{% endif %}

---

## About Our Timelines

All timelines feature:
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

## Create Your Own Timeline

To create a new timeline post:

1. **Create a data file** in `_data/timelines/`:

```yaml
# _data/timelines/my-timeline.yml
- date: "Year"
  title: "Event Title"
  description: "Event description"
  image: "/assets/img/timeline/image.jpg"
  category: "category"
```

2. **Create a post** in `_posts/`:

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

{% raw %}{% include timeline.html data=site.data.timelines.my-timeline title="My Timeline" %}{% endraw %}
```

3. **Add images** to `assets/img/timeline/`

Your timeline will automatically appear in the list above!

---

*All timeline images are from Wikimedia Commons and are in the public domain.*