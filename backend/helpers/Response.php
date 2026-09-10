<?php
declare(strict_types=1);

namespace App\Helpers;

class Response {
    public static function json(mixed $data = [], int $statusCode = 200, string $message = 'Operation completed successfully'): void {
        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
        }

        $isSuccess = $statusCode >= 200 && $statusCode < 300;

        $response = [
            'success' => $isSuccess,
            'message' => $message,
        ];

        if ($isSuccess) {
            $response['data'] = $data;
        } else if (!empty($data)) {
            $response['errors'] = $data;
        }

        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(mixed $data = [], string $message = 'Success', int $statusCode = 200): void {
        self::json($data, $statusCode, $message);
    }

    public static function error(string $message = 'Error occurred', int $statusCode = 400, mixed $errors = []): void {
        self::json($errors, $statusCode, $message);
    }

    public static function validationError(array $errors, string $message = 'Validation failed'): void {
        self::json($errors, 422, $message);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::json([], 401, $message);
    }

    public static function forbidden(string $message = 'Forbidden access'): void {
        self::json([], 403, $message);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::json([], 404, $message);
    }

    public static function serverError(string $message = 'Internal server error'): void {
        self::json([], 500, $message);
    }
}
