const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');

const W = 1000;
const H = 300;
const DELAY = 85;

const scenes = [
  '➜ ~ npx create-stack@latest',
  '✔ React + TypeScript locked in',
  '✔ Node / Express / MongoDB',
  'const craft = ["UI", "API", "DB"]',
  'await explore("ASP.NET + EF Core")',
  '➜ ~ git push origin main ✦',
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function bannerSvg(shown, cursorOn, spark) {
  const rows = scenes.slice(0, shown).map((t, i) => {
    const y = 92 + i * 24;
    const cur = i === shown - 1 && cursorOn ? '<tspan fill="#E9D5FF">▍</tspan>' : '';
    if (t.startsWith('➜')) {
      return `<text x="568" y="${y}" font-family="Consolas, Menlo, monospace" font-size="13"><tspan fill="#C084FC">➜</tspan><tspan fill="#A78BFA"> ~ </tspan><tspan fill="#F5F3FF">${esc(t.slice(4))}</tspan>${cur}</text>`;
    }
    if (t.startsWith('✔')) {
      return `<text x="568" y="${y}" font-family="Consolas, Menlo, monospace" font-size="13" fill="#C4B5FD">${esc(t)}${cur}</text>`;
    }
    return `<text x="568" y="${y}" font-family="Consolas, Menlo, monospace" font-size="13" fill="#DDD6FE">${esc(t)}${cur}</text>`;
  }).join('');

  const orbs = [
    [120, 40, 2.2], [210, 70, 1.8], [320, 36, 2.6], [450, 55, 1.6],
    [160, 250, 2], [380, 270, 1.7], [70, 180, 1.5],
  ].map(([x, y, r], i) => {
    const o = spark ? (i % 2 === 0 ? 0.9 : 0.45) : (i % 2 === 0 ? 0.45 : 0.9);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#E9D5FF" opacity="${o}"/>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090014"/>
      <stop offset="45%" stop-color="#16082B"/>
      <stop offset="100%" stop-color="#2A1052"/>
    </linearGradient>
    <linearGradient id="title" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FAF5FF"/>
      <stop offset="55%" stop-color="#E9D5FF"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
    <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0"/>
      <stop offset="40%" stop-color="#A78BFA" stop-opacity="0.45"/>
      <stop offset="75%" stop-color="#F0ABFC" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glowR" cx="82%" cy="35%" r="40%">
      <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#16082B" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowL" cx="18%" cy="75%" r="32%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#090014" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.15"/>
    </linearGradient>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M 34 0 L 0 0 0 34" fill="none" stroke="#C4B5FD" stroke-width="0.55" stroke-opacity="0.1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="820" cy="90" rx="260" ry="140" fill="url(#glowR)"/>
  <ellipse cx="160" cy="230" rx="220" ry="120" fill="url(#glowL)"/>
  <path d="M0 220 C180 160 340 270 520 210 C720 140 860 250 1000 180 L1000 300 L0 300 Z" fill="url(#aurora)" opacity="0.55"/>
  ${orbs}

  <!-- hex accents -->
  <g fill="none" stroke="#A78BFA" stroke-opacity="0.28" stroke-width="1.2">
    <path d="M420 48 l14 8 v16 l-14 8 l-14 -8 v-16 z"/>
    <path d="M455 70 l10 6 v12 l-10 6 l-10 -6 v-12 z"/>
  </g>

  <text x="40" y="78" fill="#C4B5FD" font-family="Segoe UI, Arial, sans-serif" font-size="13" letter-spacing="4" font-weight="700">FULL-STACK DEVELOPER</text>
  <text x="40" y="128" fill="url(#title)" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800">Anisul Haque Niloy</text>
  <text x="40" y="162" fill="#D4C4F0" font-family="Segoe UI, Arial, sans-serif" font-size="15">MERN · TypeScript · ASP.NET Core · PostgreSQL</text>
  <rect x="40" y="180" width="180" height="4" rx="2" fill="url(#beam)"/>

  <rect x="40" y="206" width="72" height="26" rx="13" fill="#7C3AED" fill-opacity="0.28" stroke="#A78BFA"/>
  <text x="76" y="223" text-anchor="middle" fill="#E9D5FF" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Dhaka</text>
  <rect x="122" y="206" width="102" height="26" rx="13" fill="#DB2777" fill-opacity="0.22" stroke="#F9A8D4"/>
  <text x="173" y="223" text-anchor="middle" fill="#FBCFE8" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Open to Work</text>
  <rect x="234" y="206" width="70" height="26" rx="13" fill="#8B5CF6" fill-opacity="0.25" stroke="#C4B5FD"/>
  <text x="269" y="223" text-anchor="middle" fill="#DDD6FE" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">MERN</text>

  <!-- terminal -->
  <rect x="540" y="28" width="430" height="244" rx="16" fill="#0C0318" stroke="#7C3AED" stroke-opacity="0.65" stroke-width="1.6"/>
  <rect x="540" y="28" width="430" height="34" rx="16" fill="#1A0B2E"/>
  <rect x="540" y="48" width="430" height="14" fill="#1A0B2E"/>
  <circle cx="562" cy="45" r="5" fill="#F472B6"/>
  <circle cx="580" cy="45" r="5" fill="#FBBF24"/>
  <circle cx="598" cy="45" r="5" fill="#34D399"/>
  <text x="622" y="49" fill="#A78BFA" font-family="Consolas, Menlo, monospace" font-size="12">anisul@dev — violet mode</text>
  ${rows}

  <!-- floating chips -->
  <rect x="548" y="250" width="58" height="18" rx="6" fill="#7C3AED" fill-opacity="0.35" stroke="#A78BFA"/>
  <text x="577" y="263" text-anchor="middle" fill="#E9D5FF" font-size="10" font-family="Consolas, Menlo, monospace">React</text>
  <rect x="614" y="250" width="54" height="18" rx="6" fill="#6D28D9" fill-opacity="0.35" stroke="#C4B5FD"/>
  <text x="641" y="263" text-anchor="middle" fill="#E9D5FF" font-size="10" font-family="Consolas, Menlo, monospace">Node</text>
  <rect x="676" y="250" width="54" height="18" rx="6" fill="#5B21B6" fill-opacity="0.4" stroke="#DDD6FE"/>
  <text x="703" y="263" text-anchor="middle" fill="#F5F3FF" font-size="10" font-family="Consolas, Menlo, monospace">.NET</text>
</svg>`;
}

function footerSvg(phase) {
  const yShift = phase % 2 === 0 ? 0 : 6;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="170" viewBox="0 0 1000 170">
  <defs>
    <linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A1052"/>
      <stop offset="50%" stop-color="#16082B"/>
      <stop offset="100%" stop-color="#090014"/>
    </linearGradient>
    <linearGradient id="waveA" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.55"/>
      <stop offset="50%" stop-color="#A78BFA" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#F0ABFC" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="waveB" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C084FC" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.18"/>
    </linearGradient>
    <radialGradient id="fg" cx="50%" cy="0%" r="55%">
      <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#16082B" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.1" fill="#C4B5FD" fill-opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="1000" height="170" fill="url(#fbg)"/>
  <rect width="1000" height="170" fill="url(#dots)"/>
  <ellipse cx="500" cy="0" rx="380" ry="80" fill="url(#fg)"/>
  <path d="M0 ${60 + yShift} C140 20 260 100 420 55 C600 5 760 95 900 45 C960 25 980 50 1000 40 L1000 170 L0 170 Z" fill="url(#waveB)"/>
  <path d="M0 ${85 + yShift} C160 40 280 120 460 75 C650 25 790 115 940 70 C970 55 990 75 1000 65 L1000 170 L0 170 Z" fill="url(#waveA)" opacity="0.65"/>

  <g stroke="#E9D5FF" stroke-opacity="0.35" stroke-width="1" fill="#E9D5FF">
    <path d="M90 42 L150 24 L210 46 L270 22" fill="none"/>
    <circle cx="90" cy="42" r="2.6"/><circle cx="150" cy="24" r="3"/><circle cx="210" cy="46" r="2.4"/><circle cx="270" cy="22" r="2.8"/>
    <path d="M730 24 L790 42 L850 20 L910 38" fill="none"/>
    <circle cx="730" cy="24" r="2.6"/><circle cx="790" cy="42" r="3"/><circle cx="850" cy="20" r="2.4"/><circle cx="910" cy="38" r="2.8"/>
  </g>

  <text x="500" y="112" text-anchor="middle" fill="#F5F3FF" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">Thanks for stopping by</text>
  <text x="500" y="140" text-anchor="middle" fill="#C4B5FD" font-family="Segoe UI, Arial, sans-serif" font-size="14">Let's build something solid · Anisul Haque Niloy</text>
</svg>`;
}

async function pixels(svg, w, h) {
  const { data } = await sharp(Buffer.from(svg)).resize(w, h).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}

async function writeGif(file, w, h, frames, delay) {
  const encoder = new GIFEncoder(w, h);
  encoder.setDelay(delay);
  encoder.start();
  for (const frame of frames) encoder.addFrame(frame);
  encoder.finish();
  const buf = encoder.out.getData();
  fs.writeFileSync(file, buf);
  console.log(file, buf.length);
}

async function main() {
  const bannerFrames = [];
  for (let i = 1; i <= scenes.length; i++) {
    bannerFrames.push(await pixels(bannerSvg(i, true, true), W, H));
    bannerFrames.push(await pixels(bannerSvg(i, false, false), W, H));
    bannerFrames.push(await pixels(bannerSvg(i, true, true), W, H));
    bannerFrames.push(await pixels(bannerSvg(i, false, false), W, H));
  }
  for (let i = 0; i < 8; i++) {
    bannerFrames.push(await pixels(bannerSvg(scenes.length, i % 2 === 0, i % 2 === 0), W, H));
  }
  await writeGif(path.join('assets', 'banner.gif'), W, H, bannerFrames, DELAY);
  await sharp(Buffer.from(bannerSvg(scenes.length, true, true))).png().toFile('assets/banner.png');

  const footerFrames = [];
  for (let i = 0; i < 12; i++) {
    footerFrames.push(await pixels(footerSvg(i), 1000, 170));
  }
  await writeGif(path.join('assets', 'footer.gif'), 1000, 170, footerFrames, 140);
  await sharp(Buffer.from(footerSvg(0))).png().toFile('assets/footer.png');

  // keep svg sources in sync
  fs.writeFileSync('assets/banner.svg', bannerSvg(scenes.length, true, true));
  fs.writeFileSync('assets/footer.svg', footerSvg(0));
  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });
