-- Online checkout. client_token makes placing an order safe to retry: sending the same order twice returns the first one.
ALTER TABLE orders
  ADD COLUMN client_token CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  ADD COLUMN payment_method VARCHAR(40) NOT NULL DEFAULT 'cash_on_delivery',
  ADD UNIQUE KEY orders_client_token (account_id, client_token);

ALTER TABLE account_addresses ADD KEY addresses_account (account_id, is_default);
