# Ruby 3 compatibility patch for bibtex-ruby 4.4.x.
# The gem uses Proc.new without an explicit block in a couple of iterator
# methods, which raises ArgumentError on Ruby 3.

if defined?(BibTeX::Bibliography)
  class BibTeX::Bibliography
    def each(&block)
      if block
        data.each(&block)
        self
      else
        to_enum(:each)
      end
    end

    def each_entry(&block)
      if block
        q('@entry').each(&block)
      else
        q('@entry').to_enum
      end
    end
  end
end
