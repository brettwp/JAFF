page 'index.html', layout: false
set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :version, '0.4.3'

min_build = ENV['MINIFY'] == 'true'

configure :build do
  activate :minify_css
  activate :minify_javascript if min_build
  set :http_prefix, '/jaff'
end

after_build do
  FileUtils.cp('build/javascripts/all.js', "lib/jaff-#{version}#{'.min' if min_build}.js")
end
