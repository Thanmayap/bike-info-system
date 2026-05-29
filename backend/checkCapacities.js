const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database/database.sqlite');

db.serialize(() => {
  db.all("SELECT id, brand, model, fuel_capacity, engine_cc FROM bikes WHERE brand = 'Ola Electric' OR brand = 'Ather' OR brand = 'Vida' LIMIT 15", (err, rows) => {
    console.table(rows);
  });
});

db.close();
