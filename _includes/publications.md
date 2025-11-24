<h2 id="publications" style="margin: 2px 0px -15px;">Recent Work</h2>
<hr style="border: none; height: 3px; background-color: #463935; margin: 1em 0;">
<div class="publications">
<ol class="bibliography">

{% for link in site.data.publications.recent %}
<li style="margin-bottom: 1em;">
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %} 
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
    {% endif %}
    {% if link.conference_short %} 
    <abbr class="badge">{{ link.conference_short }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="author">{{ link.authors }}</div>
      <div class="periodical"><em>{{ link.conference }}</em></div>
      <div class="links">
        {% if link.pdf %}<a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">PDF</a>{% endif %}
        {% if link.code %}<a href="{{ link.code }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Code</a>{% endif %}
        {% if link.poster %}<a href="{{ link.poster }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Poster</a>{% endif %}
        {% if link.slides %}<a href="{{ link.slides }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Slides</a>{% endif %}
        {% if link.page %}<a href="{{ link.page }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Project Page</a>{% endif %}
        {% if link.bibtex %}<a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">BibTex</a>{% endif %}
        {% if link.notes %}<strong><i style="color:#e74d3c">{{ link.notes }}</i></strong>{% endif %}
        {% if link.others %}{{ link.others }}{% endif %}
      </div>
  </div>
</div>
</li>
{% endfor %}

</ol>

<details>
<summary style="cursor:pointer; font-weight:bold; font-size:1.25em; margin-top:0;">Past Projects</summary>

<hr style="border: none; height: 2px; background-color: #463935; margin: 0.5em 0;">

<div class="publications">
<ol class="bibliography">

{% for link in site.data.publications.past %}
<li style="margin-bottom: 1em;">
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %} 
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
    {% endif %}
    {% if link.conference_short %} 
    <abbr class="badge">{{ link.conference_short }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="author">{{ link.authors }}</div>
      <div class="periodical"><em>{{ link.conference }}</em></div>
      <div class="links">
        {% if link.pdf %}<a href="{{ link.pdf }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">PDF</a>{% endif %}
        {% if link.code %}<a href="{{ link.code }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Code</a>{% endif %}
        {% if link.poster %}<a href="{{ link.poster }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Poster</a>{% endif %}
        {% if link.slides %}<a href="{{ link.slides }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Slides</a>{% endif %}
        {% if link.page %}<a href="{{ link.page }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">Project Page</a>{% endif %}
        {% if link.bibtex %}<a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" target="_blank" style="font-size:12px;">BibTex</a>{% endif %}
        {% if link.notes %}<strong><i style="color:#e74d3c">{{ link.notes }}</i></strong>{% endif %}
        {% if link.others %}{{ link.others }}{% endif %}
      </div>
  </div>
</div>
</li>
{% endfor %}

</ol>
</div>
</details>
</div>