import { esc, sec } from '../lib/svg.mjs';
import { gridPattern, project, sheetHead, sheetMetrics, sheetTitleBlock } from './sheet.mjs';

// The five phases in a row, 94 units apart; the run's current phase is outlined in mint.
const phaseX = (i) => 322 + 94 * i;
// The ledger, one record per step, each pointing back at the one before it.
const recordX = (i) => 40 + 70 * i;
// The fourth record is the call the hook refused during Red, itself a ledger line (spec A5).
const DENIED = 3;

export default {
  name: 'ratchet',
  width: 1200,
  height: 300,
  render(content) {
    const ratchet = project(content, 'ratchet');
    const { phases, records, blocked, verified, caption } = ratchet.figure;
    const phaseBoxes = phases.map((phase, i) => {
      const x = phaseX(i);
      const arrow = i < phases.length - 1 ? `<path class="ln" d="M${x + 76} 97H${x + 86}"/><path class="ah" d="M${x + 86} 93L${x + 93} 97L${x + 86} 101z"/>` : '';
      return `<rect class="box" x="${x}" y="84" width="74" height="26"/><text class="tv" x="${x + 37}" y="103.5" text-anchor="middle">${esc(phase)}</text>${arrow}`;
    });
    const ledger = records.map((record, i) => {
      const x = recordX(i);
      const back = i > 0 ? `<path class="thin" d="M${x} 198H${x - 7}"/><path class="ah" d="M${x - 7} 194.5L${x - 13} 198L${x - 7} 201.5z"/>` : '';
      return `<g class="rxr rxr${i + 1}${i === DENIED ? ' rxdeny' : ''}">${back}<rect class="rxrec" x="${x}" y="186" width="56" height="24"/><text class="figcap" x="${x + 28}" y="202.5" text-anchor="middle">${esc(record)}</text></g>`;
    });
    // The verify script checks the chain line by line once the run reaches Memory.
    const checks = records.map((_, i) => `<rect class="rxok" x="${recordX(i)}" y="186" width="56" height="24" style="animation-delay:${sec(7.9 + 0.15 * i)}"/>`).join('');
    return [
      `<defs>${gridPattern('gS4')}</defs>`,
      sheetHead(ratchet, 'gS4'),
      sheetMetrics(ratchet.metrics, [40, 300, 560]),
      sheetTitleBlock(ratchet.titleBlock),
      ...phaseBoxes,
      `<rect class="rxcur" x="${phaseX(0)}" y="84" width="74" height="26"/>`,
      `<g class="rxblock"><path class="redl" d="M${phaseX(1) + 37} 110V132H462"/><text class="note" x="466" y="138">${esc(blocked)}</text></g>`,
      `<text class="figcap" x="790" y="182" text-anchor="end">${esc(caption)}</text>`,
      ...ledger,
      checks,
      `<text class="livenote rxpass" x="600" y="203">${esc(verified)}</text>`,
    ].join('\n');
  },
};
