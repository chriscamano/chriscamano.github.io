---
layout: default
title: \otimes
extra_css:
  - blog.css
  - sidebar.css
---

<div class="blog-container">

  <!-- Sidebar -->
  <aside class="blog-sidebar">

    <h3>Recent Posts</h3>
    <ul class="recent-posts">
      {% if site.blog %}
        {% assign posts_collection = site.blog %}
      {% else %}
        {% assign posts_collection = site.posts %}
      {% endif %}
      {% assign recent_posts = posts_collection | sort: "date" | reverse %}
      {% for post in recent_posts limit:2 %}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          <span class="recent-date">({{ post.date | date: "%b %d, %Y" }})</span>
        </li>
      {% endfor %}
    </ul>

    <h3>Categories</h3>
    <ul class="categories-list">
      {% assign all_categories = posts_collection | map:"categories" | join:"," | split:"," | uniq %}
      {% for cat in all_categories %}
        {% unless cat == "" %}
          {% assign count = posts_collection | where_exp:"post","post.categories contains cat" | size %}
          {% assign cat_slug = cat | slugify %}
          <li>
            <a href="{{ '/categories/' | append:cat_slug | append:'/' | relative_url }}">{{ cat }}</a>
            <span class="category-count">({{ count }})</span>
          </li>
        {% endunless %}
      {% endfor %}
    </ul>

  </aside>

  <!-- Main feed -->
  <main class="blog-main">

    <!-- Hero banner INSIDE blog-main, constrained by main column width -->
    <div class="blog-opener">
      <div class="blog-hero">
        <div class="blog-hero-inner mathjax-process">
          <h1 class="blog-opener-title">
            <span class="blog-title-code">\otimes</span>
            <span class="blog-title-math">$ \otimes $</span>
          </h1>
          <p class="blog-opener-subtitle">
            a blog about (mostly) tensors.   
            Coming soon  
          </p>
        </div>
      </div>
      <hr class="section-separator">
    </div>

    {% for post in posts_collection %}
      <div class="post-wrapper">

        <article class="blog-post">

          <div class="post-image">
            {% if post.image %}
              <a href="{{ post.url | relative_url }}">
                <img src="{{ post.image | relative_url }}" alt="{{ post.title }}">
              </a>
            {% endif %}
          </div>

          <div class="post-text">
            <h2>
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h2>

            <hr>

            <p class="post-date-feed">
              Published: {{ post.date | date: "%B %d, %Y" }}
            </p>

            <p>{{ post.excerpt }}</p>
            <a href="{{ post.url | relative_url }}">Read more →</a>
          </div>

        </article>

        {% if post.categories %}
          <div class="post-categories-feed">
            <strong>Categories:</strong>
            {% for cat in post.categories %}
              {% assign cat_slug = cat | slugify %}
              <a href="{{ '/categories/' | append:cat_slug | append:'/' | relative_url }}"
                 class="category-link">{{ cat }}</a>{% unless forloop.last %}, {% endunless %}
            {% endfor %}
          </div>
        {% endif %}

      </div>
    {% endfor %}

  </main>

</div>
