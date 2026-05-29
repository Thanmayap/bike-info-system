const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    }).end();
  });
}

async function run() {
  const urls = [
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/220422/flying-flea-right-side-view.webp",
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/220524/flying-flea-right-side-view.webp",
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/220270/flying-flea-right-front-three-quarter.jpeg",
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/191551/flying-flea-s6-scrambler-right-side-view-2.jpeg"
  ];
  
  for (const url of urls) {
    console.log(await checkUrl(url));
  }
}

run();
