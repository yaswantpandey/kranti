<?php
declare(strict_types=1);

/**
 * Global Application Configuration & Environment Loader
 */

// Load environment variables from .env if present
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (str_contains($line, '=')) {
            [$name, $value] = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv("{$name}={$value}");
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

if (!function_exists('env')) {
    function env(string $key, mixed $default = null): mixed {
        $value = getenv($key);
        if ($value === false) {
            return $default;
        }
        return match (strtolower($value)) {
            'true', '(true)' => true,
            'false', '(false)' => false,
            'null', '(null)' => null,
            default => $value,
        };
    }
}

// Environment & Error Handling setup
$appEnv = env('APP_ENV', 'production');
if ($appEnv === 'development' || $appEnv === 'testing') {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/../logs/error.log');
}

date_default_timezone_set('Asia/Kolkata');

return [
    'app_name' => env('APP_NAME', 'Kranti Furnitures & Electronics Backend'),
    'app_env' => $appEnv,
    'app_url' => env('APP_URL', 'http://localhost/stitch_kranti_digital_showroom/backend'),
    'frontend_url' => env('FRONTEND_URL', 'http://localhost/stitch_kranti_digital_showroom'),
    
    'db' => [
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => (int) env('DB_PORT', 3306),
        'database' => env('DB_DATABASE', 'kranti'),
        'username' => env('DB_USERNAME', 'root'),
        'password' => env('DB_PASSWORD', ''),
        'charset' => 'utf8mb4',
    ],

    'session' => [
        'secret' => env('SESSION_SECRET', 'kranti_default_secret_key_change_in_prod'),
        'lifetime' => (int) env('SESSION_LIFETIME', 86400),
    ],

    'cors' => [
        'allowed_origins' => explode(',', env('ALLOWED_ORIGINS', 'http://localhost,http://127.0.0.1')),
    ],

    'upload' => [
        'max_size' => (int) env('UPLOAD_MAX_SIZE', 5242880), // 5MB
        'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
        'allowed_exts' => ['jpg', 'jpeg', 'png', 'webp'],
        'path' => __DIR__ . '/../uploads',
    ]
];
