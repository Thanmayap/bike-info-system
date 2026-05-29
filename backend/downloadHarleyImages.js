const fs = require('fs');
const path = require('path');
const https = require('https');
const db = require('./config/db');

const imagesToDownload = [
  { model: 'X440', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/151323/x440-right-side-view.jpeg' },
  { model: 'Fat Boy 114', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/150035/fat-boy-right-side-view.jpeg' },
  { model: 'Iron 883', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48209/harley-davidson-iron-883-right-side-view-4.jpeg' },
  { model: 'Street 750', url: 'https://imgd.aeplcdn.com/664x374/bw/ec/32187/harley-davidson-street-750-right-side-view-5.jpeg' },
  { model: 'Pan America 1250', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/95837/pan-america-1250-right-side-view-13.jpeg' },
  { model: 'Sportster S', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/101287/sportster-s-right-side-view-2.jpeg' }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function run() {
  const sqlite = await db.getDbInstance();
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  for (const item of imagesToDownload) {
    const filename = `harley-${item.model.toLowerCase().replace(/ /g, '-')}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    try {
      await downloadImage(item.url, filepath);
      await sqlite.run(`UPDATE bikes SET image = ? WHERE brand = 'Harley-Davidson' AND model = ?`, [`/uploads/${filename}`, item.model]);
      console.log(`Downloaded and updated image for ${item.model}`);
    } catch (e) {
      console.error(`Failed to download image for ${item.model}:`, e.message);
    }
  }
}

run();
