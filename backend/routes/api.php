<?php
declare(strict_types=1);

namespace App\Routes;

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\CartController;
use App\Controllers\CouponController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\UserController;
use App\Helpers\Response;
use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;

class Router {
    private static function parseRequest(): array {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        
        // Strip base path prefix if hosted in a subdirectory
        $baseDir = dirname($_SERVER['SCRIPT_NAME'] ?? '');
        if ($baseDir !== '/' && str_starts_with($uri, $baseDir)) {
            $uri = substr($uri, strlen($baseDir));
        }
        
        $uri = '/' . trim($uri, '/');
        
        // Read JSON input body for POST/PUT/PATCH requests
        $input = file_get_contents('php://input');
        $body = !empty($input) ? (json_decode($input, true) ?: []) : [];
        $body = array_merge($_POST, $body);

        return [$method, $uri, $_GET, $body];
    }

    public static function dispatch(): void {
        CorsMiddleware::handle();
        [$method, $uri, $queryParams, $body] = self::parseRequest();

        // --------------------------------------------------
        // Auth Routes
        // --------------------------------------------------
        if ($method === 'POST' && $uri === '/api/auth/register') {
            RateLimitMiddleware::handle(10, 60);
            AuthController::register($body);
        }
        if ($method === 'POST' && $uri === '/api/auth/login') {
            RateLimitMiddleware::handle(5, 60);
            AuthController::login($body);
        }
        if ($method === 'POST' && $uri === '/api/auth/logout') {
            AuthController::logout();
        }
        if ($method === 'GET' && $uri === '/api/auth/me') {
            AuthController::me();
        }
        if ($method === 'POST' && $uri === '/api/auth/forgot-password') {
            RateLimitMiddleware::handle(5, 60);
            AuthController::forgotPassword($body);
        }
        if ($method === 'POST' && $uri === '/api/auth/reset-password') {
            AuthController::resetPassword($body);
        }
        if ($method === 'GET' && $uri === '/api/auth/verify-email') {
            AuthController::verifyEmail($queryParams);
        }

        // --------------------------------------------------
        // User Profile & Address Routes
        // --------------------------------------------------
        if ($method === 'PUT' && $uri === '/api/user/profile') {
            UserController::updateProfile($body);
        }
        if ($method === 'PUT' && $uri === '/api/user/password') {
            UserController::changePassword($body);
        }
        if ($method === 'GET' && $uri === '/api/user/addresses') {
            UserController::getAddresses();
        }
        if ($method === 'POST' && $uri === '/api/user/addresses') {
            UserController::addAddress($body);
        }
        if ($method === 'DELETE' && preg_match('#^/api/user/addresses/([^/]+)$#', $uri, $m)) {
            UserController::deleteAddress(['id' => $m[1]]);
        }

        // --------------------------------------------------
        // Product Catalog Routes
        // --------------------------------------------------
        if ($method === 'GET' && $uri === '/api/products') {
            ProductController::index($queryParams);
        }
        if ($method === 'GET' && $uri === '/api/categories') {
            ProductController::categories();
        }
        if ($method === 'GET' && preg_match('#^/api/products/([^/]+)$#', $uri, $m)) {
            ProductController::show(['id' => $m[1]]);
        }

        // --------------------------------------------------
        // Cart Routes
        // --------------------------------------------------
        if ($method === 'GET' && $uri === '/api/cart') {
            CartController::index();
        }
        if ($method === 'POST' && $uri === '/api/cart/items') {
            CartController::addItem($body);
        }
        if ($method === 'PUT' && $uri === '/api/cart/items') {
            CartController::updateQuantity($body);
        }
        if ($method === 'DELETE' && preg_match('#^/api/cart/items/([^/]+)$#', $uri, $m)) {
            CartController::removeItem(['id' => $m[1]]);
        }
        if ($method === 'DELETE' && $uri === '/api/cart') {
            CartController::clear();
        }

        // --------------------------------------------------
        // Coupon Routes
        // --------------------------------------------------
        if ($method === 'POST' && $uri === '/api/coupons/apply') {
            CouponController::apply($body);
        }

        // --------------------------------------------------
        // Order Routes
        // --------------------------------------------------
        if ($method === 'POST' && $uri === '/api/checkout') {
            OrderController::create($body);
        }
        if ($method === 'GET' && $uri === '/api/orders') {
            OrderController::index();
        }
        if ($method === 'GET' && preg_match('#^/api/orders/([^/]+)$#', $uri, $m)) {
            OrderController::show(['orderId' => $m[1]]);
        }

        // --------------------------------------------------
        // Wishlist Routes
        // --------------------------------------------------
        if ($method === 'GET' && $uri === '/api/wishlist') {
            \App\Controllers\WishlistController::index();
        }
        if ($method === 'POST' && $uri === '/api/wishlist/toggle') {
            \App\Controllers\WishlistController::toggle($body);
        }

        // --------------------------------------------------
        // Admin Routes
        // --------------------------------------------------
        if ($method === 'GET' && $uri === '/api/admin/users') {
            AdminController::users($queryParams);
        }
        if ($method === 'PUT' && preg_match('#^/api/admin/users/(\d+)/role$#', $uri, $m)) {
            AdminController::updateUserRole(['id' => (int)$m[1]], $body);
        }
        if ($method === 'POST' && $uri === '/api/admin/products') {
            AdminController::saveProduct($body);
        }
        if ($method === 'DELETE' && preg_match('#^/api/admin/products/([^/]+)$#', $uri, $m)) {
            AdminController::deleteProduct(['id' => $m[1]]);
        }
        if ($method === 'GET' && $uri === '/api/admin/orders') {
            AdminController::orders($queryParams);
        }
        if ($method === 'PUT' && preg_match('#^/api/admin/orders/(\d+)/status$#', $uri, $m)) {
            AdminController::updateOrderStatus(['id' => (int)$m[1]], $body);
        }
        if ($method === 'GET' && $uri === '/api/admin/audit-logs') {
            AdminController::auditLogs($queryParams);
        }
        if ($method === 'POST' && $uri === '/api/admin/upload') {
            AdminController::uploadImage();
        }

        // Route Not Found
        Response::notFound("Endpoint {$method} {$uri} not found.");
    }
}
