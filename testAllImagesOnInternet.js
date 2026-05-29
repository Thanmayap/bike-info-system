const https = require('https');
const http = require('http');
const db = require('./backend/config/db');

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    if (!urlStr) {
      resolve({ status: 0 });
      return;
    }
    
    // Normalize url if it doesn't start with http
    let finalUrl = urlStr;
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      finalUrl = `http://localhost:5000${urlStr}`;
    }
    
    // Clean &amp; entity encoding in query strings
    finalUrl = finalUrl.replace(/&amp;/g, '&');

    try {
      const url = new URL(finalUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(finalUrl, { 
        method: 'GET', 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        } 
      }, (res) => {
        resolve({ status: res.statusCode });
      });
      
      req.on('error', (err) => {
        resolve({ status: 500, error: err.message });
      });
      
      // Set timeout of 5 seconds to prevent hanging
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ status: 408 }); // timeout
      });
      
      req.end();
    } catch (e) {
      resolve({ status: 500, error: e.message });
    }
  });
}

async function run() {
  const [rows] = await db.query('SELECT id, brand, model, image FROM bikes');
  console.log(`Auditing ${rows.length} bike images...`);
  
  const failed = [];
  for (let i = 0; i < rows.length; i++) {
    const bike = rows[i];
    const res = await checkUrl(bike.image);
    if (res.status !== 200) {
      console.log(`[FAILED] ${bike.brand} ${bike.model} (Status: ${res.status}): ${bike.image}`);
      failed.push({ bike, status: res.status });
    } else {
      // console.log(`[OK] ${bike.brand} ${bike.model}`);
    }
  }
  
  console.log(`\nAudit completed. ${failed.length} failed images out of ${rows.length} total.`);
}

run().catch(console.error);
