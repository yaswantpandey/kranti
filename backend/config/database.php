<?php
declare(strict_types=1);

namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = require __DIR__ . '/config.php';
            $dbConfig = $config['db'];

            // On Windows XAMPP/MariaDB, 'localhost' uses named pipe while '127.0.0.1' uses TCP.
            // Use 'localhost' to connect via the MySQL named pipe to avoid connection refusal.
            $host = $dbConfig['host'];
            if ($host === '127.0.0.1') {
                $host = 'localhost';
            }
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                $host,
                $dbConfig['database'],
                $dbConfig['charset']
            );

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$dbConfig['charset']} COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], $options);
            } catch (PDOException $e) {
                // Log connection failure without exposing credentials
                error_log("Database Connection Failed: " . $e->getMessage());
                throw new PDOException("Database connection error. Please verify configuration.", (int)$e->getCode());
            }
        }

        return self::$instance;
    }

    public static function reset(): void {
        self::$instance = null;
    }

    public static function beginTransaction(): bool {
        return self::getConnection()->beginTransaction();
    }

    public static function commit(): bool {
        return self::getConnection()->commit();
    }

    public static function rollBack(): bool {
        return self::getConnection()->rollBack();
    }
}
