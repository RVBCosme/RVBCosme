import test from 'node:test';
import assert from 'node:assert/strict';
import ratchet from '../../scripts/components/ratchet.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the RATCHET sheet matches the approved mockup', () => {
  assertMatchesMockup('ratchet', ratchet.render(fixture()), ratchet);
});

test('five phases in a row and eight ledger records, each pointing back at the one before', () => {
  const body = ratchet.render(fixture());
  const phases = [...body.matchAll(/<text class="tv" x="(\d+)" y="103\.5" text-anchor="middle">([^<]+)<\/text>/g)].map((m) => [m[2], Number(m[1])]);
  assert.deepEqual(phases, [['Spec', 359], ['Red', 453], ['Green', 547], ['Review', 641], ['Memory', 735]]);
  const records = [...body.matchAll(/<g class="(rxr rxr\d(?: rxdeny)?)">([^]*?)<\/g>/g)];
  assert.equal(records.length, 8);
  assert.equal(records.filter(([, , inner]) => inner.includes('class="ah"')).length, 7, 'every record but the first points back');
});

test('the fourth record is the call the hook refused, drawn in red', () => {
  const body = ratchet.render(fixture());
  assert.match(body, /<g class="rxr rxr4 rxdeny">[^]*?>4 deny<\/text><\/g>/);
  assert.equal((body.match(/rxdeny/g) ?? []).length, 1);
});

test('the verify script checks the records 0.15 s apart, once the run reaches Memory (spec section 6)', () => {
  const delays = [...ratchet.render(fixture()).matchAll(/class="rxok"[^>]*animation-delay:([\d.]+s)/g)].map((m) => m[1]);
  assert.deepEqual(delays, ['7.9s', '8.05s', '8.2s', '8.35s', '8.5s', '8.65s', '8.8s', '8.95s']);
});
