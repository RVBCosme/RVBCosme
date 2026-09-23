// Spec section 10, "Visual": renders README.md through GitHub's own markdown API, serves it with
// GitHub's raw-file headers on every SVG, and takes the screenshots the owner reviews.
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { COMPONENTS } from './components/index.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUT = path.join(ROOT, '.preview');
const SHOTS = path.join(OUT, 'shots');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const GITHUB_SVG_HEADERS = { 'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox", 'x-content-type-options': 'nosniff' };
const PLOTTED_MS = 5000; // the hero finishes plotting at 3.9 s

await mkdir(SHOTS, { recursive: true });
const rendered = execFileSync('gh', ['api', 'markdown', '-f', 'mode=gfm', '-f', 'context=RVBCosme/RVBCosme', '-F', 'text=@README.md'], { cwd: ROOT, encoding: 'utf8' });
await copyFile(path.join(ROOT, 'node_modules', 'github-markdown-css', 'github-markdown.css'), path.join(OUT, 'github-markdown.css'));
await writeFile(path.join(OUT, 'index.html'), `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>README preview</title><base href="/">
<link rel="stylesheet" href="/.preview/github-markdown.css">
<style>
body{margin:0}
.readme{box-sizing:border-box;max-width:896px;margin:24px auto;padding:32px;border:1px solid var(--borderColor-default,#d1d9e0);border-radius:6px}
@media (max-width:600px){.readme{margin:0;padding:16px;border:0;border-radius:0}}
</style></head>
<body class="markdown-body"><article class="readme">${rendered}</article></body></html>
`);

// GitHub sends its CSP with every raw file, but it only matters for SVGs shown through <img>, which is how
// the README shows them. Opened as a page, the same CSP would block the embedded fonts, so the
// reduced-motion shots (SVG opened as the page) are served without it.
const server = http.createServer(async (req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const body = await readFile(file);
    const ext = path.extname(file);
    const asImage = ext === '.svg' && req.headers['sec-fetch-dest'] === 'image';
    res.writeHead(200, { 'content-type': TYPES[ext] ?? 'application/octet-stream', ...(asImage ? GITHUB_SVG_HEADERS : {}) });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const shots = [];

async function shoot(name, url, options, { settle = PLOTTED_MS, prepare, fullPage = true } = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  if (prepare) await prepare(page);
  await page.waitForTimeout(settle);
  const file = path.join(SHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  shots.push(path.relative(ROOT, file));
  await context.close();
}

for (const colorScheme of ['light', 'dark']) {
  await shoot(`readme-${colorScheme}-desktop`, `${base}/.preview/index.html`, { colorScheme, viewport: { width: 1280, height: 900 } });
  await shoot(`readme-${colorScheme}-375`, `${base}/.preview/index.html`, { colorScheme, viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
}
// Emulated reduced motion reaches an SVG opened as the page, but not one shown through <img>.
// The viewport is the drawing's own size; fullPage capture hangs on SVG documents (they have no body).
for (const theme of ['light', 'dark']) {
  for (const { name, width, height } of COMPONENTS) {
    await shoot(`reduced-${theme}-${name}`, `${base}/assets/profile/${theme}/${name}.svg`, { reducedMotion: 'reduce', viewport: { width, height } }, { settle: 500, fullPage: false });
  }
}
// The approved mockup at the same width, for comparison. Its page scrolls inside .main, so unclip it.
const mockup = `${base}/docs/superpowers/mockups/2026-09-23-profile-final.html`;
const unclip = (page) => page.addStyleTag({ content: 'html,body{height:auto!important;overflow:visible!important}.main{overflow:visible!important}' });
await shoot('mockup-dark', mockup, { viewport: { width: 1280, height: 900 } }, { prepare: unclip });
await shoot('mockup-light', mockup, { viewport: { width: 1280, height: 900 } }, { prepare: async (page) => { await unclip(page); await page.click('[data-theme-btn="light"]'); } });

await browser.close();
server.close();
console.log(shots.join('\n'));
