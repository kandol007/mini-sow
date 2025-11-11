-- schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(200) NOT NULL,
  lang CHAR(2) NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  article_no VARCHAR(50),
  product_service TEXT,
  in_price NUMERIC,
  price NUMERIC,
  unit VARCHAR(100),
  in_stock NUMERIC,
  description TEXT
);
