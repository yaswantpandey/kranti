<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Order {
    public static function create(array $orderData, array $items): array {
        $db = Database::getConnection();
        Database::beginTransaction();

        try {
            $orderCode = 'KFE-' . rand(100000, 999999) . '-P';
            $now = date('Y-m-d H:i:s');
            $dateStr = date('M d, Y');
            $timeStr = date('h:i A');

            $stmt = $db->prepare('
                INSERT INTO orders (
                    order_code, user_id, status, status_step, estimated_delivery, delivery_option, payment_method,
                    shipping_full_name, shipping_phone, shipping_email, shipping_pincode, shipping_city, shipping_address,
                    subtotal, discount, delivery_fee, total
                ) VALUES (
                    :order_code, :user_id, :status, :status_step, :estimated_delivery, :delivery_option, :payment_method,
                    :shipping_full_name, :shipping_phone, :shipping_email, :shipping_pincode, :shipping_city, :shipping_address,
                    :subtotal, :discount, :delivery_fee, :total
                )
            ');

            $stmt->execute([
                'order_code' => $orderCode,
                'user_id' => $orderData['user_id'] ?? null,
                'status' => 'Order Placed',
                'status_step' => 1,
                'estimated_delivery' => 'Arriving in 2-3 Business Days',
                'delivery_option' => $orderData['delivery_option'] ?? 'Standard Free Delivery',
                'payment_method' => $orderData['payment_method'] ?? 'UPI / Google Pay',
                'shipping_full_name' => $orderData['shipping']['fullName'],
                'shipping_phone' => $orderData['shipping']['phone'],
                'shipping_email' => $orderData['shipping']['email'] ?? null,
                'shipping_pincode' => $orderData['shipping']['pincode'],
                'shipping_city' => $orderData['shipping']['city'] ?? 'Prayagraj',
                'shipping_address' => $orderData['shipping']['address'],
                'subtotal' => $orderData['totals']['subtotal'],
                'discount' => $orderData['totals']['discount'] ?? 0.00,
                'delivery_fee' => $orderData['totals']['deliveryFee'] ?? 0.00,
                'total' => $orderData['totals']['total'],
            ]);

            $orderId = (int) $db->lastInsertId();

            // Insert Line Items
            $itemStmt = $db->prepare('
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, selected_size, selected_color, image)
                VALUES (:order_id, :product_id, :product_name, :price, :quantity, :selected_size, :selected_color, :image)
            ');

            foreach ($items as $item) {
                $itemStmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'selected_size' => $item['selectedSize'] ?? null,
                    'selected_color' => $item['selectedColor'] ?? null,
                    'image' => $item['image'],
                ]);
            }

            // Insert Timeline Events
            $timelineStmt = $db->prepare('
                INSERT INTO order_timelines (order_id, title, description, event_time, is_completed)
                VALUES (:order_id, :title, :description, :event_time, :is_completed)
            ');

            $defaultTimeline = [
                ['title' => 'Order Placed', 'desc' => 'Order received and payment confirmed.', 'time' => "{$dateStr}, {$timeStr}", 'completed' => 1],
                ['title' => 'Confirmed', 'desc' => 'Awaiting showroom manager verification.', 'time' => 'Expected shortly', 'completed' => 0],
                ['title' => 'Shipped', 'desc' => 'Package will depart from Prayagraj central hub.', 'time' => 'Pending', 'completed' => 0],
                ['title' => 'Out for Delivery', 'desc' => 'Executive will contact for delivery slot.', 'time' => 'Pending', 'completed' => 0],
                ['title' => 'Delivered', 'desc' => 'Free doorstep setup and installation.', 'time' => 'Pending', 'completed' => 0],
            ];

            foreach ($defaultTimeline as $evt) {
                $timelineStmt->execute([
                    'order_id' => $orderId,
                    'title' => $evt['title'],
                    'description' => $evt['desc'],
                    'event_time' => $evt['time'],
                    'is_completed' => $evt['completed'],
                ]);
            }

            Database::commit();

            return self::getByCode($orderCode);
        } catch (\Throwable $e) {
            Database::rollBack();
            throw $e;
        }
    }

    public static function getByCode(string $code): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM orders WHERE LOWER(order_code) = LOWER(:code) LIMIT 1');
        $stmt->execute(['code' => trim($code)]);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        return self::formatOrderDetails($order);
    }

    public static function getByUserId(int $userId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM orders WHERE user_id = :user_id ORDER BY id DESC');
        $stmt->execute(['user_id' => $userId]);
        $orders = $stmt->fetchAll();

        return array_map([self::class, 'formatOrderDetails'], $orders);
    }

    public static function getAll(int $limit = 50, int $offset = 0): array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM orders ORDER BY id DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll();

        return array_map([self::class, 'formatOrderDetails'], $orders);
    }

    public static function updateStatus(int $orderId, string $status, int $statusStep): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE orders SET status = :status, status_step = :step WHERE id = :id');
        return $stmt->execute(['id' => $orderId, 'status' => $status, 'step' => $statusStep]);
    }

    private static function formatOrderDetails(array $order): array {
        $db = Database::getConnection();

        // Fetch Items
        $itemStmt = $db->prepare('SELECT product_id as productId, product_name as name, price, quantity, selected_size as selectedSize, selected_color as selectedColor, image FROM order_items WHERE order_id = :order_id');
        $itemStmt->execute(['order_id' => $order['id']]);
        $items = $itemStmt->fetchAll();

        // Fetch Timelines
        $tStmt = $db->prepare('SELECT title, description as desc, event_time as time, is_completed as completed FROM order_timelines WHERE order_id = :order_id ORDER BY id ASC');
        $tStmt->execute(['order_id' => $order['id']]);
        $timeline = $tStmt->fetchAll();

        return [
            'id' => (int)$order['id'],
            'orderId' => $order['order_code'],
            'date' => date('M d, Y', strtotime($order['created_at'])),
            'status' => $order['status'],
            'statusStep' => (int)$order['status_step'],
            'estimatedDelivery' => $order['estimated_delivery'],
            'deliveryOption' => $order['delivery_option'],
            'paymentMethod' => $order['payment_method'],
            'deliveryAddress' => [
                'fullName' => $order['shipping_full_name'],
                'phone' => $order['shipping_phone'],
                'email' => $order['shipping_email'],
                'pincode' => $order['shipping_pincode'],
                'city' => $order['shipping_city'],
                'address' => $order['shipping_address']
            ],
            'items' => array_map(function($i) {
                $i['price'] = (float)$i['price'];
                $i['quantity'] = (int)$i['quantity'];
                return $i;
            }, $items),
            'timeline' => array_map(function($t) {
                $t['completed'] = (bool)$t['completed'];
                return $t;
            }, $timeline),
            'subtotal' => (float)$order['subtotal'],
            'discount' => (float)$order['discount'],
            'deliveryFee' => (float)$order['delivery_fee'],
            'total' => (float)$order['total']
        ];
    }
}
