const https = require('https');

https.get('https://www.bikewale.com/bikes/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find img elements containing aeplcdn and brand
    const regex = /<img[^>]+src=["'](https:\/\/imgd\.aeplcdn\.com[^"']+brands[^"']+)["'][^>]*>/gi;
    let match;
    const urls = new Set();
    while ((match = regex.exec(data)) !== null) {
      urls.add(match[1]);
    }
    console.log(Array.from(urls).join('\n'));
  });
});
