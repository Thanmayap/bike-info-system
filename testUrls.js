const fs = require('fs');
const html = fs.readFileSync('hunter.html', 'utf8');

const regex = /"colorPhotos"\s*:\s*(\[[^\]]*\])/g;
let match;
const parsedColors = {};

while ((match = regex.exec(html)) !== null) {
  try {
    const arr = JSON.parse(match[1]);
    for (const item of arr) {
      if (item.name && item.imagePath) {
        const hexVal = item.hexCode ? item.hexCode.split(',')[0].trim() : '';
        const hex = hexVal.startsWith('#') ? hexVal : (hexVal ? '#' + hexVal : '#CCCCCC');
        parsedColors[item.name] = {
          name: item.name,
          hex: hex,
          image: `https://imgd.aeplcdn.com/664x374${item.imagePath}`
        };
      }
    }
  } catch (e) {
    console.error("Error parsing match:", match[1], e);
  }
}

console.log("Extracted colors:");
console.log(JSON.stringify(Object.values(parsedColors), null, 2));
