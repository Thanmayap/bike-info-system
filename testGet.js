const https = require('https');

const url = "https://imgd.aeplcdn.com/664x374/n/cw/ec/159751/hunter-350-right-side-view.jpeg";

function getUrl() {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        // just read the start
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  console.log(await getUrl());
}

run();
