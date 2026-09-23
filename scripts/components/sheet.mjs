import { esc } from '../lib/svg.mjs';

export const project = (content, id) => content.projects.find((p) => p.id === id);

export const gridPattern = (id) => `<pattern id="${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path class="gridl" d="M20 0H0V20"/></pattern>`;

/** Background, grid, frame, bubble letter, group, sheet number, title and subtitle (mockup sheets 2 to 4). */
export function sheetHead(p, gridId) {
  return [
    '<rect class="sheet" width="1200" height="300"/>',
    `<rect x="12" y="12" width="1176" height="276" fill="url(#${gridId})"/>`,
    '<rect class="frame" x="12" y="12" width="1176" height="276"/>',
    `<circle class="bubble" cx="54" cy="56" r="20"/><text class="bubt" x="54" y="62">${esc(p.letter)}</text>`,
    `<text class="asm" x="86" y="64">${esc(p.group)}</text>`,
    `<text class="sheetno" x="790" y="64">${esc(p.sheet)}</text>`,
    `<text class="ttl" x="40" y="136">${esc(p.title)}</text>`,
    `<text class="subt" x="40" y="174">${esc(p.subtitle)}</text>`,
  ].join('\n');
}

/** Metric values and labels along the bottom; the first value is the red key figure. */
export function sheetMetrics(metrics, xs) {
  return metrics.map((m, i) => `<text class="met${i === 0 ? ' red' : ''}" x="${xs[i]}" y="250">${esc(m.value)}</text><text class="metl" x="${xs[i]}" y="276">${esc(m.label)}</text>`).join('\n');
}

/** The four-row title block on the right of every project sheet. */
export function sheetTitleBlock(rows) {
  return [
    '<rect class="frame1" x="820" y="36" width="344" height="228"/>',
    '<path class="thin" d="M820 93H1164M820 150H1164M820 207H1164"/>',
    ...rows.map((row, i) => `<text class="tl2" x="834" y="${57 + 57 * i}">${esc(row.label)}</text><text class="tv2" x="834" y="${84 + 57 * i}">${esc(row.value)}</text>`),
  ].join('\n');
}
