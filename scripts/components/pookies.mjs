import { esc } from '../lib/svg.mjs';
import { gridPattern, project, sheetHead, sheetTitleBlock } from './sheet.mjs';

const ARROW = '<marker id="cArr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="ah" d="M0 0L10 5L0 10z"/></marker>';
const CHIPS = [[548, 95, 4.2], [573, 97, 3.3], [556, 119, 4.4], [578, 120, 3], [539, 112, 2.9], [566, 107, 2.4]];

export default {
  name: 'pookies',
  width: 1200,
  height: 300,
  render(content) {
    const pookies = project(content, 'pookies');
    const { boxes, edges, dimension, note } = pookies.figure;
    const chip = ([cx, cy, r]) => `<circle class="chip" cx="${cx}" cy="${cy}" r="${r}"/>`;
    return [
      `<defs>${gridPattern('gS4')}${ARROW}</defs>`,
      sheetHead(pookies, 'gS4'),
      `<rect class="box" x="40" y="204" width="200" height="56"/><text class="bx" x="140" y="239">${esc(boxes[0])}</text>`,
      `<path class="ln" d="M242 232H306" marker-end="url(#cArr4)"/><text class="edge" x="274" y="222">${esc(edges[0])}</text>`,
      `<rect class="box" x="310" y="204" width="200" height="56"/><text class="bx" x="410" y="239">${esc(boxes[1])}</text>`,
      `<path class="ln" d="M512 232H576" marker-end="url(#cArr4)"/><text class="edge" x="544" y="222">${esc(edges[1])}</text>`,
      `<rect class="box" x="580" y="204" width="200" height="56"/><text class="bx" x="680" y="239">${esc(boxes[2])}</text>`,
      sheetTitleBlock(pookies.titleBlock),
      // Request flow like the hero's, starting 0.6 s after load.
      '<rect class="hit h1p" x="310" y="204" width="200" height="56"/>',
      '<rect class="hit h2p" x="580" y="204" width="200" height="56"/>',
      '<circle class="pkt a1p" cx="242" cy="232" r="5"/>',
      '<circle class="pkt a2p" cx="512" cy="232" r="5"/>',
      // The status dot pings beside "Update in progress".
      '<circle class="ping" cx="1044" cy="191" r="5"/><circle class="livedot" cx="1044" cy="191" r="5"/>',
      `<path class="thin" d="M526 66H594M526 60V72M594 60V72"/><text class="edge" x="560" y="56">${esc(dimension)}</text>`,
      '<g class="cookie">',
      '<circle class="cookieedge" cx="560" cy="108" r="34"/>',
      CHIPS.slice(0, 3).map(chip).join(''),
      CHIPS.slice(3).map(chip).join(''),
      '<path class="thin" d="M556 108H564M560 104V112"/>',
      '</g>',
      '<path class="liveline" d="M594 108H640"/><circle class="livedot" cx="646" cy="108" r="3.5"/>',
      `<text class="livenote" x="656" y="113">${esc(note)}</text>`,
    ].join('\n');
  },
};
