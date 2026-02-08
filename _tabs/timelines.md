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

## Featured Timeline

### Church History: From Pentecost to Present

A comprehensive journey through 2,000 years of church history, featuring 57 major events including all Seven Ecumenical Councils, the Protestant Reformation, major confessions, and modern evangelicalism.

{% include timeline.html data=site.data.timelines.church-history title="Key Events in Church History" %}

<p class="text-center mt-4">
  <a href="/posts/church-history-timeline/" class="btn btn-outline-primary">
    <i class="fas fa-external-link-alt me-2"></i>View Full Post
  </a>
</p>