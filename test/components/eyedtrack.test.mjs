import test from 'node:test';
import assert from 'node:assert/strict';
import eyedtrack from '../../scripts/components/eyedtrack.mjs';
import { EAR_TRACE } from '../../scripts/components/paths.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the EyeDTrack sheet matches the approved mockup', () => {
  assertMatchesMockup('eyedtrack', eyedtrack.render(fixture()), eyedtrack);
});

test('the trace, six landmarks and the alert tag are all there', () => {
  const body = eyedtrack.render(fixture());
  assert.ok(body.includes(`<path class="wave" d="${EAR_TRACE}"/>`));
  assert.equal((body.match(/<circle class="lm" /g) ?? []).length, 6);
  assert.match(body, /<g class="alertchip"><rect x="696" y="166" width="94" height="22" rx="4"\/><text class="alertt" x="743" y="182" text-anchor="middle">alert sent<\/text><\/g>/);
});

test('the period in the title block comes from the content file', () => {
  const body = eyedtrack.render(fixture());
  assert.match(body, /<text class="tl2" x="834" y="228">Period<\/text><text class="tv2" x="834" y="255">Feb to Jun 2025<\/text>/);
});
