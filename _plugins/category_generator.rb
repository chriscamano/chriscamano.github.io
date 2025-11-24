Jekyll::Hooks.register :site, :post_read do |site|
    categories = site.collections["blog"].docs.flat_map { |doc| doc.data["categories"] || [] }.uniq
    categories.each do |cat|
      site.pages << Jekyll::PageWithoutAFile.new(site, site.source, "categories/#{cat}", "index.html").tap do |page|
        page.content = ""
        page.data["layout"] = "category"
        page.data["category"] = cat
        page.data["title"] = "Category: #{cat}"
      end
    end
  end
  