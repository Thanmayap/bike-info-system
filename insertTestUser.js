const bcrypt = require('./backend/node_modules/bcryptjs');
const pool = require('./backend/config/db');

async function run() {
  const email = 'test.rider@example.com';
  const password = 'Password123!';
  const name = 'Futuristic Rider';
  const phone = '9876543210';
  
  const hash = await bcrypt.hash(password, 10);
  
  // Check if exists
  const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  
  if (exists.length > 0) {
    await pool.query('UPDATE users SET password = ?, name = ?, phone = ? WHERE email = ?', [hash, name, phone, email]);
    console.log(`Updated existing test user: ${email} / ${password}`);
  } else {
    await pool.query('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)', [name, email, hash, phone, 'user']);
    console.log(`Created new test user: ${email} / ${password}`);
  }
  
  process.exit(0);
}

run().catch(console.error);
