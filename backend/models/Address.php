<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;

class Address {
    public static function getByUserId(int $userId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT id, type, full_name as fullName, phone, pincode, city, state, address_line as addressLine, is_default as isDefault FROM user_addresses WHERE user_id = :user_id ORDER BY is_default DESC, id DESC');
        $stmt->execute(['user_id' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(function($r) {
            $r['isDefault'] = (bool)$r['isDefault'];
            return $r;
        }, $rows);
    }

    public static function create(int $userId, array $data): string {
        $db = Database::getConnection();
        $id = 'addr_' . time() . '_' . rand(100, 999);

        if (!empty($data['isDefault'])) {
            $clearStmt = $db->prepare('UPDATE user_addresses SET is_default = 0 WHERE user_id = :user_id');
            $clearStmt->execute(['user_id' => $userId]);
        }

        $stmt = $db->prepare('
            INSERT INTO user_addresses (id, user_id, type, full_name, phone, pincode, city, state, address_line, is_default)
            VALUES (:id, :user_id, :type, :full_name, :phone, :pincode, :city, :state, :address_line, :is_default)
        ');

        $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'type' => $data['type'] ?? 'Home',
            'full_name' => $data['fullName'],
            'phone' => $data['phone'],
            'pincode' => $data['pincode'],
            'city' => $data['city'] ?? 'Prayagraj',
            'state' => $data['state'] ?? 'Uttar Pradesh',
            'address_line' => $data['addressLine'],
            'is_default' => !empty($data['isDefault']) ? 1 : 0
        ]);

        return $id;
    }

    public static function delete(int $userId, string $addressId): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('DELETE FROM user_addresses WHERE id = :id AND user_id = :user_id');
        return $stmt->execute(['id' => $addressId, 'user_id' => $userId]);
    }
}
