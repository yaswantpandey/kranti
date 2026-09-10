<?php
declare(strict_types=1);

namespace App\Services;

use App\Helpers\Logger;
use App\Helpers\Session;
use App\Models\User;

class AuthService {
    public static function register(array $data): array {
        $existing = User::findByEmail($data['email']);
        if ($existing) {
            throw new \InvalidArgumentException('An account with this email address already exists.');
        }

        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 86400); // 24 hours

        $userId = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'verification_token' => $token,
            'verification_token_expires_at' => $expires,
        ]);

        Logger::audit($userId, 'USER_REGISTERED', ['email' => $data['email']]);

        $user = User::findById($userId);
        
        // Auto session login upon registration
        Session::start();
        Session::regenerate();
        Session::set('user_id', $userId);

        return [
            'user' => $user,
            'verificationToken' => $token,
        ];
    }

    public static function login(string $email, string $password): array {
        $user = User::findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Logger::audit(null, 'LOGIN_FAILED', ['email' => $email]);
            throw new \InvalidArgumentException('Invalid email address or password.');
        }

        if (!$user['is_active']) {
            Logger::audit((int)$user['id'], 'LOGIN_BLOCKED_INACTIVE', ['email' => $email]);
            throw new \RuntimeException('Your account has been deactivated. Please contact support.');
        }

        Session::start();
        Session::regenerate();
        Session::set('user_id', (int)$user['id']);

        Logger::audit((int)$user['id'], 'LOGIN_SUCCESS', ['email' => $email]);

        unset($user['password_hash']);
        return [
            'user' => $user,
            'session_id' => session_id()
        ];
    }

    public static function logout(): void {
        Session::start();
        $userId = Session::get('user_id');
        if ($userId) {
            Logger::audit((int)$userId, 'USER_LOGOUT');
        }
        Session::destroy();
    }

    public static function forgotPassword(string $email): string {
        $user = User::findByEmail($email);
        if (!$user) {
            // Generic response to prevent account enumeration
            return 'If an account exists with that email, a password reset link has been generated.';
        }

        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour

        User::setResetToken((int)$user['id'], $token, $expires);
        Logger::audit((int)$user['id'], 'FORGOT_PASSWORD_REQUEST', ['email' => $email]);

        return $token;
    }

    public static function resetPassword(string $token, string $newPassword): bool {
        $user = User::findByToken($token);

        if (!$user || empty($user['reset_token_expires_at']) || strtotime($user['reset_token_expires_at']) < time()) {
            throw new \InvalidArgumentException('Invalid or expired password reset token.');
        }

        User::updatePassword((int)$user['id'], $newPassword);
        Logger::audit((int)$user['id'], 'PASSWORD_RESET_SUCCESS');

        return true;
    }

    public static function changePassword(int $userId, string $currentPassword, string $newPassword): bool {
        $user = User::findById($userId);
        $fullUser = User::findByEmail($user['email']);

        if (!$fullUser || !password_verify($currentPassword, $fullUser['password_hash'])) {
            throw new \InvalidArgumentException('Current password is incorrect.');
        }

        User::updatePassword($userId, $newPassword);
        Logger::audit($userId, 'PASSWORD_CHANGED');

        return true;
    }

    public static function verifyEmail(string $token): bool {
        $user = User::findByToken($token);
        if (!$user) {
            throw new \InvalidArgumentException('Invalid email verification token.');
        }

        User::verifyEmail($token);
        Logger::audit((int)$user['id'], 'EMAIL_VERIFIED');

        return true;
    }
}
