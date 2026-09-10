<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Logger;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AdminMiddleware;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\FileUploadService;

class AdminController {
    public static function users(array $queryParams): void {
        $admin = AdminMiddleware::handle();

        $search = $queryParams['search'] ?? '';
        $role = $queryParams['role'] ?? '';
        $page = (int)($queryParams['page'] ?? 1);
        $limit = (int)($queryParams['limit'] ?? 50);
        $offset = max(0, ($page - 1) * $limit);

        $users = User::getAll($search, $role, $limit, $offset);
        Response::success(['users' => $users], 'User directory retrieved.');
    }

    public static function updateUserRole(array $params, array $body): void {
        $admin = AdminMiddleware::handle();
        $userId = (int)($params['id'] ?? 0);

        if ($userId <= 0) {
            Response::error('User ID is required.', 400);
        }

        $validator = Validator::make($body, [
            'role' => 'required',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $role = $body['role'];
        if (!in_array($role, ['user', 'admin'], true)) {
            Response::error('Role must be either "user" or "admin".', 400);
        }

        $isActive = isset($body['is_active']) ? (bool)$body['is_active'] : true;

        User::updateRoleAndStatus($userId, $role, $isActive);
        Logger::audit((int)$admin['id'], 'ADMIN_UPDATED_USER', ['targetUserId' => $userId, 'role' => $role, 'isActive' => $isActive]);

        Response::success([], 'User permissions updated successfully.');
    }

    public static function saveProduct(array $body): void {
        $admin = AdminMiddleware::handle();

        $validator = Validator::make($body, [
            'id' => 'required',
            'name' => 'required|min:3',
            'brand' => 'required',
            'price' => 'required|numeric',
            'image' => 'required',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        Product::createOrUpdate($body);
        Logger::audit((int)$admin['id'], 'ADMIN_SAVED_PRODUCT', ['productId' => $body['id']]);

        Response::success([], 'Product saved successfully.');
    }

    public static function deleteProduct(array $params): void {
        $admin = AdminMiddleware::handle();
        $id = $params['id'] ?? '';

        if (empty($id)) {
            Response::error('Product ID is required.', 400);
        }

        Product::delete($id);
        Logger::audit((int)$admin['id'], 'ADMIN_DELETED_PRODUCT', ['productId' => $id]);

        Response::success([], 'Product deleted from catalog.');
    }

    public static function orders(array $queryParams): void {
        $admin = AdminMiddleware::handle();
        $page = (int)($queryParams['page'] ?? 1);
        $limit = (int)($queryParams['limit'] ?? 50);
        $offset = max(0, ($page - 1) * $limit);

        $orders = Order::getAll($limit, $offset);
        Response::success(['orders' => $orders], 'All showroom orders.');
    }

    public static function updateOrderStatus(array $params, array $body): void {
        $admin = AdminMiddleware::handle();
        $orderId = (int)($params['id'] ?? 0);

        if ($orderId <= 0) {
            Response::error('Order ID is required.', 400);
        }

        $status = $body['status'] ?? 'Order Placed';
        $step = (int)($body['status_step'] ?? 1);

        Order::updateStatus($orderId, $status, $step);
        Logger::audit((int)$admin['id'], 'ADMIN_UPDATED_ORDER', ['orderId' => $orderId, 'status' => $status, 'step' => $step]);

        Response::success([], "Order #{$orderId} status updated to {$status}.");
    }

    public static function auditLogs(array $queryParams): void {
        $admin = AdminMiddleware::handle();
        $page = (int)($queryParams['page'] ?? 1);
        $limit = (int)($queryParams['limit'] ?? 50);
        $offset = max(0, ($page - 1) * $limit);

        $logs = AuditLog::getAll($limit, $offset);
        Response::success(['logs' => $logs], 'Security audit logs.');
    }

    public static function uploadImage(): void {
        $admin = AdminMiddleware::handle();

        if (empty($_FILES['image'])) {
            Response::error('Please attach an image file under the key "image".', 400);
        }

        try {
            $url = FileUploadService::upload($_FILES['image']);
            Logger::audit((int)$admin['id'], 'ADMIN_UPLOADED_IMAGE', ['url' => $url]);
            Response::success(['url' => $url], 'Image uploaded successfully.');
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 400);
        } catch (\Throwable $e) {
            Response::error('Upload failed: ' . $e->getMessage(), 500);
        }
    }
}
