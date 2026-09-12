<?php
declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Product {
    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $p = $stmt->fetch();
        if ($p) {
            $p['gallery'] = json_decode($p['gallery'], true) ?: [];
            $p['variants'] = json_decode($p['variants'], true) ?: [];
            $p['specs'] = json_decode($p['specs'], true) ?: [];
            $p['price'] = (float)$p['price'];
            $p['originalPrice'] = (float)$p['original_price'];
            $p['discountPercent'] = (int)$p['discount_percent'];
            $p['rating'] = (float)$p['rating'];
            $p['reviewsCount'] = (int)$p['reviews_count'];
            $p['isBestSeller'] = (bool)$p['is_bestseller'];
            $p['isFeatured'] = (bool)$p['is_featured'];
            $p['inStock'] = (bool)$p['in_stock'];
            $p['categoryLabel'] = $p['category_label'];
            $p['subCategory'] = $p['sub_category'];
        }
        return $p ?: null;
    }

    public static function getFiltered(array $params = []): array {
        $db = Database::getConnection();
        $query = 'SELECT * FROM products WHERE 1=1';
        $binds = [];

        if (!empty($params['category']) && $params['category'] !== 'all') {
            $query .= ' AND (category_slug = :category_slug OR LOWER(sub_category) = LOWER(:category_sub))';
            $binds['category_slug'] = $params['category'];
            $binds['category_sub'] = $params['category'];
        }

        if (!empty($params['q'])) {
            $query .= ' AND (name LIKE :q OR brand LIKE :q OR category_label LIKE :q OR description LIKE :q)';
            $binds['q'] = '%' . $params['q'] . '%';
        }

        if (isset($params['max_price']) && is_numeric($params['max_price'])) {
            $query .= ' AND price <= :max_price';
            $binds['max_price'] = (float)$params['max_price'];
        }

        if (!empty($params['brands']) && is_array($params['brands'])) {
            $inClause = [];
            foreach ($params['brands'] as $idx => $b) {
                $k = "brand_" . $idx;
                $inClause[] = ":" . $k;
                $binds[$k] = $b;
            }
            $query .= ' AND brand IN (' . implode(',', $inClause) . ')';
        }

        if (isset($params['min_rating']) && is_numeric($params['min_rating']) && (float)$params['min_rating'] > 0) {
            $query .= ' AND rating >= :min_rating';
            $binds['min_rating'] = (float)$params['min_rating'];
        }

        // Sort
        $sort = $params['sort'] ?? 'popularity';
        if ($sort === 'price-low') {
            $query .= ' ORDER BY price ASC';
        } elseif ($sort === 'price-high') {
            $query .= ' ORDER BY price DESC';
        } elseif ($sort === 'rating') {
            $query .= ' ORDER BY rating DESC';
        } elseif ($sort === 'newest') {
            $query .= ' ORDER BY created_at DESC';
        } else {
            $query .= ' ORDER BY reviews_count DESC';
        }

        $stmt = $db->prepare($query);
        $stmt->execute($binds);
        $rows = $stmt->fetchAll();

        return array_map(function ($p) {
            $p['gallery'] = json_decode($p['gallery'], true) ?: [];
            $p['variants'] = json_decode($p['variants'], true) ?: [];
            $p['specs'] = json_decode($p['specs'], true) ?: [];
            $p['price'] = (float)$p['price'];
            $p['originalPrice'] = (float)$p['original_price'];
            $p['discountPercent'] = (int)$p['discount_percent'];
            $p['rating'] = (float)$p['rating'];
            $p['reviewsCount'] = (int)$p['reviews_count'];
            $p['isBestSeller'] = (bool)$p['is_bestseller'];
            $p['isFeatured'] = (bool)$p['is_featured'];
            $p['inStock'] = (bool)$p['in_stock'];
            $p['categoryLabel'] = $p['category_label'];
            $p['subCategory'] = $p['sub_category'];
            return $p;
        }, $rows);
    }

    public static function createOrUpdate(array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('
            INSERT INTO products (id, name, category_id, category_slug, category_label, sub_category, brand, price, original_price, discount_percent, rating, reviews_count, badge, is_bestseller, is_featured, in_stock, image, gallery, description, variants, specs)
            VALUES (:id, :name, :category_id, :category_slug, :category_label, :sub_category, :brand, :price, :original_price, :discount_percent, :rating, :reviews_count, :badge, :is_bestseller, :is_featured, :in_stock, :image, :gallery, :description, :variants, :specs)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name), category_id = VALUES(category_id), category_slug = VALUES(category_slug), category_label = VALUES(category_label),
                sub_category = VALUES(sub_category), brand = VALUES(brand), price = VALUES(price), original_price = VALUES(original_price),
                discount_percent = VALUES(discount_percent), rating = VALUES(rating), reviews_count = VALUES(reviews_count), badge = VALUES(badge),
                is_bestseller = VALUES(is_bestseller), is_featured = VALUES(is_featured), in_stock = VALUES(in_stock), image = VALUES(image),
                gallery = VALUES(gallery), description = VALUES(description), variants = VALUES(variants), specs = VALUES(specs)
        ');

        return $stmt->execute([
            'id' => $data['id'],
            'name' => $data['name'],
            'category_id' => $data['category_id'] ?? 1,
            'category_slug' => $data['category_slug'] ?? 'sofas',
            'category_label' => $data['category_label'] ?? 'Sofas & Recliners',
            'sub_category' => $data['sub_category'] ?? 'Sofas',
            'brand' => $data['brand'],
            'price' => $data['price'],
            'original_price' => $data['original_price'] ?? $data['price'],
            'discount_percent' => $data['discount_percent'] ?? 0,
            'rating' => $data['rating'] ?? 5.0,
            'reviews_count' => $data['reviews_count'] ?? 0,
            'badge' => $data['badge'] ?? null,
            'is_bestseller' => !empty($data['is_bestseller']) ? 1 : 0,
            'is_featured' => !empty($data['is_featured']) ? 1 : 0,
            'in_stock' => !empty($data['in_stock']) ? 1 : 0,
            'image' => $data['image'],
            'gallery' => json_encode($data['gallery'] ?? [$data['image']]),
            'description' => $data['description'],
            'variants' => json_encode($data['variants'] ?? []),
            'specs' => json_encode($data['specs'] ?? []),
        ]);
    }

    public static function delete(string $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare('DELETE FROM products WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}
