<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class AuditLog {
    public static function create(?int $userId, string $action, string $ip, string $userAgent, array $details = []): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details)
            VALUES (:user_id, :action, :ip_address, :user_agent, :details)
        ');

        return $stmt->execute([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $ip,
            'user_agent' => substr($userAgent, 0, 500),
            'details' => json_encode($details),
        ]);
    }

    public static function getAll(int $limit = 50, int $offset = 0): array {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            SELECT a.*, u.email as user_email
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.id DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $logs = $stmt->fetchAll();

        return array_map(function ($l) {
            $l['details'] = json_decode($l['details'] ?? '[]', true) ?: [];
            return $l;
        }, $logs);
    }
}
