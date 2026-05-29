const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/SimilarBrands.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Mapping for imgd.aeplcdn.com brands to domains or wikimedia SVGs
const manualMap = {
  'BMW': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
  'Ducati': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Ducati_red_logo.svg',
  'Harley-Davidson': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Harley-Davidson_logo.svg',
  'Husqvarna': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Husqvarna_Motorcycles_Logo.svg',
  'Indian': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Indian_Motorcycle_logo.svg',
  'Aprilia': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Aprilia_logo.svg',
  'Benelli': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Benelli_logo.svg',
  'MV Agusta': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/MV_Agusta_logo.svg',
  'Moto Guzzi': 'https://upload.wikimedia.org/wikipedia/commons/2/26/Moto_Guzzi_logo.svg',
  'Jawa': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Jawa_Motors_logo.svg',
  'Vespa': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Vespa_logo.svg',
  'Piaggio': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Piaggio_logo.svg'
};

// Regex to find all brands and replace their URLs
// { name: 'BMW', logo: 'https://imgd.aeplcdn.com/0x0/bw/brands/colors/bmw.png' }
content = content.replace(/\{\s*name:\s*'([^']+)',\s*logo:\s*'([^']+)'\s*\}/g, (match, name, url) => {
  let newUrl = url;
  
  if (manualMap[name]) {
    newUrl = manualMap[name];
  } else if (url.includes('logo.clearbit.com/')) {
    const domain = url.split('logo.clearbit.com/')[1];
    newUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
  } else if (url.includes('imgd.aeplcdn.com')) {
    // If we missed any imgd ones, fallback to google favicon search
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    newUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
  }
  
  return `{ name: '${name}', logo: '${newUrl}' }`;
});

// Write it back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SimilarBrands.jsx!');
