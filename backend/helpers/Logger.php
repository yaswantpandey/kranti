<?php
declare(strict_types=1);

namespace App\Helpers;

use App\Models\AuditLog;

class Logger {
    private static string $logDir = __DIR__ . '/../logs';

    public static function log(string $level, string $message, array $context = []): void {
        if (!is_dir(self::$logDir)) {
            @mkdir(self::$logDir, 0755, true);
        }

        $timestamp = date('Y-m-d H:i:s');
        $logFile = self::$logDir . '/' . date('Y-m-d') . '.log';
        
        // Scrub sensitive keys from context before logging
        $scrubbedContext = self::scrubSensitiveData($context);
        $contextStr = !empty($scrubbedContext) ? ' | Context: ' . json_encode($scrubbedContext) : '';
        
        $entry = sprintf("[%s] [%s] %s%s\n", $timestamp, strtoupper($level), $message, $contextStr);
        @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
    }

    public static function audit(?int $userId, string $action, array $details = []): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        self::log('AUDIT', "Action: {$action} | User ID: " . ($userId ?? 'Guest'), $details);

        try {
            AuditLog::create($userId, $action, $ip, $userAgent, self::scrubSensitiveData($details));
        } catch (\Throwable $e) {
            self::log('ERROR', "Failed to write audit log to database: " . $e->getMessage());
        }
    }

    private static function scrubSensitiveData(array $data): array {
        $sensitiveKeys = ['password', 'password_hash', 'current_password', 'new_password', 'token', 'reset_token', 'card_number', 'cvv'];
        
        foreach ($data as $key => $val) {
            if (is_array($val)) {
                $data[$key] = self::scrubSensitiveData($val);
            } elseif (in_array(strtolower((string)$key), $sensitiveKeys, true)) {
                $data[$key] = '[REDACTED]';
            }
        }
        return $data;
    }
}
