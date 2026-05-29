const fs = require('fs');
const path = require('path');
const https = require('https');
const db = require('./config/db');

const imagesToDownload = [
  { model: 'X440', url: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?w=800&q=80' },
  { model: 'Fat Boy 114', url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80' },
  { model: 'Iron 883', url: 'https://images.unsplash.com/photo-1558980394-0a06c4631733?w=800&q=80' },
  { model: 'Street 750', url: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&q=80' },
  { model: 'Pan America 1250', url: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?w=800&q=80' },
  { model: 'Sportster S', url: 'https://images.unsplash.com/photo-1558980663-3685c656d315?w=800&q=80' }
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
