ALTER TABLE accounts
  ADD COLUMN terms_accepted_at DATETIME NULL,
  ADD COLUMN terms_version VARCHAR(32) NULL,
  ADD COLUMN last_login_at DATETIME NULL;

-- Only a SHA-256 hash of the random browser token is stored here.
CREATE TABLE account_sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  KEY account_sessions_account (account_id),
  KEY account_sessions_expiry (expires_at),
  CONSTRAINT sessions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auth_rate_limits (
  bucket_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  KEY auth_rate_limits_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
