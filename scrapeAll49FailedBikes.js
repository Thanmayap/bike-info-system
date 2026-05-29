const https = require('https');
const db = require('./backend/config/db');

const customPaths = {
  // Hero
  "Hero|Splendor Plus": "hero-bikes/splendor-plus",
  "Hero|Splendor Plus Xtec": "hero-bikes/splendor-plus-xtec",
  "Hero|Splendor Plus Xtec 2.0": "hero-bikes/splendor-plus-xtec",
  "Hero|HF Deluxe": "hero-bikes/hf-deluxe",
  "Hero|HF 100": "hero-bikes/hf-100",
  "Hero|Passion Plus": "hero-bikes/passion-plus",
  "Hero|Passion Pro": "hero-bikes/passion-pro",
  "Hero|Passion XPro": "hero-bikes/passion-pro",
  "Hero|Splendor Pro": "hero-bikes/splendor-plus",
  "Hero|Splendor NXG": "hero-bikes/splendor-plus",
  "Hero|Super Splendor": "hero-bikes/super-splendor",
  "Hero|Super Splendor Xtec": "hero-bikes/super-splendor-xtec",
  "Hero|Glamour": "hero-bikes/glamour",
  "Hero|Glamour Xtec": "hero-bikes/glamour-xtec",
  "Hero|Glamour Fi": "hero-bikes/glamour",
  "Hero|Xtreme 125R": "hero-bikes/xtreme-125r",
  "Hero|Xtreme 160R": "hero-bikes/xtreme-160r",
  "Hero|Xtreme 160R 4V": "hero-bikes/xtreme-160r-4v",
  "Hero|CBZ Xtreme": "hero-bikes/glamour",
  "Hero|Hunk": "hero-bikes/glamour",
  "Hero|Impulse": "hero-bikes/xpulse-200-4v",
  "Hero|Xpulse 200 4V": "hero-bikes/xpulse-200-4v",
  "Hero|Xpulse 210": "hero-bikes/xpulse-210",
  "Hero|Karizma XMR": "hero-bikes/karizma-xmr",
  "Hero|Xtreme 250R": "hero-bikes/xtreme-250r",
  "Hero|Mavrick 440": "hero-bikes/mavrick-440",
  
  // TVS
  "TVS|Star City Plus": "tvs-bikes/star-city-plus",
  "TVS|TVS Centra": "tvs-bikes/radeon", // Discontinued, use Radeon
  "TVS|Apache RTR 180": "tvs-bikes/apache-rtr-180",
  "TVS|Apache RTR 200 4V": "tvs-bikes/apache-rtr-200-4v",
  "TVS|Suzuki Fiero": "tvs-bikes/apache", // Discontinued, use Apache 160
  "TVS|XL 100 Comfort": "tvs-bikes/xl100",
  "TVS|XL 100 Heavy Duty": "tvs-bikes/xl100",
  "TVS|XL Champ": "tvs-bikes/xl100", // Discontinued, use XL 100
  "TVS|Scooty Pep+": "tvs-bikes/scooty-pep-plus",
  "TVS|Scooty Zest 110": "tvs-bikes/scooty-zest-110",
  "TVS|TVS Stile": "tvs-bikes/scooty-zest-110", // Discontinued, use Zest 110
  
  // Yamaha
  "Yamaha|FZS-Fi Version 3.0": "yamaha-bikes/fzs-fi",
  "Yamaha|FZ-S Fi Hybrid": "yamaha-bikes/fzs-fi",
  "Yamaha|YZF-R15S V3": "yamaha-bikes/r15s",
  
  // Royal Enfield
  "Royal Enfield|Bullet 350": "royalenfield-bikes/bullet-350",
  "Royal Enfield|Interceptor 650": "royalenfield-bikes/interceptor-650",
  "Royal Enfield|Continental GT 650": "royalenfield-bikes/continental-gt-650",
  
  // Honda
  "Honda|CB 125 Hornet": "honda-bikes/sp-125",
  "Honda|Hornet 2.0": "honda-bikes/hornet-2-0"
};

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        resolve('');
        return;
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', () => resolve(''));
  });
}

function extractImage(html) {
  if (!html) return null;
  const regex = /https:\/\/imgd\.aeplcdn\.com\/[^\s"'>]+/g;
  const matches = html.match(regex) || [];
  
  // Clean matches from trailing quotes or backslashes
  const cleanMatches = [...new Set(matches.map(m => m.split(/[\\'"]/)[0].replace(/&amp;/g, '&')))];
  
  // Try to find right-side-view with /cw/ec/
  const rightSide = cleanMatches.find(m => m.includes('right-side-view') && m.includes('/cw/ec/'));
  if (rightSide) return rightSide;
  
  // Try to find right-front-three-quarter
  const threeQuarter = cleanMatches.find(m => m.includes('right-front-three-quarter') && m.includes('/cw/ec/'));
  if (threeQuarter) return threeQuarter;

  // Try to find any /cw/ec/ with image extension
  const anyCwEc = cleanMatches.find(m => m.includes('/cw/ec/') && (m.includes('.jpeg') || m.includes('.png') || m.includes('.webp')));
  if (anyCwEc) return anyCwEc;
  
  return cleanMatches.find(m => m.includes('/cw/ec/')) || cleanMatches[0] || null;
}

async function run() {
  const sqliteDb = await db.getDbInstance();
  console.log('Starting image extraction scraper for failed bikes...');
  
  let successCount = 0;
  for (const [key, path] of Object.entries(customPaths)) {
    const [brand, model] = key.split('|');
    const url = `https://www.bikewale.com/${path}/`;
    const html = await fetchHtml(url);
    let img = extractImage(html);
    
    if (img) {
      console.log(`[FOUND] ${brand} ${model} -> ${img}`);
      const result = await sqliteDb.run(
        'UPDATE bikes SET image = ? WHERE brand = ? AND model = ?',
        [img, brand, model]
      );
      if (result.changes > 0) {
        successCount++;
      }
    } else {
      console.warn(`[NOT FOUND] ${brand} ${model} (URL: ${url})`);
    }
  }
  
  console.log(`Finished. Successfully updated ${successCount} bikes.`);
  process.exit(0);
}

run().catch(console.error);
