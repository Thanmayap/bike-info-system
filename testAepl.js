const https = require('https');

const urls = [
  'https://imgd.aeplcdn.com/0x0/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/104x42/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/200x200/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/0x0/n/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/104x42/n/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/164x64/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/164x64/n/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/0x0/bw/brands/logos/royal-enfield.png',
  'https://imgd.aeplcdn.com/0x0/n/bw/brands/logos/royal-enfield.png',
  'https://imgd.aeplcdn.com/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/n/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/664x374/bw/brands/colors/royal-enfield.png',
  'https://imgd.aeplcdn.com/664x374/n/bw/brands/colors/royal-enfield.png'
];

urls.forEach(url => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log(`Status ${res.statusCode} for ${url}`);
  }).on('error', (e) => {
    console.log(`Error ${e.message} for ${url}`);
  });
});
