import { esc, r1 } from '../lib/svg.mjs';
import { gridPattern, project, sheetHead, sheetMetrics, sheetTitleBlock } from './sheet.mjs';

// Lusot's nine levels, drawn as Lusot draws them: deepest on top, MMDA's seven in one column,
// the two added levels (below gutter, above chest) dashed and set apart.
const CELL = 14;
const GAUGE_X = 700;
const rowTop = (i) => (i === 0 ? 198 : i === 8 ? 78 : 194 - CELL * i);
// The sample photo reads at the fifth level, knee, as the portfolio's figure does (spec A3).
const READING = 4;
const PHOTO = { x: 550, y: 80, width: 100, height: 70 };
const WATERLINE = 115; // 25 units up a 40-unit (26 in) wheel: about 16 in, inside the knee level (13 to 19 in)

export default {
  name: 'lusot',
  width: 1200,
  height: 300,
  render(content) {
    const lusot = project(content, 'lusot');
    const { levels, cantTell, caption } = lusot.figure;
    const { x, y, width, height } = PHOTO;
    const offCells = [0, 8].map((i) => `<rect class="lgcell lgoff" x="${GAUGE_X}" y="${rowTop(i)}" width="16" height="${CELL}"/>`).join('');
    const dividers = [2, 3, 4, 5, 6, 7].map((i) => `M${GAUGE_X} ${rowTop(i) + CELL}H${GAUGE_X + 16}`).join('');
    const labels = levels.map((level, i) => `<text class="figcap${i === READING ? ' lgmark' : ''}" x="724" y="${r1(rowTop(i) + 11.5)}">${esc(level)}</text>`).join('');
    const reading = rowTop(READING) + CELL / 2;
    return [
      '<defs>',
      `<clipPath id="luPhoto"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath>`,
      `<clipPath id="luCells"><rect x="${GAUGE_X}" y="78" width="16" height="${CELL}"/><rect x="${GAUGE_X}" y="96" width="16" height="98"/><rect x="${GAUGE_X}" y="198" width="16" height="${CELL}"/></clipPath>`,
      '<pattern id="luHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="lghl" d="M0 0V8"/></pattern>',
      gridPattern('gS2'),
      '</defs>',
      sheetHead(lusot, 'gS2'),
      sheetMetrics(lusot.metrics, [40, 300, 560]),
      sheetTitleBlock(lusot.titleBlock),
      // The sample photo: a parked car's wheel on the road, then water rising to the reading.
      `<rect class="sheet" x="${x}" y="${y}" width="${width}" height="${height}"/>`,
      '<g clip-path="url(#luPhoto)">',
      '<path class="thin" d="M550 140H650"/>',
      '<g class="lgref"><path class="lgcar" d="M550 118H561A24 24 0 0 1 609 118H642V105L636 100H614L598 86H550M556 98H604L594 90H556Z"/><circle class="lgtyre" cx="585" cy="120" r="20"/><circle class="lgrim" cx="585" cy="120" r="11"/><circle class="lghub" cx="585" cy="120" r="3"/></g>',
      `<g class="lgwater"><rect class="lgwfill" x="${x}" y="${WATERLINE}" width="${width}" height="${y + height - WATERLINE}"/><path class="lgwline" d="M${x} ${WATERLINE}H${x + width}"/></g>`,
      `<rect class="lghatch" x="${x}" y="${y}" width="${width}" height="${height}" fill="url(#luHatch)"/>`,
      '</g>',
      `<rect class="lgphoto" x="${x}" y="${y}" width="${width}" height="${height}"/>`,
      // The gauge fills to the reading; its two added levels stay apart from MMDA's seven.
      `<g clip-path="url(#luCells)"><rect class="lgfill" x="${GAUGE_X}" y="${rowTop(READING)}" width="16" height="${212 - rowTop(READING)}"/></g>`,
      `<rect class="lgcell" x="${GAUGE_X}" y="96" width="16" height="98"/><path class="thin" d="${dividers}"/>${offCells}`,
      labels,
      `<g class="lgto"><path class="ln" d="M650 ${WATERLINE}H664L678 ${reading}H690"/><path class="ah" d="M690 ${reading - 5}L699 ${reading}L690 ${reading + 5}z"/></g>`,
      // Or no reading at all: the other answer, drawn under the photo.
      '<path class="lgalt" d="M600 151V163"/>',
      '<g class="lgdown"><path class="ln" d="M600 150V156"/><path class="ah" d="M595 156L600 164L605 156z"/></g>',
      `<rect class="lgcant" x="550" y="164" width="100" height="24" rx="3"/><text class="tv" x="600" y="182.5" text-anchor="middle">${esc(cantTell)}</text>`,
      `<text class="figcap" x="600" y="204" text-anchor="middle">${esc(caption)}</text>`,
    ].join('\n');
  },
};
