import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { altText, loadContent, validateContent } from '../scripts/lib/content.mjs';
import { fixture } from './helpers/content.mjs';

const SPEC = readFileSync(new URL('../docs/superpowers/specs/2026-09-23-github-profile-redesign-design.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APPENDIX = SPEC.slice(SPEC.indexOf('## Appendix A'));
const specLines = (label) => [...APPENDIX.matchAll(new RegExp(`^- ${label}: (.+)$`, 'gm'))].map((m) => m[1].trim());

test('the content file and the fixture are valid', async () => {
  await loadContent();
  assert.deepEqual(validateContent(fixture()), []);
});

test('content carries the approved copy from spec appendix A (ADR-005)', async () => {
  const c = await loadContent();
  assert.equal(c.intro, APPENDIX.split('**A1. Intro**')[1].split('**A2.')[0].trim());
  assert.deepEqual(c.projects.map((p) => p.paragraph), specLines('Paragraph'));
  assert.deepEqual(c.projects.map((p) => p.chips.join(', ')), specLines('Chips'));
  assert.deepEqual([c.projects[0].note], specLines('Note'));
  const a6 = APPENDIX.split('**A6. Experience**')[1].split('Hero revision table')[0];
  assert.deepEqual(
    c.experience.list.map((x) => `**${x.role}**, ${x.where}. ${x.period}. ${x.detail}`),
    [...a6.matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()),
  );
  const a7 = APPENDIX.split('`<details>` list:')[1].split('**A8.')[0];
  assert.deepEqual(c.certificates.list.map((e) => `**${e.issuer}:** ${e.items}`), [...a7.matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()));
  const contactLine = APPENDIX.split('Markdown under it:')[1].trim().split('\n')[0];
  assert.equal(c.contact.cards.map((k) => `**${k.label}** [${k.linkText}](${k.href})`).join(' · '), contactLine);
  const alts = [...APPENDIX.matchAll(/^- `(\w+)\.svg`: (.+)$/gm)];
  assert.equal(alts.length, 9);
  for (const [, name, alt] of alts) assert.equal(altText(c, name), alt.trim(), `alt text for ${name}`);
  assert.deepEqual([c.sidebar.name, c.sidebar.pronouns, c.sidebar.bio, c.sidebar.location], ['Name', 'Pronouns', 'Bio', 'Location'].map((k) => specLines(k)[0]));
});

test('a missing or wrongly shaped field is reported by its path', () => {
  const c = fixture();
  c.now.items.push('A fifth thing');
  delete c.hero.titleBlock.scale;
  c.experience.rows[3].end = 'Jun 2026';
  c.certificates.stamps[0].ink = 'blue';
  assert.deepEqual(validateContent(c), [
    'hero.titleBlock.scale must be an object',
    "now.items must have 4 item(s); it has 5. The drawing's layout is fixed, so changing the count needs a design change.",
    'experience.rows[3].end must be a month like "2026-09" or null',
    'certificates.stamps[0].ink must be one of "red", "line"',
  ]);
});

test('owner rulings are enforced: project order and exactly three contact links', () => {
  const c = fixture();
  c.projects.reverse();
  c.contact.cards[2].kind = 'phone';
  const errors = validateContent(c);
  assert.ok(errors.includes('projects[0].id must be "anf" (order: anf, eyedtrack, pookies)'), errors.join('\n'));
  assert.ok(errors.includes('contact.cards kinds must be email, linkedin, github in that order; got email, linkedin, phone'), errors.join('\n'));
});

test('the month shown in three places must agree (Review Focus 5)', () => {
  const c = fixture();
  c.experience.now = '2026-10';
  assert.deepEqual(validateContent(c), [
    'now.updated must be "Updated 2026-10" to match experience.now',
    'hero.titleBlock.date.value must be "2026-10" to match experience.now',
  ]);
});

test('certificate counts must agree with the list', () => {
  const c = fixture();
  c.certificates.list[1].items += ', AWS Cloud Practitioner (2026)';
  assert.deepEqual(validateContent(c), [
    'certificates.summary says 10 certificates but certificates.list names 11',
    'certificates.listSummary must mention 11',
  ]);
});

test('schedule dates must sit inside the drawn range', () => {
  const c = fixture();
  c.experience.rows[0].start = '2021-08';
  c.experience.rows[3].end = '2026-12';
  assert.deepEqual(validateContent(c), [
    'experience.rows[0].start is before experience.fromYear',
    'experience.rows[3].end is after experience.now; use null for an ongoing role',
  ]);
});

test('loadContent stops with every problem listed (Review Focus 1)', async () => {
  const c = fixture();
  c.intro = '';
  c.sidebar.bio = '';
  const file = join(mkdtempSync(join(tmpdir(), 'profile-')), 'profile.json');
  writeFileSync(file, JSON.stringify(c));
  await assert.rejects(loadContent(pathToFileURL(file)), (error) => {
    assert.equal(error.message, 'content/profile.json has 2 problem(s):\n- intro must be a non-empty string\n- sidebar.bio must be a non-empty string');
    return true;
  });
});

test('rule checks run once the shape is right', () => {
  const c = fixture();
  c.projects[2].letter = 'D';
  assert.deepEqual(validateContent(c), ['projects[2].letter must be "C"']);
});

test('loadContent explains unreadable JSON', async () => {
  const file = join(mkdtempSync(join(tmpdir(), 'profile-')), 'profile.json');
  writeFileSync(file, '{ "intro": ');
  await assert.rejects(loadContent(pathToFileURL(file)), /^Error: content\/profile\.json is not valid JSON: /);
});
