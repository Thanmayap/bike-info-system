const db = require('./config/db');
async function fix() {
  const sqlite = await db.getDbInstance();
  await sqlite.run(`UPDATE bikes SET image = 'https://www.tvsmotor.com/tvs-xl/images/tvs-xl100-right-side-view.png' WHERE model = 'XL 100 Comfort'`);
  await sqlite.run(`UPDATE bikes SET image = 'https://www.tvsmotor.com/tvs-xl/images/tvs-xl100-heavy-duty-right-side-view.png' WHERE model = 'XL 100 Heavy Duty'`);
  await sqlite.run(`UPDATE bikes SET image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' WHERE model = 'XL Champ'`);
  console.log("Restored original HD transparent PNG images!");
}
fix();
