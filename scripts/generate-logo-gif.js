const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

async function generateAnimatedLogoGif() {
  const logoPath = path.join(__dirname, '../public/logo-trimmed.png');
  if (!fs.existsSync(logoPath)) {
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

    // Card dimensions: 96x96 in center
    const cardW = 96;
    const cardH = 96;
    const cardX = (W - cardW) / 2;
    const cardY = (H - cardH) / 2;

    // Logo fills ~86% of card width for maximum legibility of 'controle tecnológico'
    const logoW = 82;
    const logoH = Math.round(logoW * (353 / 606)); // ~48px
    const logoX = (W - logoW) / 2;
    const logoY = (H - logoH) / 2;

    // Transparent SVG canvas (clean transparent background, no banded glow)
    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ringOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="35%" stop-color="#818cf8" />
            <stop offset="70%" stop-color="#c084fc" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="ringInner" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="40%" stop-color="#22d3ee" />
            <stop offset="80%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Outer Ring (Clockwise) -->
        <g transform="rotate(${angle1.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="82" fill="none" stroke="url(#ringOuter)" stroke-width="3.6" stroke-dasharray="320 215" stroke-linecap="round" />
        </g>

        <!-- Inner Ring (Counter-Clockwise) -->
        <g transform="rotate(${angle2.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="68" fill="none" stroke="url(#ringInner)" stroke-width="2.8" stroke-dasharray="260 186" stroke-linecap="round" />
        </g>

        <!-- Central Dark Glass Card -->
        <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="22" fill="#0c1220" stroke="#1e293b" stroke-width="2" />
        <rect x="${cardX + 2}" y="${cardY + 2}" width="${cardW - 4}" height="${cardH - 4}" rx="20" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.5" />

        <!-- High-Resolution Trimmed Logo with large legible text -->
        <image href="data:image/png;base64,${logoB64}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
      </svg>
    `;

    const rawBuf = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
    const raw = new Uint8Array(rawBuf);
    const palette = quantize(raw, 256, { format: 'rgba4444' });
    const transparentIndex = palette.findIndex(c => c[3] === 0);
    const index = applyPalette(raw, palette, 'rgba4444');

    gif.writeFrame(index, W, H, {
      palette,
      transparent: transparentIndex !== -1,
      transparentIndex: transparentIndex !== -1 ? transparentIndex : 0,
      dispose: 2,
      delay: 50
    });
  }

  gif.finish();
  const gifBuf = Buffer.from(gif.bytes());

  const outGifPath = path.join(__dirname, '../public/logo-animated.gif');
  fs.writeFileSync(outGifPath, gifBuf);

  // Copy to brain artifacts
  const artifactPath = 'C:/Users/leona/.gemini/antigravity/brain/e83222f7-1e2a-49d2-8f60-d1a945b649e1/logo-animated.gif';
  fs.writeFileSync(artifactPath, gifBuf);

  const meta = await sharp(gifBuf).metadata();
  console.log(`Generated TRANSPARENT Animated GIF! Pages: ${meta.pages}, hasAlpha: ${meta.hasAlpha}, Size: ${(gifBuf.length / 1024).toFixed(1)} KB`);
}

generateAnimatedLogoGif().catch(err => {
  console.error("Error generating gif:", err);
  process.exit(1);
});
