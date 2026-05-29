const https = require('https');

function test(urlStr) {
  return new Promise((resolve) => {
    https.request(urlStr, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url: urlStr, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url: urlStr, error: err.message });
    }).end();
  });
}

async function run() {
  console.log(await test("https://imgd.aeplcdn.com/664x374/n/cw/ec/134309/fzs-fi-right-side-view.jpeg"));
}

run();
