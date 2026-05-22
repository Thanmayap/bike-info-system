const db = require('./config/db');

async function test() {
  const [rows] = await db.query("SELECT id, brand, model, image FROM bikes WHERE brand = 'Honda'");
  console.log(rows);
}

test().catch(console.error);
