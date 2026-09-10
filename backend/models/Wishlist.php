<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;

class Wishlist {
    public static function getDetailed(int $userId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT p.* FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = :user_id
            ORDER BY w.id DESC
        ');
        $stmt->execute(['user_id' => $userId]);
        $rows = $stmt->fetchAll();

        return array_map(function ($p) {
            $p['gallery'] = json_decode($p['gallery'], true) ?: [];
            $p['variants'] = json_decode($p['variants'], true) ?: [];
            $p['specs'] = json_decode($p['specs'], true) ?: [];
            $p['price'] = (float)$p['price'];
            $p['originalPrice'] = (float)$p['original_price'];
            $p['discountPercent'] = (int)$p['discount_percent'];
            $p['rating'] = (float)$p['rating'];
            $p['reviewsCount'] = (int)$p['reviews_count'];
            $p['isBestSeller'] = (bool)$p['is_bestseller'];
            $p['isFeatured'] = (bool)$p['is_featured'];
            $p['inStock'] = (bool)$p['in_stock'];
            $p['categoryLabel'] = $p['category_label'];
            $p['subCategory'] = $p['sub_category'];
            return $p;
        }, $rows);
    }

    public static function toggle(int $userId, string $productId): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT id FROM wishlists WHERE user_id = :user_id AND product_id = :product_id LIMIT 1');
        $stmt->execute(['user_id' => $userId, 'product_id' => $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $delete = $db->prepare('DELETE FROM wishlists WHERE id = :id');
            $delete->execute(['id' => $existing['id']]);
            return false; // Removed
        } else {
            $insert = $db->prepare('INSERT INTO wishlists (user_id, product_id) VALUES (:user_id, :product_id)');
            $insert->execute(['user_id' => $userId, 'product_id' => $productId]);
            return true; // Added
        }
    }
}
