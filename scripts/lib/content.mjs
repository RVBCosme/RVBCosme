import { readFile } from 'node:fs/promises';

export const CONTENT_URL = new URL('../../content/profile.json', import.meta.url);
export const PROJECT_IDS = ['anf', 'eyedtrack', 'pookies'];
export const CONTACT_KINDS = ['email', 'linkedin', 'github'];

const STR = { type: 'string' };
const MAYBE_EMPTY = { type: 'string', empty: true };
const MONTH = { type: 'month' };
const list = (count, item) => ({ type: 'list', count, item });
const obj = (fields) => ({ type: 'object', fields });
const CELL = obj({ label: STR, value: STR });

// The drawings have fixed layouts, so list lengths are part of the schema.
const SCHEMA = obj({
  hero: obj({
    alt: STR,
    groups: list(2, obj({ number: STR, title: STR, boxes: list(3, obj({ lines: list([1, 2], STR), caption: STR })), edges: list(2, STR), markup: STR })),
    dimension: STR,
    revisionHeaders: list(2, STR),
    revisions: list(5, obj({ date: STR, text: STR })),
    titleBlock: obj({ title: CELL, description: CELL, drawnBy: CELL, date: CELL, sheet: CELL, scale: CELL }),
  }),
  intro: STR,
  now: obj({ alt: STR, title: STR, updated: STR, items: list(4, STR), next: obj({ text: STR, bar: STR }) }),
  projects: list(3, obj({
    id: STR, letter: STR, group: STR, sheet: STR, title: STR, subtitle: STR,
    metrics: list([0, 3], obj({ value: STR, label: STR })),
    titleBlock: list(4, CELL),
    figure: { type: 'object', fields: {} },
    paragraph: STR,
    chips: list([1, 12], STR),
    note: MAYBE_EMPTY,
    links: list([0, 3], obj({ text: STR, href: STR })),
    alt: STR,
  })),
  experience: obj({
    alt: STR, title: STR, range: STR,
    fromYear: { type: 'year' },
    now: MONTH,
    nowLabel: STR,
    rows: list(6, obj({ label: STR, start: MONTH, end: { type: 'month', nullable: true }, outline: { type: 'boolean', optional: true } })),
    list: list(5, obj({ role: STR, where: STR, period: STR, detail: STR })),
  }),
  stack: obj({ alt: STR, title: STR, headers: list(3, STR), rows: list(6, obj({ parts: STR, use: STR })) }),
  certificates: obj({
    alt: STR, title: STR, summary: STR,
    stamps: list(5, obj({ name: STR, nameSize: { type: 'number' }, inner: STR, rim: STR, ink: { type: 'enum', values: ['red', 'line'] } })),
    listSummary: STR,
    // The README list isn't drawn, so it names every issuer; the five stamps show some of them.
    list: list([1, 12], obj({ issuer: STR, items: STR })),
  }),
  contact: obj({ alt: STR, heading: STR, cards: list(3, obj({ kind: STR, label: STR, value: STR, href: STR, linkText: STR })) }),
  readme: obj({ headings: obj({ work: STR, experience: STR, stack: STR, certificates: STR, contact: STR }) }),
  sidebar: obj({ name: STR, pronouns: STR, bio: STR, location: STR, link: STR }),
});

// Each project sheet draws a different figure.
const FIGURES = {
  anf: obj({ caption: STR, receiptHeading: STR, receiptNumbers: list(4, STR), totalLabel: STR, total: STR }),
  eyedtrack: obj({ traceLabel: STR, alert: STR }),
  pookies: obj({ boxes: list(3, STR), edges: list(2, STR), dimension: STR, note: STR }),
};
const METRIC_COUNTS = { anf: 3, eyedtrack: 3, pookies: 0 };

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

function check(value, rule, path, errors) {
  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string' || (!rule.empty && value.trim() === '')) errors.push(`${path} must be a ${rule.empty ? '' : 'non-empty '}string`);
      return;
    case 'month':
      if (value === null && rule.nullable) return;
      if (typeof value !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) errors.push(`${path} must be a month like "2026-09"${rule.nullable ? ' or null' : ''}`);
      return;
    case 'year':
      if (!Number.isInteger(value) || value < 2000 || value > 2100) errors.push(`${path} must be a year like 2022`);
      return;
    case 'number':
      if (typeof value !== 'number' || !(value > 0)) errors.push(`${path} must be a positive number`);
      return;
    case 'boolean':
      if (value === undefined && rule.optional) return;
      if (typeof value !== 'boolean') errors.push(`${path} must be true or false`);
      return;
    case 'enum':
      if (!rule.values.includes(value)) errors.push(`${path} must be one of ${rule.values.map((v) => `"${v}"`).join(', ')}`);
      return;
    case 'list': {
      const [min, max] = Array.isArray(rule.count) ? rule.count : [rule.count, rule.count];
      if (!Array.isArray(value)) {
        errors.push(`${path} must be a list`);
        return;
      }
      if (value.length < min || value.length > max) {
        errors.push(`${path} must have ${min === max ? min : `${min} to ${max}`} item(s); it has ${value.length}. The drawing's layout is fixed, so changing the count needs a design change.`);
      }
      value.forEach((item, i) => check(item, rule.item, `${path}[${i}]`, errors));
      return;
    }
    case 'object':
      if (!isObject(value)) {
        errors.push(`${path} must be an object`);
        return;
      }
      for (const [key, fieldRule] of Object.entries(rule.fields)) check(value[key], fieldRule, path ? `${path}.${key}` : key, errors);
      return;
    default:
      throw new Error(`Unknown rule type "${rule.type}"`);
  }
}

/** Returns a list of problems; an empty list means the content can be drawn. */
export function validateContent(content) {
  const errors = [];
  check(content, SCHEMA, '', errors);
  if (errors.length) return errors;

  const { hero, now, projects, experience, certificates, contact } = content;
  // Owner ruling (ADR-005): ANF System, EyeDTrack, Pookies System, lettered A, B, C.
  projects.forEach((project, i) => {
    if (project.id !== PROJECT_IDS[i]) errors.push(`projects[${i}].id must be "${PROJECT_IDS[i]}" (order: ${PROJECT_IDS.join(', ')})`);
    if (project.letter !== 'ABC'[i]) errors.push(`projects[${i}].letter must be "${'ABC'[i]}"`);
    if (FIGURES[project.id]) check(project.figure, FIGURES[project.id], `projects[${i}].figure`, errors);
    if (project.id in METRIC_COUNTS && project.metrics.length !== METRIC_COUNTS[project.id]) {
      errors.push(`projects[${i}].metrics must have ${METRIC_COUNTS[project.id]} item(s)`);
    }
  });
  // ADR-005: contact is exactly email, LinkedIn and GitHub.
  const kinds = contact.cards.map((card) => card.kind).join(', ');
  if (kinds !== CONTACT_KINDS.join(', ')) errors.push(`contact.cards kinds must be ${CONTACT_KINDS.join(', ')} in that order; got ${kinds}`);
  // The schedule can only draw dates inside its range.
  experience.rows.forEach((row, i) => {
    if (Number(row.start.slice(0, 4)) < experience.fromYear) errors.push(`experience.rows[${i}].start is before experience.fromYear`);
    if (row.start > experience.now) errors.push(`experience.rows[${i}].start is after experience.now`);
    if (row.end !== null && row.end < row.start) errors.push(`experience.rows[${i}].end is before its start`);
    if (row.end !== null && row.end > experience.now) errors.push(`experience.rows[${i}].end is after experience.now; use null for an ongoing role`);
  });
  // One month appears in three places (Review Focus 5).
  if (now.updated !== `Updated ${experience.now}`) errors.push(`now.updated must be "Updated ${experience.now}" to match experience.now`);
  if (hero.titleBlock.date.value !== experience.now) errors.push(`hero.titleBlock.date.value must be "${experience.now}" to match experience.now`);
  // Certificate counts must agree with the list they summarize.
  const listed = certificates.list.reduce((n, entry) => n + (entry.items.match(/\(\d{4}\)/g) ?? []).length, 0);
  const total = Number(/^(\d+) certificates/.exec(certificates.summary)?.[1]);
  const issuers = Number(/(\d+) issuers$/.exec(certificates.summary)?.[1]);
  if (total !== listed) errors.push(`certificates.summary says ${total} certificates but certificates.list names ${listed}`);
  if (!certificates.listSummary.includes(String(listed))) errors.push(`certificates.listSummary must mention ${listed}`);
  if (issuers !== certificates.list.length || certificates.stamps.length > issuers) {
    errors.push(`certificates.summary says ${issuers} issuers; certificates.list has ${certificates.list.length} and certificates.stamps has ${certificates.stamps.length}`);
  }
  return errors;
}

/** Reads and validates the content file; throws one error listing every problem. */
export async function loadContent(url = CONTENT_URL) {
  let text;
  try {
    text = await readFile(url, 'utf8');
  } catch (error) {
    throw new Error(`Can't read content/profile.json: ${error.message}`);
  }
  let content;
  try {
    content = JSON.parse(text);
  } catch (error) {
    throw new Error(`content/profile.json is not valid JSON: ${error.message}`);
  }
  const errors = validateContent(content);
  if (errors.length) throw new Error(`content/profile.json has ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  return content;
}

const SECTION_FOR = { hero: 'hero', now: 'now', schedule: 'experience', stack: 'stack', certificates: 'certificates', contact: 'contact' };

/** The alt text for a drawing: spec A9, verbatim. */
export function altText(content, name) {
  const project = content.projects.find((p) => p.id === name);
  if (project) return project.alt;
  if (!SECTION_FOR[name]) throw new Error(`No drawing named "${name}"`);
  return content[SECTION_FOR[name]].alt;
}
