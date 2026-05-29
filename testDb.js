const db = require('./backend/config/db');

async function test() {
  const updates = [
    { brand: 'Yamaha', model: 'RX 100', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133649/rx-100-right-front-three-quarter.jpeg?isig=0' },
    { brand: 'Yamaha', model: 'RX 135', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/20562/rx-135-exterior-right-side-view.jpeg' },
    { brand: 'Yamaha', model: 'RX-G',   image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/20562/rx-135-exterior-right-side-view.jpeg' },
    { brand: 'Yamaha', model: 'RD 350', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/22055/rd350-exterior-right-side-view.jpeg' }
  ];

  for (const item of updates) {
    const result = await db.query(
      'UPDATE bikes SET image = ? WHERE brand = ? AND model = ?',
      [item.image, item.brand, item.model]
    );
    console.log(`Updated ${item.brand} ${item.model} -> changes: ${result[0].affectedRows}`);
  }
}

test();
