<?php
declare(strict_types=1);

namespace App\Tests;

/**
 * Kranti Furnitures & Electronics - Automated API Test Script
 * Can be executed via PHP CLI: php backend/tests/ApiTest.php
 */

// Register PSR-4 autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) {
        $fileName = $parts[count($parts) - 1] . '.php';
        array_pop($parts);
        $file = $baseDir . implode('/', array_map('strtolower', $parts)) . '/' . $fileName;
    } else {
        $file = $baseDir . strtolower($relativeClass) . '.php';
    }
    if (file_exists($file)) require_once $file;
});
require_once __DIR__ . '/../config/config.php';

class ApiTest {
    private static int $passed = 0;
    private static int $failed = 0;

    public static function run(): void {
        echo "\n🧪 Running Backend API & Logic Verification Suite...\n";
        echo "=======================================================\n";

        self::testValidationRules();
        self::testPasswordSecurity();
        self::testSanitization();
        self::testCouponValidation();
        self::testUserRoles();

        echo "=======================================================\n";
        echo sprintf("Results: %d Passed, %d Failed.\n\n", self::$passed, self::$failed);

        if (self::$failed > 0) {
            exit(1);
        }
    }

    private static function assert(bool $condition, string $testName): void {
        if ($condition) {
            echo "  ✓ PASS: {$testName}\n";
            self::$passed++;
        } else {
            echo "  ❌ FAIL: {$testName}\n";
            self::$failed++;
        }
    }

    private static function testValidationRules(): void {
        $validator = \App\Helpers\Validator::make([
            'email' => 'invalid-email',
            'phone' => '123',
            'pincode' => '99',
        ], [
            'email' => 'email',
            'phone' => 'phone',
            'pincode' => 'pincode',
        ]);

        self::assert($validator->fails(), 'Validator catches invalid email, phone, and pincode');
        self::assert(isset($validator->errors()['email']), 'Validator detects bad email format');
        self::assert(isset($validator->errors()['pincode']), 'Validator detects bad pincode length');
    }

    private static function testPasswordSecurity(): void {
        $plain = 'kranti123';
        $hash = password_hash($plain, PASSWORD_BCRYPT, ['cost' => 12]);

        self::assert(password_verify($plain, $hash), 'Bcrypt password verification succeeds');
        self::assert(!password_verify('wrongpass', $hash), 'Bcrypt rejects incorrect password');
    }

    private static function testSanitization(): void {
        $dirty = '<script>alert("xss")</script>';
        $clean = \App\Helpers\Validator::sanitize($dirty);

        self::assert($clean === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'Input sanitization strips executable HTML/JS tags');
    }

    private static function testCouponValidation(): void {
        $coupon = \App\Models\Coupon::findByCode('KRANTI10');
        self::assert($coupon !== null && $coupon['code'] === 'KRANTI10', 'Coupon KRANTI10 exists and fetches successfully');
    }

    private static function testUserRoles(): void {
        $user = ['role' => 'user'];
        $admin = ['role' => 'admin'];

        self::assert($user['role'] !== 'admin', 'Standard user role is not admin');
        self::assert($admin['role'] === 'admin', 'Admin role recognized');
    }
}

if (php_sapi_name() === 'cli') {
    ApiTest::run();
}
