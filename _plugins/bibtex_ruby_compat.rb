# Ruby 3 compatibility patch for bibtex-ruby 4.4.x.
# That series uses Proc.new without an explicit block in a few methods,
# which raises ArgumentError on Ruby 3.

begin
  require "bibtex"
rescue LoadError
  # If bibtex is unavailable, allow the normal plugin error path later.
end

if defined?(BibTeX::Bibliography)
  class BibTeX::Bibliography
    def each(&block)
      return to_enum(:each) unless block
      data.each(&block)
      self
    end

    def each_entry(&block)
      return q("@entry").to_enum unless block
      q("@entry").each(&block)
    end

    def unify(field, pattern, value = nil, &block)
      pattern = Regexp.new(pattern) unless pattern.is_a?(Regexp)
      action = block || proc { |e| e[field] = value }

      each_entry do |entry|
        if entry.field?(field) && entry[field].to_s =~ pattern
          action.call(entry)
        end
      end

      self
    end

    def select_duplicates_by(*arguments, &block)
      arguments = [:year, :title] if arguments.empty?

      group_by(*arguments) do |digest, entry|
        digest = digest.gsub(/\s+/, "").downcase
        digest = block.call(digest, entry) if block
        digest
      end.values.select { |d| d.length > 1 }
    end
  end
end

if defined?(BibTeX::Entry)
  class BibTeX::Entry
    def each(&block)
      if block
        fields.each(&block)
        self
      else
        to_enum(:each)
      end
    end

    alias each_pair each

    def convert(*filters, &block)
      if block
        dup.convert!(*filters, &block)
      else
        dup.convert!(*filters)
      end
    end
  end
end

if defined?(BibTeX::Names)
  class BibTeX::Names
    def each(&block)
      return enum_for(:each) unless block

      @tokens.each do |token|
        name =
          if token.respond_to?(:each_pair)
            token
          else
            BibTeX::Name.parse(token.to_s) || BibTeX::Name.new(last: token.to_s)
          end
        block.call(name)
      end

      self
    end

    def value(options = {})
      each.map do |n|
        node = n.respond_to?(:to_citeproc) ? n : BibTeX::Name.parse(n.to_s)
        node ? node.to_s(options) : n.to_s
      end.join(" and ")
    end

    def to_citeproc(options = {})
      each.map do |n|
        node = n.respond_to?(:to_citeproc) ? n : BibTeX::Name.parse(n.to_s)
        node.to_citeproc(options) if node.respond_to?(:to_citeproc)
      end.compact
    end

    def convert!(*filters)
      tokens.each { |t| t.convert!(*filters) if t.respond_to?(:convert!) }
      self
    end
  end
end
