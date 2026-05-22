const https = require('https');

const url = "https://www.bikewale.com/royalenfield-bikes/classic-350/";

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        resolve(html);
      });
    }).on('error', (err) => {
      resolve('');
    });
  });
}

async function run() {
  const html = await fetchHtml(url);
  console.log("HTML length:", html.length);
  // Find all matches for imgd.aeplcdn.com
  const regex = /https:\/\/imgd\.aeplcdn\.com\/[^"']+/g;
  const matches = html.match(regex) || [];
  console.log("Found aeplcdn matches:", matches.slice(0, 10));
}

run();
