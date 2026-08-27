const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');
const https = require('https');

const C = {
  bg0: '#070B12',
  bg1: '#0E1624',
  bg2: '#162033',
  steel: '#8FA3B8',
  steelBright: '#C5D0DC',
  gold: '#C2A46B',
  goldSoft: '#E2D3A8',
  ink: '#F3F1EB',
  muted: '#9AA6B2',
  green: '#7D9B84',
  string: '#C2A46B',
  key: '#C5D0DC',
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const codeLines = [
  { html: `<tspan fill="${C.steel}">const</tspan><tspan fill="${C.ink}"> anisul = {</tspan>` },
  { html: `<tspan fill="${C.key}">  role:</tspan><tspan fill="${C.string}"> "Full-Stack Developer"</tspan><tspan fill="${C.ink}">,</tspan>` },
  { html: `<tspan fill="${C.key}">  stack:</tspan><tspan fill="${C.string}"> "MERN + TypeScript"</tspan><tspan fill="${C.ink}">,</tspan>` },
  { html: `<tspan fill="${C.key}">  exploring:</tspan><tspan fill="${C.ink}"> [</tspan><tspan fill="${C.string}">"ASP.NET"</tspan><tspan fill="${C.ink}">, </tspan><tspan fill="${C.string}">"EF Core"</tspan><tspan fill="${C.ink}">],</tspan>` },
  { html: `<tspan fill="${C.key}">  mindset:</tspan><tspan fill="${C.string}"> "Ship with standards"</tspan>` },
  { html: `<tspan fill="${C.ink}">};</tspan>` },
];

function aboutCodeSvg(shown, cursorOn) {
  const rows = codeLines.slice(0, shown).map((line, i) => {
    const y = 78 + i * 28;
    const cur = i === shown - 1 && cursorOn ? `<tspan fill="${C.gold}">▍</tspan>` : '';
    return `<text x="36" y="${y}" font-family="Consolas, Menlo, monospace" font-size="15">${line.html}${cur}</text>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="280" viewBox="0 0 720 280">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.bg0}"/>
      <stop offset="100%" stop-color="${C.bg1}"/>
    </linearGradient>
  </defs>
  <rect width="720" height="280" rx="18" fill="url(#bg)" stroke="${C.gold}" stroke-opacity="0.35"/>
  <rect width="720" height="40" rx="18" fill="${C.bg2}"/>
  <rect y="22" width="720" height="18" fill="${C.bg2}"/>
  <circle cx="28" cy="20" r="5" fill="#B85C5C"/>
  <circle cx="46" cy="20" r="5" fill="${C.gold}"/>
  <circle cx="64" cy="20" r="5" fill="${C.green}"/>
  <text x="90" y="24" fill="${C.steel}" font-family="Consolas, Menlo, monospace" font-size="13">anisul.ts — TypeScript</text>
  ${rows}
</svg>`;
}

async function pixels(svg, w, h) {
  const { data } = await sharp(Buffer.from(svg)).resize(w, h).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 90000 }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`));
        else resolve(data);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function writeGif(file, w, h, frames, delay) {
  const encoder = new GIFEncoder(w, h);
  encoder.setDelay(delay);
  encoder.start();
  for (const f of frames) encoder.addFrame(f);
  encoder.finish();
  fs.writeFileSync(file, encoder.out.getData());
  console.log('wrote', file, fs.statSync(file).size);
}

async function main() {
  // About animated TS card
  const frames = [];
  for (let i = 1; i <= codeLines.length; i++) {
    frames.push(await pixels(aboutCodeSvg(i, true), 720, 280));
    frames.push(await pixels(aboutCodeSvg(i, false), 720, 280));
    frames.push(await pixels(aboutCodeSvg(i, true), 720, 280));
    frames.push(await pixels(aboutCodeSvg(i, false), 720, 280));
  }
  for (let i = 0; i < 10; i++) {
    frames.push(await pixels(aboutCodeSvg(codeLines.length, i % 2 === 0), 720, 280));
  }
  await writeGif(path.join('assets', 'about-code.gif'), 720, 280, frames, 110);
  await sharp(Buffer.from(aboutCodeSvg(codeLines.length, true))).png().toFile('assets/about-code.png');

  // Cache streak SVG locally (fast for GitHub Camo)
  const streakUrl =
    'https://streak-stats.demolab.com/?user=AnisulHaqueNiloy&theme=dark&hide_border=true&background=0E1624&ring=C2A46B&fire=E2D3A8&currStreakLabel=C2A46B&sideLabels=C5D0DC&dates=8FA3B8';
  try {
    const svgRaw = await fetchText(streakUrl);
    if (/Failed to retrieve|Something went wrong/i.test(svgRaw)) {
      throw new Error('streak API returned error payload');
    }
    let svg = svgRaw
      .replace(/<style>[\s\S]*?<\/style>/, '')
      .replace(/style="[^"]*opacity:\s*0[^"]*"/g, 'style="opacity: 1"')
      .replace(/style='[^']*opacity:\s*0[^']*'/g, "style='opacity: 1'")
      .replace(/animation:[^;"']+;?/g, '');
    fs.writeFileSync('assets/github-streak.svg', svg);
    // PNG fallback for max compatibility
    await sharp(Buffer.from(svg)).png().toFile('assets/github-streak.png');
    console.log('streak cached ok');
  } catch (e) {
    console.error('streak fetch failed:', e.message);
    // keep previous file if any
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
