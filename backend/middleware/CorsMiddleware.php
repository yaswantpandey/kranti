<?php
declare(strict_types=1);

namespace App\Middleware;

class CorsMiddleware {
    public static function handle(): void {
        $config = require __DIR__ . '/../config/config.php';
        $allowedOrigins = $config['cors']['allowed_origins'] ?? ['http://localhost', 'http://127.0.0.1'];
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins, true) || empty($origin)) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
        header('Access-Control-Max-Age: 86400');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
