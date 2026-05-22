const https = require('https');

const url = "https://imgd.aeplcdn.com/664x374/n/cw/ec/159751/hunter-350-right-side-view.jpeg";

function checkWithReferer(referer) {
  return new Promise((resolve) => {
    const headers = referer ? { 'Referer': referer } : {};
    https.request(url, { method: 'HEAD', headers }, (res) => {
      resolve({ referer, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ referer, error: err.message });
    }).end();
  });
}

async function run() {
  console.log(await checkWithReferer(null));
  console.log(await checkWithReferer("http://localhost:5173/"));
  console.log(await checkWithReferer("https://www.bikewale.com/"));
}

run();
