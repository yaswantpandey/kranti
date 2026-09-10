<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Logger;
use App\Helpers\Response;
use App\Helpers\Session;
use App\Helpers\Validator;
use App\Models\Cart;
use App\Models\Order;

class OrderController {
    public static function create(array $body): void {
        Session::start();
        $userId = Session::get('user_id') ? (int)Session::get('user_id') : null;
        $sessionId = session_id();

        $cartItems = Cart::getDetailed($userId, $sessionId);
        if (empty($cartItems)) {
            Response::error('Your cart is empty. Please add products before checkout.', 400);
        }

        $validator = Validator::make($body['shipping'] ?? [], [
            'fullName' => 'required|min:2',
            'phone' => 'required|phone',
            'pincode' => 'required|pincode',
            'address' => 'required|min:10',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Calculate backend verified totals
        $subtotal = array_reduce($cartItems, fn($sum, $i) => $sum + ($i['price'] * $i['quantity']), 0.0);
        $deliveryFee = $subtotal > 1000 ? 0.0 : 499.0;
        $discount = (float)($body['discount'] ?? 0.0);
        $total = max(0.0, $subtotal - $discount + $deliveryFee);

        $orderData = [
            'user_id' => $userId,
            'delivery_option' => $body['deliveryOption'] ?? 'Standard Free Delivery',
            'payment_method' => $body['paymentMethod'] ?? 'UPI / Google Pay',
            'shipping' => $body['shipping'],
            'totals' => [
                'subtotal' => $subtotal,
                'discount' => $discount,
                'deliveryFee' => $deliveryFee,
                'total' => $total,
            ]
        ];

        try {
            $newOrder = Order::create($orderData, $cartItems);

            // Clear Cart after successful checkout
            Cart::clear($userId, $sessionId);

            Logger::audit($userId, 'ORDER_CREATED', ['orderCode' => $newOrder['orderId'], 'total' => $total]);

            Response::success(['order' => $newOrder], "Order #{$newOrder['orderId']} confirmed successfully!", 201);
        } catch (\Throwable $e) {
            Logger::log('ERROR', 'Order placement failed: ' . $e->getMessage());
            Response::error('Order placement failed: ' . $e->getMessage(), 500);
        }
    }

    public static function index(): void {
        Session::start();
        $userId = Session::get('user_id');

        if (!$userId) {
            Response::success(['orders' => []], 'Guest user order list.');
        }

        $orders = Order::getByUserId((int)$userId);
        Response::success(['orders' => $orders], 'User order history.');
    }

    public static function show(array $params): void {
        $orderId = $params['orderId'] ?? '';
        if (empty($orderId)) {
            Response::error('Order ID is required.', 400);
        }

        $order = Order::getByCode($orderId);
        if (!$order) {
            Response::notFound('Order not found.');
        }

        Response::success(['order' => $order], 'Order details & milestone timeline.');
    }
}
