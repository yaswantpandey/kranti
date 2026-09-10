<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;
use App\Helpers\Session;
use App\Models\User;

class AuthMiddleware {
    public static function handle(): array {
        Session::start();
        $userId = Session::get('user_id');

        // Check Authorization header for Bearer token fallback if session not found
        if (!$userId && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
            if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
                $token = $matches[1];
                $user = User::findByToken($token);
                if ($user) {
                    $userId = $user['id'];
                }
            }
        }

        if (!$userId) {
            Response::unauthorized('Authentication required. Please log in.');
        }

        $user = User::findById((int)$userId);

        if (!$user) {
            Session::destroy();
            Response::unauthorized('Invalid user session.');
        }

        if (!$user['is_active']) {
            Session::destroy();
            Response::forbidden('Your account has been deactivated. Please contact support.');
        }

        return $user;
    }
}
