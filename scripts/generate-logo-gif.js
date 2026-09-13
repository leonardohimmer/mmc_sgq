const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateAnimatedLogoGif() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const logoBuf = fs.readFileSync(logoPath);
  const logoB64 = logoBuf.toString('base64');

  const W = 220;
  const H = 220;
  const numFrames = 30; // 30 frames for ultra-smooth loop
  const frameBuffers = [];

  for (let i = 0; i < numFrames; i++) {
    const progress = i / numFrames;
    const angle1 = progress * 360;
    const angle2 = -progress * 360;

    const pulse = 1 + Math.sin(progress * Math.PI * 2) * 0.02;
    const logoW = Math.round(76 * pulse);
    const logoH = Math.round(76 * pulse);
    const logoX = Math.round(W / 2 - logoW / 2);
    const logoY = Math.round(H / 2 - logoH / 2);

    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background matches dark header in emails (#0f172a) -->
        <rect width="100%" height="100%" fill="#0f172a" />
        <defs>
          <!-- Gradients for Rings -->
          <linearGradient id="ringOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="35%" stop-color="#818cf8" />
            <stop offset="70%" stop-color="#c084fc" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </linearGradient>

          <linearGradient id="ringInner" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="35%" stop-color="#22d3ee" />
            <stop offset="75%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </linearGradient>

          <!-- Ambient Glow -->
          <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.32" />
            <stop offset="35%" stop-color="#8b5cf6" stop-opacity="0.22" />
            <stop offset="70%" stop-color="#10b981" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
          </radialGradient>

          <!-- Card Subtle Gradient -->
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#141d2e" />
            <stop offset="100%" stop-color="#0b1120" />
          </linearGradient>
        </defs>

        <!-- Ambient Glow -->
        <circle cx="${W / 2}" cy="${H / 2}" r="96" fill="url(#neonGlow)" />

        <!-- Outer Orbit Ring (Smooth Arc 240 degrees) -->
        <g transform="rotate(${angle1.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="85" fill="none" stroke="url(#ringOuter)" stroke-width="2.6" stroke-dasharray="320 215" stroke-linecap="round" />
        </g>

        <!-- Inner Orbit Ring (Smooth Arc 220 degrees in reverse) -->
        <g transform="rotate(${angle2.toFixed(2)} ${W / 2} ${H / 2})">
          <circle cx="${W / 2}" cy="${H / 2}" r="71" fill="none" stroke="url(#ringInner)" stroke-width="2.2" stroke-dasharray="270 176" stroke-linecap="round" />
        </g>

        <!-- Central Rounded Dark Card -->
        <rect x="${W / 2 - 47}" y="${H / 2 - 47}" width="94" height="94" rx="26" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.8" />
        <rect x="${W / 2 - 45}" y="${H / 2 - 45}" width="90" height="90" rx="24" fill="none" stroke="#334155" stroke-width="0.8" stroke-opacity="0.6" />

        <!-- MMC LAB Logo Image with pulse -->
        <image href="data:image/png;base64,${logoB64}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
      </svg>
    `;

    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    frameBuffers.push(buf);
  }

  const compositeList = frameBuffers.map((buf, idx) => ({
    input: buf,
    top: idx * H,
    left: 0
  }));

  const joined = await sharp({
    create: { width: W, height: H * numFrames, channels: 4, background: '#0f172a' }
  }).composite(compositeList).png().toBuffer();

  const outGifPath = path.join(__dirname, '../public/logo-animated.gif');
  // 50ms delay = 20fps loop, smooth and lightweight (~200KB)
  const gifBuffer = await sharp(joined, { animated: true, pageHeight: H }).gif({ loop: 0, delay: 50 }).toBuffer();
  fs.writeFileSync(outGifPath, gifBuffer);

  // Also copy to brain artifacts directory
  const artifactPath = 'C:/Users/leona/.gemini/antigravity/brain/e83222f7-1e2a-49d2-8f60-d1a945b649e1/logo-animated.gif';
  fs.writeFileSync(artifactPath, gifBuffer);

  console.log(`Generated ${outGifPath} successfully! Size: ${(gifBuffer.length / 1024).toFixed(1)} KB`);
}

generateAnimatedLogoGif().catch(err => {
  console.error("Error generating gif:", err);
  process.exit(1);
});
