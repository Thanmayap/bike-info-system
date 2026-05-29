const https = require('https');

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    https.request(urlStr, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url: urlStr, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url: urlStr, error: err.message });
    }).end();
  });
}

async function run() {
  const resolutions = ['272x153', '476x268', '1056x594', '664x374'];
  const testCases = [
    { name: 'rx-100', path: 'n/cw/ec/133649/rx-100-right-front-three-quarter.jpeg' },
    { name: 'rx-135', path: 'n/cw/ec/20562/rx-135-exterior-right-side-view.jpeg' },
    { name: 'rd350', path: 'n/cw/ec/22055/rd350-exterior-right-side-view.jpeg' }
  ];
  
  for (const tc of testCases) {
    console.log(`--- Testing ${tc.name} ---`);
    for (const res of resolutions) {
      const url = `https://imgd.aeplcdn.com/${res}/${tc.path}`;
      console.log(await checkUrl(url));
    }
  }
}

run();
