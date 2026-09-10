<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;

class AdminMiddleware {
    public static function handle(): array {
        $user = AuthMiddleware::handle();

        if ($user['role'] !== 'admin') {
            Response::forbidden('Access denied. Administrator privilege required.');
        }

        return $user;
    }
}
