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
  const resolutions = ['476x268', '272x153', '1056x594', '1280x720', '664x374'];
  const path = 'n/cw/ec/23279/apache-rtr-180-right-side-view.jpeg';
  
  for (const res of resolutions) {
    const url = `https://imgd.aeplcdn.com/${res}/${path}`;
    console.log(await checkUrl(url));
  }
}

run();
