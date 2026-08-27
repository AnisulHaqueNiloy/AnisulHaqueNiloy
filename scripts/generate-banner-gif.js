const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');

const W = 960;
const H = 280;
const DELAY = 90;

const scenes = [
  '➜ ~ npx create-stack@latest',
  '✔ React + TypeScript ready',
  '✔ Node / Express / MongoDB',
  'const stack = ["MERN", "RTK"]',
  'await explore("ASP.NET + PG")',
  '➜ ~ git push origin main',
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svg(shown, cursorOn) {
  const rows = scenes.slice(0, shown).map((t, i) => {
    const y = 88 + i * 24;
    const cur = i === shown - 1 && cursorOn ? '<tspan fill="#67E8F9">▍</tspan>' : '';
    let fill = '#E2E8F0';
    if (t.startsWith('✔')) fill = '#94A3B8';
    if (t.startsWith('➜')) fill = '#E2E8F0';
    if (t.startsWith('const') || t.startsWith('await')) fill = '#7DD3FC';
    const prefix = t.startsWith('➜')
      ? `<tspan fill="#34D399">➜</tspan><tspan fill="#38BDF8"> ~ </tspan><tspan fill="#E2E8F0">${esc(t.slice(4))}</tspan>`
      : `<tspan fill="${fill}">${esc(t)}</tspan>`;
    return `<text x="548" y="${y}" font-family="Consolas, Menlo, monospace" font-size="13">${prefix}${cur}</text>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0B1220"/>
    </linearGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#67E8F9"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="36" y="78" fill="#67E8F9" font-family="Segoe UI, Arial, sans-serif" font-size="12" letter-spacing="3" font-weight="700">FULL-STACK DEVELOPER</text>
  <text x="36" y="122" fill="url(#title)" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="800">Anisul Haque Niloy</text>
  <text x="36" y="154" fill="#94A3B8" font-family="Segoe UI, Arial, sans-serif" font-size="14">MERN · TypeScript · ASP.NET Core · PostgreSQL</text>
  <rect x="36" y="172" width="160" height="3" rx="2" fill="#38BDF8"/>
  <rect x="36" y="196" width="78" height="24" rx="12" fill="#0EA5E9" fill-opacity="0.22" stroke="#38BDF8"/>
  <text x="75" y="212" text-anchor="middle" fill="#7DD3FC" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Softvence</text>
  <rect x="122" y="196" width="64" height="24" rx="12" fill="#14B8A6" fill-opacity="0.22" stroke="#2DD4BF"/>
  <text x="154" y="212" text-anchor="middle" fill="#99F6E4" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Dhaka</text>
  <rect x="194" y="196" width="92" height="24" rx="12" fill="#F97316" fill-opacity="0.18" stroke="#FB923C"/>
  <text x="240" y="212" text-anchor="middle" fill="#FDBA74" font-size="11" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Open to Work</text>

  <rect x="520" y="28" width="412" height="224" rx="14" fill="#020617" stroke="#334155"/>
  <rect x="520" y="28" width="412" height="30" rx="14" fill="#111827"/>
  <rect x="520" y="46" width="412" height="12" fill="#111827"/>
  <circle cx="542" cy="43" r="4.5" fill="#F87171"/>
  <circle cx="558" cy="43" r="4.5" fill="#FBBF24"/>
  <circle cx="574" cy="43" r="4.5" fill="#34D399"/>
  <text x="596" y="47" fill="#64748B" font-family="Consolas, Menlo, monospace" font-size="11">anisul@dev — coding…</text>
  ${rows}
</svg>`;
}

async function pixels(s) {
  const { data } = await sharp(Buffer.from(s)).resize(W, H).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}

async function main() {
  const encoder = new GIFEncoder(W, H);
  encoder.setDelay(DELAY);
  encoder.start();

  for (let i = 1; i <= scenes.length; i++) {
    encoder.addFrame(await pixels(svg(i, true)));
    encoder.addFrame(await pixels(svg(i, false)));
    encoder.addFrame(await pixels(svg(i, true)));
    encoder.addFrame(await pixels(svg(i, false)));
  }
  for (let i = 0; i < 8; i++) {
    encoder.addFrame(await pixels(svg(scenes.length, i % 2 === 0)));
  }

  encoder.finish();
  const buf = encoder.out.getData();
  const outGif = path.join('assets', 'banner.gif');
  fs.writeFileSync(outGif, buf);
  console.log('banner.gif bytes', buf.length);

  // compress further via sharp if needed
  await sharp(Buffer.from(svg(scenes.length, true))).png().toFile('assets/banner.png');
  console.log('banner.png ready');
}

main().catch((e) => { console.error(e); process.exit(1); });
