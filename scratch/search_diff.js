const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'diff_portal_cliente.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf16le'); // Try UTF-16 LE
  const lines = content.split('\n');
  let matchCount = 0;
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('email') || line.toLowerCase().includes('smtp') || line.toLowerCase().includes('mail')) {
      if (matchCount < 50) {
        console.log(`L${index + 1}: ${line.trim()}`);
      }
      matchCount++;
    }
  });
  console.log(`Total matches: ${matchCount}`);
} else {
  console.log("File not found");
}
