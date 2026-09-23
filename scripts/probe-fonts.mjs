// Spec section 7, "Font probe": proves that embedded data: fonts render in an SVG loaded through <img>
// when it is served with the headers raw.githubusercontent.com sends (checked 2026-09-23).
import http from 'node:http';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { subsetFace } from './lib/fonts.mjs';

const GITHUB_SVG_HEADERS = {
  'content-type': 'image/svg+xml',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  'x-content-type-options': 'nosniff',
};
const OUT = new URL('../.preview/probe/', import.meta.url);

const hand = await subsetFace('caveat-700', "Let's connect");
const sans = await subsetFace('barlow-400', 'Barlow ≈ 0.95 s camera to alert');
// Probe-only family names, so the fallback variant can't borrow a locally installed Barlow or Caveat.
const face = (family, weight, woff2) => `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${woff2.toString('base64')}) format("woff2")}`;
const probeSvg = (embed) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200"><style>${embed ? face('Probe Hand', 700, hand) + face('Probe Sans', 400, sans) : ''}.h{font:700 64px "Probe Hand",serif;fill:#172E5E}.b{font:400 28px "Probe Sans",serif;fill:#172E5E}</style><rect width="600" height="200" fill="#F4F6F7"/><text class="h" x="20" y="90">Let's connect</text><text class="b" x="20" y="160">Barlow ≈ 0.95 s camera to alert</text></svg>`;

const VARIANTS = {
  'embedded-csp': { svg: probeSvg(true), headers: GITHUB_SVG_HEADERS },
  'embedded-plain': { svg: probeSvg(true), headers: { 'content-type': 'image/svg+xml' } },
  'fallback-csp': { svg: probeSvg(false), headers: GITHUB_SVG_HEADERS },
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/page.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><body style="margin:0;background:#fff"><img id="probe" src="/${url.searchParams.get('variant')}.svg" width="600" height="200"></body>`);
    return;
  }
  const variant = VARIANTS[url.pathname.slice(1).replace(/\.svg$/, '')];
  if (!variant) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, variant.headers);
  res.end(variant.svg);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(OUT, { recursive: true });

let failed = false;
for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch();
  const page = await browser.newPage();
  const shots = {};
  for (const variant of Object.keys(VARIANTS)) {
    await page.goto(`${base}/page.html?variant=${variant}`);
    await page.waitForFunction(() => document.getElementById('probe').complete);
    await page.waitForTimeout(1500); // SVG images decode data: fonts asynchronously
    shots[variant] = await page.locator('#probe').screenshot({ path: fileURLToPath(new URL(`${name}-${variant}.png`, OUT)) });
  }
  const headersChangeNothing = shots['embedded-csp'].equals(shots['embedded-plain']);
  const fontIsUsed = !shots['embedded-csp'].equals(shots['fallback-csp']);
  const pass = headersChangeNothing && fontIsUsed;
  failed ||= !pass;
  console.log(`${name.padEnd(9)} ${browser.version().padEnd(16)} ${pass ? 'PASS' : 'FAIL'}  (GitHub headers change nothing: ${headersChangeNothing}; embedded font differs from fallback: ${fontIsUsed})`);
  await browser.close();
}
server.close();
console.log(`Screenshots: ${fileURLToPath(OUT)}`);
process.exitCode = failed ? 1 : 0;
