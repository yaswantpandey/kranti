<?php
/**
 * Fix Seed Data - Updates seeded user passwords to valid bcrypt hashes
 * Run: php backend/scripts/fix_seed_passwords.php
 */

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

$db = \App\Config\Database::getConnection();

$hash = password_hash('kranti123', PASSWORD_BCRYPT, ['cost' => 12]);
echo "Generated hash: $hash\n";

// Verify hash before applying
if (!password_verify('kranti123', $hash)) {
    echo "ERROR: Hash verification failed!\n";
    exit(1);
}

$stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE email IN ('ramesh.kumar@example.com', 'admin@krantifurnitures.com')");
$stmt->execute([$hash]);
echo "Updated {$stmt->rowCount()} user(s) password hash.\n";

// Verify
$check = $db->query("SELECT email, password_hash FROM users WHERE email IN ('ramesh.kumar@example.com', 'admin@krantifurnitures.com')")->fetchAll();
foreach ($check as $row) {
    $ok = password_verify('kranti123', $row['password_hash']) ? '✓' : '❌';
    echo "  $ok {$row['email']} - hash correct: " . (password_verify('kranti123', $row['password_hash']) ? 'YES' : 'NO') . "\n";
}

echo "Done.\n";
