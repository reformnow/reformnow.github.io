---
layout: page
title: Timelines
icon: fas fa-stream
order: 5
---


<div class="lang-switcher my-4 py-2 border-bottom">
  <div class="btn-group" role="group" aria-label="Language switcher">
    <button type="button" class="btn btn-sm btn-outline-primary" data-lang="english" onclick="setLanguageView('english')">
      English
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary" data-lang="chinese" onclick="setLanguageView('chinese')">
      中文
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary" data-lang="both" onclick="setLanguageView('both')">
      双语
    </button>
  </div>
</div>

<div class="lang-en" markdown="1">
This timeline showcases major events in church history, from the birth of the Christian church to the present day.
</div>

<div class="lang-zh" markdown="1">
本时间线展示了教会历史上的重大事件，从基督教会的诞生直到今天。
</div>

{% include timeline.html data=site.data.timelines.church-history title="Key Events in Church History" %}
