const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/database.sqlite');

db.serialize(() => {
  // Check the table schema
  db.all("PRAGMA table_info(bikes)", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    const columns = rows.map(r => r.name);
    console.log("Columns:", columns.filter(c => c.toLowerCase().includes('fuel') || c.toLowerCase().includes('battery') || c.toLowerCase().includes('capacity') || c.toLowerCase().includes('type')));
  });

  // Get a few sample rows to see the data
  db.all("SELECT id, name, fuel_capacity, battery_capacity, fuel_type FROM bikes LIMIT 10", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("\nSample Data:");
    console.table(rows);
  });
  
  // Get counts of records with 0 L fuel
  db.all("SELECT id, name, fuel_capacity, battery_capacity, fuel_type FROM bikes WHERE fuel_capacity LIKE '%0%' OR fuel_capacity = '' LIMIT 10", (err, rows) => {
      console.log("\nZero or empty fuel capacities:");
      console.table(rows);
  });
});

db.close();
