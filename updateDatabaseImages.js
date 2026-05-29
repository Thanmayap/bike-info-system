const db = require('./backend/config/db');

async function runUpdate() {
  const updates = [
    { brand: "Royal Enfield", model: "Flying Flea C6", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/220422/flying-flea-right-side-view.webp" },
    { brand: "Royal Enfield", model: "Flying Flea S6", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/191551/flying-flea-s6-scrambler-right-side-view-2.jpeg" },
    { brand: "TVS", model: "TVS Centra", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/130591/radeon-right-side-view.jpeg" },
    { brand: "TVS", model: "Suzuki Fiero", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/41462/apache-rtr-160-right-side-view.jpeg" },
    { brand: "TVS", model: "XL Champ", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/41292/xl-100-right-side-view.jpeg" },
    { brand: "TVS", model: "TVS Stile", image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/41296/scooty-zest-110-right-side-view.jpeg" }
  ];

  for (const item of updates) {
    const result = await db.query(
      'UPDATE bikes SET image = ? WHERE brand = ? AND model = ?',
      [item.image, item.brand, item.model]
    );
    console.log(`Updated ${item.brand} ${item.model} -> changes: ${result[0].affectedRows}`);
  }
  
  console.log('Database images update completed.');
}

runUpdate().catch(console.error);
