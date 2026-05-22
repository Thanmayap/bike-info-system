const db = require('../config/db');
const { updateBikeImages } = require('./updateBikeImages');

const hondaBikes = [
  { brand: "Honda", model: "Activa (110)", category_id: 3, price: 78166, mileage: 51.5, engine_cc: 110, power: "7.73 bhp @ 8000 rpm", torque: "8.90 Nm @ 5500 rpm", transmission: "Automatic", features: "ESP Technology, LED Headlamp, External Fuel Lid", description: "India's highest selling family scooter.", is_featured: 1 },
  { brand: "Honda", model: "Dio (110)", category_id: 3, price: 74298, mileage: 49.0, engine_cc: 110, power: "7.6 bhp @ 8000 rpm", torque: "9.0 Nm @ 4750 rpm", transmission: "Automatic", features: "LED Headlamp, Sporty Graphics, External Fuel Lid", description: "Sporty and youthful 110cc scooter.", is_featured: 1 },
  { brand: "Honda", model: "Activa 125", category_id: 3, price: 92529, mileage: 47.0, engine_cc: 124, power: "8.18 bhp @ 6500 rpm", torque: "10.3 Nm @ 5000 rpm", transmission: "Automatic", features: "Idling Stop System, LED Headlamp, Digital Dash", description: "Premium 125cc family scooter.", is_featured: 1 },
  { brand: "Honda", model: "Dio 125", category_id: 3, price: 93289, mileage: 47.0, engine_cc: 124, power: "8.18 bhp @ 6250 rpm", torque: "10.3 Nm @ 5000 rpm", transmission: "Automatic", features: "Smart Key, LED Headlamp, Sporty Exhaust Muffler", description: "Aggressive and stylish 125cc scooter.", is_featured: 1 },
  { brand: "Honda", model: "Activa e", category_id: 5, price: 119909, mileage: 102.0, engine_cc: 0, power: "6 kW peak", torque: "22 Nm", transmission: "Automatic", features: "Removable Batteries, LED Lights, Riding Modes", description: "Honda's first electric scooter for India.", is_featured: 1 },
  { brand: "Honda", model: "QC1", category_id: 5, price: 90486, mileage: 80.0, engine_cc: 0, power: "1.8 kW peak", torque: "12 Nm", transmission: "Automatic", features: "Compact Design, Removable Battery, Digital Cluster", description: "Compact electric scooter for urban commuting.", is_featured: 0 },
  { brand: "Honda", model: "Shine 100", category_id: 3, price: 65717, mileage: 60.0, engine_cc: 99, power: "7.28 bhp @ 7500 rpm", torque: "8.05 Nm @ 5000 rpm", transmission: "4-Speed", features: "Side Stand Engine Cut-off, Alloy Wheels", description: "Highly reliable and affordable 100cc commuter.", is_featured: 1 },
  { brand: "Honda", model: "Livo", category_id: 3, price: 80752, mileage: 65.0, engine_cc: 110, power: "8.67 bhp @ 7500 rpm", torque: "9.30 Nm @ 5500 rpm", transmission: "4-Speed", features: "Silent Start with ACG, Disc Brake, Tubeless Tyres", description: "Stylish 110cc commuter bike.", is_featured: 0 },
  { brand: "Honda", model: "Shine 125", category_id: 3, price: 82449, mileage: 55.0, engine_cc: 124, power: "10.59 bhp @ 7500 rpm", torque: "11.0 Nm @ 6000 rpm", transmission: "5-Speed", features: "Silent Start, DC Headlamp, Alloy Wheels", description: "Legendary 125cc commuter bike.", is_featured: 1 },
  { brand: "Honda", model: "SP 125", category_id: 3, price: 89406, mileage: 63.0, engine_cc: 124, power: "10.72 bhp @ 7500 rpm", torque: "10.9 Nm @ 6000 rpm", transmission: "5-Speed", features: "LED Headlamp, Fully Digital Instrument Cluster", description: "Premium and sporty 125cc commuter.", is_featured: 1 },
  { brand: "Honda", model: "CB 125 Hornet", category_id: 3, price: 115065, mileage: 48.0, engine_cc: 124, power: "11.2 bhp @ 8500 rpm", torque: "11.0 Nm @ 6500 rpm", transmission: "5-Speed", features: "Aggressive Tank Shrouds, LED Tail Light", description: "Sporty 125cc commuter for youth.", is_featured: 0 },
  { brand: "Honda", model: "Unicorn", category_id: 3, price: 113613, mileage: 50.0, engine_cc: 163, power: "12.7 bhp @ 7500 rpm", torque: "14.0 Nm @ 5500 rpm", transmission: "5-Speed", features: "Mono Suspension, Chrome Accents, Tubeless Tyres", description: "Smooth and reliable 160cc executive commuter.", is_featured: 1 },
  { brand: "Honda", model: "SP 160", category_id: 3, price: 116270, mileage: 50.0, engine_cc: 163, power: "13.27 bhp @ 7500 rpm", torque: "14.58 Nm @ 5500 rpm", transmission: "5-Speed", features: "LED Headlamp, Digital Meter, Hazard Switch", description: "Sporty executive 160cc motorcycle.", is_featured: 1 },
  { brand: "Honda", model: "Hornet 2.0", category_id: 1, price: 147864, mileage: 45.0, engine_cc: 184, power: "17.03 bhp @ 8500 rpm", torque: "16.1 Nm @ 6000 rpm", transmission: "5-Speed", features: "USD Front Forks, Petal Disc Brakes, Gear Position Indicator", description: "Naked streetfighter styling with premium handling.", is_featured: 1 }
];

async function seed() {
  const sqliteDb = await db.getDbInstance();
  console.log("Seeding Honda bikes into database...");

  for (const bike of hondaBikes) {
    const row = await sqliteDb.get(
      "SELECT id FROM bikes WHERE brand = ? AND model = ?",
      [bike.brand, bike.model]
    );

    if (!row) {
      await sqliteDb.run(
        `INSERT INTO bikes 
         (brand, model, category_id, price, mileage, engine_cc, power, torque, transmission, features, description, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bike.brand,
          bike.model,
          bike.category_id,
          bike.price,
          bike.mileage,
          bike.engine_cc,
          bike.power,
          bike.torque,
          bike.transmission,
          bike.features,
          bike.description,
          bike.is_featured
        ]
      );
      console.log(`Inserted: ${bike.brand} ${bike.model}`);
    } else {
      console.log(`Already exists: ${bike.brand} ${bike.model}`);
    }
  }

  // Always update images and colors
  console.log("Updating images and colors...");
  await updateBikeImages();
  console.log("Honda seeding complete!");
}

seed().catch(console.error);
