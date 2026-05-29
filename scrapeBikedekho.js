const https = require('https');

https.get('https://www.bikedekho.com/new-bikes', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = new Set();
    const regex = /https:\/\/stimg\.cardekho\.com[^"'\s]+/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      if (match[0].toLowerCase().includes('logo') || match[0].toLowerCase().includes('brand')) {
        urls.add(match[0]);
      }
    }
    console.log(`Found ${urls.size} urls on bikedekho:`);
    console.log(Array.from(urls).slice(0, 30).join('\n'));
  });
}).on('error', (e) => console.log(e));
