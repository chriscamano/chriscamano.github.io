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
  ],
  "lib/bibtex/names.rb" => [
    [
      /def value\(options = \{\}\)\s*\n\s*@tokens\.map \{ \|n\| n\.to_s\(options\) \}\.join\(' and '\)\s*\n\s*end/m,
      <<~'PATCH'
        def value(options = {})
          @tokens.map do |n|
            node = n.respond_to?(:to_citeproc) ? n : Name.parse(n.to_s)
            node ? node.to_s(options) : n.to_s
          end.join(' and ')
        end
      PATCH
    ],
    [
      /def to_citeproc\(options = \{\}\)\s*\n\s*map \{ \|n\| n\.to_citeproc\(options\) \}\s*\n\s*end/m,
      <<~'PATCH'
        def to_citeproc(options = {})
          map do |n|
            node = n.respond_to?(:to_citeproc) ? n : Name.parse(n.to_s)
            node.to_citeproc(options) if node.respond_to?(:to_citeproc)
          end.compact
        end
      PATCH
    ],
    [
      /\[:convert!,\s*:rename_if,\s*:rename_unless,\s*:extend_initials\]\.each do \|method_id\|\s*\n\s*define_method\(method_id\) do \|\*arguments\|\s*\n\s*tokens\.each \{ \|t\| t\.send\(method_id, \*arguments\) \}\s*\n\s*self\s*\n\s*end\s*\n\s*end/m,
      <<~'PATCH'
        [:convert!, :rename_if, :rename_unless, :extend_initials].each do |method_id|
          define_method(method_id) do |*arguments|
            tokens.each { |t| t.send(method_id, *arguments) if t.respond_to?(method_id) }
            self
          end
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
  "dup.convert!(*filters, &Proc.new)" => /dup\.convert!\(\*filters,\s*&Proc\.new\)/m,
  "tokens.each { |t| t.send(method_id, *arguments) }" => /tokens\.each \{ \|t\| t\.send\(method_id, \*arguments\) \}/,
  "map { |n| n.to_citeproc(options) }" => /map \{ \|n\| n\.to_citeproc\(options\) \}/,
  "@tokens.map { |n| n.to_s(options) }.join(' and ')" => /@tokens\.map \{ \|n\| n\.to_s\(options\) \}\.join\(' and '\)/
}

remaining = []
%w[lib/bibtex/bibliography.rb lib/bibtex/entry.rb lib/bibtex/names.rb].each do |relative_path|
  path = File.join(root, relative_path)
  body = File.read(path)
  unsafe_patterns.each do |label, regex|
    remaining << "#{relative_path}: #{label}" if body.match?(regex)
  end
end

abort("bibtex-ruby compatibility patch did not apply cleanly:\n#{remaining.join("\n")}") unless remaining.empty?
