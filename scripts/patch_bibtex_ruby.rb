#!/usr/bin/env ruby
# frozen_string_literal: true

# Patch bibtex-ruby 4.4.x for Ruby 3 compatibility.
# The upstream gem uses Proc.new without explicit block capture in a few methods.

def resolve_bibtex_root
  output = `bundle show bibtex-ruby 2>&1`
  candidates = output.lines.map(&:strip).reverse
  root = candidates.find { |line| line.include?("bibtex-ruby") && File.directory?(line) }
  abort("Could not resolve bibtex-ruby path.\nOutput:\n#{output}") unless root
  root
end

def patch_file(path, replacements)
  src = File.read(path)
  before = src.dup
  replacements.each { |regex, replacement| src.gsub!(regex, replacement) }
  return false if src == before
  File.write(path, src)
  true
end

root = resolve_bibtex_root

patches = {
  "lib/bibtex/bibliography.rb" => [
    [
      /def each\s*\n\s*if block_given\?\s*\n\s*data\.each\(&Proc\.new\)\s*\n\s*self\s*\n\s*else\s*\n\s*to_enum\s*\n\s*end\s*\n\s*end/m,
      <<~'PATCH'
        def each(&block)
          if block
            data.each(&block)
            self
          else
            to_enum(:each)
          end
        end
      PATCH
    ],
    [
      /def each_entry\s*\n\s*if block_given\?\s*\n\s*q\('@entry'\)\.each\(&Proc\.new\)\s*\n\s*else\s*\n\s*q\('@entry'\)\.to_enum\s*\n\s*end\s*\n\s*end/m,
      <<~'PATCH'
        def each_entry(&block)
          if block
            q('@entry').each(&block)
          else
            q('@entry').to_enum
          end
        end
      PATCH
    ]
  ],
  "lib/bibtex/entry.rb" => [
    [
      /def each\s*\n\s*if block_given\?\s*\n\s*fields\.each\(&Proc\.new\)\s*\n\s*self\s*\n\s*else\s*\n\s*to_enum\s*\n\s*end\s*\n\s*end/m,
      <<~'PATCH'
        def each(&block)
          if block
            fields.each(&block)
            self
          else
            to_enum(:each)
          end
        end
      PATCH
    ],
    [
      /def convert\(\*filters\)\s*\n\s*block_given\?\s*\?\s*dup\.convert!\(\*filters,\s*&Proc\.new\)\s*:\s*dup\.convert!\(\*filters\)\s*\n\s*end/m,
      <<~'PATCH'
        def convert(*filters, &block)
          block ? dup.convert!(*filters, &block) : dup.convert!(*filters)
        end
      PATCH
    ]
  ]
}

changed_paths = []
patches.each do |relative_path, replacements|
  path = File.join(root, relative_path)
  changed_paths << path if patch_file(path, replacements)
end

puts(changed_paths.empty? ? "No bibtex-ruby patch needed" : "Patched:\n- #{changed_paths.join("\n- ")}")

unsafe_patterns = {
  "data.each(&Proc.new)" => /data\.each\(&Proc\.new\)/,
  "q('@entry').each(&Proc.new)" => /q\('@entry'\)\.each\(&Proc\.new\)/,
  "fields.each(&Proc.new)" => /fields\.each\(&Proc\.new\)/,
  "dup.convert!(*filters, &Proc.new)" => /dup\.convert!\(\*filters,\s*&Proc\.new\)/m
}

remaining = []
%w[lib/bibtex/bibliography.rb lib/bibtex/entry.rb].each do |relative_path|
  path = File.join(root, relative_path)
  body = File.read(path)
  unsafe_patterns.each do |label, regex|
    remaining << "#{relative_path}: #{label}" if body.match?(regex)
  end
end

abort("bibtex-ruby compatibility patch did not apply cleanly:\n#{remaining.join("\n")}") unless remaining.empty?
