import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { COMPONENTS } from '../scripts/components/index.mjs';
import { PROJECT_IDS, altText, loadContent, validateContent } from '../scripts/lib/content.mjs';
import { fixture } from './helpers/content.mjs';
import { drawnPaths } from './helpers/drawn.mjs';

const SPEC = readFileSync(new URL('../docs/superpowers/specs/2026-09-23-github-profile-redesign-design.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APPENDIX = SPEC.slice(SPEC.indexOf('## Appendix A'));

// Appendix A, split at its numbered headings. A section is found by its title or by the drawing its
// heading names ("**A3. A: ANF System** (`anf.svg`)"), never by its number, so adding a sheet renumbers nothing here.
const SECTIONS = APPENDIX.split(/^(?=\*\*A\d+\. )/m).slice(1).map((text) => {
  const [heading, id, title] = /^\*\*(A\d+)\. (.+?)\*\*.*$/m.exec(text);
  return { id, title, drawing: /\(`(\w+)\.svg`\)/.exec(heading)?.[1], text };
});
function section(find) {
  const found = SECTIONS.find(find);
  if (!found) throw new Error(`Spec appendix A has no section for ${find}`);
  return found;
}
const titled = (title) => section((s) => s.title === title);
const drawing = (name) => section((s) => s.drawing === name);
// The project sheets are the sections titled with their bubble letter, "A: ANF System".
const SHEETS = SECTIONS.filter((s) => /^[A-Z]: /.test(s.title));

// Readers for the drawing copy in appendix A.
const line = (text, label) => new RegExp(`^- ${label}: (.+)$`, 'm').exec(text)[1].trim();
const optionalLine = (text, label) => new RegExp(`^- ${label}: (.+)$`, 'm').exec(text)?.[1].trim();
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

// Each project sheet draws its own figure; these read its copy from the sheet's section.
const FIGURE_COPY = {
  lusot(text) {
    const [cantTell, caption] = quoted(line(text, 'Other answer and caption'));
    return { levels: quoted(line(text, 'Gauge levels, shallow to deep')), cantTell, caption };
  },
  ratchet(text) {
    const [blocked, verified, caption] = quoted(line(text, 'Notes and caption'));
    return { phases: quoted(line(text, 'Phases')), records: quoted(line(text, 'Ledger records')), blocked, verified, caption };
  },
  anf(text) {
    const [receiptHeading, first, last, totalLabel, total] = quoted(/^- Receipt figure.*$/m.exec(text)[0]);
    const receiptNumbers = [];
    for (let n = Number(first.match(/\d+/)[0]); n <= Number(last.match(/\d+/)[0]); n += 1) receiptNumbers.push(first.replace(/\d+/, n));
    return { caption: line(text, 'Figure caption'), receiptHeading, receiptNumbers, totalLabel, total };
  },
  eyedtrack(text) {
    const [traceLabel, alert] = quoted(line(text, 'Trace label'));
    return { traceLabel, alert };
  },
  pookies(text) {
    const chain = line(text, 'Diagram').split(/ →\((.+?)\)→ /);
    const [dimension, note] = quoted(line(text, 'Figure'));
    return { boxes: chain.filter((_, k) => k % 2 === 0), edges: chain.filter((_, k) => k % 2 === 1), dimension, note };
  },
};

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
  const intro = titled('Intro');
  check(`${intro.id} intro`, c.intro, intro.text.replace(/^.*\n/, '').trim());
  const experience = titled('Experience');
  check(
    `${experience.id} experience list`,
    c.experience.list.map((x) => `**${x.role}**, ${x.where}. ${x.period}. ${x.detail}`),
    [...experience.text.split('Hero revision table')[0].matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()),
  );
  const stackAndCertificates = titled('Stack and certificates');
  const certificateList = stackAndCertificates.text.split('`<details>` list:')[1];
  check(`${stackAndCertificates.id} certificate list`, c.certificates.list.map((e) => `**${e.issuer}:** ${e.items}`), [...certificateList.matchAll(/^- (\*\*.+)$/gm)].map((m) => m[1].trim()));
  const contact = drawing('contact');
  const contactLine = contact.text.split('Markdown under it:')[1].trim().split('\n')[0];
  check(`${contact.id} contact line`, c.contact.cards.map((k) => `**${k.label}** [${k.linkText}](${k.href})`).join(' · '), contactLine);
  const altSection = titled('Alt text');
  const alts = [...altSection.text.matchAll(/^- `(\w+)\.svg`: (.+)$/gm)];
  check(`${altSection.id} alt text count`, alts.length, COMPONENTS.length);
  for (const [, name, alt] of alts) check(`${altSection.id} alt text for ${name}`, altText(c, name), alt.trim());
  const sidebar = titled('Sidebar');
  check(`${sidebar.id} sidebar`, [c.sidebar.name, c.sidebar.pronouns, c.sidebar.bio, c.sidebar.location], ['Name', 'Pronouns', 'Bio', 'Location'].map((k) => line(sidebar.text, k)));

  // The drawings' copy: every string a drawing shows, except the hero's box captions and arrow labels, which the spec doesn't list.
  const now = drawing('now');
  const nowRows = [...now.text.matchAll(/^- (.+)$/gm)].map((m) => m[1]);
  const [, nextText, bar, updated] = /^(.+) \(bar label: "(.+)"; header: "(.+)"\)$/.exec(nowRows.at(-1));
  check(`${now.id} title`, c.now.title, now.title);
  check(`${now.id} In progress rows`, [...c.now.items, c.now.next.text], [...nowRows.slice(0, -1), nextText]);
  check(`${now.id} bar label and header`, [c.now.next.bar, c.now.updated], [bar, updated]);

  // Each project against its own sheet in appendix A, which lists the sheets in README order.
  check('Appendix A project sheets, in order', SHEETS.map((s) => s.drawing), c.projects.map((p) => p.id));
  for (const p of c.projects) {
    const sheet = SHEETS.find((s) => s.drawing === p.id);
    if (!sheet) continue;
    const { id, text } = sheet;
    const header = line(text, 'Header');
    check(`${id} header`, [p.letter, p.group, p.sheet], [/bubble (\w)/.exec(header)[1], ...quoted(header)]);
    check(`${id} title and subtitle`, [p.title, p.subtitle], [line(text, 'Title'), line(text, 'Subtitle')]);
    // A value can hold a space ("713 ms"), so each metric is compared as "value label".
    check(`${id} metrics`, p.metrics.map((m) => `${m.value} ${m.label}`), optionalLine(text, 'Metrics')?.split(' · ') ?? []);
    check(`${id} title block`, p.titleBlock, labelled(line(text, 'Title block')));
    check(`${id} figure`, p.figure, FIGURE_COPY[p.id]?.(text));
    check(`${id} paragraph`, p.paragraph, line(text, 'Paragraph'));
    check(`${id} chips`, p.chips.join(', '), line(text, 'Chips'));
    check(`${id} note`, p.note, line(text, 'Note'));
    const links = [...(optionalLine(text, 'Links?') ?? '').matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(([, linkText, href]) => ({ text: linkText, href }));
    check(`${id} links`, p.links, links);
  }

  const schedule = table(experience.text, 'Row').rows.map(([label, start, end]) => ({
    label: label.replace(' (outlined bar)', ''), start: month(start), end: end === 'now' ? null : month(end), outline: label.endsWith('(outlined bar)'),
  }));
  check(`${experience.id} schedule rows`, c.experience.rows.map((r) => ({ label: r.label, start: r.start, end: r.end, outline: Boolean(r.outline) })), schedule);
  const [, nowLabel, nowMonth] = /The "(\w+)" line sits at late (\w+ \d{4})\./.exec(experience.text);
  check(`${experience.id} now line`, [c.experience.nowLabel, c.experience.now], [nowLabel, month(nowMonth)]);
  const revisions = table(experience.text, 'Date');
  check(`${experience.id} revision table`, [c.hero.revisionHeaders, c.hero.revisions], [revisions.header, revisions.rows.map(([date, text]) => ({ date, text: text.replace(' (revision cloud)', '') }))]);
  check(`${experience.id} hero title block`, Object.values(c.hero.titleBlock), labelled(/^Title block: .+$/m.exec(experience.text)[0]));

  const stack = table(stackAndCertificates.text, 'Item');
  check(`${stackAndCertificates.id} bill of materials`, [c.stack.headers, c.stack.rows], [stack.header, stack.rows.map(([, parts, use]) => ({ parts, use }))]);
  check(
    `${stackAndCertificates.id} stamps`,
    c.certificates.stamps.map(({ name, inner, rim, ink }) => ({ name, inner, rim, ink })),
    table(stackAndCertificates.text, 'Name').rows.map(([name, inner, rim, ink]) => ({ name, inner, rim, ink: ink === 'coral' ? 'red' : ink })),
  );
  check(`${stackAndCertificates.id} certificates header`, [c.certificates.title, c.certificates.summary], quoted(/^Header: .+$/m.exec(stackAndCertificates.text)[0]));

  check(`${contact.id} heading`, c.contact.heading, quoted(contact.text)[0]);
  check(`${contact.id} cards`, c.contact.cards.map((k) => [k.label, k.value]), [...contact.text.matchAll(/^- (\w+): (\S+) \(/gm)].map((m) => [m[1], m[2]]));

  // Section titles appear only as the first sentence of their drawing's alt text.
  const firstSentence = (name) => alts.find(([, n]) => n === name)[2].split('. ')[0];
  check(`${altSection.id} schedule title and range`, `${c.experience.title}, ${c.experience.range}`, firstSentence('schedule'));
  check(`${altSection.id} bill of materials title`, c.stack.title, firstSentence('stack'));

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

test('a project link that drifts from its sheet in the spec is named (ADR-005)', () => {
  const c = fixture();
  const eyed = c.projects.findIndex((p) => p.id === 'eyedtrack');
  c.projects[eyed].links[0].href = 'https://example.com';
  assert.deepEqual(approvedCopyProblems(c).map((line) => line.split(':')[0]), [`${SHEETS.find((s) => s.drawing === 'eyedtrack').id} links`]);
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
  assert.ok(errors.includes(`projects[0].id must be "${PROJECT_IDS[0]}" (order: ${PROJECT_IDS.join(', ')})`), errors.join('\n'));
  assert.ok(errors.includes('contact.cards kinds must be email, linkedin, github in that order; got email, linkedin, phone'), errors.join('\n'));
});

test('sheet numbers count the hero and every project sheet', () => {
  const c = fixture();
  const sheets = c.projects.length + 1;
  c.hero.titleBlock.sheet.value = `1 / ${sheets - 1}`;
  c.projects.at(-1).sheet = `Sheet ${sheets} of ${sheets - 1}`;
  assert.deepEqual(validateContent(c), [
    `hero.titleBlock.sheet.value must be "1 / ${sheets}": the hero and ${sheets - 1} project sheets`,
    `projects[${sheets - 2}].sheet must be "Sheet ${sheets} of ${sheets}"`,
  ]);
});

test('the month shown in three places must agree (Review Focus 5)', () => {
  const c = fixture();
  c.experience.now = '2026-12';
  assert.deepEqual(validateContent(c), [
    'now.updated must be "Updated 2026-12" to match experience.now',
    'hero.titleBlock.date.value must be "2026-12" to match experience.now',
  ]);
});

test('certificate counts must agree with the list', () => {
  const c = fixture();
  c.certificates.list[0].items += ', AWS Cloud Practitioner (2026)';
  assert.deepEqual(validateContent(c), [
    'certificates.summary says 14 certificates but certificates.list names 15',
    'certificates.listSummary must mention 15',
  ]);
});

test('the summary counts the issuers the list names; the five stamps show some of them', () => {
  const c = fixture();
  assert.equal(c.certificates.list.length, 6);
  assert.equal(c.certificates.stamps.length, 5);
  c.certificates.summary = c.certificates.summary.replace('6 issuers', '5 issuers');
  assert.deepEqual(validateContent(c), ['certificates.summary says 5 issuers; certificates.list has 6 and certificates.stamps has 5']);
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
