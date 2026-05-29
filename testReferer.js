const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, headers: res.headers });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    }).end();
  });
}

async function run() {
  console.log(await checkUrl("https://www.bikewale.com/royalenfield-bikes/flying-flea-c6/"));
  console.log(await checkUrl("https://www.bikewale.com/royalenfield-bikes/flying-flea/"));
  console.log(await checkUrl("https://www.bikewale.com/royalenfield-bikes/flyingflea-c6/"));
}

run();
