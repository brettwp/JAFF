activate :livereload
page 'index.html', layout: false
set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :version, '0.3.0'

configure :build do
  activate :minify_css
  activate :minify_javascript
  set :http_prefix, '/jaff'
end
