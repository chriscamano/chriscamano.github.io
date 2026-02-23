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
