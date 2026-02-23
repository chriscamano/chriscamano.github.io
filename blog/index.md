---
layout: default
title: \otimes
extra_css:
  - blog.css
  - sidebar.css
---

<style>
  .blog-sidebar .categories-list a,
  .post-categories-feed .category-link {
    text-decoration: none;
  }

  .blog-sidebar .categories-list a:hover,
  .post-categories-feed .category-link:hover {
    text-decoration: none;
  }
</style>

<div class="blog-container">

  <!-- Sidebar -->
  <aside class="blog-sidebar">

    {% if site.blog %}
      {% assign posts_collection = site.blog %}
    {% else %}
      {% assign posts_collection = site.posts %}
    {% endif %}

    <h3>Categories</h3>
    <ul class="categories-list">
      {% assign all_categories = posts_collection | map:"categories" | join:"," | split:"," | uniq | sort %}
      {% for cat in all_categories %}
        {% unless cat == "" %}
          {% assign count = posts_collection | where_exp:"post","post.categories contains cat" | size %}
          {% assign cat_slug = cat | slugify %}
          <li>
            <a href="{{ '/blog/' | append:'?category=' | append:cat_slug | relative_url }}">{{ cat }}</a>
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
        <div class="blog-hero-inner">
          <h1 class="blog-opener-title">
            <span class="blog-title-code">\otimes</span>
            <span class="blog-title-math">⊗</span>
          </h1>
          <p class="blog-opener-subtitle">
            a blog about (mostly) tensors.
          </p>
        </div>
      </div>
      <hr class="section-separator">
    </div>

    {% assign posts_sorted = posts_collection | sort: "date" | reverse %}
    {% for post in posts_sorted %}
      {% capture post_cat_slugs %}{% if post.categories %}{% for cat in post.categories %}{{ cat | slugify }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endif %}{% endcapture %}
      <div class="post-wrapper" data-categories="{{ post_cat_slugs | strip }}">

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
            <p class="post-date-feed post-views-feed">
              <span class="post-views-count-feed" data-post-path="{{ post.url | relative_url }}">—</span> views
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
              <a href="{{ '/blog/' | append:'?category=' | append:cat_slug | relative_url }}"
                 class="category-link">{{ cat }}</a>{% unless forloop.last %}, {% endunless %}
            {% endfor %}
          </div>
        {% endif %}

      </div>
    {% endfor %}

  </main>

</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    var category = params.get("category");
    if (category) {
      var wrappers = document.querySelectorAll(".post-wrapper");
      var visibleCount = 0;

      wrappers.forEach(function (wrapper) {
        var raw = wrapper.getAttribute("data-categories") || "";
        var cats = raw ? raw.split(",") : [];
        var show = cats.indexOf(category) !== -1;
        wrapper.style.display = show ? "" : "none";
        if (show) visibleCount += 1;
      });

      var hero = document.querySelector(".blog-opener");
      if (hero) {
        var note = document.createElement("p");
        note.style.margin = "0.25rem 0 1rem";
        note.style.fontSize = "0.95rem";
        note.innerHTML = "Filtered by category: <strong>" + category.replace(/-/g, " ") + "</strong> (" + visibleCount + " post" + (visibleCount === 1 ? "" : "s") + "). <a href=\"{{ '/blog/' | relative_url }}\">Show all</a>";
        hero.insertAdjacentElement("afterend", note);
      }
    }

    var apiBase = "{{ site.views_api_base | default: '' }}";
    var endpoint = apiBase ? apiBase + "/api/views" : "/api/views";
    var viewEls = document.querySelectorAll(".post-views-count-feed");
    viewEls.forEach(function (el) {
      var path = el.getAttribute("data-post-path");
      if (!path) {
        el.textContent = "—";
        return;
      }
      fetch(endpoint + "?path=" + encodeURIComponent(path))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (typeof data.views === "number") {
            el.textContent = data.views.toLocaleString();
          } else {
            el.textContent = "—";
          }
        })
        .catch(function () {
          el.textContent = "—";
        });
    });
  });
</script>
