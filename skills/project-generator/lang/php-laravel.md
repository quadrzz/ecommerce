# PHP Laravel API Template

## Files to create:

### `composer.json`
```json
{
  "name": "laravel-api",
  "type": "project",
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11"
  },
  "autoload": {
    "psr-4": {
      "App\\": "app/"
    }
  }
}
```

### `routes/web.php`
```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Hello from Laravel!']);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
```

### `app/Http/Kernel.php`
```php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        \Illuminate\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
    ];

    protected $middlewareGroups = [
        'api' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $middlewareAliases = [
        'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
    ];
}
```

### `.env`
```
APP_NAME=LaravelAPI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
```

### `.gitignore`
```
/vendor
.env
storage/
bootstrap/cache/
```
