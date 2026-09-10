<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\Wishlist;

class WishlistController {
    public static function index(): void {
        $user = AuthMiddleware::handle();
        $items = Wishlist::getDetailed((int)$user['id']);
        Response::success(['wishlist' => $items], 'User saved wishlist.');
    }

    public static function toggle(array $body): void {
        $user = AuthMiddleware::handle();
        $productId = $body['productId'] ?? '';

        if (empty($productId)) {
            Response::error('Product ID is required.', 400);
        }

        $added = Wishlist::toggle((int)$user['id'], $productId);
        $items = Wishlist::getDetailed((int)$user['id']);

        $msg = $added ? 'Added to wishlist' : 'Removed from wishlist';
        Response::success(['added' => $added, 'wishlist' => $items], $msg);
    }
}
