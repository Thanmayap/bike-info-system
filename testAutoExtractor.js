const https = require('https');

const testBikes = [
  { brand: "Royal Enfield", model: "Classic 350", path: "royalenfield-bikes/classic-350" },
  { brand: "Royal Enfield", model: "Hunter 350", path: "royalenfield-bikes/hunter-350" },
  { brand: "TVS", model: "Apache RTR 160 4V", path: "tvs-bikes/apache-rtr-160-4v" },
  { brand: "TVS", model: "Raider 125", path: "tvs-bikes/raider-125" },
  { brand: "Yamaha", model: "MT-15 Version 2.0", path: "yamaha-bikes/mt15" },
  { brand: "Yamaha", model: "YZF R15 V4", path: "yamaha-bikes/yzf-r15" },
  { brand: "Hero", model: "Splendor Plus", path: "hero-bikes/splendor-plus" },
  { brand: "Hero", model: "Xtreme 125R", path: "hero-bikes/xtreme-125r" }
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
  
  // Try to find right-side-view
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
  for (const bike of testBikes) {
    const url = `https://www.bikewale.com/${bike.path}/`;
    const html = await fetchHtml(url);
    const img = extractImage(html);
    console.log(`${bike.brand} ${bike.model} ->`, img);
  }
}

run();
