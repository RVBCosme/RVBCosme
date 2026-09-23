import test from 'node:test';
import assert from 'node:assert/strict';
import * as fontkit from 'fontkit';
import { FACES, fontFaceCss, subsetFace } from '../scripts/lib/fonts.mjs';

test('FACES lists the six faces the approved mockup renders', () => {
  assert.deepEqual(Object.keys(FACES), ['barlow-400', 'barlow-500', 'barlow-600', 'bsc-600', 'bsc-700', 'caveat-700']);
});

test('subsetFace returns WOFF2 and is deterministic', async () => {
  const a = await subsetFace('barlow-400', 'Date ≈ 0.95 s');
  const b = await subsetFace('barlow-400', 'Date ≈ 0.95 s');
  assert.equal(a.subarray(0, 4).toString('latin1'), 'wOF2');
  assert.ok(a.equals(b), 'two subsets of the same text differ');
});

test('Caveat is instanced at weight 700 into a static font', async () => {
  const font = fontkit.create(await subsetFace('caveat-700', 'RVC'));
  assert.deepEqual(Object.keys(font.variationAxes), []);
  assert.ok(font.hasGlyphForCodePoint('R'.codePointAt(0)));
});

test('fontFaceCss embeds only the faces that have glyphs, in FACES order', async () => {
  const css = await fontFaceCss(new Map([['caveat-700', 'RVC'], ['barlow-400', 'Date']]));
  const faces = [...css.matchAll(/font-family:"([^"]+)";font-weight:(\d+)/g)].map((m) => `${m[1]} ${m[2]}`);
  assert.deepEqual(faces, ['Barlow 400', 'Caveat 700']);
  assert.match(css, /src:url\(data:font\/woff2;base64,[A-Za-z0-9+/=]+\) format\("woff2"\)/);
  assert.doesNotMatch(css, /https?:/);
});

test('fontFaceCss rejects an unknown face', async () => {
  await assert.rejects(fontFaceCss(new Map([['comic-400', 'x']])), /Unknown font face "comic-400"/);
});
