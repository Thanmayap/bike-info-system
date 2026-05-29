const db = require('./backend/config/db');

async function checkBikes() {
  try {
    const [rows] = await db.query('SELECT id, brand, model, image FROM bikes');
    console.log(`Found ${rows.length} bikes in database.`);
    
    const placeholders = [];
    const unsplash = [];
    const others = [];
    
    for (const row of rows) {
      if (!row.image) {
        placeholders.push(row);
      } else if (row.image.includes('unsplash') || row.image.includes('placeholder') || row.image.includes('grey-16x9') || row.image.includes('royal-enfield/motorcycles/flying-flea') || row.image.includes('flying-flea-c6.png')) {
        unsplash.push(row);
      } else {
        others.push(row);
      }
    }
    
    console.log('\n--- PLACEHOLDER OR SUSPECT IMAGES ---');
    unsplash.forEach(b => console.log(`[SUSPECT] ${b.brand} ${b.model}: ${b.image}`));
    if (placeholders.length > 0) {
      console.log('\n--- NULL/EMPTY IMAGES ---');
      placeholders.forEach(b => console.log(`[EMPTY] ${b.brand} ${b.model}`));
    }
    
    console.log(`\nSummary: ${unsplash.length} suspect images, ${placeholders.length} empty, ${others.length} standard images.`);
  } catch (error) {
    console.error('Error querying bikes:', error);
  }
}

checkBikes();
