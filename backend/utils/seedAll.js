const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const utilsDir = __dirname;
const files = fs.readdirSync(utilsDir);

const seedFiles = files.filter(file => file.startsWith('seed') && file.endsWith('.js') && file !== 'seedAll.js' && file !== 'seedAdmin.js');

console.log(`Found ${seedFiles.length} seed scripts. Running them sequentially...\n`);

for (const file of seedFiles) {
    console.log(`==========================================`);
    console.log(`Running ${file}...`);
    try {
        const output = execSync(`node ${path.join(utilsDir, file)}`, { stdio: 'inherit' });
        console.log(`Finished ${file}\n`);
    } catch (e) {
        console.error(`Error running ${file}`);
    }
}

console.log(`==========================================`);
console.log(`All seed scripts finished successfully!`);
