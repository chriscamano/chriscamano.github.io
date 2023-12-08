<h2 id="projects" style="margin: 2px 0px -15px;">
  <a href="projects_page.html">Projects</a>
</h2>

<div class="projects">
  <ol class="project-list">

    {% for project in site.data.projects.main %}

    <li>
      <div class="project-row">
        <div class="col-sm-3" style="position: relative;padding-right: 15px;padding-left: 15px;">
          {% if project.image %} 
          <img src="{{ project.image }}" class="project-teaser img-fluid z-depth-1" style="width=100;height=40%">
          {% endif %}
        </div>
        <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
          <div class="title">
            <a href="{{ project.more_info }}">{{ project.title }}</a>
          </div>
          <div class="description">{{ project.description }}</div>
          <div class="completion-date">Completed: {{ project.date_completed }}</div>
          <div class="links">
            {% if project.more_info %} 
            <a href="{{ project.more_info }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">More Info</a>
            {% endif %}
          </div>
        </div>
      </div>
    </li>

    <br>

    {% endfor %}

  </ol>
</div>
