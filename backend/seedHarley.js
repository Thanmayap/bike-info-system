const db = require('./config/db');

const harleyBikes = [
  // Brand, Model, Category ID (2 = Cruiser, 4 = Adventure), Price, Mileage, Engine CC, Power, Torque, Weight, Fuel Capacity, Transmission, Features, Description, Image, IsFeatured
  ["Harley-Davidson", "X440", 2, 239500, 35.0, 440, "27 bhp @ 6000 rpm", "38 Nm", 190.5, 13.5, "6-Speed", "Dual-Channel ABS,LED Headlamp,TFT Display", "Affordable entry into the Harley-Davidson family.", "https://bd.gaadicdn.com/processedimages/harley-davidson/x440/640X309/x44064a3d46193f9c.jpg", 1],
  ["Harley-Davidson", "Fat Boy 114", 2, 2569000, 15.0, 1868, "92.5 bhp @ 5020 rpm", "155 Nm", 317, 18.9, "6-Speed", "Dual-Channel ABS,LED Headlamp,Keyless Ignition", "The original fat custom icon with a muscular stance.", "https://bd.gaadicdn.com/processedimages/harley-davidson/fat-boy/640X309/fat-boy65bb2c22d1df7.jpg", 1],
  ["Harley-Davidson", "Iron 883", 2, 1199000, 20.0, 883, "50 bhp @ 5500 rpm", "68 Nm", 256, 12.5, "5-Speed", "Dual-Channel ABS,Bobber Styling", "An original icon of the Harley-Davidson Dark Custom style.", "https://bd.gaadicdn.com/processedimages/harley-davidson/iron-883/640X309/iron-88360216b5398ab7.jpg", 0],
  ["Harley-Davidson", "Street 750", 2, 469000, 22.0, 749, "47 bhp @ 8000 rpm", "59 Nm", 233, 13.1, "6-Speed", "Dual-Channel ABS,Liquid Cooled", "Lightweight, liquid-cooled Harley-Davidson for urban streets.", "https://bd.gaadicdn.com/processedimages/harley-davidson/street-750/640X309/street-7505ed8a13ed4940.jpg", 0],
  ["Harley-Davidson", "Pan America 1250", 4, 2449000, 18.0, 1252, "150 bhp @ 8750 rpm", "128 Nm", 245, 21.2, "6-Speed", "Riding Modes,TFT Display,Cornering ABS,TCS", "Advanced adventure touring motorcycle.", "https://bd.gaadicdn.com/processedimages/harley-davidson/pan-america-1250/640X309/pan-america-12506041ec60d00f7.jpg", 1],
  ["Harley-Davidson", "Sportster S", 2, 1649000, 19.0, 1252, "121 bhp @ 7500 rpm", "125 Nm", 228, 11.8, "6-Speed", "TFT Display,Riding Modes,Cornering ABS", "The next chapter of the legendary Sportster saga.", "https://bd.gaadicdn.com/processedimages/harley-davidson/sportster-s/640X309/sportster-s61b9bbf5cd932.jpg", 1]
];

async function seed() {
  const sqlite = await db.getDbInstance();
  for (const bike of harleyBikes) {
    const existing = await sqlite.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike[0], bike[1]]);
    if (!existing) {
      await sqlite.run(
        'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        bike
      );
    }
  }
  console.log("Successfully seeded Harley-Davidson bikes!");
}

seed();
