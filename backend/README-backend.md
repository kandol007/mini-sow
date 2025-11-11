Backend README:

1) Copy .env.example to .env and edit DATABASE_URL & JWT_SECRET.
2) Install:
   cd backend
   npm install

3) Run DB schema (see sql/schema.sql) against your Postgres instance.

4) Seed DB:
   psql -d mini_sow -f ../sql/seed.sql

5) Create test user:
   node create_user.js
   (or set env vars SEED_USERNAME/SEED_PASSWORD before running)

6) Start server:
   npm start
   or for development:
   npm run dev
