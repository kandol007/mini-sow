-- reset.sql
-- Drop existing tables
DROP TABLE IF EXISTS texts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate tables with your schema
CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(255) NOT NULL,
  lang VARCHAR(10) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key_name, lang)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  article_no VARCHAR(50),
  product_service TEXT,
  in_price NUMERIC(10, 2),
  price NUMERIC(10, 2),
  unit VARCHAR(50),
  in_stock NUMERIC(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_texts_lang ON texts(lang);
CREATE INDEX idx_texts_key_name ON texts(key_name);