<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;

class Category {
    public static function getAll(): array {
        $db = Database::getConnection();
        $stmt = $db->query('SELECT * FROM categories ORDER BY id ASC');
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM categories WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $res = $stmt->fetch();
        return $res ?: null;
    }
}
