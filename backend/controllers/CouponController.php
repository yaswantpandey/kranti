<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Coupon;

class CouponController {
    public static function apply(array $body): void {
        $code = trim($body['code'] ?? '');
        if (empty($code)) {
            Response::error('Coupon code is required.', 400);
        }

        $coupon = Coupon::findByCode($code);
        if (!$coupon) {
            Response::error('Invalid coupon code. Try KRANTI10, FESTIVE15, or WELCOME500.', 400);
        }

        if ($coupon['expires_at'] && strtotime($coupon['expires_at']) < time()) {
            Response::error('This coupon voucher has expired.', 400);
        }

        Response::success([
            'coupon' => [
                'code' => $coupon['code'],
                'type' => $coupon['type'],
                'value' => $coupon['value'],
                'label' => $coupon['label'],
            ]
        ], "Coupon applied: {$coupon['label']}");
    }
}
