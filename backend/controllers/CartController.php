<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Session;
use App\Models\Cart;

class CartController {
    private static function getUserOrSession(): array {
        Session::start();
        $userId = Session::get('user_id');
        $sessionId = session_id();
        return [$userId ? (int)$userId : null, $sessionId];
    }

    public static function index(): void {
        [$userId, $sessionId] = self::getUserOrSession();
        $items = Cart::getDetailed($userId, $sessionId);
        Response::success(['cart' => $items], 'Shopping cart contents.');
    }

    public static function addItem(array $body): void {
        [$userId, $sessionId] = self::getUserOrSession();

        $productId = $body['productId'] ?? '';
        $quantity = (int)($body['quantity'] ?? 1);
        $size = $body['selectedSize'] ?? null;
        $color = $body['selectedColor'] ?? null;

        if (empty($productId)) {
            Response::error('Product ID is required.', 400);
        }

        Cart::addItem($userId, $sessionId, $productId, $quantity, $size, $color);
        $items = Cart::getDetailed($userId, $sessionId);

        Response::success(['cart' => $items], 'Item added to cart successfully.');
    }

    public static function updateQuantity(array $body): void {
        [$userId, $sessionId] = self::getUserOrSession();

        $productId = $body['productId'] ?? '';
        $quantity = (int)($body['quantity'] ?? 1);

        if (empty($productId)) {
            Response::error('Product ID is required.', 400);
        }

        Cart::updateQuantity($userId, $sessionId, $productId, $quantity);
        $items = Cart::getDetailed($userId, $sessionId);

        Response::success(['cart' => $items], 'Cart quantity updated.');
    }

    public static function removeItem(array $params): void {
        [$userId, $sessionId] = self::getUserOrSession();
        $productId = $params['id'] ?? '';

        if (empty($productId)) {
            Response::error('Product ID is required.', 400);
        }

        Cart::removeItem($userId, $sessionId, $productId);
        $items = Cart::getDetailed($userId, $sessionId);

        Response::success(['cart' => $items], 'Item removed from cart.');
    }

    public static function clear(): void {
        [$userId, $sessionId] = self::getUserOrSession();
        Cart::clear($userId, $sessionId);
        Response::success(['cart' => []], 'Cart cleared.');
    }
}
