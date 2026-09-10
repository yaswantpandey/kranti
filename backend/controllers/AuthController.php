<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Services\AuthService;

class AuthController {
    public static function register(array $body): void {
        $validator = Validator::make($body, [
            'first_name' => 'required|min:2|max:50',
            'last_name' => 'required|min:2|max:50',
            'email' => 'required|email|max:100',
            'password' => 'required|min:6|max:100',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        try {
            $result = AuthService::register($body);
            Response::success($result, 'Registration successful. Welcome to Kranti digital showroom!', 201);
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 409);
        } catch (\Throwable $e) {
            Response::error('Failed to create account: ' . $e->getMessage(), 500);
        }
    }

    public static function login(array $body): void {
        $validator = Validator::make($body, [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        try {
            $result = AuthService::login($body['email'], $body['password']);
            Response::success($result, 'Signed in successfully. Welcome back!');
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 401);
        } catch (\RuntimeException $e) {
            Response::forbidden($e->getMessage());
        } catch (\Throwable $e) {
            Response::error('Login failed: ' . $e->getMessage(), 500);
        }
    }

    public static function logout(): void {
        AuthService::logout();
        Response::success([], 'Logged out of session successfully.');
    }

    public static function me(): void {
        $user = AuthMiddleware::handle();
        Response::success(['user' => $user], 'Current authenticated user profile.');
    }

    public static function forgotPassword(array $body): void {
        $validator = Validator::make($body, ['email' => 'required|email']);
        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $resetToken = AuthService::forgotPassword($body['email']);
        Response::success(['resetToken' => $resetToken], 'If an account exists, a password reset token has been issued.');
    }

    public static function resetPassword(array $body): void {
        $validator = Validator::make($body, [
            'token' => 'required',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        try {
            AuthService::resetPassword($body['token'], $body['password']);
            Response::success([], 'Password has been reset successfully. You can now log in.');
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public static function verifyEmail(array $params): void {
        $token = $params['token'] ?? '';
        if (empty($token)) {
            Response::error('Verification token is required.', 400);
        }

        try {
            AuthService::verifyEmail($token);
            Response::success([], 'Email address verified successfully!');
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
