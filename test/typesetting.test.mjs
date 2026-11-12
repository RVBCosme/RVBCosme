import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { COMPONENTS } from '../scripts/components/index.mjs';
import { PROJECT_IDS, loadContent } from '../scripts/lib/content.mjs';
import { FACES, subsetFace } from '../scripts/lib/fonts.mjs';
import { collectGlyphs } from '../scripts/lib/svg.mjs';
import { TYPE } from '../scripts/lib/typography.mjs';
import { fixture } from './helpers/content.mjs';
import { drawnPaths } from './helpers/drawn.mjs';

const fonts = new Map();
function font(face) {
  if (!fonts.has(face)) {
    const file = fontkit.openSync(fileURLToPath(new URL(`../assets/fonts/${FACES[face].file}`, import.meta.url)));
    // A variable face (Caveat) is embedded pinned to its weight, so measure that instance, not the default.
    fonts.set(face, FACES[face].axes ? file.getVariation(FACES[face].axes) : file);
  }
  return fonts.get(face);
}

/** Rendered width in drawing units, with the real font's kerning and the class's letter spacing. */
function textWidth(cls, text, size = TYPE[cls].size) {
  const f = font(TYPE[cls].face);
  const spacing = Number(/letter-spacing:([\d.]+)px/.exec(TYPE[cls].style)?.[1] ?? 0);
  return (f.layout(text).advanceWidth * size) / f.unitsPerEm + spacing * [...text].length;
}

// A project's content path by its id, so the slots don't depend on the order of the sheets.
const P = Object.fromEntries(PROJECT_IDS.map((id, i) => [id, `projects[${i}]`]));

// Content-driven text with a fixed slot in the drawings: [what, text class, widest allowed, content paths].
// The limits are the free space in the approved layout, not today's widths. "[*]" means every item of a list.
const SLOTS = [
  // hero.svg
  ['hero group numbers (bubble radius 16)', 'bubt', 24, 'hero.groups[*].number'],
  ['hero group titles (the AI markup can start at x 375)', 'asm', 260, 'hero.groups[*].title'],
  ['hero box labels', 'bx', 174, 'hero.groups[*].boxes[*].lines[*]'],
  ['hero box captions', 'cap', 180, 'hero.groups[*].boxes[*].caption'],
  ['arrow labels (70 units between boxes)', 'edge', 60, ['hero.groups[*].edges[*]', `${P.pookies}.figure.edges[*]`]],
  ['hero markups', 'note', 225, 'hero.groups[*].markup'],
  ['hero dimension', 'dim', 196, 'hero.dimension'],
  ['revision date header (divider at x 920)', 'tl', 64, 'hero.revisionHeaders[0]'],
  ['revision entry header', 'tl', 205, 'hero.revisionHeaders[1]'],
  ['revision dates', 'tv', 64, 'hero.revisions[*].date'],
  ['revision entries', 'tv', 205, 'hero.revisions[*].text'],
  ['hero title and description labels', 'tl', 290, ['hero.titleBlock.title.label', 'hero.titleBlock.description.label']],
  ['hero title', 'tname', 290, 'hero.titleBlock.title.value'],
  ['hero description', 'tv', 290, 'hero.titleBlock.description.value'],
  ['"Drawn by" label (divider at x 912)', 'tl', 58, 'hero.titleBlock.drawnBy.label'],
  ['signature (divider at x 912)', 'sig', 56, 'hero.titleBlock.drawnBy.value'],
  ['date label (divider at x 1010)', 'tl', 84, 'hero.titleBlock.date.label'],
  ['date value (divider at x 1010)', 'tv', 84, 'hero.titleBlock.date.value'],
  ['sheet and scale labels (60-unit cells)', 'tl', 56, ['hero.titleBlock.sheet.label', 'hero.titleBlock.scale.label']],
  ['sheet and scale values (60-unit cells)', 'tv', 56, ['hero.titleBlock.sheet.value', 'hero.titleBlock.scale.value']],
  // now, schedule, stack and certificates share a header: a title at x 36, a note right-aligned at x 1164
  ['section titles', 'asm', 600, ['now.title', 'experience.title', 'stack.title', 'certificates.title']],
  ['section header notes (right-aligned at x 1164)', 'tl', 400, ['now.updated', 'experience.range', 'certificates.summary']],
  // now.svg
  ['In progress rows', 'tv', 720, ['now.items[*]', 'now.next.text']],
  ['In progress bar label', 'tl', 330, 'now.next.bar'],
  // anf.svg, eyedtrack.svg, pookies.svg
  ['sheet bubble letters (radius 20)', 'bubt', 28, 'projects[*].letter'],
  ['sheet group names (the Pookies dimension starts at x 526)', 'asm', 420, 'projects[*].group'],
  ['sheet numbers (right-aligned at x 790)', 'sheetno', 180, 'projects[*].sheet'],
  ['ANF and EyeDTrack titles', 'ttl', 570, [`${P.anf}.title`, `${P.eyedtrack}.title`]],
  ['Pookies title (the cookie starts at x 526)', 'ttl', 470, `${P.pookies}.title`],
  ['ANF subtitle (the receipt printer starts at x 620)', 'subt', 580, `${P.anf}.subtitle`],
  ['EyeDTrack subtitle (the trace label starts at x 630)', 'subt', 580, `${P.eyedtrack}.subtitle`],
  ['Pookies subtitle', 'subt', 770, `${P.pookies}.subtitle`],
  ['metric values', 'met', 200, 'projects[*].metrics[*].value'],
  ['metric labels', 'metl', 200, 'projects[*].metrics[*].label'],
  ['project title block labels', 'tl2', 320, 'projects[*].titleBlock[*].label'],
  ['project title block values', 'tv2', 320, 'projects[*].titleBlock[*].value'],
  ['Pookies status (its live dot sits at x 1044)', 'tv2', 190, `${P.pookies}.titleBlock[2].value`],
  ['ANF figure caption (the test strip ends at x 600)', 'figcap', 196, `${P.anf}.figure.caption`],
  ['receipt heading (the paper is 94 wide)', 'rct', 90, `${P.anf}.figure.receiptHeading`],
  ['receipt numbers (the paper is 94 wide)', 'rcn', 90, `${P.anf}.figure.receiptNumbers[*]`],
  ['EyeDTrack trace label (right-aligned at x 790)', 'earlabel', 160, `${P.eyedtrack}.figure.traceLabel`],
  ['EyeDTrack alert tag (its chip is 94 wide)', 'alertt', 86, `${P.eyedtrack}.figure.alert`],
  ['Pookies diagram boxes', 'bx', 184, `${P.pookies}.figure.boxes[*]`],
  ['Pookies dimension (centered over the cookie)', 'edge', 80, `${P.pookies}.figure.dimension`],
  ['Pookies live note (the title block starts at x 820)', 'livenote', 156, `${P.pookies}.figure.note`],
  // lusot.svg
  ['Lusot title (the photo starts at x 550)', 'ttl', 500, `${P.lusot}.title`],
  ["Lusot subtitle (the can't-tell box starts at x 550)", 'subt', 500, `${P.lusot}.subtitle`],
  ['Lusot gauge levels (the title block starts at x 820)', 'figcap', 90, `${P.lusot}.figure.levels[*]`],
  ["Lusot can't-tell box (100 wide)", 'tv', 90, `${P.lusot}.figure.cantTell`],
  ['Lusot caption (centered at x 600; the gauge starts at x 700)', 'figcap', 196, `${P.lusot}.figure.caption`],
  // ratchet.svg
  ['RATCHET title (the phases start at x 322)', 'ttl', 270, `${P.ratchet}.title`],
  ['RATCHET subtitle (the caption can start at x 580)', 'subt', 530, `${P.ratchet}.subtitle`],
  ['RATCHET phases (the boxes are 74 wide)', 'tv', 66, `${P.ratchet}.figure.phases[*]`],
  ['RATCHET ledger records (the records are 56 wide)', 'figcap', 50, `${P.ratchet}.figure.records[*]`],
  ['RATCHET blocked note (the title block starts at x 820)', 'note', 330, `${P.ratchet}.figure.blocked`],
  ['RATCHET verify note (the title block starts at x 820)', 'livenote', 200, `${P.ratchet}.figure.verified`],
  ['RATCHET caption (right-aligned at x 790, beside the subtitle)', 'figcap', 210, `${P.ratchet}.figure.caption`],
  // schedule.svg
  ['schedule labels (the year grid starts at x 330)', 'tv', 286, 'experience.rows[*].label'],
  ['schedule now label (19 units from the frame in December)', 'nowlabel', 30, 'experience.nowLabel'],
  // stack.svg
  ['bill of materials item header (divider at x 92)', 'tl', 50, 'stack.headers[0]'],
  ['bill of materials parts header', 'tl', 740, 'stack.headers[1]'],
  ['bill of materials uses header', 'tl', 255, 'stack.headers[2]'],
  ['bill of materials parts', 'tv', 740, 'stack.rows[*].parts'],
  ['bill of materials uses', 'tv', 255, 'stack.rows[*].use'],
  // certificates.svg
  ['stamp inner lines', 'stsub', 104, 'certificates.stamps[*].inner'],
  // contact.svg
  ['contact heading (the wiring starts at x 456)', 'hwc', 380, 'contact.heading'],
  ['contact labels', 'tl2', 460, 'contact.cards[*].label'],
  ['contact values', 'tv2', 460, 'contact.cards[*].value'],
];
// Drawn text measured below with its own geometry instead of a single slot.
const OWN_GEOMETRY = ['certificates.stamps[*].name', 'certificates.stamps[*].rim', `${P.anf}.figure.totalLabel`, `${P.anf}.figure.total`];

/** Expands a content path such as 'hero.groups[*].markup' into [path, value] pairs. */
function expand(content, pattern) {
  let found = [['', content]];
  for (const part of pattern.match(/[^.[\]]+|\[\*\]|\[\d+\]/g)) {
    found = found.flatMap(([path, value]) => {
      if (part === '[*]') return value.map((item, i) => [`${path}[${i}]`, item]);
      if (part.startsWith('[')) return [[`${path}${part}`, value[Number(part.slice(1, -1))]]];
      return [[path ? `${path}.${part}` : part, value[part]]];
    });
  }
  return found;
}

/** One line per text that is wider than its slot. */
function slotProblems(content) {
  const problems = [];
  for (const [what, cls, max, paths] of SLOTS) {
    for (const [, text] of [paths].flat().flatMap((pattern) => expand(content, pattern))) {
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
  // The receipt's total line starts at x 668 and ends at x 742; keep 4 units between label and amount.
  const { totalLabel, total } = content.projects.find((p) => p.id === 'anf').figure;
  const line = Math.round(textWidth('rct', totalLabel) + textWidth('rct', total));
  if (line > 70) problems.push(`receipt total line: "${totalLabel}" and "${total}" take ${line} units; the receipt allows 70`);
  return problems;
}

test('the typesetting check measures each face as the build embeds it', async () => {
  const sample = "Let's connect, RVC 0123456789";
  for (const face of Object.keys(FACES)) {
    const embedded = fontkit.create(await subsetFace(face, sample));
    const measured = font(face).layout(sample).advanceWidth / font(face).unitsPerEm;
    const built = embedded.layout(sample).advanceWidth / embedded.unitsPerEm;
    assert.ok(Math.abs(measured - built) < 0.001, `${face}: measured ${measured.toFixed(4)} em, but the embedded subset is ${built.toFixed(4)} em`);
  }
});

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
  assert.deepEqual(slotProblems(await loadContent()), []);
});

test('every content-driven text in the drawings has a slot (Review Focus 2)', async () => {
  const content = await loadContent();
  const patterns = [...SLOTS.flatMap(([, , , paths]) => [paths].flat()), ...OWN_GEOMETRY];
  const covered = new Set(patterns.flatMap((pattern) => expand(content, pattern).map(([path]) => path)));
  assert.deepEqual([...drawnPaths(content)].filter((path) => !covered.has(path)), []);
});

test('the slot check names overlong copy where the layout has no room', () => {
  const c = fixture();
  const eyed = c.projects.find((p) => p.id === 'eyedtrack');
  eyed.subtitle = 'Real-time driver attention monitoring with live alerts, thesis';
  eyed.figure.alert = 'drowsiness alert sent';
  c.contact.heading = "Let's build together";
  assert.deepEqual(slotProblems(c).map((line) => line.split(':')[0]), [
    'EyeDTrack subtitle (the trace label starts at x 630)',
    'EyeDTrack alert tag (its chip is 94 wide)',
    'contact heading (the wiring starts at x 456)',
  ]);
});

test('the slot check would catch an overlong status', () => {
  assert.ok(textWidth('tv2', 'v1.0.10, installed and in daily use at the National Council office') > 320);
});
