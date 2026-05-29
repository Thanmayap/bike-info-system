const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const html = await fetchHtml('https://www.bikewale.com/royalenfield-bikes/flying-flea/');
  console.log(`Fetched HTML. Length: ${html.length}`);
  
  // Find all images matching aeplcdn
  const regex = /https:\/\/imgd\.aeplcdn\.com\/[^\s"'>]+/g;
  const matches = html.match(regex) || [];
  const cleanMatches = [...new Set(matches.map(m => m.split(/[\\'"]/)[0]))];
  
  console.log('Clean aeplcdn Matches:');
  cleanMatches.forEach(m => console.log(m));
}

run();
