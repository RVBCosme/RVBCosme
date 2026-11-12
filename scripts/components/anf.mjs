import { esc, r1, sec } from '../lib/svg.mjs';
import { gridPattern, project, sheetHead, sheetMetrics, sheetTitleBlock } from './sheet.mjs';

const TICKS = 38; // test-runner strip, x 40 to 600 (spec section 6)

export const tickX = (i) => r1(40 + (i * 560) / (TICKS - 1));

export default {
  name: 'anf',
  width: 1200,
  height: 300,
  render(content) {
    const anf = project(content, 'anf');
    const { caption, receiptHeading, receiptNumbers, totalLabel, total } = anf.figure;
    const ticks = Array.from({ length: TICKS }, (_, i) => `<line class="tk" x1="${tickX(i)}" y1="189" x2="${tickX(i)}" y2="203" style="animation-delay:${sec(0.06 * i)}"/>`).join('');
    // Official Receipts print 3 s apart, hold, then tear off; they are sample values, not data (spec A3).
    const receipts = receiptNumbers.map((number, i) => [
      `<g class="rc rc${i + 1}"><rect class="paper" x="658" y="152" width="94" height="86"/>`,
      `<text class="rct" x="705" y="167" text-anchor="middle">${esc(receiptHeading)}</text>`,
      `<text class="rcn" x="705" y="186" text-anchor="middle">${esc(number)}</text>`,
      '<rect class="rcl" x="668" y="194" width="74" height="3"/><rect class="rcl" x="668" y="202" width="52" height="3"/>',
      `<text class="rct" x="668" y="224">${esc(totalLabel)}</text><text class="rct" x="742" y="224" text-anchor="end">${esc(total)}</text></g>`,
    ].join('')).join('');
    return [
      `<defs><clipPath id="orClip"><rect x="620" y="56" width="170" height="96"/></clipPath>${gridPattern('gS5')}</defs>`,
      sheetHead(anf, 'gS5'),
      `<g class="tests">${ticks}</g>`,
      sheetMetrics(anf.metrics, [40, 300, 520]),
      sheetTitleBlock(anf.titleBlock),
      `<g clip-path="url(#orClip)">${receipts}</g>`,
      '<rect class="box" x="628" y="150" width="154" height="22" rx="4"/>',
      '<path class="ln" d="M646 156H764"/>',
      '<circle class="livedot" cx="772" cy="164" r="3"/>',
      `<text class="figcap" x="705" y="190" text-anchor="middle">${esc(caption)}</text>`,
    ].join('\n');
  },
};
