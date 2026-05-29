const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      console.log(`Status for ${url}: ${res.statusCode}`);
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        console.log(`Redirect Location: ${res.headers.location}`);
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', (err) => {
      console.error(err);
      resolve('');
    });
  });
}

async function run() {
  const html = await fetchHtml('https://www.bikewale.com/yamaha-bikes/fzs-fi/');
  console.log(`HTML Length: ${html.length}`);
  
  // Find all images matching aeplcdn
  const regex = /https:\/\/imgd\.aeplcdn\.com\/[^\s"'>]+/g;
  const matches = html.match(regex) || [];
  console.log(`Found ${matches.length} matches:`);
  matches.slice(0, 10).forEach(m => console.log(m));
}

run();
