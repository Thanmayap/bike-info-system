require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

(async () => {
  const hash = await bcrypt.hash('Admin@123', 10);
  await pool.query(
    `INSERT INTO users (name,email,password,role) VALUES ('Admin','admin@bikes.com',?, 'admin')
     ON DUPLICATE KEY UPDATE password=VALUES(password), role='admin'`,
    [hash]
  );
  console.log('Admin seeded: admin@bikes.com / Admin@123');
  process.exit(0);
})();
