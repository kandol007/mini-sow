# Mini SOW - runnable repo

This repository implements the SOW mini-app: login (JWT), terms, simple price list with editable fields.

## Quick local run (dev)
1. Ensure Postgres is running.

2. Create DB:
   ```bash
   createdb mini_sow
   psql -d mini_sow -f sql/schema.sql
   psql -d mini_sow -f sql/seed.sql

3. Backend:
   ```bash
   cd backend
   cp .env.example .env
   # edit .env if needed, e.g. DATABASE_URL
   npm install
   npm run create-user
   npm start

Default seeded user (via create_user.js) is:
    username: testuser
    password: Password123

4. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   Frontend dev server proxies /api to http://localhost:4000 (see vite.config.js).

5. Open http://localhost:5173 in browser.
   Build frontend: npm run build in frontend, copy dist to nginx root, reverse proxy /api to backend.
   Start backend with pm2 or systemd:

   pgsql
   pm2 start server.js --name mini-sow-backend
   pm2 save
   pm2 startup


## Notes
JWT token is returned from /api/login and must be sent in Authorization: Bearer <token> header to /api/products.

All code is plain JS and vanilla CSS.

Add at least 20 products (seed.sql already inserts 20).


---

# How to run locally — concise steps (copy from README)

1. Install Postgres, Node.js (>=18), npm.  

2. Create DB and run SQL:
   createdb mini_sow
   psql -d mini_sow -f sql/schema.sql
   psql -d mini_sow -f sql/seed.sql

3. Backend:
   cd backend
   cp .env.example .env

edit DATABASE_URL if needed
   npm install
   npm run create-user # creates testuser/Password123
   npm start

4. Frontend:
   cd frontend
   npm install
   npm run dev

5. Visit `http://localhost:5173`. Login with `testuser` / `Password123`. After login you are taken to pricelist (20 rows).

---

# Deployment tips (Linux VM)
I included the nginx sample earlier in the plan; summary:
- Host backend on port 4000 (pm2).
- Build frontend and serve static files via nginx.
- Proxy `/api` to backend in nginx config.
- Ensure `.env` DATABASE_URL points to your Postgres on VM or a managed DB.

---

# Credentials and test data
- Test user created by default via `create_user.js`:
- username: `testuser`
- password: `Password123`
- JWT secret: change `JWT_SECRET` in `.env` before production.

---

# Final notes & next steps
- Everything above is ready-to-run. Copy files into your workspace or paste into a repo.  
- If you want, I can:
- produce a zip with all files (I can run python_user_visible to write files and present a download link) — say "zip it" if you'd like that.  
- or generate a Git repo structure with commits (I can output `git` commands to run locally).
