const db = require('./backend/config/db');

async function test() {
  const [rows] = await db.query("SELECT brand, model, image, colors FROM bikes WHERE brand = 'Royal Enfield' LIMIT 5");
  console.log(JSON.stringify(rows, null, 2));
}

test();
