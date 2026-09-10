-- ============================================================================
-- Kranti Furnitures & Electronics - Initial Seed Data
-- ============================================================================

USE `kranti`;

-- ----------------------------------------------------------------------------
-- 1. Initial Users (Default Admin: admin@krantifurnitures.com / admin123, User: ramesh.kumar@example.com / kranti123)
-- Password for both in this seed is 'kranti123' hashed with bcrypt cost 12
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `role`, `is_active`, `is_verified`) VALUES
(1, 'Ramesh', 'Kumar', 'ramesh.kumar@example.com', '+91 98765 43210', '$2y$12$zP8e/sZ8L9F6G5H4I3J2KO1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z.', 'user', 1, 1),
(2, 'Showroom', 'Admin', 'admin@krantifurnitures.com', '+91 98765 00000', '$2y$12$zP8e/sZ8L9F6G5H4I3J2KO1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z.', 'admin', 1, 1);

-- ----------------------------------------------------------------------------
-- 2. Categories
-- ----------------------------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`) VALUES
(1, 'Sofas & Recliners', 'sofas', 'Plush velvet sofas, ergonomic sectionals and motorized recliners', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg'),
(2, 'Televisions & Electronics', 'electronics', '4K QLED, OLED & Ultra HD Smart TVs from Samsung, Sony, LG', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZesYvQZKFG-3HUzGm4ui3VRJYGdDvtg5FcHTvhK4El1kGNCijRqYqlcrlEL9NzU5Nw982LbLERIhJCw9QytRsqYAEQiEL3EAj9PIR9qxxT-Xz1igO6nU5Ydqv-5NczcgJwRpP-lloJ5P_NhCNL9p1j8Rz0Q8SDT9T1fcdOrOwvma_uskucqN_GupKouBOulfJKl2PV6o18hUrllg04l97DgpZv1gS_cQQ6alwCMXbuAspamGKJXu7'),
(3, 'Beds & Storage', 'beds', 'Solid sheesham wood king & queen beds with hydraulic storage', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-RVXoMka_gdeatFXDqL4kISTTI4-OgJdNSHsHFUv_qwix3DsK3vn8OfDki2fS3VQF-f8umW0lIpg02Z0Ntfob5w8xF7s7dyJ6WeomlzbiNovoBTLYGtkMw9E2-h1HHO1TyQqPFv1ZaD-XH0TyuhR8wbYXxrU3wvmJ1BXB1Blm7g0CAT_zc6msGxvU_hAksPN-Mr88hHm8UHPsgeeHWCE1ulfGuWDmCYoSzxNZiDErPQvFwNhCooR6'),
(4, 'Refrigerators & Appliances', 'appliances', 'Double door frost-free inverter refrigerators & home appliances', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqPz6V7kHCK7ODMtEnSxAupw6UhEPl__M4LX6UnArR0Lt81-Km3ABNWoa8QnB0obFF3UOlKGY7U-0Osz1OF8z18PRu8EY0m1N-vkpxIpaGG2AhXXDj1gLPE9pSKbLYcTBfbox-F1e9ZyFNLIEemvQGcAvZhYiyNteRG8HXHEewbD6e_z0GVbQUug3Drm9biB9AxY-9-7oH_ivnbKzsyEb9TyVpgchxGkFmNNpXs4zbf84MrEZTlhyg'),
(5, 'Dining Sets & Chairs', 'dining', 'Contemporary 6-seater teakwood dining sets & ergonomic chairs', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD'),
(6, 'Recliners & Armchairs', 'recliners', 'Motorized leatherette recliners with USB charging ports', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFTiNu-briRs9EiZMk2uFGDvQJ63_odxZVa942oJ1Nj00iBw0U5A9K9ms3wmOa8sBgMu01e-9oit_JN9T5rD_11fVNQACXA5Jo0o0940Tbe5eIalxCotXB-an_2_cyogAuL08YqnU40PriLRe5gcY5TubqaTwhzcmb2HxnxeRE_Wa_rm2c9-CLyaoGUCWLbkTtglXopoucybAqMUCxO-yVvFLZKNYyb5lpnGxNZRw1IQgXWAeWr33P');

-- ----------------------------------------------------------------------------
-- 3. Products
-- ----------------------------------------------------------------------------
INSERT INTO `products` (`id`, `name`, `category_id`, `category_slug`, `category_label`, `sub_category`, `brand`, `price`, `original_price`, `discount_percent`, `rating`, `reviews_count`, `badge`, `is_bestseller`, `is_featured`, `in_stock`, `image`, `gallery`, `description`, `variants`, `specs`) VALUES
('loring-3-seater-sofa', 'Loring 3-Seater Velvet Sofa', 1, 'sofas', 'Sofas & Recliners', 'Sofas', 'Urban Living', 34999.00, 41175.00, 15, 4.80, 128, '15% OFF', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg", "https://lh3.googleusercontent.com/aida-public/AB6AXuC6AlQf8l0htq7cHBA8cW81kJJF-m-KUrHjqpXKQUFP3psDxxY3g4twEj8Ul82vGhvQSinKi1Sbr7cJ3g_9X5XnXFt3y-n14MzBqmo_t5C-LyADX8CPcg0r8vsHl5CJO07N794n_GZGujnD1VM6anBOIDA5uWui0bzoQVZ9TuppoeU_g8-ESKl4jAR5LI7pOamEYgPFj08rr3Wwt_wygmpfTlfpOgz3ep8XKXCAA8nvYn8twLWu8A-C"]',
'Crafted with premium high-density velvet fabric and solid sheesham wood frame. Features ergonomic dual-cushioning for unmatched lounge comfort and an elegant modern silhouette that elevates any living room.',
'{"sizes": ["3-Seater (84\\" W)", "2-Seater (62\\" W)", "Sectional L-Shape"], "colors": [{"name": "Deep Navy Velvet", "hex": "#002045"}, {"name": "Stone Grey", "hex": "#78716c"}, {"name": "Warm Amber", "hex": "#c6955e"}]}',
'{"Primary Material": "High-Density Velvet & Kiln-Dried Solid Hardwood", "Filling Material": "32-Density Super Soft PU Foam + Pocket Springs", "Seating Capacity": "3 Persons", "Dimensions": "34 H x 84 W x 36 D Inches", "Warranty": "5-Year Manufacturer Warranty on Frame"}'),

('samsung-65-qled-4k-tv', 'Samsung 65" Class QLED 4K Q60C Series Smart TV', 2, 'electronics', 'Televisions', 'Televisions', 'Samsung', 84990.00, 114900.00, 26, 4.60, 1284, 'Best Seller', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuCZesYvQZKFG-3HUzGm4ui3VRJYGdDvtg5FcHTvhK4El1kGNCijRqYqlcrlEL9NzU5Nw982LbLERIhJCw9QytRsqYAEQiEL3EAj9PIR9qxxT-Xz1igO6nU5Ydqv-5NczcgJwRpP-lloJ5P_NhCNL9p1j8Rz0Q8SDT9T1fcdOrOwvma_uskucqN_GupKouBOulfJKl2PV6o18hUrllg04l97DgpZv1gS_cQQ6alwCMXbuAspamGKJXu7',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuCZesYvQZKFG-3HUzGm4ui3VRJYGdDvtg5FcHTvhK4El1kGNCijRqYqlcrlEL9NzU5Nw982LbLERIhJCw9QytRsqYAEQiEL3EAj9PIR9qxxT-Xz1igO6nU5Ydqv-5NczcgJwRpP-lloJ5P_NhCNL9p1j8Rz0Q8SDT9T1fcdOrOwvma_uskucqN_GupKouBOulfJKl2PV6o18hUrllg04l97DgpZv1gS_cQQ6alwCMXbuAspamGKJXu7", "https://lh3.googleusercontent.com/aida-public/AB6AXuAHubKN70dN9tBq9b05i335im7ksiMKHHaqrLMGTHFTermQCnGkYGYfjbXXqL6uhSj-Ne8O9Bh4qH4Ux54wXNF2LpqL5aLVLuV081D7vGLIZcCPbiLoGCORN241S7eOaEZft-01OtleW4Vo8KHVaSS9y1R36_Og4hPYlCjNonoFkmWsdODOFgICiEbSKMmgicRp3NNNbB8CmIfsgEb1Wmhxg-z8_8LBtft2CAKXen15gzO3UhDpx3ya"]',
'Experience Quantum Dot technology with 100% Color Volume. Dual LED backlighting provides balanced contrast. Ultra-slim AirSlim design blends seamlessly into any room.',
'{"sizes": ["55 Inch", "65 Inch", "75 Inch"], "colors": [{"name": "Titan Gray Metallic", "hex": "#374151"}, {"name": "Obsidian Black", "hex": "#111827"}]}',
'{"Display Resolution": "4K Ultra HD (3840 x 2160)", "Refresh Rate": "60 Hz", "Audio Output": "20W 2.0Ch with OTS Lite", "Connectivity": "3 HDMI, 2 USB, Bluetooth 5.2, Wi-Fi 5", "Warranty": "1-Year Comprehensive + 1-Year Panel"}'),

('sony-bravia-65-oled-tv', 'Sony Bravia 65" 4K Ultra HD Smart OLED TV', 2, 'electronics', 'Televisions', 'Televisions', 'Sony', 145990.00, 189900.00, 23, 4.90, 842, 'Premium Flagship', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj"]',
'Cognitive Processor XR delivers deep OLED blacks and purest highlights. Acoustic Surface Audio+ turns the screen itself into a multi-channel speaker with theater-grade clarity.',
'{"sizes": ["55 Inch", "65 Inch"], "colors": [{"name": "Titanium Metal Edge", "hex": "#1e293b"}]}',
'{"Display Technology": "Self-illuminating OLED", "Processor": "Cognitive Processor XR", "Sound": "50W Acoustic Surface Audio+", "Warranty": "2-Year Manufacturer Warranty"}'),

('royal-plush-recliner-armchair', 'Royal Plush Motorized Leatherette Recliner', 6, 'recliners', 'Sofas & Recliners', 'Recliners', 'ComfortPlus', 24500.00, 32000.00, 23, 4.80, 165, 'Top Rated', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuAFTiNu-briRs9EiZMk2uFGDvQJ63_odxZVa942oJ1Nj00iBw0U5A9K9ms3wmOa8sBgMu01e-9oit_JN9T5rD_11fVNQACXA5Jo0o0940Tbe5eIalxCotXB-an_2_cyogAuL08YqnU40PriLRe5gcY5TubqaTwhzcmb2HxnxeRE_Wa_rm2c9-CLyaoGUCWLbkTtglXopoucybAqMUCxO-yVvFLZKNYyb5lpnGxNZRw1IQgXWAeWr33P',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuAFTiNu-briRs9EiZMk2uFGDvQJ63_odxZVa942oJ1Nj00iBw0U5A9K9ms3wmOa8sBgMu01e-9oit_JN9T5rD_11fVNQACXA5Jo0o0940Tbe5eIalxCotXB-an_2_cyogAuL08YqnU40PriLRe5gcY5TubqaTwhzcmb2HxnxeRE_Wa_rm2c9-CLyaoGUCWLbkTtglXopoucybAqMUCxO-yVvFLZKNYyb5lpnGxNZRw1IQgXWAeWr33P"]',
'One-touch motorized power reclining with integrated USB fast-charging port, deep cup holders, and high-resilience ergonomic lumbar support.',
'{"sizes": ["1-Seater Single Recliner"], "colors": [{"name": "Espresso Brown", "hex": "#382216"}, {"name": "Cream Ivory", "hex": "#f5f5f4"}]}',
'{"Reclining Mechanism": "German Motorized Mechanism (160° Recline)", "Cover Material": "Anti-Peel Leatherette", "Warranty": "3-Year Warranty on Mechanism"}'),

('luxury-sheesham-king-bed', 'Heritage Solid Sheesham Wood King Bed with Storage', 3, 'beds', 'Beds', 'Beds', 'Luxe Home', 42999.00, 58000.00, 25, 4.90, 204, 'Solid Wood', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuD-RVXoMka_gdeatFXDqL4kISTTI4-OgJdNSHsHFUv_qwix3DsK3vn8OfDki2fS3VQF-f8umW0lIpg02Z0Ntfob5w8xF7s7dyJ6WeomlzbiNovoBTLYGtkMw9E2-h1HHO1TyQqPFv1ZaD-XH0TyuhR8wbYXxrU3wvmJ1BXB1Blm7g0CAT_zc6msGxvU_hAksPN-Mr88hHm8UHPsgeeHWCE1ulfGuWDmCYoSzxNZiDErPQvFwNhCooR6',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuD-RVXoMka_gdeatFXDqL4kISTTI4-OgJdNSHsHFUv_qwix3DsK3vn8OfDki2fS3VQF-f8umW0lIpg02Z0Ntfob5w8xF7s7dyJ6WeomlzbiNovoBTLYGtkMw9E2-h1HHO1TyQqPFv1ZaD-XH0TyuhR8wbYXxrU3wvmJ1BXB1Blm7g0CAT_zc6msGxvU_hAksPN-Mr88hHm8UHPsgeeHWCE1ulfGuWDmCYoSzxNZiDErPQvFwNhCooR6"]',
'Grand master bedroom king bed handcrafted from 100% solid Sheesham wood with hydraulic lift-on storage compartments and cushioned tufted headboard.',
'{"sizes": ["King Size (78\\" x 72\\")", "Queen Size (78\\" x 60\\")"], "colors": [{"name": "Rich Honey Finish", "hex": "#78350f"}, {"name": "Teak Brown", "hex": "#451a03"}]}',
'{"Wood": "100% Seasoned Sheesham Wood", "Storage": "Hydraulic Easy-Lift Storage System (1200L Capacity)", "Warranty": "10-Year Termite & Structural Warranty"}'),

('frost-free-double-door-fridge', 'Frost-Free Double Door Smart Inverter Refrigerator (340L)', 4, 'appliances', 'Refrigerators', 'Refrigerators', 'Samsung', 32490.00, 42990.00, 24, 4.70, 450, '5-Star Inverter', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuCqPz6V7kHCK7ODMtEnSxAupw6UhEPl__M4LX6UnArR0Lt81-Km3ABNWoa8QnB0obFF3UOlKGY7U-0Osz1OF8z18PRu8EY0m1N-vkpxIpaGG2AhXXDj1gLPE9pSKbLYcTBfbox-F1e9ZyFNLIEemvQGcAvZhYiyNteRG8HXHEewbD6e_z0GVbQUug3Drm9biB9AxY-9-7oH_ivnbKzsyEb9TyVpgchxGkFmNNpXs4zbf84MrEZTlhyg',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuCqPz6V7kHCK7ODMtEnSxAupw6UhEPl__M4LX6UnArR0Lt81-Km3ABNWoa8QnB0obFF3UOlKGY7U-0Osz1OF8z18PRu8EY0m1N-vkpxIpaGG2AhXXDj1gLPE9pSKbLYcTBfbox-F1e9ZyFNLIEemvQGcAvZhYiyNteRG8HXHEewbD6e_z0GVbQUug3Drm9biB9AxY-9-7oH_ivnbKzsyEb9TyVpgchxGkFmNNpXs4zbf84MrEZTlhyg"]',
'Digital Inverter Technology for 50% energy savings and ultra-quiet operation. Features convertible 5-in-1 modes and deodorizing filter.',
'{"sizes": ["340 Liters", "420 Liters"], "colors": [{"name": "Refined Inox Stainless Steel", "hex": "#94a3b8"}, {"name": "Black Mirror Glass", "hex": "#18181b"}]}',
'{"Capacity": "340 Liters", "Energy Rating": "5 Star BEE Rating", "Compressor": "Digital Inverter with 20-Year Warranty"}'),

('modern-teakwood-dining-set', 'Modern Teakwood 6-Seater Dining Table Set', 5, 'dining', 'Dining', 'Dining Sets', 'Luxe Home', 48999.00, 65000.00, 24, 4.80, 118, 'Complete Set', 1, 1, 1,
'https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD',
'["https://lh3.googleusercontent.com/aida-public/AB6AXuAGio1KjVNFqT1dH36SyV9twr-gzAja39lS0TqkheeSeGyl0Tin_Euzre-qZB1v0HJqrQdOdJS5eNhX-RUO9LSJv16vmNtSySsG9QFp9fJ7ql5LiBwaAWO_hgOyHogrl4DoeySpqYRIgGIZgKK82lfx-4Axtr4GAPKeGPUDWMmKbiAp4x_p0WAF6gBo61X5rB5UliqN-SAJEKL5qir8kswxSSBSd2JatGwwSHyR8VKy-As57lZU2rgD"]',
'Contemporary 6-seater dining table with tempered bevel-edge top and six solid cushioned teakwood chairs. Built for family feasts.',
'{"sizes": ["6-Seater Table (60\\" x 36\\")", "8-Seater Table (84\\" x 42\\")"], "colors": [{"name": "Warm Honey Teak", "hex": "#b45309"}]}',
'{"Set Includes": "1 Dining Table + 6 Chairs", "Wood": "100% Grade-A Kiln-Dried Teakwood", "Warranty": "5-Year Manufacturer Warranty"}');

-- ----------------------------------------------------------------------------
-- 4. User Addresses
-- ----------------------------------------------------------------------------
INSERT INTO `user_addresses` (`id`, `user_id`, `type`, `full_name`, `phone`, `pincode`, `city`, `state`, `address_line`, `is_default`) VALUES
('addr_1', 1, 'Home (Default)', 'Ramesh Kumar', '+91 98765 43210', '211001', 'Prayagraj', 'Uttar Pradesh', '123 Civil Lines, Near High Court, Prayagraj, UP 211001', 1),
('addr_2', 1, 'Office', 'Ramesh Kumar', '+91 98765 43210', '211002', 'Prayagraj', 'Uttar Pradesh', 'Suite 4B, Kranti Commercial Complex, MG Marg, Prayagraj, UP 211002', 0);

-- ----------------------------------------------------------------------------
-- 5. Coupons
-- ----------------------------------------------------------------------------
INSERT INTO `coupons` (`code`, `type`, `value`, `label`, `min_order_amount`, `is_active`) VALUES
('KRANTI10', 'percent', 10.00, '10% Festive Discount', 1000.00, 1),
('WELCOME500', 'flat', 500.00, '₹500 Welcome Voucher', 2500.00, 1),
('FESTIVE15', 'percent', 15.00, '15% Showroom Special', 5000.00, 1);

-- ----------------------------------------------------------------------------
-- 6. Sample Order
-- ----------------------------------------------------------------------------
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `status`, `status_step`, `estimated_delivery`, `delivery_option`, `payment_method`, `shipping_full_name`, `shipping_phone`, `shipping_email`, `shipping_pincode`, `shipping_city`, `shipping_address`, `subtotal`, `discount`, `delivery_fee`, `total`) VALUES
(1, 'KFE-849204-B', 1, 'Out for Delivery', 4, 'Tomorrow, by 9:00 PM', 'Standard Delivery', 'UPI / Online Payment', 'Ramesh Kumar', '+91 98765 43210', 'ramesh.kumar@example.com', '211001', 'Prayagraj', '123 Civil Lines, Near High Court, Prayagraj, UP 211001', 164490.00, 0.00, 0.00, 164490.00);

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `selected_size`, `selected_color`, `image`) VALUES
(1, 'sony-bravia-65-oled-tv', 'Sony Bravia 65" 4K Ultra HD Smart OLED TV', 145990.00, 1, '65 Inch', 'Titanium Metal Edge', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj'),
(1, 'urban-comfort-2-seater-sofa', 'Urban Comfort 2-Seater Fabric Sofa', 18500.00, 1, '2-Seater (58" W)', 'Stone Grey', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSkAIDRNZVKdpnifYFTJ6BwbG0BuFjwIA1MBjS_MwrYUfE_NQ4nFFNpcXWLFgTef_b4RlQ4Smxc9QbSeGBg0SDIw4ClpoVCaTBsVouWgo_iq9_a9E9s42R6G5TtYSoTpZOEx0kpNbdXnjrnGVp2m9hWf0wFRs3lNNgqCczt7-6D0-LlnulW2biwE56PcLvyOxLH8DLDryx3AxhFLhqzUEFFcFN_r5Qeh2261Alnfnmdn-cYYj1ErOv');

INSERT INTO `order_timelines` (`order_id`, `title`, `description`, `event_time`, `is_completed`) VALUES
(1, 'Out for Delivery', 'Your item is out for delivery. Our delivery executive will contact you shortly.', 'Oct 14, 2024, 08:30 AM', 1),
(1, 'Reached local hub', 'Package arrived at Prayagraj distribution center.', 'Oct 13, 2024, 11:45 PM', 1),
(1, 'Shipped', 'Package has left the main warehouse.', 'Oct 13, 2024, 02:15 PM', 1),
(1, 'Confirmed', 'Order verified by Kranti digital showroom team.', 'Oct 12, 2024, 04:20 PM', 1),
(1, 'Order Placed', 'Order received and payment confirmed.', 'Oct 12, 2024, 03:45 PM', 1);

-- ----------------------------------------------------------------------------
-- 7. Wishlists
-- ----------------------------------------------------------------------------
INSERT INTO `wishlists` (`user_id`, `product_id`) VALUES
(1, 'samsung-65-qled-4k-tv'),
(1, 'royal-plush-recliner-armchair');
