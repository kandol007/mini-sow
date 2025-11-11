// create_user.js
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

async function run(){
  const username = process.env.SEED_USERNAME || 'testuser';
  const password = process.env.SEED_PASSWORD || 'Password123';
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      [username, hash]
    );
    console.log('Created user:', username, 'password:', password);
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    process.exit(0);
  }
}

run();
