import test from 'node:test';
import assert from 'node:assert/strict';
import anf, { tickX } from '../../scripts/components/anf.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the ANF sheet matches the approved mockup', () => {
  assertMatchesMockup('anf', anf.render(fixture()), anf);
});

test('the test strip has 38 ticks from x 40 to 600, 0.06 s apart (spec section 6)', () => {
  const body = anf.render(fixture());
  const ticks = [...body.matchAll(/<line class="tk" x1="([\d.]+)"[^>]*animation-delay:([\d.]+s)/g)];
  assert.equal(ticks.length, 38);
  assert.deepEqual([tickX(0), tickX(1), tickX(37)], [40, 55.1, 600]);
  assert.deepEqual([ticks[0][2], ticks[3][2], ticks[37][2]], ['0s', '0.18s', '2.22s']);
});

test('receipts, metrics and title block come from the content file', () => {
  const content = fixture();
  const anfContent = content.projects[0];
  anfContent.figure.receiptNumbers = ['No. 2001', 'No. 2002', 'No. 2003', 'No. 2004'];
  anfContent.titleBlock[2].value = 'In use, v1.0.10';
  const body = anf.render(content);
  assert.match(body, /<g class="rc rc1">[^]*?No\. 2001[^]*?<\/g><g class="rc rc2">/);
  assert.match(body, /<text class="tv2" x="834" y="198">In use, v1\.0\.10<\/text>/);
  assert.match(body, /<text class="met red" x="40" y="250">4,000\+<\/text>/);
});
