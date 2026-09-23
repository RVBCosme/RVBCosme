import test from 'node:test';
import assert from 'node:assert/strict';
import contact from '../../scripts/components/contact.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('contact matches the approved mockup', () => {
  assertMatchesMockup('contact', contact.render(fixture()), contact);
});

test('contact takes its copy from the content file', () => {
  const content = fixture();
  content.contact.heading = 'Say hello';
  content.contact.cards[0].value = 'someone@example.com';
  const body = contact.render(content);
  assert.match(body, /<text class="hwc" x="64" y="166">Say hello<\/text>/);
  assert.match(body, /<text class="tv2" x="668" y="90">someone@example\.com<\/text>/);
});

test('contact escapes XML specials in copy (Review Focus 4)', () => {
  const content = fixture();
  content.contact.heading = 'R&D <team> "hi"';
  assert.match(contact.render(content), />R&amp;D &lt;team&gt; &quot;hi&quot;<\/text>/);
});
