const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'prisma', 'seed-equipamentos.ts');
console.log('Target file:', filePath);
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/certificateNumber:\s*"([^"]+)"/g, 'certificateNumber: ["$1"]');
content = content.replace(/serviceType:\s*"([^"]+)"/g, 'serviceType: ["$1"]');
fs.writeFileSync(filePath, content);
console.log('Seed file updated successfully.');
