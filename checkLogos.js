const fs = require('fs');
const https = require('https');
const http = require('http');

const content = fs.readFileSync('frontend/src/components/SimilarBrands.jsx', 'utf8');

const regex = /logo:\s*'([^']+)'/g;
let match;
const urls = [];
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

console.log(`Checking ${urls.length} urls...`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 301 && res.statusCode !== 302) {
        resolve({ url, status: res.statusCode });
      } else {
        resolve(null);
      }
    }).on('error', (err) => {
      resolve({ url, status: err.message });
    });
    req.setTimeout(3000, () => {
      req.abort();
      resolve({ url, status: 'TIMEOUT' });
    });
  });
}

async function run() {
  const promises = urls.map(url => checkUrl(url));
  const results = await Promise.all(promises);
  const failed = results.filter(r => r !== null);
  console.log(`Failed URLs (${failed.length}):`);
  failed.forEach(f => console.log(`[${f.status}] ${f.url}`));
}

run();
