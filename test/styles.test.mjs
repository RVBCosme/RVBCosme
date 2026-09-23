import test from 'node:test';
import assert from 'node:assert/strict';
import { STYLESHEET, REDUCED_MOTION_CSS } from '../scripts/lib/styles.mjs';
import { TYPE } from '../scripts/lib/typography.mjs';
import { FACES } from '../scripts/lib/fonts.mjs';
import { cssModel, plain } from './helpers/css.mjs';
import { mockupCss } from './helpers/mockup.mjs';

// Mockup classes that no element uses (leftovers from earlier rounds). They are not ported.
const DEAD_CLASSES = ['.draw', '.fadein', '.hw', '.hw2', '.plotstamp', '.contact-note'];
const DEAD_KEYFRAMES = ['cDraw', 'rvFade', 'hw'];

function approvedCss() {
  const model = cssModel(mockupCss(), { scope: '.dC' });
  for (const rules of [model.rules, model.reduced]) for (const selector of DEAD_CLASSES) rules.delete(selector);
  for (const name of DEAD_KEYFRAMES) model.keyframes.delete(name);
  // Deliberate difference 1: the chip text gets its own class, so every <text> carries a typography class.
  model.rules.set('.alertt', model.rules.get('.alertchip text'));
  model.rules.delete('.alertchip text');
  // Deliberate difference 2: the mockup asks for Barlow 700 on stamp rims but only loads up to 600,
  // so 600 is what was approved on screen.
  model.rules.get('.rim').set('font', '600 11.5px "Barlow",sans-serif');
  return model;
}

test('every rule matches the approved mockup', () => {
  assert.deepEqual(plain(cssModel(STYLESHEET).rules), plain(approvedCss().rules));
});

test('every keyframe matches the approved mockup, so timings are identical', () => {
  assert.deepEqual(Object.fromEntries(cssModel(STYLESHEET).keyframes), Object.fromEntries(approvedCss().keyframes));
});

test('reduced motion freezes the same things as the mockup', () => {
  assert.deepEqual(plain(cssModel(STYLESHEET).reduced), plain(approvedCss().reduced));
  assert.ok(REDUCED_MOTION_CSS.startsWith('@media (prefers-reduced-motion: reduce){'));
});

test('every typography class names a known face', () => {
  for (const [name, type] of Object.entries(TYPE)) assert.ok(FACES[type.face], `.${name} uses unknown face ${type.face}`);
});
