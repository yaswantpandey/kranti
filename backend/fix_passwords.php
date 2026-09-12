<?php
declare(strict_types=1);
require_once __DIR__ . '/config/database.php';
use App\Config\Database;

$pdo = Database::getConnection();

$hash = password_hash('kranti123', PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id IN (1, 2)");
$stmt->execute([$hash]);

echo "Updated " . $stmt->rowCount() . " user(s).\n";
echo "New hash starts with: " . substr($hash, 0, 7) . "...\n\n";

// Verify stored hash works
$stmt = $pdo->query("SELECT id, email, role, password_hash FROM users WHERE id <= 2");
foreach ($stmt->fetchAll() as $u) {
    $valid = password_verify('kranti123', $u['password_hash']) ? 'PASS' : 'FAIL';
    echo "  [{$u['id']}] {$u['email']} ({$u['role']}) => verify: $valid\n";
}
