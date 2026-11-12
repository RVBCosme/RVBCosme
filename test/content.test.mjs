import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { altText, loadContent, validateContent } from '../scripts/lib/content.mjs';
import { fixture } from './helpers/content.mjs';
import { drawnPaths } from './helpers/drawn.mjs';

const SPEC = readFileSync(new URL('../docs/superpowers/specs/2026-09-23-github-profile-redesign-design.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APPENDIX = SPEC.slice(SPEC.indexOf('## Appendix A'));
const specLines = (label) => [...APPENDIX.matchAll(new RegExp(`^- ${label}: (.+)$`, 'gm'))].map((m) => m[1].trim());

// Readers for the drawing copy in appendix A.
const part = (from, to) => APPENDIX.split(from)[1].split(to)[0];
const line = (text, label) => new RegExp(`^- ${label}: (.+)$`, 'm').exec(text)[1];
const quoted = (text) => [...text.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
const labelled = (text) => [...text.matchAll(/([A-Z][\w ]*?) "([^"]*)"/g)].map(([, label, value]) => ({ label, value }));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const month = (text) => `${text.split(' ')[1]}-${String(MONTHS.indexOf(text.split(' ')[0]) + 1).padStart(2, '0')}`;
function table(text, firstHeader) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`| ${firstHeader} |`));
  const cells = (l) => l.split('|').slice(1, -1).map((cell) => cell.trim());
  const rows = [];
  for (let i = start + 2; lines[i]?.startsWith('|'); i += 1) rows.push(cells(lines[i]));
  return { header: cells(lines[start]), rows };
}

test('the content file and the fixture are valid', async () => {
  await loadContent();
  assert.deepEqual(validateContent(fixture()), []);
});

/** The approved copy compared with the content: one line per mismatch, named by its spec section. */
function approvedCopyProblems(c) {
  const problems = [];
  const check = (what, actual, expected) => {
    if (!isDeepStrictEqual(actual, expected)) problems.push(`${what}: the content has ${JSON.stringify(actual)}, the spec has ${JSON.stringify(expected)}`);
  };
  check('A1 intro', c.intro, APPENDIX.split('**A1. Intro**')[1].split('**A2.')[0].trim());
  check('A3 to A5 paragraphs', c.projects.map((p) => p.paragraph), specLines('Paragraph'));
  check('A3 to A5 chips', c.projects.map((p) => p.chips.join(', ')), specLines('Chips'));
  check('A3 to A5 notes', c.projects.map((p) => p.note), specLines('Note'));
  const a6 = APPENDIX.split('**A6. Experience**')[1].split('Hero revision table')[0];
  check(
    'A6 experience list',
    c.experience.list.map((x) => `**${x.role}**, ${x.where}. ${x.period}. ${x.detail}`),
    [...a6.matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()),
  );
  const a7 = APPENDIX.split('`<details>` list:')[1].split('**A8.')[0];
  check('A7 certificate list', c.certificates.list.map((e) => `**${e.issuer}:** ${e.items}`), [...a7.matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()));
  const contactLine = APPENDIX.split('Markdown under it:')[1].trim().split('\n')[0];
  check('A8 contact line', c.contact.cards.map((k) => `**${k.label}** [${k.linkText}](${k.href})`).join(' · '), contactLine);
  const alts = [...APPENDIX.matchAll(/^- `(\w+)\.svg`: (.+)$/gm)];
  check('A9 alt text count', alts.length, 9);
  for (const [, name, alt] of alts) check(`A9 alt text for ${name}`, altText(c, name), alt.trim());
  check('A0 sidebar', [c.sidebar.name, c.sidebar.pronouns, c.sidebar.bio, c.sidebar.location], ['Name', 'Pronouns', 'Bio', 'Location'].map((k) => specLines(k)[0]));

  // The drawings' copy: every string a drawing shows, except the hero's box captions and arrow labels, which the spec doesn't list.
  const a2 = part('**A2. ', '**A3.');
  const nowRows = [...a2.matchAll(/^- (.+)$/gm)].map((m) => m[1]);
  const [, nextText, bar, updated] = /^(.+) \(bar label: "(.+)"; header: "(.+)"\)$/.exec(nowRows.at(-1));
  check('A2 title', c.now.title, a2.split('**')[0]);
  check('A2 In progress rows', [...c.now.items, c.now.next.text], [...nowRows.slice(0, -1), nextText]);
  check('A2 bar label and header', [c.now.next.bar, c.now.updated], [bar, updated]);

  const [anf, eyed, pookies] = [['**A3. ', '**A4.'], ['**A4. ', '**A5.'], ['**A5. ', '**A6.']].map(([from, to]) => part(from, to));
  [anf, eyed, pookies].forEach((text, i) => {
    const p = c.projects[i];
    const id = `A${i + 3}`;
    const header = line(text, 'Header');
    check(`${id} header`, [p.letter, p.group, p.sheet], [/bubble (\w)/.exec(header)[1], ...quoted(header)]);
    check(`${id} title and subtitle`, [p.title, p.subtitle], [line(text, 'Title'), line(text, 'Subtitle')]);
    // A value can hold a space ("0.95 s"), so each metric is compared as "value label".
    check(`${id} metrics`, p.metrics.map((m) => `${m.value} ${m.label}`), /^- Metrics: (.+)$/m.exec(text)?.[1].split(' · ') ?? []);
    check(`${id} title block`, p.titleBlock, labelled(line(text, 'Title block')));
  });
  const [receiptHeading, first, last, totalLabel, total] = quoted(/^- Receipt figure.*$/m.exec(anf)[0]);
  const receiptNumbers = [];
  for (let n = Number(first.match(/\d+/)[0]); n <= Number(last.match(/\d+/)[0]); n += 1) receiptNumbers.push(first.replace(/\d+/, n));
  check('A3 figure', c.projects[0].figure, { caption: line(anf, 'Figure caption'), receiptHeading, receiptNumbers, totalLabel, total });
  const [traceLabel, alert] = quoted(line(eyed, 'Trace label'));
  check('A4 figure', c.projects[1].figure, { traceLabel, alert });
  const chain = line(pookies, 'Diagram').split(/ →\((.+?)\)→ /);
  const [dimension, note] = quoted(line(pookies, 'Figure'));
  check('A5 figure', c.projects[2].figure, { boxes: chain.filter((_, k) => k % 2 === 0), edges: chain.filter((_, k) => k % 2 === 1), dimension, note });

  const experience = part('**A6. Experience**', '**A7.');
  const schedule = table(experience, 'Row').rows.map(([label, start, end]) => ({
    label: label.replace(' (outlined bar)', ''), start: month(start), end: end === 'now' ? null : month(end), outline: label.endsWith('(outlined bar)'),
  }));
  check('A6 schedule rows', c.experience.rows.map((r) => ({ label: r.label, start: r.start, end: r.end, outline: Boolean(r.outline) })), schedule);
  const [, nowLabel, nowMonth] = /The "(\w+)" line sits at late (\w+ \d{4})\./.exec(experience);
  check('A6 now line', [c.experience.nowLabel, c.experience.now], [nowLabel, month(nowMonth)]);
  const revisions = table(experience, 'Date');
  check('A6 revision table', [c.hero.revisionHeaders, c.hero.revisions], [revisions.header, revisions.rows.map(([date, text]) => ({ date, text: text.replace(' (revision cloud)', '') }))]);
  check('A6 hero title block', Object.values(c.hero.titleBlock), labelled(/^Title block: .+$/m.exec(experience)[0]));

  const stackAndCertificates = part('**A7. Stack and certificates**', '**A8.');
  const stack = table(stackAndCertificates, 'Item');
  check('A7 bill of materials', [c.stack.headers, c.stack.rows], [stack.header, stack.rows.map(([, parts, use]) => ({ parts, use }))]);
  check(
    'A7 stamps',
    c.certificates.stamps.map(({ name, inner, rim, ink }) => ({ name, inner, rim, ink })),
    table(stackAndCertificates, 'Name').rows.map(([name, inner, rim, ink]) => ({ name, inner, rim, ink: ink === 'coral' ? 'red' : ink })),
  );
  check('A7 certificates header', [c.certificates.title, c.certificates.summary], quoted(/^Header: .+$/m.exec(stackAndCertificates)[0]));

  const contact = part('**A8. Contact**', '**A9.');
  check('A8 heading', c.contact.heading, quoted(contact)[0]);
  check('A8 cards', c.contact.cards.map((k) => [k.label, k.value]), [...contact.matchAll(/^- (\w+): (\S+) \(/gm)].map((m) => [m[1], m[2]]));

  // Section titles appear only as the first sentence of their drawing's alt text (A9).
  const firstSentence = (name) => alts.find(([, n]) => n === name)[2].split('. ')[0];
  check('A9 schedule title and range', `${c.experience.title}, ${c.experience.range}`, firstSentence('schedule'));
  check('A9 bill of materials title', c.stack.title, firstSentence('stack'));

  // Appendix A has no hero diagram; spec section 5 describes it.
  const hero = SPEC.split('\n').find((l) => l.startsWith('| 1 | Hero'));
  const groups = [...hero.matchAll(/Group (\d), ([^:]+): (.+?), with (?:the markup )?"([^"]+)"/g)];
  check(
    'Section 5 hero groups',
    c.hero.groups.map((g) => [g.number, g.title.toLowerCase(), g.boxes.map((b) => b.lines.join(' ')), g.markup]),
    groups.map(([, number, title, boxes, markup]) => [number, title.toLowerCase(), boxes.split(' → '), markup]),
  );
  check('Section 5 hero dimension', c.hero.dimension, /a dimension line "([^"]+)"/.exec(hero)[1]);
  return problems;
}

test('content carries the approved copy from spec appendix A (ADR-005)', async () => {
  assert.deepEqual(approvedCopyProblems(await loadContent()), []);
});

// The spec never lists the hero's box captions and arrow labels; the golden fixture alone pins them.
const NOT_IN_SPEC = [/^hero\.groups\[\d+\]\.boxes\[\d+\]\.caption$/, /^hero\.groups\[\d+\]\.edges\[\d+\]$/];

test('every string a drawing shows is tied to the spec (ADR-005)', async () => {
  const c = await loadContent();
  const untied = [];
  for (const path of drawnPaths(c)) {
    if (NOT_IN_SPEC.some((pattern) => pattern.test(path))) continue;
    const changed = structuredClone(c);
    const keys = path.match(/[^.[\]]+/g);
    const parent = keys.slice(0, -1).reduce((node, key) => node[key], changed);
    parent[keys.at(-1)] += ' (changed)';
    if (approvedCopyProblems(changed).length === 0) untied.push(path);
  }
  assert.deepEqual(untied, []);
});

test('drawing copy that drifts from the spec is named (ADR-005)', () => {
  const c = fixture();
  c.now.items[0] = 'ANF Inventory System: in use at the Council';
  c.projects[0].titleBlock[2].value = 'v1.0.10, in use';
  assert.deepEqual(approvedCopyProblems(c).map((line) => line.split(':')[0]), ['A2 In progress rows', 'A3 title block']);
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
