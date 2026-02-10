---
layout: page
title: English
icon: fas fa-flag
order: 6
---

## English Posts

{% assign en_posts = site.posts | where_exp: "post", "post.path contains '_posts/en/'" %}

{% if en_posts.size > 0 %}
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in en_posts %}
  <article class="card-wrapper card">
    <a href="{{ post.url | relative_url }}" class="post-preview row g-0 flex-md-row-reverse">
      {% assign card_body_col = '12' %}
      
      {% if post.image %}
      {% assign src = post.image.path | default: post.image %}
      <div class="col-md-5">
        <img src="{{ src }}" alt="{{ post.image.alt | default: 'Preview Image' }}">
      </div>
      {% assign card_body_col = '7' %}
      {% endif %}
      
      <div class="col-md-{{ card_body_col }}">
        <div class="card-body d-flex flex-column">
          <h1 class="card-title my-2 mt-md-0">{{ post.title }}</h1>
          <div class="card-text content mt-0 mb-3">
            <p>{{ post.description | default: post.excerpt }}</p>
          </div>
          <div class="post-meta flex-grow-1 d-flex align-items-end">
            <div class="me-auto">
              <i class="far fa-calendar fa-fw me-1"></i>
              {{ post.date | date: "%B %d, %Y" }}
              {% if post.categories.size > 0 %}
              <i class="far fa-folder-open fa-fw me-1"></i>
              <span class="categories">
                {% for category in post.categories %}
                  {{ category }}{% unless forloop.last %},{% endunless %}
                {% endfor %}
              </span>
              {% endif %}
            </div>
          </div>
        </div>
      </div>
    </a>
  </article>
  {% endfor %}
</div>
{% else %}
<p class="text-muted">No English posts found.</p>
{% endif %}