import test from 'node:test';
import assert from 'node:assert/strict';
import schedule, { scheduleScale } from '../../scripts/components/schedule.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the schedule matches the approved mockup', () => {
  assertMatchesMockup('schedule', schedule.render(fixture()), schedule);
});

test('the scale spreads the years from fromYear to now across x 330 to 1150', () => {
  const scale = scheduleScale(2022, '2026-09');
  assert.equal(scale.years, 5);
  assert.equal(scale.yearWidth, 164);
  assert.equal(Math.round(scale.monthX('2022-08') * 10) / 10, 425.7);
  assert.equal(Math.round(scale.nowX * 10) / 10, 1105.6); // late September: spec A6
});

test('a new year adds a column and the drawing rescales', () => {
  const content = fixture();
  content.experience.now = '2027-01';
  const scale = scheduleScale(2022, '2027-01');
  assert.equal(scale.years, 6);
  const body = schedule.render(content);
  assert.match(body, /<text class="tl" x="[\d.]+" y="88" text-anchor="middle">2027<\/text>/);
  assert.equal((body.match(/class="yr"/g) ?? []).length, 7);
});

test('a finished role ends where the month after its end begins; an ongoing one ends at the now line', () => {
  const body = schedule.render(fixture());
  assert.match(body, /<rect class="gbar" x="1013\.3" y="225" width="54\.7" height="16" rx="3"\/>/);
  assert.match(body, /<rect class="gbar" x="1068" y="301" width="37\.6" height="16" rx="3"\/>/);
  assert.match(body, /<path class="nowline" d="M1105\.6 94V330"\/>/);
});
