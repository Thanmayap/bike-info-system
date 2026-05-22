const https = require('https');
const db = require('../config/db');

const overrides = {
  "Yamaha|YZF R15 V4": "yamaha-bikes/r15",
  "Yamaha|YZF-R15 V4": "yamaha-bikes/r15",
  "Yamaha|YZF-R15S V3": "yamaha-bikes/r15s",
  "Yamaha|YZF-R15M": "yamaha-bikes/r15m",
  "Yamaha|MT-15 Version 2.0": "yamaha-bikes/mt-15",
  "Yamaha|XSR 155": "yamaha-bikes/mt-15",
  "Yamaha|FZ-Fi Version 3.0": "yamaha-bikes/fz-v3",
  "Yamaha|FZS-Fi Version 3.0": "yamaha-bikes/fz-s",
  "Yamaha|FZS-Fi Version 4.0 DLX": "yamaha-bikes/fzs-fi-v4",
  "Yamaha|FZ-X": "yamaha-bikes/fz-x",
  "Yamaha|FZ-X Hybrid": "yamaha-bikes/fz-x",
  "Yamaha|FZ Rave": "yamaha-bikes/fz-v3",
  "Yamaha|FZ-S Fi Hybrid": "yamaha-bikes/fz-s",
  "Yamaha|MT-03": "yamaha-bikes/mt-03",
  "Yamaha|YZF-R3": "yamaha-bikes/r3",
  "Yamaha|YZF-R1": "yamaha-bikes/r1",
  "Yamaha|Fascino 125 Fi Hybrid": "yamaha-bikes/fascino-125",
  "Yamaha|New Fascino 125 Fi": "yamaha-bikes/fascino-125",
  "Yamaha|RayZR 125 Fi Hybrid": "yamaha-bikes/ray-zr-125",
  "Yamaha|RayZR Street Rally 125 Fi": "yamaha-bikes/ray-zr-125",
  "Yamaha|Aerox 155 Version S": "yamaha-bikes/aerox-155",

  "Royal Enfield|Classic 350": "royalenfield-bikes/classic-350",
  "Royal Enfield|Classic 350 (Retro)": "royalenfield-bikes/classic-350",
  "Royal Enfield|Bullet 350": "royalenfield-bikes/bullet",
  "Royal Enfield|Classic 350 (Chrome)": "royalenfield-bikes/classic-350",
  "Royal Enfield|Hunter 350": "royalenfield-bikes/hunter-350",
  "Royal Enfield|Meteor 350": "royalenfield-bikes/meteor-350",
  "Royal Enfield|Himalayan 450": "royalenfield-bikes/himalayan",
  "Royal Enfield|Guerrilla 450": "royalenfield-bikes/guerrilla-450",
  "Royal Enfield|Scram 440": "royalenfield-bikes/scram-411",
  "Royal Enfield|Interceptor 650": "royalenfield-bikes/interceptor",
  "Royal Enfield|Continental GT 650": "royalenfield-bikes/continental-gt",
  "Royal Enfield|Super Meteor 650": "royalenfield-bikes/super-meteor-650",
  "Royal Enfield|Bear 650": "royalenfield-bikes/bear-650",
  "Royal Enfield|Flying Flea C6": "royalenfield-bikes/flying-flea",
  "Royal Enfield|Flying Flea S6": "royalenfield-bikes/flying-flea",

  "TVS|Apache RTR 160": "tvs-bikes/apache-160",
  "TVS|Apache RTR 160 4V": "tvs-bikes/apache-rtr-160-4v",
  "TVS|Apache RTR 180": "tvs-bikes/apache-180",
  "TVS|Apache RTR 200 4V": "tvs-bikes/apache-200",
  "TVS|Apache RR 310": "tvs-bikes/apache-rr-310",
  "TVS|Apache RTR 310": "tvs-bikes/apache-rtr-310",
  "TVS|Apache RTX 300": "tvs-bikes/apache-rtr-310",
  "TVS|TVS Radeon": "tvs-bikes/radeon",
  "TVS|Sport": "tvs-bikes/sport",
  "TVS|Star City Plus": "tvs-bikes/star-city",
  "TVS|Jupiter 110": "tvs-bikes/jupiter",
  "TVS|Jupiter 125": "tvs-bikes/jupiter-125",
  "TVS|Ntorq 125 Race Edition": "tvs-bikes/ntorq-125",
  "TVS|Ntorq 125 XT": "tvs-bikes/ntorq-125",
  "TVS|Scooty Pep+": "tvs-bikes/scooty-pep-plus",
  "TVS|Scooty Zest 110": "tvs-bikes/scooty-zest",
  "TVS|XL 100 Comfort": "tvs-bikes/xl100",
  "TVS|XL 100 Heavy Duty": "tvs-bikes/xl100",
  "TVS|iQube Standard": "tvs-bikes/iqube",
  "TVS|iQube S": "tvs-bikes/iqube",
  "TVS|iQube ST": "tvs-bikes/iqube",
  "TVS|Raider 125": "tvs-bikes/raider-125",
  "TVS|Ronin": "tvs-bikes/ronin",
  "TVS|Suzuki Samurai": "tvs-bikes/samurai",
  "TVS|Suzuki Shogun": "tvs-bikes/samurai",

  "Hero|Splendor Plus": "hero-bikes/splendor-plus",
  "Hero|Splendor Plus Xtec": "hero-bikes/splendor-plus-xtec",
  "Hero|Splendor Plus Xtec 2.0": "hero-bikes/splendor-plus",
  "Hero|HF Deluxe": "hero-bikes/hf-deluxe",
  "Hero|HF 100": "hero-bikes/hf-deluxe",
  "Hero|CD 100": "hero-bikes/hf-deluxe",
  "Hero|CD 100 SS": "hero-bikes/hf-deluxe",
  "Hero|Joy": "hero-bikes/hf-deluxe",
  "Hero|Sleek": "hero-bikes/hf-deluxe",
  "Hero|Street": "hero-bikes/hf-deluxe",
  "Hero|Passion Plus": "hero-bikes/passion-plus",
  "Hero|Passion Pro": "hero-bikes/passion-plus",
  "Hero|Passion XPro": "hero-bikes/passion-plus",
  "Hero|Super Splendor": "hero-bikes/super-splendor",
  "Hero|Super Splendor Xtec": "hero-bikes/super-splendor-xtec",
  "Hero|Glamour": "hero-bikes/glamour",
  "Hero|Glamour Xtec": "hero-bikes/glamour-xtec",
  "Hero|Glamour Fi": "hero-bikes/glamour",
  "Hero|Xtreme 125R": "hero-bikes/xtreme-125r",
  "Hero|Xtreme 160R": "hero-bikes/xtreme-160r",
  "Hero|Xtreme 160R 4V": "hero-bikes/xtreme-160r-4v",
  "Hero|Xpulse 200 4V": "hero-bikes/xpulse-200-4v",
  "Hero|Xpulse 210": "hero-bikes/xpulse-200-4v",
  "Hero|Karizma XMR": "hero-bikes/karizma-xmr",
  "Hero|Mavrick 440": "hero-bikes/mavrick-440",
  "Hero|Splendor Pro": "hero-bikes/splendor-plus",
  "Hero|Splendor NXG": "hero-bikes/splendor-plus",
  "Hero|CBZ Xtreme": "hero-bikes/cbz",
  "Hero|Hunk": "hero-bikes/hunk",
  "Hero|Impulse": "hero-bikes/xpulse-200-4v"
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
      res.on('end', () => {
        resolve(html);
      });
    }).on('error', () => {
      resolve('');
    });
  });
}

function extractImage(html) {
  if (!html) return null;
  const regex = /https:\/\/imgd\.aeplcdn\.com\/[^\s"'>]+/g;
  const matches = html.match(regex) || [];
  
  const cleanMatches = matches.map(m => m.split(/[\\'"]/)[0]);
  
  // Try to find right-side-view
  const rightSide = cleanMatches.find(m => m.includes('right-side-view') && m.includes('/cw/ec/'));
  if (rightSide) return rightSide;
  
  // Try to find right-front-three-quarter
  const threeQuarter = cleanMatches.find(m => m.includes('right-front-three-quarter') && m.includes('/cw/ec/'));
  if (threeQuarter) return threeQuarter;

  // Try to find any /cw/ec/
  const anyCwEc = cleanMatches.find(m => m.includes('/cw/ec/'));
  if (anyCwEc) return anyCwEc;
  
  return cleanMatches[0] || null;
}

function cleanSlug(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCandidatePaths(brand, model) {
  const key = `${brand}|${model}`;
  if (overrides[key]) {
    return [overrides[key]];
  }

  let brandSlug = cleanSlug(brand);
  if (brandSlug === 'royal-enfield') brandSlug = 'royalenfield';
  if (brandSlug === 'ola') brandSlug = 'ola';

  const modelSlug = cleanSlug(model);
  const candidates = new Set();

  candidates.add(`${brandSlug}-bikes/${modelSlug}`);

  const noParens = model.replace(/\([^)]*\)/g, '').trim();
  if (noParens !== model) {
    candidates.add(`${brandSlug}-bikes/${cleanSlug(noParens)}`);
  }

  let cleanedModel = model
    .replace(/\b(version\s+\d+(\.\d+)?|v\d+(\.\d+)?|race\s+edition|edition|std|dlx|retro|chrome|hybrid|electric)\b/gi, '')
    .trim();
  if (cleanedModel !== model) {
    candidates.add(`${brandSlug}-bikes/${cleanSlug(cleanedModel)}`);
  }

  const words = model.split(/\s+/);
  if (words.length > 2) {
    candidates.add(`${brandSlug}-bikes/${cleanSlug(words.slice(0, 2).join(' '))}`);
  }
  if (words.length > 1) {
    candidates.add(`${brandSlug}-bikes/${cleanSlug(words[0])}`);
  }

  return Array.from(candidates);
}

async function migrate() {
  const sqliteDb = await db.getDbInstance();
  const [bikes] = await db.query("SELECT id, brand, model, image FROM bikes");
  
  console.log(`Starting image migration for ${bikes.length} bikes...`);
  
  let updatedCount = 0;
  
  for (const bike of bikes) {
    const { id, brand, model } = bike;
    const candidates = getCandidatePaths(brand, model);
    let foundImage = null;
    let successfulPath = null;
    
    for (const path of candidates) {
      const url = `https://www.bikewale.com/${path}/`;
      const html = await fetchHtml(url);
      const img = extractImage(html);
      if (img) {
        foundImage = img;
        successfulPath = path;
        break;
      }
    }
    
    if (foundImage) {
      // Decode HTML entities if present (like &amp;)
      const cleanImg = foundImage.replace(/&amp;/g, '&');
      await sqliteDb.run("UPDATE bikes SET image = ? WHERE id = ?", [cleanImg, id]);
      console.log(`[SUCCESS] ${brand} ${model} -> ${cleanImg}`);
      updatedCount++;
    } else {
      console.log(`[FAILED] Could not find image for ${brand} ${model}`);
    }
  }
  
  console.log(`Image migration finished. Updated ${updatedCount} / ${bikes.length} bikes.`);
}

migrate().catch(console.error);
