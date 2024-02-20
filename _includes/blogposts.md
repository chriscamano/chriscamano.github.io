<h2 id="blogposts" style="margin: 2px 0px -15px;">Blog Posts</h2>

<div class="blogposts">
  <ol class="blogposts-list">

    {% for post in site.data.blogposts.main %}

    <li>
      <div class="post-row">
        <div class="col-sm-3" style="position: relative;padding-right: 15px;padding-left: 15px;">
          {% if post.image %} 
          <img src="{{ post.image }}" class="post-teaser img-fluid z-depth-1" style="height: 200px; width: auto;">

          {% endif %}
        </div>
        <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
          <div class="title">
            <a href="{{ post.more_info }}">{{ post.title }}</a>
          </div>
          <div class="description">{{ post.description }}</div>
          <div class="completion-date">Completed: {{ post.date_completed }}</div>
          <div class="links">
            {% if post.more_info %} 
            <a href="{{ post.more_info }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">More Info</a>
            {% endif %}
          </div>
        </div>
      </div>
    </li>

    <br>

    {% endfor %}

  </ol>
</div>
