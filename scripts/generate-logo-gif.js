const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

async function generateStaticLogoGif() {
  const logoPath = path.join(__dirname, '../public/logo-trimmed.png');
  const logoBuf = fs.readFileSync(logoPath);
  const logoB64 = logoBuf.toString('base64');

  const W = 220;
  const H = 150;

  const cardW = 192;
  const cardH = 126;
  const cardX = (W - cardW) / 2;
  const cardY = (H - cardH) / 2;

  const logoW = 162;
  const logoH = Math.round(logoW * (353 / 606)); // ~94px
  const logoX = (W - logoW) / 2;
  const logoY = (H - logoH) / 2;

  const svg = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <!-- Central Static Card (No Orbital Rings) -->
      <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
      <image href="data:image/png;base64,${logoB64}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
    </svg>
  `;

  const rawBuf = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
  const raw = new Uint8Array(rawBuf);
  const palette = quantize(raw, 256, { format: 'rgba4444' });
  const transparentIndex = palette.findIndex(c => c[3] === 0);
  const index = applyPalette(raw, palette, 'rgba4444');

  const gif = GIFEncoder();
  gif.writeFrame(index, W, H, {
    palette,
    transparent: transparentIndex !== -1,
    transparentIndex: transparentIndex !== -1 ? transparentIndex : 0,
    dispose: 2,
    delay: 1000
  });
  gif.finish();

  const gifBuf = Buffer.from(gif.bytes());
  const outGifPath = path.join(__dirname, '../public/logo-animated.gif');
  fs.writeFileSync(outGifPath, gifBuf);
  console.log(`Updated static logo-animated.gif (${(gifBuf.length / 1024).toFixed(1)} KB)`);
}

generateStaticLogoGif().catch(err => {
  console.error("Error generating gif:", err);
  process.exit(1);
});
