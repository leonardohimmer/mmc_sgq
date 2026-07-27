const fs = require('fs');
const path = require('path');

function searchEnvs(dir, depth = 0) {
  if (depth > 3) return;
  try {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      let fullPath = path.join(dir, f);
      try {
        let stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (f !== 'node_modules' && f !== '.next' && f !== '.git' && f !== 'AppData' && f !== '.cache' && f !== '.config') {
            searchEnvs(fullPath, depth + 1);
          }
        } else {
          if (f.startsWith('.env') && f !== '.env.example') {
            console.log(`Found env file: ${fullPath}`);
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach(line => {
              if (line.includes('EMAIL') || line.includes('SMTP') || line.includes('MAIL')) {
                console.log(`  ${line.trim()}`);
              }
            });
          }
        }
      } catch (e) {}
    });
  } catch (e) {}
}

searchEnvs('c:\\Users\\leona');
searchEnvs('c:\\Users\\leona\\MMC Sistema de Gestão');
