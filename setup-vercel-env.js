const fs = require('fs');
const cp = require('child_process');

const content = fs.readFileSync('.env', 'utf-8');
const lines = content.split('\n');

for (const line of lines) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    let [key, ...values] = line.split('=');
    key = key.trim();
    let val = values.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
    }
    if (!val) continue;

    console.log(`Adding ${key}...`);
    try {
        cp.execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'ignore' });
    } catch (e) { }
    try {
        cp.execSync(`npx vercel env add ${key} production`, { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
    } catch (e) { console.error(`Failed to add ${key} to production`); }
}
