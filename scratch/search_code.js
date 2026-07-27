const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const searchTerms = ['sendWelcomeEmail', 'sendFinalizedEmail', 'sendResetPasswordEmail', 'sendMail'];

walkDir(path.resolve(process.cwd(), 'src'), (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    searchTerms.forEach(term => {
      if (content.includes(term)) {
        console.log(`Found "${term}" in ${path.relative(process.cwd(), filePath)}`);
      }
    });
  }
});
