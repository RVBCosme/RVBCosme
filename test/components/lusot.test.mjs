import test from 'node:test';
import assert from 'node:assert/strict';
import lusot from '../../scripts/components/lusot.mjs';
import { assertMatchesMockup } from '../helpers/golden.mjs';
import { fixture } from '../helpers/content.mjs';

test('the Lusot sheet matches the approved mockup', () => {
  assertMatchesMockup('lusot', lusot.render(fixture()), lusot);
});

test('the gauge draws the nine levels deepest on top, the two added levels dashed and set apart', () => {
  const body = lusot.render(fixture());
  const labels = [...body.matchAll(/<text class="figcap(?: lgmark)?" x="724" y="([\d.]+)">([^<]+)<\/text>/g)].map((m) => [m[2], Number(m[1])]);
  assert.deepEqual(labels.map(([level]) => level), ['below gutter', 'gutter', 'half-knee', 'half-tire', 'knee', 'tire', 'waist', 'chest', 'above chest']);
  for (let i = 1; i < labels.length; i += 1) assert.ok(labels[i][1] < labels[i - 1][1], `${labels[i][0]} is drawn above ${labels[i - 1][0]}`);
  assert.deepEqual([...body.matchAll(/<rect class="lgcell lgoff" x="700" y="(\d+)"/g)].map((m) => m[1]), ['198', '78']);
});

test('the sample photo reads at knee: the gauge fills from there down and the leader points at it', () => {
  const body = lusot.render(fixture());
  assert.match(body, /<text class="figcap lgmark" x="724" y="149\.5">knee<\/text>/);
  assert.match(body, /<rect class="lgfill" x="700" y="138" width="16" height="74"\/>/);
  assert.match(body, /<g class="lgto"><path class="ln" d="M650 115H664L678 145H690"\/>/);
});

test("the gauge's levels and the can't-tell answer come from the content file", () => {
  const content = fixture();
  const { figure } = content.projects.find((p) => p.id === 'lusot');
  figure.levels[8] = 'over chest';
  figure.cantTell = 'no reading';
  const body = lusot.render(content);
  assert.match(body, /<text class="figcap" x="724" y="89\.5">over chest<\/text>/);
  assert.match(body, /<text class="tv" x="600" y="182\.5" text-anchor="middle">no reading<\/text>/);
});
