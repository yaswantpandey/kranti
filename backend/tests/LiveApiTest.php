<?php
/**
 * Kranti Furnitures & Electronics - Comprehensive Live API Test Runner
 * Tests all major features via real HTTP requests against the running server.
 * Run: php backend/tests/LiveApiTest.php
 */

define('API_BASE', 'http://localhost:8000');
$cookieFile = tempnam(sys_get_temp_dir(), 'kranti_test_cookie_');
$passed = 0;
$failed = 0;

function request(string $method, string $path, array $data = [], bool $useCookie = true): array {
    global $cookieFile;
    $url = API_BASE . $path;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_TIMEOUT => 10,
        CURLOPT_COOKIEJAR => $cookieFile,
        CURLOPT_COOKIEFILE => $cookieFile,
    ]);
    if (!empty($data)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $body = curl_exec($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $decoded = json_decode($body, true) ?? [];
    return ['status' => $statusCode, 'body' => $decoded, 'raw' => $body];
}

function pass(string $test): void {
    global $passed;
    echo "  ✓ PASS: $test\n";
    $passed++;
}

function fail(string $test, string $detail = ''): void {
    global $failed;
    echo "  ❌ FAIL: $test" . ($detail ? " | $detail" : '') . "\n";
    $failed++;
}

function check(bool $condition, string $test, string $detail = ''): void {
    if ($condition) pass($test);
    else fail($test, $detail);
}

echo "\n🔬 Kranti Digital Showroom - Live API Test Suite\n";
echo "==================================================\n";

// ============================================================
// 1. Product Catalog
// ============================================================
echo "\n📦 1. Product Catalog API\n";

$r = request('GET', '/api/products');
check($r['status'] === 200, 'GET /api/products returns 200');
check(isset($r['body']['data']['products']) && count($r['body']['data']['products']) >= 7, 'Catalog returns 7+ products with seed data', 'got ' . count($r['body']['data']['products'] ?? []));
check(isset($r['body']['data']['total']) && $r['body']['data']['total'] >= 7, 'Catalog total count >= 7');

$r = request('GET', '/api/products?category=sofas');
check($r['status'] === 200, 'GET /api/products?category=sofas filters correctly');

$r = request('GET', '/api/products?q=sofa');
check($r['status'] === 200 && count($r['body']['data']['products'] ?? []) > 0, 'Search by keyword "sofa" returns results');

$r = request('GET', '/api/products?sort=price-low');
check($r['status'] === 200, 'GET /api/products?sort=price-low returns 200');

$r = request('GET', '/api/products/loring-3-seater-sofa');
check($r['status'] === 200 && isset($r['body']['data']['product']['id']), 'GET /api/products/{id} returns product detail');
check(isset($r['body']['data']['product']['gallery']), 'Product detail includes gallery array');
check(isset($r['body']['data']['product']['variants']), 'Product detail includes variants');
check(isset($r['body']['data']['product']['specs']), 'Product detail includes specs');

$r = request('GET', '/api/categories');
check($r['status'] === 200 && count($r['body']['data']['categories'] ?? []) >= 6, 'GET /api/categories returns 6+ categories');

// ============================================================
// 2. Coupon Validation
// ============================================================
echo "\n🏷️  2. Coupon API\n";

$r = request('POST', '/api/coupons/apply', ['code' => 'KRANTI10']);
check($r['status'] === 200 && $r['body']['data']['coupon']['code'] === 'KRANTI10', 'Coupon KRANTI10 validates correctly');

$r = request('POST', '/api/coupons/apply', ['code' => 'FESTIVE15']);
check($r['status'] === 200 && $r['body']['data']['coupon']['type'] === 'percent', 'Coupon FESTIVE15 is percentage type');

$r = request('POST', '/api/coupons/apply', ['code' => 'WELCOME500']);
check($r['status'] === 200 && $r['body']['data']['coupon']['type'] === 'flat', 'Coupon WELCOME500 is flat discount type');

$r = request('POST', '/api/coupons/apply', ['code' => 'INVALID_CODE_XYZ']);
check($r['status'] === 400, 'Invalid coupon code returns 400');

// ============================================================
// 3. Auth - Registration
// ============================================================
echo "\n🔐 3. Authentication API\n";

$uniqueEmail = 'testuser_' . time() . '@krantidemo.com';
$r = request('POST', '/api/auth/register', [
    'first_name' => 'Test',
    'last_name'  => 'User',
    'email'      => $uniqueEmail,
    'password'   => 'testpass123',
    'phone'      => '9876543210',
]);
check($r['status'] === 201, 'POST /api/auth/register creates account (201)', $r['body']['message'] ?? '');
check(isset($r['body']['data']['user']['email']), 'Register response includes user email');
check(!isset($r['body']['data']['user']['password_hash']), 'Password hash not exposed in register response');

// Duplicate email should fail
$r2 = request('POST', '/api/auth/register', [
    'first_name' => 'Dup',
    'last_name'  => 'User',
    'email'      => $uniqueEmail,
    'password'   => 'testpass123',
]);
check($r2['status'] === 409, 'Duplicate email registration returns 409 Conflict');

// ============================================================
// 4. Auth - Login
// ============================================================
// Fresh login - session cookie stored automatically in $cookieFile
$loginResult = request('POST', '/api/auth/login', [
    'email'    => 'ramesh.kumar@example.com',
    'password' => 'kranti123',
]);
check($loginResult['status'] === 200, 'POST /api/auth/login with seeded customer succeeds');
check(isset($loginResult['body']['data']['user']['email']), 'Login response includes user email');
check(!isset($loginResult['body']['data']['user']['password_hash']), 'Password hash not exposed in login response');

$r = request('POST', '/api/auth/login', [
    'email'    => 'ramesh.kumar@example.com',
    'password' => 'wrongpassword',
]);
check($r['status'] === 401, 'Wrong password returns 401 Unauthorized');

// ============================================================
// 5. Auth - Get Current User (/me) - uses session cookie
// ============================================================
// Login fresh to get a session cookie in cookie jar
request('POST', '/api/auth/login', [
    'email'    => 'ramesh.kumar@example.com',
    'password' => 'kranti123',
]);

$r = request('GET', '/api/auth/me');
check($r['status'] === 200 && isset($r['body']['data']['user']), 'GET /api/auth/me returns authenticated user');

// ============================================================
// 6. Cart API
// ============================================================
echo "\n🛒 6. Cart API\n";

$r = request('POST', '/api/cart/items', [
    'productId'     => 'loring-3-seater-sofa',
    'quantity'      => 2,
    'selectedColor' => 'Beige',
]);
check($r['status'] === 200 && count($r['body']['data']['cart']) > 0, 'Add item to cart succeeds');

$r = request('GET', '/api/cart');
check($r['status'] === 200, 'GET /api/cart returns 200');
check(count($r['body']['data']['cart'] ?? []) > 0, 'Cart has items after add');

$r = request('PUT', '/api/cart/items', [
    'productId' => 'loring-3-seater-sofa',
    'quantity'  => 3,
]);
check($r['status'] === 200, 'PUT /api/cart/items updates quantity');

$r = request('DELETE', '/api/cart/items/loring-3-seater-sofa');
check($r['status'] === 200, 'DELETE /api/cart/items/{id} removes item');

// ============================================================
// 7. Checkout & Order Tracking
// ============================================================
echo "\n📝 7. Checkout & Order Tracking\n";

// Add item before checkout (user is logged in — session is active)
request('POST', '/api/cart/items', [
    'productId' => 'samsung-65-qled-4k-tv',
    'quantity'  => 1,
]);

// Also add sofa
request('POST', '/api/cart/items', [
    'productId' => 'loring-3-seater-sofa',
    'quantity'  => 1,
]);

$r = request('POST', '/api/checkout', [
    'shipping' => [
        'fullName' => 'Ramesh Kumar',
        'phone'    => '9876543210',
        'email'    => 'ramesh.kumar@example.com',
        'pincode'  => '211001',
        'city'     => 'Prayagraj',
        'address'  => 'House 45, Civil Lines, Prayagraj, UP',
    ],
    'paymentMethod'  => 'UPI / Google Pay',
    'deliveryOption' => 'Standard Free Delivery',
]);
check($r['status'] === 201, 'POST /api/checkout creates order (201)');
$orderCode = $r['body']['data']['order']['orderId'] ?? null;
check(!empty($orderCode) && str_starts_with($orderCode, 'KFE-'), 'Order code follows KFE-XXXXXX-P format: ' . ($orderCode ?? 'null'));
check(isset($r['body']['data']['order']['timeline']) && count($r['body']['data']['order']['timeline']) === 5, 'Order includes 5-step delivery timeline');
check($r['body']['data']['order']['statusStep'] === 1, 'Order starts at status step 1 (Order Placed)');
check(isset($r['body']['data']['order']['items']), 'Order contains line items');

// Cart should be empty now
$cartCheck = request('GET', '/api/cart');
check(count($cartCheck['body']['data']['cart'] ?? []) === 0, 'Cart is cleared after successful checkout');

// Fetch order by code
if ($orderCode) {
    $r = request('GET', '/api/orders/' . $orderCode);
    check($r['status'] === 200 && $r['body']['data']['order']['orderId'] === $orderCode, "GET /api/orders/$orderCode returns order detail");
}

// User order history
$r = request('GET', '/api/orders');
check($r['status'] === 200 && isset($r['body']['data']['orders']), 'GET /api/orders returns user order history');

// ============================================================
// 8. Wishlist API
// ============================================================
echo "\n❤️  8. Wishlist API\n";

$r = request('POST', '/api/wishlist/toggle', ['productId' => 'loring-3-seater-sofa']);
check($r['status'] === 200 && $r['body']['data']['added'] === true, 'POST /api/wishlist/toggle adds product to wishlist');

$r = request('GET', '/api/wishlist');
check($r['status'] === 200 && count($r['body']['data']['wishlist'] ?? []) > 0, 'GET /api/wishlist returns saved items');

$r = request('POST', '/api/wishlist/toggle', ['productId' => 'loring-3-seater-sofa']);
check($r['status'] === 200 && $r['body']['data']['added'] === false, 'POST /api/wishlist/toggle removes product from wishlist (toggle)');

// ============================================================
// 9. User Profile & Addresses
// ============================================================
echo "\n👤 9. User Profile & Address API\n";

$r = request('PUT', '/api/user/profile', [
    'first_name' => 'Ramesh',
    'last_name'  => 'Kumar',
    'email'      => 'ramesh.kumar@example.com',
    'phone'      => '9812345670',
]);
check($r['status'] === 200 && isset($r['body']['data']['user']), 'PUT /api/user/profile updates profile', $r['body']['message'] ?? json_encode($r['body']));

$r = request('POST', '/api/user/addresses', [
    'fullName'    => 'Ramesh Kumar',
    'phone'       => '9876543210',
    'pincode'     => '211001',
    'city'        => 'Prayagraj',
    'state'       => 'Uttar Pradesh',
    'addressLine' => 'House 45, Civil Lines, Prayagraj UP',
    'type'        => 'Home',
    'isDefault'   => true,
]);
check($r['status'] === 201, 'POST /api/user/addresses creates new address');
$addrId = $r['body']['data']['id'] ?? null;

$r = request('GET', '/api/user/addresses');
check($r['status'] === 200 && count($r['body']['data']['addresses'] ?? []) > 0, 'GET /api/user/addresses lists saved addresses');

if ($addrId) {
    $r = request('DELETE', '/api/user/addresses/' . $addrId);
    check($r['status'] === 200, 'DELETE /api/user/addresses/{id} removes address');
}

// ============================================================
// 10. Admin Endpoints (Login as admin first)
// ============================================================
echo "\n🛡️  10. Admin API\n";

// Clear cookie jar and login as admin
file_put_contents($cookieFile, '');
$r = request('POST', '/api/auth/login', [
    'email'    => 'admin@krantifurnitures.com',
    'password' => 'kranti123',
]);
check($r['status'] === 200 && ($r['body']['data']['user']['role'] ?? '') === 'admin', 'Admin login succeeds with role=admin', $r['body']['message'] ?? '');

$r = request('GET', '/api/admin/users');
check($r['status'] === 200 && isset($r['body']['data']['users']), 'GET /api/admin/users returns user list');
check(count($r['body']['data']['users'] ?? []) >= 2, 'Admin users list has at least 2 seeded users');

$r = request('GET', '/api/admin/orders');
check($r['status'] === 200 && isset($r['body']['data']['orders']), 'GET /api/admin/orders returns all orders');

$r = request('GET', '/api/admin/audit-logs');
check($r['status'] === 200 && isset($r['body']['data']['logs']), 'GET /api/admin/audit-logs returns log entries');

// Test admin access protection - logout then try admin route
request('POST', '/api/auth/logout');
$r = request('GET', '/api/admin/users');
check($r['status'] === 401, 'Admin routes return 401 when not authenticated');

// ============================================================
// 11. Validation Errors
// ============================================================
echo "\n🔍 11. Validation & Error Handling\n";

$r = request('POST', '/api/auth/register', [
    'first_name' => 'A',
    'email'      => 'not-an-email',
    'password'   => '123',
]);
check($r['status'] === 422, 'Invalid registration data returns 422 Validation Error');

$r = request('GET', '/api/orders/KFE-INVALID-ORDER-9999');
check($r['status'] === 404, 'Unknown order code returns 404 Not Found');

$r = request('GET', '/api/nonexistent-route');
check($r['status'] === 404, 'Unknown route returns 404');

// ============================================================
// Final Results
// ============================================================
echo "\n==================================================\n";
echo sprintf("📊 Final Results: %d Passed  /  %d Failed\n\n", $passed, $failed);

if (file_exists($cookieFile)) @unlink($cookieFile);
exit($failed > 0 ? 1 : 0);
