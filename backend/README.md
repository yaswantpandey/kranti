# Kranti Furnitures & Electronics - Backend API

Production-ready, high-performance **PHP 8.2+ & MySQL 8+ REST API** backend built for the **Kranti Furnitures & Electronics** digital showroom application.

---

## 🛠️ Tech Stack & Key Features

- **PHP 8.2+**: Modern strict-typed OOP architecture (`declare(strict_types=1);`).
- **MySQL 8.0+ / PDO**: Complete relational DDL schema with transactions, foreign key cascades, and 100% prepared statements.
- **RESTful API**: Clean JSON request/response specification with standardized status codes (200, 201, 400, 401, 403, 404, 422, 429, 500).
- **Authentication**:
  - Secure bcrypt password hashing (`cost = 12`).
  - Session & Token authentication with `HttpOnly`, `SameSite=Lax`, and `Secure` cookie protection.
  - Password reset tokens and email verification workflows.
- **Security Protections**:
  - IP-based rate limiting on sensitive login/register routes to prevent brute-force attacks.
  - Role-Based Access Control (RBAC) guard middleware (`/api/admin/*`).
  - Input sanitization & server-side validation.
  - Secure upload handling with MIME validation & disabled PHP execution in `/uploads/.htaccess`.
  - Database audit trail logging for all security events.

---

## 📂 Project Directory Architecture

```text
backend/
├── config/
│   ├── config.php           # App settings, environment loader & CORS configuration
│   └── database.php         # PDO connection factory with error handling
├── database/
│   ├── schema.sql           # MySQL 8.0+ database tables, indexes & constraints
│   └── seed.sql             # Initial showroom categories, products, default users & coupons
├── helpers/
│   ├── Response.php         # Standardized JSON response renderer
│   ├── Validator.php        # Server-side validation rules & sanitization
│   ├── Session.php          # Cookie/session & CSRF token manager
│   └── Logger.php           # Security audit & error logger
├── middleware/
│   ├── AuthMiddleware.php   # User authentication guard
│   ├── AdminMiddleware.php  # Administrator RBAC guard
│   ├── CorsMiddleware.php   # Secure CORS header filtering
│   └── RateLimitMiddleware.php # Route rate-limiting protection
├── models/
│   ├── User.php             # User CRUD & credential management
│   ├── Product.php          # Product catalog queries & filter engine
│   ├── Category.php         # Category taxonomy
│   ├── Address.php          # Saved delivery addresses
│   ├── Cart.php             # Persistent user/guest cart
│   ├── Order.php            # Transactional order placement & tracking
│   ├── Coupon.php           # Voucher verification
│   ├── Wishlist.php        # Saved wishlist toggles
│   └── AuditLog.php         # Security audit database log
├── controllers/
│   ├── AuthController.php   # Register, login, logout, password reset, verify
│   ├── UserController.php   # Profile, password, address endpoints
│   ├── ProductController.php# Catalog, search, filters & details
│   ├── CartController.php   # Cart sync, add, update, remove
│   ├── CouponController.php # Promo voucher validation
│   ├── OrderController.php  # Order placement & milestone tracking
│   ├── WishlistController.php# Wishlist add/remove
│   └── AdminController.php  # Admin user, product, order & log management
├── routes/
│   └── api.php              # REST API Router & endpoint dispatching
├── services/
│   ├── AuthService.php      # Auth business logic
│   └── FileUploadService.php# Safe file upload handler
├── uploads/                 # Uploaded media directory (.htaccess protected)
├── logs/                    # Security logs
├── tests/
│   └── ApiTest.php          # Automated backend test suite
├── index.php                # Single entry point / Front Controller
├── .env.example             # Environment template
├── composer.json            # PSR-4 Autoloading definition
└── README.md                # Project documentation
```

---

## 🚀 Setup & Installation Instructions

### 1. Requirements
- **PHP**: `>= 8.2` (with `pdo_mysql`, `openssl`, `mbstring`, `fileinfo` extensions enabled)
- **MySQL**: `>= 8.0` or **MariaDB**: `>= 10.4`
- **Web Server**: Apache (`mod_rewrite` enabled), Nginx, or PHP Built-in CLI server.

### 2. Database Creation & Seeding
Import the schema and seed files into your MySQL server:

```bash
# 1. Create database schema
mysql -u root -p < backend/database/schema.sql

# 2. Seed initial products, categories, default admin & test user
mysql -u root -p < backend/database/seed.sql
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost/stitch_kranti_digital_showroom

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kranti_showroom
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 4. Running the Development Server
You can start PHP's built-in web server directly from the `backend/` directory:

```bash
php -S localhost:8000 -t backend/
```

The REST API will now be available at: `http://localhost:8000/api/...`

### 5. Running Verification Tests
Run the automated verification suite:

```bash
php backend/tests/ApiTest.php
```

---

## 🔑 Default Accounts (Seeded)

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Customer User** | `ramesh.kumar@example.com` | `kranti123` | `user` |
| **Administrator** | `admin@krantifurnitures.com` | `kranti123` | `admin` |

---

## 📡 REST API Endpoint Documentation

### 🔓 Authentication APIs
- `POST /api/auth/register` - Create account (`first_name`, `last_name`, `email`, `password`)
- `POST /api/auth/login` - Authenticate (`email`, `password`)
- `POST /api/auth/logout` - Log out active session
- `GET /api/auth/me` - Fetch profile of logged-in user
- `POST /api/auth/forgot-password` - Generate reset token for email
- `POST /api/auth/reset-password` - Reset password (`token`, `password`)
- `GET /api/auth/verify-email?token=...` - Confirm email token

### 👤 User & Profile APIs
- `PUT /api/user/profile` - Update profile (`first_name`, `last_name`, `phone`, `email`)
- `PUT /api/user/password` - Change password (`current_password`, `new_password`)
- `GET /api/user/addresses` - List saved delivery addresses
- `POST /api/user/addresses` - Save new delivery address
- `DELETE /api/user/addresses/{id}` - Delete saved address

### 🛋️ Catalog & Products APIs
- `GET /api/products` - Filter catalog (`category`, `q`, `maxPrice`, `brands`, `minRating`, `sort`)
- `GET /api/products/{id}` - Product details, gallery & specs
- `GET /api/categories` - List categories

### 🛒 Cart & Checkout APIs
- `GET /api/cart` - Retrieve persistent cart items
- `POST /api/cart/items` - Add item to cart (`productId`, `quantity`, `selectedSize`, `selectedColor`)
- `PUT /api/cart/items` - Update item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart
- `POST /api/coupons/apply` - Validate coupon code (`KRANTI10`, `FESTIVE15`, `WELCOME500`)
- `POST /api/checkout` - Create order (`shipping`, `paymentMethod`, `deliveryOption`)
- `GET /api/orders` - Fetch customer order history
- `GET /api/orders/{orderId}` - Fetch single order & Prayagraj delivery milestone timeline

### ❤️ Wishlist APIs
- `GET /api/wishlist` - Fetch user wishlist items
- `POST /api/wishlist/toggle` - Toggle product in/out of wishlist (`productId`)

### 🛡️ Admin Management APIs (Requires `role === 'admin'`)
- `GET /api/admin/users` - Search & filter registered users
- `PUT /api/admin/users/{id}/role` - Update user role / active status
- `POST /api/admin/products` - Create / update product catalog entry
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - View all showroom orders
- `PUT /api/admin/orders/{id}/status` - Update order status step
- `GET /api/admin/audit-logs` - Inspect security audit log history
- `POST /api/admin/upload` - Securely upload product images

---

## 🌐 Connecting Frontend with Backend API

To connect your static HTML/JS frontend with this PHP backend, simply configure the API base URL in `assets/js/store.js` or `assets/js/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000';

// Example: Fetch products from PHP Backend
async function fetchBackendProducts(category = 'all') {
  const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`, {
    headers: { 'Accept': 'application/json' },
    credentials: 'include' // Sends session cookie automatically
  });
  const json = await response.json();
  return json.data.products;
}
```
