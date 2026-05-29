const bcrypt = require('./backend/node_modules/bcryptjs');
const pool = require('./backend/config/db');

async function check() {
  const [rows] = await pool.query('SELECT name, email, password, role FROM users');
  console.log(`Found ${rows.length} users in database:`);
  
  for (const user of rows) {
    const isMatched = await bcrypt.compare('Admin@123', user.password);
    console.log(`- User: ${user.name} (${user.email}), Role: ${user.role}, Password "Admin@123" matched? ${isMatched}`);
  }
}

check();
