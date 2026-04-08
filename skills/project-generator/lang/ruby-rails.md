# Ruby on Rails Template

## Files to create:

### `Gemfile`
```ruby
source "https://rubygems.org"

gem "rails", "~> 7.2"
gem "sqlite3", "~> 2.0"
gem "puma", ">= 5.0"
gem "bootsnap", require: false
gem "jbuilder"
```

### `config.ru`
```ruby
require_relative "config/environment"
run Rails.application
```

### `config/environment.rb`
```ruby
# Load the Rails application
require_relative "application"
Rails.application.initialize!
```

### `config/application.rb`
```ruby
require_relative "boot"
require "rails"
Bundler.require(*Rails.groups)

module RailsApp
  class Application < Rails::Application
    config.load_defaults 7.2
  end
end
```

### `config/boot.rb`
```ruby
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)
require "bundler/setup"
```

### `config/routes.rb`
```ruby
Rails.application.routes.draw do
  root to: "home#index"
end
```

### `app/controllers/home_controller.rb`
```ruby
class HomeController < ApplicationController
  def index
    render json: { message: "Hello from Rails!" }
  end
end
```

### `app/controllers/application_controller.rb`
```ruby
class ApplicationController < ActionController::API
end
```

### `.gitignore`
```
/node_modules
/public/packs
/public/packs-test
/storage
/.bundle
/.vscode
*.rbc
```
