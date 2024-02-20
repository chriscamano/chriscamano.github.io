<h2 id="blogposts" style="margin: 2px 0px -15px;">Blog Posts</h2>

<div class="blogposts" style="width: 100%; margin: 0;">
  <ol class="blogposts-list" style="padding: 0; list-style: none;">

    {% for post in site.data.blogposts.main %}

    <li style="margin-bottom: 20px;">
      <div class="post-row" style="display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px;">
        <div class="col-sm-3" style="flex: 0 0 25%; max-width: 25%; position: relative; padding-right: 15px; padding-left: 15px;">
          {% if post.image %} 
          <img src="{{ post.image }}" class="post-teaser img-fluid z-depth-1" style="width: 100%; height: auto;">
          {% endif %}
        </div>
        <div class="col-sm-9" style="flex: 0 0 75%; max-width: 75%; position: relative; padding-right: 15px; padding-left: 15px;">
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

    {% endfor %}

  </ol>
</div>
