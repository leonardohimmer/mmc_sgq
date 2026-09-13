const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

async function generateAnimatedLogoGif() {
  const logoPath = path.join(__dirname, '../public/logo-trimmed.png');
  if (!fs.existsSync(logoPath)) {
    // Generate trimmed logo first
    await sharp(path.join(__dirname, '../public/logo.png')).trim().toFile(logoPath);
  }
  const logoBuf = fs.readFileSync(logoPath);
  const logoB64 = logoBuf.toString('base64');

  const W = 220;
  const H = 220;
  const numFrames = 24;

  const gif = GIFEncoder();

  for (let i = 0; i < numFrames; i++) {
    const progress = i / numFrames;
    const angle1 = progress * 360;
    const angle2 = -progress * 360;

    // Card dimensions: 96x96
    const cardW = 96;
    const cardH = 96;
    const cardX = (W - cardW) / 2;
    const cardY = (H - cardH) / 2;

    // Logo fills ~84% of card width for maximum legibility of 'controle tecnológico'
    const logoW = 80;
    const logoH = Math.round(logoW * (353 / 606)); // ~46.6px -> 47px
    const logoX = (W - logoW) / 2;
    const logoY = (H - logoH) / 2;

    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0f172a" />
        <defs>
          <linearGradient id="ringOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="35%" stop-color="#6366f1" />
            <stop offset="70%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="ringInner" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="40%" stop-color="#06b6d4" />
            <stop offset="80%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </linearGradient>
          <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45" />
            <stop offset="40%" stop-color="#8b5cf6" stop-opacity="0.3" />
            <stop offset="75%" stop-color="#10b981" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Ambient Glow -->
        <circle cx="${W / 2}" cy="${H / 2}" r="96" fill="url(#neonGlow)" />

        <!-- Outer Ring (Clockwise) -->
        <g transform="rotate(${angle1.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="85" fill="none" stroke="url(#ringOuter)" stroke-width="3.5" stroke-dasharray="310 220" stroke-linecap="round" />
        </g>

        <!-- Inner Ring (Counter-Clockwise) -->
        <g transform="rotate(${angle2.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="70" fill="none" stroke="url(#ringInner)" stroke-width="2.8" stroke-dasharray="250 190" stroke-linecap="round" />
        </g>

        <!-- Dark Glass Card -->
        <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24" fill="#0b1220" stroke="#1e293b" stroke-width="2" />
        <rect x="${cardX + 2}" y="${cardY + 2}" width="${cardW - 4}" height="${cardH - 4}" rx="22" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.4" />

        <!-- High-Resolution Trimmed Logo with legible text -->
        <image href="data:image/png;base64,${logoB64}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
      </svg>
    `;

    const raw = await sharp(Buffer.from(svg)).raw().toBuffer();
    const palette = quantize(raw, 256);
    const index = applyPalette(raw, palette);
    gif.writeFrame(index, W, H, { palette, delay: 60 });
  }

  gif.finish();
  const gifBuf = Buffer.from(gif.bytes());

  const outGifPath = path.join(__dirname, '../public/logo-animated.gif');
  fs.writeFileSync(outGifPath, gifBuf);

  // Copy to brain artifacts
  const artifactPath = 'C:/Users/leona/.gemini/antigravity/brain/e83222f7-1e2a-49d2-8f60-d1a945b649e1/logo-animated.gif';
  fs.writeFileSync(artifactPath, gifBuf);

  const meta = await sharp(gifBuf).metadata();
  console.log(`Generated TRUE animated GIF! Pages: ${meta.pages}, Size: ${(gifBuf.length / 1024).toFixed(1)} KB`);
}

generateAnimatedLogoGif().catch(err => {
  console.error("Error generating gif:", err);
  process.exit(1);
});
