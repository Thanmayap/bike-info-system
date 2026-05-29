const fs = require('fs');
const https = require('https');
const path = require('path');

const content = fs.readFileSync('frontend/src/components/SimilarBrands.jsx', 'utf8');

const regex = /{ name: '([^']+)', logo: '([^']+)' }/g;
let match;
const brands = [];
while ((match = regex.exec(content)) !== null) {
  brands.push({ name: match[1], url: match[2] });
}

const dir = 'frontend/public/brands';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function downloadLogo(brand) {
  return new Promise((resolve) => {
    let url = brand.url;
    // For clearbit/gstatic, use as is, for wikipedia, use a fake user agent
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };
    
    // Fix wikipedia URLs
    if (url.includes('wikipedia')) {
        // They should work with User-Agent
    } else if (url.includes('faviconV2')) {
        // These work too
    }

    const req = https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
         // handle redirect
         https.get(res.headers.location, options, (res2) => {
             const ext = url.includes('.svg') ? '.svg' : '.png';
             const filename = brand.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ext;
             const dest = path.join(dir, filename);
             const file = fs.createWriteStream(dest);
             res2.pipe(file);
             file.on('finish', () => { file.close(); resolve(true); });
         }).on('error', () => resolve(false));
         return;
      }

      if (res.statusCode !== 200) {
        console.log(`Failed ${brand.name} with status ${res.statusCode}`);
        resolve(false);
        return;
      }
      
      const ext = url.includes('.svg') ? '.svg' : '.png';
      const filename = brand.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ext;
      const dest = path.join(dir, filename);
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      console.log(`Error ${brand.name}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
        req.abort();
        resolve(false);
    });
  });
}

async function run() {
  console.log(`Downloading ${brands.length} logos...`);
  const promises = brands.map(b => downloadLogo(b));
  await Promise.all(promises);
  console.log('Finished downloading logos.');
}

run();
