import test from 'node:test';
import assert from 'node:assert/strict';
import { XMLValidator } from 'fast-xml-parser';
import { COMPONENTS } from '../scripts/components/index.mjs';
import { assetPath } from '../scripts/lib/assets.mjs';
import { THEMES, tokenCss } from '../scripts/lib/tokens.mjs';
import { builtFiles } from './helpers/build.mjs';

const MAX_BYTES = 150 * 1024;
const svgs = async () => [...(await builtFiles())].filter(([path]) => path.endsWith('.svg'));

test('every drawing is built in both themes', async () => {
  const files = await builtFiles();
  for (const { name } of COMPONENTS) for (const theme of THEMES) assert.ok(files.has(assetPath(theme, name)), `${assetPath(theme, name)} is missing`);
});

test('every SVG is well-formed, standalone and titled', async () => {
  for (const [path, text] of await svgs()) {
    assert.equal(XMLValidator.validate(text), true, `${path} is not well-formed XML`);
    assert.match(text, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 \d+ \d+" width="\d+" height="\d+" role="img" aria-labelledby="title">\n/, path);
    assert.match(text, /<title id="title">[^<]+<\/title>/, path);
  }
});

test('no SVG points outside itself', async () => {
  for (const [path, text] of await svgs()) {
    assert.deepEqual(text.match(/https?:\/\/[^\s"')]+/g), ['http://www.w3.org/2000/svg'], `${path} contains an external URL`);
    assert.doesNotMatch(text, /xlink:|@import/, path);
    const ids = new Set([...text.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, ref] of text.matchAll(/(?:url\(#|href="#)([^)"]+)/g)) assert.ok(ids.has(ref), `${path} points at #${ref}, which it doesn't define`);
  }
});

test('every SVG has a reduced-motion block and fits the size budget', async () => {
  for (const [path, text] of await svgs()) {
    assert.match(text, /@media \(prefers-reduced-motion: reduce\)\{/, path);
    const bytes = Buffer.byteLength(text);
    assert.ok(bytes <= MAX_BYTES, `${path} is ${bytes} bytes; the budget is ${MAX_BYTES}`);
  }
});

test('light and dark files differ only in token values (ADR-003)', async () => {
  const files = await builtFiles();
  for (const { name } of COMPONENTS) {
    const light = files.get(assetPath('light', name));
    const dark = files.get(assetPath('dark', name));
    assert.equal(dark.replace(tokenCss('dark'), tokenCss('light')), light, name);
  }
});

test('every embedded font is a WOFF2 data URI for a face the drawing uses', async () => {
  for (const [path, text] of await svgs()) {
    const faces = [...text.matchAll(/@font-face\{font-family:"([^"]+)";font-weight:(\d+);src:url\(data:font\/woff2;base64,[A-Za-z0-9+/=]+\) format\("woff2"\)\}/g)];
    assert.ok(faces.length > 0, `${path} embeds no font`);
    assert.equal((text.match(/@font-face/g) ?? []).length, faces.length, `${path} has a malformed @font-face rule`);
  }
});
