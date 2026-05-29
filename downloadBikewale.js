const fs = require('fs');
const https = require('https');
const path = require('path');

const brands = [
  { name: 'Royal Enfield', slug: 'royal-enfield' },
  { name: 'TVS', slug: 'tvs' },
  { name: 'Bajaj', slug: 'bajaj' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Yamaha', slug: 'yamaha' },
  { name: 'Hero', slug: 'hero' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'KTM', slug: 'ktm' },
  { name: 'Triumph', slug: 'triumph' },
  { name: 'Kawasaki', slug: 'kawasaki' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Ducati', slug: 'ducati' },
  { name: 'Harley-Davidson', slug: 'harley-davidson' },
  { name: 'Husqvarna', slug: 'husqvarna' },
  { name: 'Indian', slug: 'indian' },
  { name: 'Aprilia', slug: 'aprilia' },
  { name: 'Benelli', slug: 'benelli' },
  { name: 'MV Agusta', slug: 'mv-agusta' },
  { name: 'Moto Guzzi', slug: 'moto-guzzi' },
  { name: 'Jawa', slug: 'jawa' }
];

const dir = 'frontend/public/brands';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function downloadLogo(brand) {
  return new Promise((resolve) => {
    // Bikewale standard logo path
    const url = `https://imgd.aeplcdn.com/0x0/cw/static/brands/${brand.slug}.png`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.log(`Failed ${brand.name} (Bikewale) - Status ${res.statusCode}`);
        // Fallback to Clearbit if Bikewale fails
        let domain = brand.slug.replace('-', '') + '.com';
        if (brand.name === 'Yamaha') domain = 'yamaha-motor.com';
        if (brand.name === 'Hero') domain = 'heromotocorp.com';
        if (brand.name === 'Triumph') domain = 'triumphmotorcycles.co.uk';
        if (brand.name === 'Royal Enfield') domain = 'royalenfield.com';
        
        https.get(`https://logo.clearbit.com/${domain}`, (res2) => {
            if (res2.statusCode !== 200) {
                 resolve(false); return;
            }
            const filename = brand.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
            const dest = path.join(dir, filename);
            const file = fs.createWriteStream(dest);
            res2.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => resolve(false));
        return;
      }
      
      const filename = brand.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
      const dest = path.join(dir, filename);
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', (err) => {
      resolve(false);
    });
  });
}

async function run() {
  console.log('Downloading logos...');
  await Promise.all(brands.map(b => downloadLogo(b)));
  console.log('Done');
}
run();
