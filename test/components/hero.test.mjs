import test from 'node:test';
import assert from 'node:assert/strict';
import hero, { boxLabel } from '../../scripts/components/hero.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the hero matches the approved mockup', () => {
  assertMatchesMockup('hero', hero.render(fixture()), hero);
});

test('revision rows come from the content file and fade in 0.1 s apart', () => {
  const content = fixture();
  content.hero.revisions[4] = { date: '09/26', text: 'ANF in use' };
  const rows = [...hero.render(content).matchAll(/<g class="fade" style="--d:([\d.]+s)"><text class="tv" x="852" y="(\d+)">([^<]+)<\/text><text class="tv" x="932" y="\d+">([^<]+)<\/text><\/g>/g)];
  assert.deepEqual(rows.map((m) => [m[1], m[2], m[3], m[4]]), [
    ['1.95s', '98', '08/23', 'Co-founded Pookies'],
    ['2.05s', '128', '02/25', 'Led EyeDTrack thesis'],
    ['2.15s', '158', '03/26', 'Highly Succeed intern'],
    ['2.25s', '188', '05/26', 'Built the ANF system'],
    ['2.35s', '218', '09/26', 'ANF in use'],
  ]);
});

test('box labels take one line or two', () => {
  assert.equal(boxLabel(['Kotlin app'], 160, 329), '<text class="bx" x="160" y="329">Kotlin app</text>');
  assert.equal(boxLabel(['MobileNetV2', '+ LLaVA'], 705, 329), '<text class="bx" x="705" y="318">MobileNetV2</text><text class="bx" x="705" y="342">+ LLaVA</text>');
});

test('the signature is the "drawn by" value in handwriting, and the plotter crosshair is last', () => {
  const body = hero.render(fixture());
  assert.match(body, /<text class="sig" x="852" y="409" style="--d:2\.65s">RVC<\/text>/);
  assert.ok(body.trimEnd().endsWith('<g class="pen"><circle class="penring" r="7"/><path class="pencross" d="M-15 0H-6M6 0H15M0 -15V-6M0 6V15"/></g>'));
});
