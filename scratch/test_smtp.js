const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env.production.local manually
const envPath = path.resolve(process.cwd(), '.env.production.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...values] = line.split('=');
      let val = values.join('=').trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  });
}

console.log("Environment variables loaded:");
console.log(`EMAIL_HOST: "${process.env.EMAIL_HOST}"`);
console.log(`EMAIL_PORT: "${process.env.EMAIL_PORT}"`);
console.log(`EMAIL_SECURE: "${process.env.EMAIL_SECURE}"`);
console.log(`EMAIL_USER: "${process.env.EMAIL_USER}"`);
console.log(`EMAIL_PASS (length): ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

async function test() {
  const transporter = createTransporter();
  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
  } catch (error) {
    console.error("SMTP verification failed with error:", error);
  }
}

test();
