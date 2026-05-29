const https = require('https');
const http = require('http');

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    client.request(urlStr, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url: urlStr, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url: urlStr, error: err.message });
    }).end();
  });
}

async function run() {
  const urls = [
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/134309/fzs-fi-right-side-view.jpeg",
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/20562/rx-135-exterior-right-side-view.jpeg",
    "https://imgd.aeplcdn.com/272x153/n/cw/ec/199227/fz-s-hybrid-right-side-view-3.png?isig=0&amp;q=80",
    "https://imgd.aeplcdn.com/310x174/n/cw/ec/171099/z650rs-right-side-view.png?isig=0"
  ];
  for (const url of urls) {
    console.log(await checkUrl(url));
  }
}

run();
