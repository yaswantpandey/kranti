<?php
/**
 * Kranti DB Connection Test
 * Run: php test_connection.php
 * Or visit: http://localhost/kranti/backend/test_connection.php (WAMP)
 */
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';

use App\Config\Database;

echo "=== Kranti Database Connection Test ===\n\n";

try {
    $pdo = Database::getConnection();
    echo "[OK] Connected to MySQL successfully.\n";

    // Check DB name
    $stmt = $pdo->query("SELECT DATABASE() AS db");
    $row = $stmt->fetch();
    echo "[OK] Using database: {$row['db']}\n\n";

    // Count records in key tables
    $tables = ['users', 'categories', 'products', 'coupons', 'orders'];
    echo "--- Table Row Counts ---\n";
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) AS cnt FROM `$table`");
        $count = $stmt->fetch()['cnt'];
        echo "  {$table}: {$count} rows\n";
    }

    // Sample product
    echo "\n--- Sample Product ---\n";
    $stmt = $pdo->query("SELECT id, name, brand, category_label FROM products LIMIT 1");
    $product = $stmt->fetch();
    if ($product) {
        echo "  ID:       {$product['id']}\n";
        echo "  Name:     {$product['name']}\n";
        echo "  Brand:    {$product['brand']}\n";
        echo "  Category: {$product['category_label']}\n";
    }

    // Sample user (no password output)
    echo "\n--- Sample User ---\n";
    $stmt = $pdo->query("SELECT id, first_name, last_name, email, role FROM users LIMIT 1");
    $user = $stmt->fetch();
    if ($user) {
        echo "  ID:    {$user['id']}\n";
        echo "  Name:  {$user['first_name']} {$user['last_name']}\n";
        echo "  Email: {$user['email']}\n";
        echo "  Role:  {$user['role']}\n";
    }

    echo "\n[ALL CHECKS PASSED] Database is connected and seeded correctly.\n";

} catch (\PDOException $e) {
    echo "[FAIL] Connection Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "  1. Make sure WAMP/MySQL is running (start wampmysqld64 service)\n";
    echo "  2. Verify .env has: DB_HOST=127.0.0.1, DB_DATABASE=kranti, DB_USERNAME=root\n";
    echo "  3. Import schema: mysql -u root kranti < database/schema.sql\n";
    echo "  4. Import seed:   mysql -u root kranti < database/seed.sql\n";
    exit(1);
}
