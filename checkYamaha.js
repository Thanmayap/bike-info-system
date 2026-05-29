const db = require('./backend/config/db');

async function checkYamaha() {
  const [rows] = await db.query("SELECT id, brand, model, image FROM bikes WHERE brand = 'Yamaha'");
  console.log(`Found ${rows.length} Yamaha bikes in database.`);
  rows.forEach(r => console.log(`${r.brand} ${r.model}: ${r.image}`));
}

checkYamaha();
