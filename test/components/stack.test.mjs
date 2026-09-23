import test from 'node:test';
import assert from 'node:assert/strict';
import stack from '../../scripts/components/stack.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the bill of materials matches the approved mockup', () => {
  assertMatchesMockup('stack', stack.render(fixture()), stack);
});

test('rows come from the content file and are numbered from 1', () => {
  const content = fixture();
  content.stack.rows[5] = { parts: 'Kotlin, Java, C++, PHP, Laravel, Go', use: 'Also shipped with' };
  const body = stack.render(content);
  assert.match(body, /<text class="tv" x="40" y="293">6<\/text><text class="tv" x="108" y="293">Kotlin, Java, C\+\+, PHP, Laravel, Go<\/text>/);
});

test('checkmarks draw down the rows exactly 0.35 s apart (spec section 6)', () => {
  const delays = [...stack.render(fixture()).matchAll(/class="ck"[^>]*animation-delay:([\d.]+s)/g)].map((m) => m[1]);
  assert.deepEqual(delays, ['0s', '0.35s', '0.7s', '1.05s', '1.4s', '1.75s']);
});
