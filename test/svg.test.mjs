import test from 'node:test';
import assert from 'node:assert/strict';
import { XMLValidator } from 'fast-xml-parser';
import { collectGlyphs, esc, r1, sec, svgDocument } from '../scripts/lib/svg.mjs';

test('esc escapes XML specials and keeps apostrophes', () => {
  assert.equal(esc(`R&D <team> "hi" it's`), `R&amp;D &lt;team&gt; &quot;hi&quot; it's`);
});

test('r1 and sec format numbers the way the mockup does', () => {
  assert.equal(r1(40 + (7 * 560) / 37), 145.9);
  assert.equal(r1(1105.5833), 1105.6);
  assert.equal(sec(0), '0s');
  assert.equal(sec(0.06 * 3), '0.18s');
  assert.equal(sec(0.35 * 3), '1.05s');
  assert.equal(sec(1.95 + 0.4), '2.35s');
});

test('collectGlyphs groups characters by face, decodes entities and reads textPath', () => {
  const body = '<text class="tv" x="1" y="2">R&amp;D</text><text class="rim"><textPath href="#r">A·B</textPath></text><text class="met red" x="1" y="2">DD</text>';
  assert.deepEqual(collectGlyphs(body), new Map([['bsc-600', '&DR'], ['barlow-600', 'AB·'], ['bsc-700', 'D']]));
});

test('collectGlyphs refuses text without a typography class', () => {
  assert.throws(() => collectGlyphs('<text x="1" y="2">x</text>'), /<text> needs a typography class as its first class/);
  assert.throws(() => collectGlyphs('<text class="fade tv">x</text>'), /got "fade"/);
});

test('svgDocument writes a standalone, well-formed SVG', () => {
  const svg = svgDocument({ width: 100, height: 50, title: 'A "quoted" & titled drawing', body: '<rect class="sheet" width="100" height="50"/>', theme: 'dark', fontCss: '' });
  assert.equal(XMLValidator.validate(svg), true);
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="100" height="50" role="img" aria-labelledby="title">'));
  assert.match(svg, /<title id="title">A &quot;quoted&quot; &amp; titled drawing<\/title>/);
  assert.match(svg, /:root\{--sheet:#0F2A47;/);
  assert.match(svg, /@media \(prefers-reduced-motion: reduce\)\{/);
  assert.ok(svg.endsWith('</svg>\n'));
});
