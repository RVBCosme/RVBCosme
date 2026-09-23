import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { COMPONENTS } from '../scripts/components/index.mjs';
import { loadContent } from '../scripts/lib/content.mjs';
import { FACES } from '../scripts/lib/fonts.mjs';
import { collectGlyphs } from '../scripts/lib/svg.mjs';
import { TYPE } from '../scripts/lib/typography.mjs';

const fonts = new Map();
function font(face) {
  if (!fonts.has(face)) fonts.set(face, fontkit.openSync(fileURLToPath(new URL(`../assets/fonts/${FACES[face].file}`, import.meta.url))));
  return fonts.get(face);
}

/** Rendered width in drawing units, with the real font's kerning and the class's letter spacing. */
function textWidth(cls, text, size = TYPE[cls].size) {
  const f = font(TYPE[cls].face);
  const spacing = Number(/letter-spacing:([\d.]+)px/.exec(TYPE[cls].style)?.[1] ?? 0);
  return (f.layout(text).advanceWidth * size) / f.unitsPerEm + spacing * [...text].length;
}

// Content-driven text with a fixed slot in the drawings: [what, text class, widest allowed, texts].
// The limits are the free space in the approved layout, not today's widths.
const SLOTS = [
  ['hero title', 'tname', 290, (c) => [c.hero.titleBlock.title.value]],
  ['hero description', 'tv', 290, (c) => [c.hero.titleBlock.description.value]],
  ['revision dates', 'tv', 64, (c) => c.hero.revisions.map((r) => r.date)],
  ['revision entries', 'tv', 205, (c) => c.hero.revisions.map((r) => r.text)],
  ['hero box labels', 'bx', 174, (c) => c.hero.groups.flatMap((g) => g.boxes.flatMap((b) => b.lines))],
  ['hero box captions', 'cap', 180, (c) => c.hero.groups.flatMap((g) => g.boxes.map((b) => b.caption))],
  ['hero markups', 'note', 225, (c) => c.hero.groups.map((g) => g.markup)],
  ['hero dimension', 'dim', 196, (c) => [c.hero.dimension]],
  ['In progress rows', 'tv', 720, (c) => [...c.now.items, c.now.next.text]],
  ['In progress bar label', 'tl', 330, (c) => [c.now.next.bar]],
  ['ANF subtitle (the receipt printer starts at x 620)', 'subt', 580, (c) => [c.projects[0].subtitle]],
  ['EyeDTrack and Pookies subtitles', 'subt', 770, (c) => c.projects.slice(1).map((p) => p.subtitle)],
  ['ANF and EyeDTrack titles', 'ttl', 570, (c) => c.projects.slice(0, 2).map((p) => p.title)],
  ['Pookies title (the cookie starts at x 526)', 'ttl', 470, (c) => [c.projects[2].title]],
  ['project title block values', 'tv2', 320, (c) => c.projects.flatMap((p) => p.titleBlock.map((r) => r.value))],
  ['Pookies status (its live dot sits at x 1044)', 'tv2', 190, (c) => [c.projects[2].titleBlock[2].value]],
  ['metric values', 'met', 200, (c) => c.projects.flatMap((p) => p.metrics.map((m) => m.value))],
  ['metric labels', 'metl', 200, (c) => c.projects.flatMap((p) => p.metrics.map((m) => m.label))],
  ['Pookies diagram boxes', 'bx', 184, (c) => c.projects[2].figure.boxes],
  ['schedule labels (the year grid starts at x 330)', 'tv', 286, (c) => c.experience.rows.map((r) => r.label)],
  ['bill of materials parts', 'tv', 740, (c) => c.stack.rows.map((r) => r.parts)],
  ['bill of materials uses', 'tv', 255, (c) => c.stack.rows.map((r) => r.use)],
  ['stamp inner lines', 'stsub', 104, (c) => c.certificates.stamps.map((s) => s.inner)],
  ['contact values', 'tv2', 460, (c) => c.contact.cards.map((k) => k.value)],
];

test('every character in the drawings has a glyph in its embedded font (Review Focus 3)', async () => {
  const content = await loadContent();
  const problems = [];
  for (const component of COMPONENTS) {
    for (const [face, chars] of collectGlyphs(component.render(content))) {
      const missing = [...chars].filter((ch) => !font(face).hasGlyphForCodePoint(ch.codePointAt(0)));
      if (missing.length) problems.push(`${component.name}: ${FACES[face].family} ${FACES[face].weight} has no glyph for ${missing.map((ch) => `"${ch}"`).join(', ')}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('copy fits its slot in the drawings (Review Focus 2)', async () => {
  const content = await loadContent();
  const problems = [];
  for (const [what, cls, max, texts] of SLOTS) {
    for (const text of texts(content)) {
      const width = Math.round(textWidth(cls, text));
      if (width > max) problems.push(`${what}: "${text}" is ${width} units wide; the slot allows ${max}`);
    }
  }
  for (const stamp of content.certificates.stamps) {
    const name = Math.round(textWidth('stname', stamp.name, stamp.nameSize));
    if (name > 108) problems.push(`stamp name: "${stamp.name}" at ${stamp.nameSize}px is ${name} units wide; the stamp allows 108`);
    const rim = Math.round(textWidth('rim', `${stamp.rim} · `));
    if (rim > 410) problems.push(`stamp rim: "${stamp.rim}" is ${rim} units long; the rim allows 410`);
  }
  assert.deepEqual(problems, []);
});

test('the slot check would catch an overlong status', () => {
  assert.ok(textWidth('tv2', 'v1.0.10, installed and in daily use at the National Council office') > 320);
});
