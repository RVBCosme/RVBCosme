import { esc, sec } from '../lib/svg.mjs';
import { REVISION_CLOUD } from './paths.mjs';

const ZONE_X = [125, 315, 505, 695, 885, 1075];

/** A box label on one line at y, or on two lines 24 units apart around it. */
export const boxLabel = (lines, x, y) => (lines.length === 1
  ? `<text class="bx" x="${x}" y="${y}">${esc(lines[0])}</text>`
  : `<text class="bx" x="${x}" y="${y - 11}">${esc(lines[0])}</text><text class="bx" x="${x}" y="${y + 13}">${esc(lines[1])}</text>`);

const boxText = (box, x, y, capY) => `${boxLabel(box.lines, x, y)}<text class="cap" x="${x}" y="${capY}">${esc(box.caption)}</text>`;

export default {
  name: 'hero',
  width: 1200,
  height: 470,
  render(content) {
    const { groups: [business, ai], dimension, revisionHeaders, revisions, titleBlock: tb } = content.hero;
    const zones = (y) => ZONE_X.map((x, i) => `<text class="zone" x="${x}" y="${y}">${i + 1}</text>`).join('');
    return [
      '<defs><pattern id="cGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path class="gridl" d="M20 0H0V20"/></pattern></defs>',
      '<rect class="sheet" width="1200" height="470"/>',
      '<rect class="gridfill" x="30" y="30" width="1140" height="410" fill="url(#cGrid)"/>',
      '<rect class="frame1 plot" x="10" y="10" width="1180" height="450" style="--len:3270;--d:0s"/>',
      '<rect class="frame plot" x="30" y="30" width="1140" height="410" style="--len:3110;--d:.1s"/>',
      `<g class="fade" style="--d:.45s"><path class="thin" d="M220 10V30M410 10V30M600 10V30M790 10V30M980 10V30M220 440V460M410 440V460M600 440V460M790 440V460M980 440V460"/>${zones(25)}${zones(455)}</g>`,

      // Group 1: business systems, with the request flow.
      `<circle class="bubble plot" cx="76" cy="76" r="16" style="--len:101;--d:.5s"/><text class="bubt fade" x="76" y="82" style="--d:.75s">${esc(business.number)}</text>`,
      `<text class="asm fade" x="102" y="84" style="--d:.6s">${esc(business.title)}</text>`,
      '<rect class="box plot" x="60" y="108" width="200" height="60" style="--len:520;--d:.55s"/>',
      '<rect class="box plot" x="330" y="108" width="210" height="60" style="--len:540;--d:.7s"/>',
      '<rect class="box plot" x="610" y="108" width="190" height="60" style="--len:500;--d:.85s"/>',
      `<g class="fade" style="--d:.95s">${boxText(business.boxes[0], 160, 145, 190)}</g>`,
      `<g class="fade" style="--d:1.05s">${boxText(business.boxes[1], 435, 145, 190)}</g>`,
      `<g class="fade" style="--d:1.15s">${boxText(business.boxes[2], 705, 145, 190)}</g>`,
      `<path class="ln plot" d="M262 138H318" style="--len:56;--d:1.1s"/><path class="ah fade" d="M318 133L328 138L318 143z" style="--d:1.35s"/><text class="edge fade" x="294" y="128" style="--d:1.2s">${esc(business.edges[0])}</text>`,
      `<path class="ln plot" d="M542 138H598" style="--len:56;--d:1.25s"/><path class="ah fade" d="M598 133L608 138L598 143z" style="--d:1.5s"/><text class="edge fade" x="574" y="128" style="--d:1.35s">${esc(business.edges[1])}</text>`,
      '<rect class="hit h1" x="330" y="108" width="210" height="60"/>',
      '<rect class="hit h2" x="610" y="108" width="190" height="60"/>',
      '<circle class="pkt a1" cx="262" cy="138" r="5"/>',
      '<circle class="pkt a2" cx="542" cy="138" r="5"/>',
      `<path class="redl plot" d="M520 108L548 80H604" style="--len:100;--d:2.25s"/><text class="note fade" x="610" y="86" style="--d:2.45s">${esc(business.markup)}</text>`,

      // Group 2: AI systems, with the camera-to-alert chain.
      `<circle class="bubble plot" cx="76" cy="258" r="16" style="--len:101;--d:.8s"/><text class="bubt fade" x="76" y="264" style="--d:1.05s">${esc(ai.number)}</text>`,
      `<text class="asm fade" x="102" y="266" style="--d:.9s">${esc(ai.title)}</text>`,
      '<rect class="box plot" x="60" y="292" width="200" height="60" style="--len:520;--d:.85s"/>',
      '<rect class="box plot" x="330" y="292" width="210" height="60" style="--len:540;--d:1s"/>',
      '<rect class="box plot" x="610" y="292" width="190" height="60" style="--len:500;--d:1.15s"/>',
      `<g class="fade" style="--d:1.25s">${boxText(ai.boxes[0], 160, 329, 374)}</g>`,
      `<g class="fade" style="--d:1.35s">${boxText(ai.boxes[1], 435, 329, 374)}</g>`,
      `<g class="fade" style="--d:1.45s">${boxText(ai.boxes[2], 705, 329, 374)}</g>`,
      `<path class="ln plot" d="M262 322H318" style="--len:56;--d:1.4s"/><path class="ah fade" d="M318 317L328 322L318 327z" style="--d:1.65s"/><text class="edge fade" x="294" y="312" style="--d:1.5s">${esc(ai.edges[0])}</text>`,
      `<path class="ln plot" d="M542 322H598" style="--len:56;--d:1.55s"/><path class="ah fade" d="M598 317L608 322L598 327z" style="--d:1.8s"/><text class="edge fade" x="574" y="312" style="--d:1.65s">${esc(ai.edges[1])}</text>`,
      '<circle class="rec" cx="246" cy="303" r="4.5"/>',
      '<rect class="hit hp" x="330" y="292" width="210" height="60"/>',
      '<rect class="hit hm" x="610" y="292" width="190" height="60"/>',
      '<rect class="pkt f1" x="258" y="318" width="8" height="8"/>',
      '<rect class="pkt f2" x="258" y="318" width="8" height="8"/>',
      '<rect class="pkt f3" x="258" y="318" width="8" height="8"/>',
      '<circle class="pkt b2" cx="542" cy="322" r="5"/>',
      `<text class="note fade" x="600" y="278" text-anchor="end" style="--d:2.55s">${esc(ai.markup)}</text><path class="redl plot" d="M606 272H690L705 292" style="--len:120;--d:2.35s"/>`,

      // Dimension line: camera to alert. Its red pulse covers the first 31.67% of a 3 s loop; the loop is not to scale (ADR-004).
      '<path class="thin fade" d="M60 358V420M800 358V420" style="--d:1.6s"/>',
      '<path class="ln plot" d="M72 410H788" style="--len:716;--d:1.7s"/>',
      '<path class="ah fade" d="M72 405L62 410L72 415z" style="--d:2.1s"/><path class="ah fade" d="M788 405L798 410L788 415z" style="--d:2.1s"/>',
      `<g class="fade" style="--d:2.15s"><rect class="sheet" x="330" y="388" width="200" height="22"/><text class="dim" x="430" y="404">${esc(dimension)}</text></g>`,
      '<circle class="tpulse" cx="62" cy="410" r="5"/>',
      '<circle class="ring" cx="798" cy="410" r="7"/>',

      // Revision table (dates only) with a cloud around the newest row.
      '<rect class="frame1 plot" x="840" y="48" width="310" height="178" style="--len:980;--d:1.6s"/>',
      '<path class="thin fade" d="M840 76H1150M840 106H1150M840 136H1150M840 166H1150M840 196H1150M920 48V226" style="--d:1.85s"/>',
      `<g class="fade" style="--d:1.9s"><text class="tl" x="852" y="67">${esc(revisionHeaders[0])}</text><text class="tl" x="932" y="67">${esc(revisionHeaders[1])}</text></g>`,
      ...revisions.map((r, i) => `<g class="fade" style="--d:${sec(1.95 + 0.1 * i)}"><text class="tv" x="852" y="${98 + 30 * i}">${esc(r.date)}</text><text class="tv" x="932" y="${98 + 30 * i}">${esc(r.text)}</text></g>`),
      `<path class="cloud" d="${REVISION_CLOUD}" style="--len:900;--d:3s"/>`,

      // Title block with the handwritten signature.
      '<rect class="frame plot" x="840" y="236" width="310" height="184" style="--len:990;--d:1.75s"/>',
      '<path class="thin fade" d="M840 306H1150M840 354H1150M912 354V420M1010 354V420M1080 354V420" style="--d:2s"/>',
      `<g class="fade" style="--d:2.05s"><text class="tl" x="852" y="255">${esc(tb.title.label)}</text><text class="tname" x="852" y="296">${esc(tb.title.value)}</text></g>`,
      `<g class="fade" style="--d:2.15s"><text class="tl" x="852" y="323">${esc(tb.description.label)}</text><text class="tv" x="852" y="346">${esc(tb.description.value)}</text></g>`,
      [
        '<g class="fade" style="--d:2.25s">',
        `<text class="tl" x="850" y="373">${esc(tb.drawnBy.label)}</text>`,
        `<text class="tl" x="922" y="373">${esc(tb.date.label)}</text><text class="tv" x="922" y="405">${esc(tb.date.value)}</text>`,
        `<text class="tl" x="1020" y="373">${esc(tb.sheet.label)}</text><text class="tv" x="1020" y="405">${esc(tb.sheet.value)}</text>`,
        `<text class="tl" x="1090" y="373">${esc(tb.scale.label)}</text><text class="tv" x="1090" y="405">${esc(tb.scale.value)}</text>`,
        '</g>',
      ].join(''),
      `<text class="sig" x="852" y="409" style="--d:2.65s">${esc(tb.drawnBy.value)}</text>`,
      // The mint plotter crosshair tours the drawing once (3.9 s); its path is the pen keyframes in styles.mjs.
      '<g class="pen"><circle class="penring" r="7"/><path class="pencross" d="M-15 0H-6M6 0H15M0 -15V-6M0 6V15"/></g>',
    ].join('\n');
  },
};
