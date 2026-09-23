import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { THEMES, TOKENS, tokenCss } from '../scripts/lib/tokens.mjs';

const ADR = readFileSync(new URL('../docs/adr/ADR-001-visual-direction-engineering-drawing.md', import.meta.url), 'utf8');

test('tokens match the ADR-001 table exactly', () => {
  const rows = [...ADR.matchAll(/^\| (\w+) \| `(#[0-9A-F]{6})` \| `(#[0-9A-F]{6})` \|/gm)];
  assert.equal(rows.length, 8);
  assert.deepEqual(TOKENS.light, Object.fromEntries(rows.map(([, name, light]) => [name, light])));
  assert.deepEqual(TOKENS.dark, Object.fromEntries(rows.map(([, name, , dark]) => [name, dark])));
  assert.deepEqual(THEMES, ['light', 'dark']);
});

test('tokenCss writes one :root block of CSS variables', () => {
  assert.equal(tokenCss('light'), ':root{--sheet:#F4F6F7;--grid:#E1E7EF;--line:#22407F;--line2:#52668E;--title:#172E5E;--red:#C23F2D;--live:#0E8A57;--icon:#1F2328}');
  assert.throws(() => tokenCss('sepia'), /Unknown theme "sepia"/);
});
