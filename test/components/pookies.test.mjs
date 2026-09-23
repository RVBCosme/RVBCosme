import test from 'node:test';
import assert from 'node:assert/strict';
import pookies from '../../scripts/components/pookies.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the Pookies sheet matches the approved mockup', () => {
  assertMatchesMockup('pookies', pookies.render(fixture()), pookies);
});

test('Pookies shows its status from the content file and has no metrics row (owner ruling)', () => {
  const body = pookies.render(fixture());
  assert.match(body, /<text class="tl2" x="834" y="171">Status<\/text><text class="tv2" x="834" y="198">Update in progress<\/text>/);
  assert.doesNotMatch(body, /class="met/);
});

test('diagram labels and the cookie note come from the content file', () => {
  const content = fixture();
  content.projects[2].figure.boxes[1] = 'Express REST API';
  content.projects[2].figure.note = 'batch cost, per tray';
  const body = pookies.render(content);
  assert.match(body, /<text class="bx" x="410" y="239">Express REST API<\/text>/);
  assert.match(body, /<text class="livenote" x="656" y="113">batch cost, per tray<\/text>/);
});
