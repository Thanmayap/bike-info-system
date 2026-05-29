const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function seed() {
  try {
    const dataPath = path.join(__dirname, '../tmp_tvs.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const sqlite = await db.getDbInstance();

    for (const bike of data) {
      const existing = await sqlite.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
      
      if (!existing) {
        await sqlite.run(
          `INSERT INTO bikes (
            brand, model, category_id, price, mileage, engine_cc, power, torque, top_speed, fuel_capacity, 
            transmission, features, description, image, gallery, is_featured, created_at, updated_at, weight
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bike.brand, bike.model, bike.category_id, bike.price, bike.mileage, bike.engine_cc, bike.power, 
            bike.torque, bike.top_speed, bike.fuel_capacity, bike.transmission, bike.features, bike.description, 
            bike.image, bike.gallery, bike.is_featured, bike.created_at, bike.updated_at, bike.weight
          ]
        );
        console.log(`Inserted: ${bike.brand} ${bike.model}`);
      } else {
        console.log(`Skipped existing: ${bike.brand} ${bike.model}`);
      }
    }
    console.log("Successfully seeded TVS bikes!");
  } catch (error) {
    console.error("Error seeding TVS data:", error);
  }
}

seed();
