ALTER TABLE accounts
  ADD COLUMN cart_reminders_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN last_cart_reminder_at DATETIME NULL;

CREATE TABLE email_verifications (
  email VARCHAR(254) NOT NULL PRIMARY KEY,
  challenge_id CHAR(43) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  code_digest CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  verification_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL,
  attempts_remaining TINYINT UNSIGNED NOT NULL DEFAULT 5,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  verified_at DATETIME NULL,
  UNIQUE KEY email_verification_challenge (challenge_id),
  KEY email_verification_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customer_carts (
  account_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  revision BIGINT UNSIGNED NOT NULL DEFAULT 0,
  content_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY customer_carts_activity (last_activity_at),
  CONSTRAINT carts_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customer_cart_items (
  account_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  selected_color VARCHAR(80) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (account_id, product_id, selected_color),
  CONSTRAINT cart_items_cart FOREIGN KEY (account_id) REFERENCES customer_carts(account_id) ON DELETE CASCADE,
  CONSTRAINT cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT cart_items_quantity CHECK (quantity BETWEEN 1 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The unique event key provides durable at-most-once claiming across job processes.
CREATE TABLE email_deliveries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  event_key VARCHAR(191) NOT NULL,
  status ENUM('sending', 'sent', 'skipped', 'uncertain') NOT NULL DEFAULT 'sending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME NULL,
  UNIQUE KEY email_deliveries_event (event_key),
  CONSTRAINT deliveries_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
