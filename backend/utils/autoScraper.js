const https = require('https');
const db = require('../config/db');

const testBikes = [
  // Honda
  { brand: "Honda", model: "Activa (110)", path: "honda-bikes/activa" },
  { brand: "Honda", model: "Dio (110)", path: "honda-bikes/dio" },
  { brand: "Honda", model: "Activa 125", path: "honda-bikes/activa-125" },
  { brand: "Honda", model: "Dio 125", path: "honda-bikes/dio-125" },
  { brand: "Honda", model: "Activa e", path: "honda-bikes/activa-e" },
  { brand: "Honda", model: "QC1", path: "honda-bikes/qc1" },
  { brand: "Honda", model: "Shine 100", path: "honda-bikes/shine-100" },
  { brand: "Honda", model: "Livo", path: "honda-bikes/livo" },
  { brand: "Honda", model: "SP 125", path: "honda-bikes/sp-125" },
  { brand: "Honda", model: "CB 125 Hornet", path: "honda-bikes/cb-hornet-160r" },
  { brand: "Honda", model: "Unicorn", path: "honda-bikes/unicorn" },
  { brand: "Honda", model: "SP 160", path: "honda-bikes/sp160" },
  { brand: "Honda", model: "Hornet 2.0", path: "honda-bikes/hornet-2-0" },
  { brand: "Honda", model: "Shine 125", path: "honda-bikes/shine" },
  
  // Royal Enfield
  { brand: "Royal Enfield", model: "Classic 350", path: "royalenfield-bikes/classic-350" },
  { brand: "Royal Enfield", model: "Hunter 350", path: "royalenfield-bikes/hunter-350" },
  { brand: "Royal Enfield", model: "Meteor 350", path: "royalenfield-bikes/meteor-350" },
  { brand: "Royal Enfield", model: "Bullet 350", path: "royalenfield-bikes/bullet-350" },
  { brand: "Royal Enfield", model: "Classic 350 (Chrome)", path: "royalenfield-bikes/classic-350" },
  { brand: "Royal Enfield", model: "Himalayan 450", path: "royalenfield-bikes/himalayan" },
  { brand: "Royal Enfield", model: "Guerrilla 450", path: "royalenfield-bikes/guerrilla-450" },
  { brand: "Royal Enfield", model: "Scram 440", path: "royalenfield-bikes/scram-411" },
  { brand: "Royal Enfield", model: "Interceptor 650", path: "royalenfield-bikes/interceptor-650" },
  { brand: "Royal Enfield", model: "Continental GT 650", path: "royalenfield-bikes/continental-gt-650" },
  { brand: "Royal Enfield", model: "Super Meteor 650", path: "royalenfield-bikes/super-meteor-650" },
  { brand: "Royal Enfield", model: "Bear 650", path: "royalenfield-bikes/bear-650" },
  { brand: "Royal Enfield", model: "Flying Flea C6", path: "royalenfield-bikes/flying-flea-c6" },
  { brand: "Royal Enfield", model: "Flying Flea S6", path: "royalenfield-bikes/flying-flea-s6" },

  // TVS
  { brand: "TVS", model: "Sport", path: "tvs-bikes/sport" },
  { brand: "TVS", model: "TVS Radeon", path: "tvs-bikes/radeon" },
  { brand: "TVS", model: "Star City Plus", path: "tvs-bikes/star-city-plus" },
  { brand: "TVS", model: "Raider 125", path: "tvs-bikes/raider-125" },
  { brand: "TVS", model: "Apache RTR 160", path: "tvs-bikes/apache" },
  { brand: "TVS", model: "Apache RTR 160 4V", path: "tvs-bikes/apache-rtr-160-4v" },
  { brand: "TVS", model: "Apache RTR 180", path: "tvs-bikes/apache-rtr-180" },
  { brand: "TVS", model: "Apache RTR 200 4V", path: "tvs-bikes/apache-rtr-200-4v" },
  { brand: "TVS", model: "Ronin", path: "tvs-bikes/ronin" },
  { brand: "TVS", model: "Apache RTR 310", path: "tvs-bikes/apache-rtr-310" },
  { brand: "TVS", model: "Apache RTX 300", path: "tvs-bikes/apache-rtr-310" },
  { brand: "TVS", model: "Apache RR 310", path: "tvs-bikes/apache-rr-310" },
  { brand: "TVS", model: "Jupiter 110", path: "tvs-bikes/jupiter" },
  { brand: "TVS", model: "Jupiter 125", path: "tvs-bikes/jupiter-125" },
  { brand: "TVS", model: "Ntorq 125 Race Edition", path: "tvs-bikes/ntorq-125" },
  { brand: "TVS", model: "Ntorq 125 XT", path: "tvs-bikes/ntorq-125" },
  { brand: "TVS", model: "Scooty Pep+", path: "tvs-bikes/scooty-pep-plus" },
  { brand: "TVS", model: "Scooty Zest 110", path: "tvs-bikes/scooty-zest-110" },
  { brand: "TVS", model: "XL 100 Comfort", path: "tvs-bikes/xl100" },
  { brand: "TVS", model: "XL 100 Heavy Duty", path: "tvs-bikes/xl100" },
  { brand: "TVS", model: "iQube Standard", path: "tvs-bikes/iqube" },
  { brand: "TVS", model: "iQube S", path: "tvs-bikes/iqube" },
  { brand: "TVS", model: "iQube ST", path: "tvs-bikes/iqube" },

  // Yamaha
  { brand: "Yamaha", model: "YZF R15 V4", path: "yamaha-bikes/r15" },
  { brand: "Yamaha", model: "FZ-Fi Version 3.0", path: "yamaha-bikes/fz" },
  { brand: "Yamaha", model: "FZS-Fi Version 3.0", path: "yamaha-bikes/fzs-fi" },
  { brand: "Yamaha", model: "FZS-Fi Version 4.0 DLX", path: "yamaha-bikes/fzs-fi" },
  { brand: "Yamaha", model: "FZ-X", path: "yamaha-bikes/fz-x" },
  { brand: "Yamaha", model: "FZ Rave", path: "yamaha-bikes/fz" },
  { brand: "Yamaha", model: "FZ-S Fi Hybrid", path: "yamaha-bikes/fzs-fi" },
  { brand: "Yamaha", model: "FZ-X Hybrid", path: "yamaha-bikes/fz-x" },
  { brand: "Yamaha", model: "MT-15 Version 2.0", path: "yamaha-bikes/mt-15" },
  { brand: "Yamaha", model: "YZF-R15S V3", path: "yamaha-bikes/r15s" },
  { brand: "Yamaha", model: "YZF-R15 V4", path: "yamaha-bikes/r15" },
  { brand: "Yamaha", model: "YZF-R15M", path: "yamaha-bikes/r15" },
  { brand: "Yamaha", model: "XSR 155", path: "yamaha-bikes/xsr-155" },
  { brand: "Yamaha", model: "MT-03", path: "yamaha-bikes/mt-03" },
  { brand: "Yamaha", model: "YZF-R3", path: "yamaha-bikes/r3" },
  { brand: "Yamaha", model: "Fascino 125 Fi Hybrid", path: "yamaha-bikes/fascino-125" },
  { brand: "Yamaha", model: "New Fascino 125 Fi", path: "yamaha-bikes/fascino-125" },
  { brand: "Yamaha", model: "RayZR 125 Fi Hybrid", path: "yamaha-bikes/ray-zr-125" },
  { brand: "Yamaha", model: "RayZR Street Rally 125 Fi", path: "yamaha-bikes/ray-zr-125" },
  { brand: "Yamaha", model: "Aerox 155 Version S", path: "yamaha-bikes/aerox-155" },

  // KTM
  { brand: "KTM", model: "Duke 390", path: "ktm-bikes/390-duke" },

  // Bajaj
  { brand: "Bajaj", model: "Pulsar NS200", path: "bajaj-bikes/pulsar-ns" },

  // Ola
  { brand: "Ola", model: "S1 Pro", path: "ola-bikes/s1-pro" }
];

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
  
  // Clean matches from trailing quotes or backslashes
  const cleanMatches = matches.map(m => m.split(/[\\'"]/)[0]);
  
  // Try to find right-side-view with extensions png or jpeg
  const rightSide = cleanMatches.find(m => m.includes('right-side-view') && m.includes('/cw/ec/'));
  if (rightSide) return rightSide;
  
  // Try to find any right-front-three-quarter
  const threeQuarter = cleanMatches.find(m => m.includes('right-front-three-quarter') && m.includes('/cw/ec/'));
  if (threeQuarter) return threeQuarter;

  // Try to find any /cw/ec/
  const anyCwEc = cleanMatches.find(m => m.includes('/cw/ec/'));
  if (anyCwEc) return anyCwEc;
  
  return cleanMatches[0] || null;
}

async function run() {
  const sqliteDb = await db.getDbInstance();
  console.log('Starting image extraction scraper from Bikewale...');
  
  let successCount = 0;
  for (const bike of testBikes) {
    const url = `https://www.bikewale.com/${bike.path}/`;
    const html = await fetchHtml(url);
    let img = extractImage(html);
    
    // Check if it's a valid URL or null
    if (img) {
      console.log(`[FOUND] ${bike.brand} ${bike.model} -> ${img}`);
      // Update database
      const result = await sqliteDb.run(
        'UPDATE bikes SET image = ? WHERE brand = ? AND model = ?',
        [img, bike.brand, bike.model]
      );
      if (result.changes > 0) {
        successCount++;
      }
    } else {
      console.warn(`[NOT FOUND] ${bike.brand} ${bike.model} (URL: ${url})`);
      // Try fallback Unsplash image to make it look spectacular if the scrape fails
      const fallbackUrl = `https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80`;
      const result = await sqliteDb.run(
        'UPDATE bikes SET image = ? WHERE brand = ? AND model = ? AND (image IS NULL OR image LIKE "%aeplcdn.com/664x374%")',
        [fallbackUrl, bike.brand, bike.model]
      );
      if (result.changes > 0) {
        successCount++;
        console.log(`[FALLBACK] Updated ${bike.brand} ${bike.model} to premium Unsplash image`);
      }
    }
  }
  
  console.log(`Finished. Successfully updated ${successCount} bikes.`);
  process.exit(0);
}

run().catch(console.error);
