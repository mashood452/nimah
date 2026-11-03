-- Categories describe the product type. Shapes describe the frame independently.
CREATE TABLE product_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY product_categories_code (code),
  UNIQUE KEY product_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_shapes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL,
  name VARCHAR(160) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY product_shapes_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO product_categories (code, slug, name, sort_order) VALUES
  ('Sunglasses', 'sunglasses', 'Sunglasses', 0),
  ('Blue-Cut', 'blue-light-glasses', 'Blue-Cut Glasses', 1),
  ('Eyeglasses', 'eyeglasses', 'Eyeglasses', 2);

INSERT INTO product_shapes (slug, name, sort_order) VALUES
  ('aviator', 'Aviator', 0), ('wayfarer', 'Wayfarer', 1), ('round', 'Round', 2),
  ('cat-eye', 'Cat-Eye', 3), ('square', 'Square', 4), ('oversized', 'Oversized', 5),
  ('browline', 'Browline', 6), ('rectangle', 'Rectangle', 7);

ALTER TABLE products ADD COLUMN category_id BIGINT UNSIGNED NULL, ADD COLUMN shape_id BIGINT UNSIGNED NULL;

UPDATE products p
  JOIN product_categories c ON c.code = p.category
  JOIN product_shapes s ON s.slug = p.shape
  SET p.category_id = c.id, p.shape_id = s.id;

-- Correct the initial optical samples to match their existing descriptions.
UPDATE products p JOIN product_shapes s ON s.slug = 'browline'
  SET p.shape_id = s.id WHERE p.slug = 'ellis-optical' AND p.shape = 'aviator';
UPDATE products p JOIN product_shapes s ON s.slug = 'rectangle'
  SET p.shape_id = s.id WHERE p.slug = 'orion-optical' AND p.shape = 'square';

ALTER TABLE products
  MODIFY category_id BIGINT UNSIGNED NOT NULL,
  MODIFY shape_id BIGINT UNSIGNED NOT NULL,
  ADD KEY products_category_listing (category_id, is_active),
  ADD KEY products_shape_listing (shape_id, is_active),
  ADD CONSTRAINT products_category_fk FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT,
  ADD CONSTRAINT products_shape_fk FOREIGN KEY (shape_id) REFERENCES product_shapes(id) ON DELETE RESTRICT,
  DROP INDEX products_category,
  DROP COLUMN category,
  DROP COLUMN shape;

ALTER TABLE blog_posts ADD COLUMN product_category_id BIGINT UNSIGNED NULL;
UPDATE blog_posts b JOIN product_categories c ON c.code = b.product_category SET b.product_category_id = c.id;
ALTER TABLE blog_posts
  ADD CONSTRAINT posts_product_category_fk FOREIGN KEY (product_category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  DROP COLUMN product_category;
