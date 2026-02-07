---
layout: page
title: Timelines
icon: fas fa-stream
order: 5
---

## Church History Timelines

Explore the history of the church through interactive timelines. Each timeline traces major events, councils, reformations, and theological developments from the apostles to the present day.

### Featured Timelines

<div class="timeline-list">
  <div class="timeline-card">
    <h3><a href="/posts/church-history-timeline/">Church History Timeline</a></h3>
    <p class="text-muted">33 AD — Present</p>
    <p>A comprehensive journey through 2,000 years of church history, from Pentecost to the New Calvinism movement. Features 57 major events including:</p>
    <ul>
      <li>All Seven Ecumenical Councils</li>
      <li>The Protestant Reformation</li>
      <li>Major Confessions and Synods</li>
      <li>Modern Evangelicalism</li>
    </ul>
    <a href="/posts/church-history-timeline/" class="btn btn-outline-primary btn-sm">View Timeline</a>
  </div>
</div>

### About Our Timelines

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

### Using the Timelines

To use a timeline in your own posts:

```yaml
---
title: "My Timeline"
layout: post
tags: [timeline]
---

{% raw %}{% include timeline.html data=site.data.timelines.church-history title="My Timeline" %}{% endraw %}
```

Or create your own timeline data in `_data/timelines/`.

---

*All timeline images are from Wikimedia Commons and are in the public domain.*