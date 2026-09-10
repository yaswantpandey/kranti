<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class User {
    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT id, first_name, last_name, email, phone, role, is_active, is_verified, created_at, updated_at FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findByEmail(string $email): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => strtolower(trim($email))]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findByToken(string $token): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM users WHERE verification_token = :token OR reset_token = :token LIMIT 1');
        $stmt->execute(['token' => $token]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function create(array $data): int {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, is_verified, verification_token, verification_token_expires_at)
            VALUES (:first_name, :last_name, :email, :phone, :password_hash, :role, 1, 0, :verification_token, :verification_token_expires_at)
        ');

        $stmt->execute([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => strtolower(trim($data['email'])),
            'phone' => $data['phone'] ?? null,
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            'role' => $data['role'] ?? 'user',
            'verification_token' => $data['verification_token'] ?? null,
            'verification_token_expires_at' => $data['verification_token_expires_at'] ?? null,
        ]);

        return (int) $db->lastInsertId();
    }

    public static function updateProfile(int $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            UPDATE users
            SET first_name = :first_name, last_name = :last_name, phone = :phone, email = :email
            WHERE id = :id
        ');

        return $stmt->execute([
            'id' => $id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'],
            'email' => strtolower(trim($data['email'])),
        ]);
    }

    public static function updatePassword(int $id, string $newPassword): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET password_hash = :hash, reset_token = NULL, reset_token_expires_at = NULL WHERE id = :id');
        return $stmt->execute([
            'id' => $id,
            'hash' => password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12])
        ]);
    }

    public static function setResetToken(int $id, string $token, string $expiresAt): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET reset_token = :token, reset_token_expires_at = :expires WHERE id = :id');
        return $stmt->execute(['id' => $id, 'token' => $token, 'expires' => $expiresAt]);
    }

    public static function verifyEmail(string $token): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET is_verified = 1, verification_token = NULL, verification_token_expires_at = NULL WHERE verification_token = :token');
        return $stmt->execute(['token' => $token]);
    }

    public static function getAll(string $search = '', string $role = '', int $limit = 50, int $offset = 0): array {
        $db = Database::getConnection();
        $query = 'SELECT id, first_name, last_name, email, phone, role, is_active, is_verified, created_at FROM users WHERE 1=1';
        $params = [];

        if (!empty($search)) {
            $query .= ' AND (first_name LIKE :search OR last_name LIKE :search OR email LIKE :search OR phone LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        if (!empty($role)) {
            $query .= ' AND role = :role';
            $params['role'] = $role;
        }

        $query .= ' ORDER BY id DESC LIMIT :limit OFFSET :offset';
        $stmt = $db->prepare($query);

        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function updateRoleAndStatus(int $id, string $role, bool $isActive): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET role = :role, is_active = :is_active WHERE id = :id');
        return $stmt->execute(['id' => $id, 'role' => $role, 'is_active' => $isActive ? 1 : 0]);
    }
}
