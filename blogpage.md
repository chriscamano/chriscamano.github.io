---
layout: page
title: Blog Page
permalink: /blogpage/
---

<h2 id="blog" style="margin: 2px 0px -15px;">Blog</h2>

<div class="projects">
  <ol class="project-list">

    {% for post in site.posts %}

    <li>
      <div class="project-row">
        <div class="col-sm-3" style="position: relative;padding-right: 15px;padding-left: 15px;">
          {% if post.image %} 
          <img src="{{ post.image }}" class="project-teaser img-fluid z-depth-1" style="width=100;height=40%">
          {% endif %}
        </div>
        <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
          <div class="title">
            <a href="{{ post.url }}">{{ post.title }}</a>
          </div>
          <div class="description">{{ post.excerpt | strip_html }}</div>
          <div class="completion-date">Published: {{ post.date | date: "%B %d, %Y" }}</div>
          <div class="links">
            <a href="{{ post.url }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Read More</a>
          </div>
        </div>
      </div>
    </li>

    <br>

    {% endfor %}

  </ol>
</div>
