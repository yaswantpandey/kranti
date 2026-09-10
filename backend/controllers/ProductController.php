<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Category;
use App\Models\Product;

class ProductController {
    public static function index(array $queryParams): void {
        $category = $queryParams['category'] ?? 'all';
        $q = $queryParams['q'] ?? '';
        $maxPrice = isset($queryParams['maxPrice']) ? (float)$queryParams['maxPrice'] : null;
        $brands = isset($queryParams['brands']) ? explode(',', $queryParams['brands']) : [];
        $minRating = isset($queryParams['minRating']) ? (float)$queryParams['minRating'] : null;
        $sort = $queryParams['sort'] ?? 'popularity';

        $products = Product::getFiltered([
            'category' => $category,
            'q' => $q,
            'max_price' => $maxPrice,
            'brands' => $brands,
            'min_rating' => $minRating,
            'sort' => $sort,
        ]);

        Response::success([
            'products' => $products,
            'total' => count($products),
        ], 'Product catalog retrieved successfully.');
    }

    public static function show(array $params): void {
        $id = $params['id'] ?? '';
        if (empty($id)) {
            Response::error('Product ID is required.', 400);
        }

        $product = Product::findById($id);
        if (!$product) {
            // Fallback to first product if requested ID not found to match frontend UX
            $all = Product::getFiltered([]);
            $product = $all[0] ?? null;
        }

        if (!$product) {
            Response::notFound('Product not found.');
        }

        Response::success(['product' => $product], 'Product details retrieved.');
    }

    public static function categories(): void {
        $categories = Category::getAll();
        Response::success(['categories' => $categories], 'Product categories retrieved.');
    }
}
