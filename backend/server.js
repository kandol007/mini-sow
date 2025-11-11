// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function authMiddleware(req, res, next){
  const auth = req.headers['authorization'];
  if(!auth) return res.status(401).json({ error: 'Missing token' });
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({ error: 'Invalid auth header' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Routes

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const r = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
    if(r.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, username: user.username });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Texts (translations)
app.get('/api/texts/:lang', async (req, res) => {
  const lang = req.params.lang || 'en';
  try {
    const r = await db.query('SELECT key_name, value FROM texts WHERE lang = $1', [lang]);
    const out = {};
    r.rows.forEach(row => out[row.key_name] = row.value);
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Products (protected)
app.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM products ORDER BY id');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { article_no, product_service, in_price, price, unit, in_stock, description } = req.body;
  try {
    await db.query(
      `UPDATE products SET article_no=$1, product_service=$2, in_price=$3, price=$4, unit=$5, in_stock=$6, description=$7 WHERE id=$8`,
      [article_no, product_service, in_price, price, unit, in_stock, description, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
