<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;

class Coupon {
    public static function findByCode(string $code): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(:code) AND is_active = 1 LIMIT 1');
        $stmt->execute(['code' => trim($code)]);
        $c = $stmt->fetch();
        if ($c) {
            $c['value'] = (float)$c['value'];
            $c['min_order_amount'] = (float)$c['min_order_amount'];
        }
        return $c ?: null;
    }
}
