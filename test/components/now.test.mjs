import test from 'node:test';
import assert from 'node:assert/strict';
import now from '../../scripts/components/now.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the In progress board matches the approved mockup', () => {
  assertMatchesMockup('now', now.render(fixture()), now);
});

test('rows, header and next role come from the content file', () => {
  const content = fixture();
  content.now.items[0] = 'ANF Inventory System: v1.0.10 in use at the Council';
  content.now.updated = 'Updated 2026-10';
  const body = now.render(content);
  assert.match(body, /<text class="tv" x="66" y="100">ANF Inventory System: v1\.0\.10 in use at the Council<\/text>/);
  assert.match(body, /<text class="tl" x="1164" y="48" text-anchor="end">Updated 2026-10<\/text>/);
  assert.match(body, /<text class="tv nexttext" x="66" y="244">Next: a full-time software engineering or AI\/ML role<\/text>/);
});

test('live dots ping 0.4 s apart', () => {
  const delays = [...now.render(fixture()).matchAll(/class="ping"[^>]*animation-delay:([\d.]+s)/g)].map((m) => m[1]);
  assert.deepEqual(delays, ['0s', '0.4s', '0.8s', '1.2s']);
});
