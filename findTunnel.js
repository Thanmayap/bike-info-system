const fs = require('fs');
const path = require('path');

async function run() {
  const logDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\62c73b2f-48e8-4650-bb15-3b0af40ef753\\.system_generated\\logs';
  const filePath = path.join(logDir, 'transcript.jsonl');
  
  if (!fs.existsSync(filePath)) {
    console.log(`Log file not found at: ${filePath}`);
    return;
  }
  
  console.log(`Reading log file from: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`Found ${lines.length} lines. Searching for "loca.lt" or tunnels...`);
  
  const matches = [];
  lines.forEach((line, index) => {
    if (line.includes('loca.lt') || line.includes('lt --port') || line.includes('tunnel')) {
      matches.push({ index, line });
    }
  });
  
  console.log(`Found ${matches.length} matches:`);
  matches.forEach(m => {
    console.log(`\nLine ${m.index}:`);
    console.log(m.line.slice(0, 1000)); // Print first 1000 chars of match
  });
}

run();
