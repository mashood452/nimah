-- MySQL 8+ / MariaDB 10.6+. Media columns contain R2 object keys, never image bytes.
CREATE TABLE accounts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NULL,
  display_name VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  email_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY accounts_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE account_addresses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(80) NULL,
  recipient VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255) NULL,
  city VARCHAR(120) NOT NULL,
  region VARCHAR(120) NULL,
  postal_code VARCHAR(24) NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'AE',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT addresses_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  sku VARCHAR(100) NULL,
  name VARCHAR(200) NOT NULL,
  subtitle VARCHAR(255) NOT NULL DEFAULT '',
  category ENUM('Sunglasses', 'Blue-Cut', 'Eyeglasses') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  shape ENUM('aviator', 'wayfarer', 'round', 'cat-eye', 'square', 'oversized') NOT NULL,
  swatches JSON NOT NULL,
  badge ENUM('New', 'Best seller') NULL,
  description TEXT NOT NULL,
  tags JSON NOT NULL,
  features JSON NOT NULL,
  thumbnail_key VARCHAR(512) NULL,
  thumbnail_alt VARCHAR(255) NOT NULL DEFAULT '',
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  keywords JSON NOT NULL,
  stock_quantity INT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY products_slug (slug),
  UNIQUE KEY products_sku (sku),
  KEY products_listing (is_active, sort_order, id),
  KEY products_category (category, is_active),
  CONSTRAINT products_price CHECK (price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  object_key VARCHAR(512) NOT NULL,
  alt_text VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  KEY product_images_order (product_id, sort_order),
  CONSTRAINT images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE blog_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  published_at DATETIME NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  read_minutes SMALLINT UNSIGNED NOT NULL,
  thumbnail_key VARCHAR(512) NOT NULL,
  thumbnail_alt VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  keywords JSON NOT NULL,
  takeaways JSON NOT NULL,
  sections JSON NOT NULL,
  product_category ENUM('Sunglasses', 'Blue-Cut', 'Eyeglasses') NULL,
  product_tag VARCHAR(100) NULL,
  author_account_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY blog_posts_slug (slug),
  KEY blog_posts_listing (status, published_at),
  CONSTRAINT posts_author FOREIGN KEY (author_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  CONSTRAINT posts_read_minutes CHECK (read_minutes > 0),
  CONSTRAINT posts_publish_date CHECK (status <> 'published' OR published_at IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(64) NOT NULL,
  account_id BIGINT UNSIGNED NULL,
  customer_email VARCHAR(254) NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  customer_phone VARCHAR(40) NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  currency CHAR(3) NOT NULL DEFAULT 'AED',
  subtotal DECIMAL(12,2) NOT NULL,
  discount_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL,
  shipping_address JSON NOT NULL,
  billing_address JSON NULL,
  notes TEXT NULL,
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY orders_number (order_number),
  KEY orders_account (account_id, placed_at),
  KEY orders_status (status, placed_at),
  CONSTRAINT orders_account_fk FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  CONSTRAINT orders_amounts CHECK (subtotal >= 0 AND discount_total >= 0 AND shipping_total >= 0 AND tax_total >= 0 AND grand_total >= 0),
  CONSTRAINT orders_total CHECK (grand_total = subtotal - discount_total + shipping_total + tax_total)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product snapshots preserve historical orders after a product is edited or removed.
CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_slug VARCHAR(191) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  sku VARCHAR(100) NULL,
  selected_color VARCHAR(80) NULL,
  thumbnail_key VARCHAR(512) NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  CONSTRAINT items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT items_amounts CHECK (quantity > 0 AND unit_price >= 0 AND line_total = quantity * unit_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gateway references only. Never store card numbers or CVVs.
CREATE TABLE payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(80) NOT NULL,
  provider_reference VARCHAR(191) NULL,
  status ENUM('pending', 'authorized', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'pending',
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AED',
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY payments_reference (provider, provider_reference),
  CONSTRAINT payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  CONSTRAINT payments_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
