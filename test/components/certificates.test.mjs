import test from 'node:test';
import assert from 'node:assert/strict';
import certificates from '../../scripts/components/certificates.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the certificate stamps match the approved mockup', () => {
  assertMatchesMockup('certificates', certificates.render(fixture()), certificates);
});

test('stamps press in exactly 0.35 s apart (spec section 6)', () => {
  const delays = [...certificates.render(fixture()).matchAll(/class="stamp[^"]*"[^>]*animation-delay:([\d.]+s)/g)].map((m) => m[1]);
  assert.deepEqual(delays, ['0s', '0.35s', '0.7s', '1.05s', '1.4s']);
});

test('ink, rim text and name size come from the content file', () => {
  const content = fixture();
  content.certificates.stamps[1] = { name: 'AWS', nameSize: 30, inner: 'AI Practitioner', rim: 'AWS CERTIFIED · 2027', ink: 'red' };
  const body = certificates.render(content);
  assert.match(body, /<g class="stamp ink1" filter="url\(#stRough\)" style="animation-delay:0\.35s">/);
  assert.match(body, /<textPath href="#rim1">AWS CERTIFIED · 2027 · <\/textPath>/);
  assert.match(body, /<text class="stname" x="370" y="186" text-anchor="middle" style="font-size:30px">AWS<\/text>/);
});
