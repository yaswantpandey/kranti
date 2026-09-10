<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;

class Cart {
    public static function getDetailed(?int $userId, ?string $sessionId): array {
        $db = Database::getConnection();

        if ($userId) {
            $stmt = $db->prepare('
                SELECT c.id as cart_item_id, c.product_id, c.quantity, c.selected_size, c.selected_color, p.*
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = :user_id
            ');
            $stmt->execute(['user_id' => $userId]);
        } elseif ($sessionId) {
            $stmt = $db->prepare('
                SELECT c.id as cart_item_id, c.product_id, c.quantity, c.selected_size, c.selected_color, p.*
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                WHERE c.session_id = :session_id
            ');
            $stmt->execute(['session_id' => $sessionId]);
        } else {
            return [];
        }

        $items = $stmt->fetchAll();

        return array_map(function ($i) {
            $variants = json_decode($i['variants'], true) ?: [];
            return [
                'id' => $i['product_id'],
                'name' => $i['name'],
                'brand' => $i['brand'],
                'price' => (float)$i['price'],
                'originalPrice' => (float)$i['original_price'],
                'image' => $i['image'],
                'quantity' => (int)$i['quantity'],
                'selectedSize' => $i['selected_size'] ?: ($variants['sizes'][0] ?? ''),
                'selectedColor' => $i['selected_color'] ?: ($variants['colors'][0]['name'] ?? ''),
            ];
        }, $items);
    }

    public static function addItem(?int $userId, ?string $sessionId, string $productId, int $quantity = 1, ?string $selectedSize = null, ?string $selectedColor = null): bool {
        $db = Database::getConnection();

        // Check if item already exists
        $query = 'SELECT id, quantity FROM cart_items WHERE product_id = :product_id AND ';
        $query .= $userId ? 'user_id = :user_id' : 'session_id = :session_id';
        $stmt = $db->prepare($query);

        if ($userId) {
            $stmt->execute(['product_id' => $productId, 'user_id' => $userId]);
        } else {
            $stmt->execute(['product_id' => $productId, 'session_id' => $sessionId]);
        }

        $existing = $stmt->fetch();

        if ($existing) {
            $newQty = $existing['quantity'] + $quantity;
            $update = $db->prepare('UPDATE cart_items SET quantity = :qty, selected_size = COALESCE(:size, selected_size), selected_color = COALESCE(:color, selected_color) WHERE id = :id');
            return $update->execute(['qty' => $newQty, 'size' => $selectedSize, 'color' => $selectedColor, 'id' => $existing['id']]);
        } else {
            $insert = $db->prepare('
                INSERT INTO cart_items (user_id, session_id, product_id, quantity, selected_size, selected_color)
                VALUES (:user_id, :session_id, :product_id, :quantity, :selected_size, :selected_color)
            ');
            return $insert->execute([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'selected_size' => $selectedSize,
                'selected_color' => $selectedColor
            ]);
        }
    }

    public static function updateQuantity(?int $userId, ?string $sessionId, string $productId, int $quantity): bool {
        if ($quantity <= 0) {
            return self::removeItem($userId, $sessionId, $productId);
        }

        $db = Database::getConnection();
        $query = 'UPDATE cart_items SET quantity = :quantity WHERE product_id = :product_id AND ';
        $query .= $userId ? 'user_id = :user_id' : 'session_id = :session_id';
        $stmt = $db->prepare($query);

        if ($userId) {
            return $stmt->execute(['quantity' => $quantity, 'product_id' => $productId, 'user_id' => $userId]);
        } else {
            return $stmt->execute(['quantity' => $quantity, 'product_id' => $productId, 'session_id' => $sessionId]);
        }
    }

    public static function removeItem(?int $userId, ?string $sessionId, string $productId): bool {
        $db = Database::getConnection();
        $query = 'DELETE FROM cart_items WHERE product_id = :product_id AND ';
        $query .= $userId ? 'user_id = :user_id' : 'session_id = :session_id';
        $stmt = $db->prepare($query);

        if ($userId) {
            return $stmt->execute(['product_id' => $productId, 'user_id' => $userId]);
        } else {
            return $stmt->execute(['product_id' => $productId, 'session_id' => $sessionId]);
        }
    }

    public static function clear(?int $userId, ?string $sessionId): bool {
        $db = Database::getConnection();
        $query = 'DELETE FROM cart_items WHERE ';
        $query .= $userId ? 'user_id = :user_id' : 'session_id = :session_id';
        $stmt = $db->prepare($query);

        if ($userId) {
            return $stmt->execute(['user_id' => $userId]);
        } else {
            return $stmt->execute(['session_id' => $sessionId]);
        }
    }
}
