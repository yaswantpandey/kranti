<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;
use App\Helpers\Session;

class RateLimitMiddleware {
    public static function handle(int $maxAttempts = 5, int $decaySeconds = 60): void {
        Session::start();
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $key = 'rate_limit_' . md5($ip . ':' . $path);

        $attempts = Session::get($key, ['count' => 0, 'expires' => time() + $decaySeconds]);

        if (time() > $attempts['expires']) {
            $attempts = ['count' => 0, 'expires' => time() + $decaySeconds];
        }

        $attempts['count']++;
        Session::set($key, $attempts);

        if ($attempts['count'] > $maxAttempts) {
            $retryAfter = $attempts['expires'] - time();
            header('Retry-After: ' . max(1, $retryAfter));
            Response::error("Too many requests. Please try again in {$retryAfter} seconds.", 429);
        }
    }
}
