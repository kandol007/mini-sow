-- seed.sql

-- Insert translations (English + Swedish)
INSERT INTO texts (key_name, lang, value) VALUES
('login.title', 'en', 'Sign in to your account'),
('login.title', 'se', 'Logga in på ditt konto'),
('terms.title', 'en', 'Terms and conditions'),
('terms.title', 'se', 'Villkor'),
('terms.body', 'en', 'These are the terms and conditions. Replace with full text from DB.'),
('terms.body', 'se', 'Detta är villkoren. Ersätt med full text från DB.'),
('menu.price_list', 'en', 'Price List'),
('menu.price_list', 'se', 'Prislista');

-- Insert 20 products
INSERT INTO products (article_no, product_service, in_price, price, unit, in_stock, description)
SELECT
  LPAD((100000 + s)::text, 9, '0'),
  CONCAT('Product ', s, ' - This is a test product with long name to test UI overflow'),
  (100 * s)::numeric,
  (150 * s)::numeric,
  'unit',
  (50 * s)::numeric,
  CONCAT('Description for product ', s)
FROM generate_series(1, 20) s;
