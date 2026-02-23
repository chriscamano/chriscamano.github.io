# Ruby 3 compatibility patch for bibtex-ruby 4.4.x.
# The gem uses Proc.new without an explicit block in iterator methods,
# which raises ArgumentError on Ruby 3.

begin
  require 'bibtex'
rescue LoadError
  # If bibtex isn't available, let normal load fail later with a clear error.
end

if defined?(BibTeX::Bibliography)
  class BibTeX::Bibliography
    def each(&block)
      return to_enum(:each) unless block
      data.each(&block)
      self
    end

    def each_entry(&block)
      return q('@entry').to_enum unless block
      q('@entry').each(&block)
    end
  end
end
