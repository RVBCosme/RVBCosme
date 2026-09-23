import { esc, sec } from '../lib/svg.mjs';

// Each stamp sits at a slight, hand-placed angle (approved mockup).
const ROTATIONS = [-7, 4, -3, 6, -5];
const ROUGH_EDGES = '<filter id="stRough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>';

export default {
  name: 'certificates',
  width: 1200,
  height: 290,
  render(content) {
    const { title, summary, stamps } = content.certificates;
    const centers = stamps.map((_, i) => 140 + 230 * i);
    const rims = centers.map((cx, i) => `<path id="rim${i}" d="M${cx - 66} 182a66 66 0 1 1 132 0a66 66 0 1 1 -132 0"/>`).join('');
    return [
      `<defs>${ROUGH_EDGES}${rims}</defs>`,
      '<rect class="sheet" width="1200" height="290"/>',
      '<rect class="frame" x="12" y="12" width="1176" height="266"/>',
      `<text class="asm" x="36" y="50">${esc(title)}</text>`,
      `<text class="tl" x="1164" y="48" text-anchor="end">${esc(summary)}</text>`,
      '<path class="ln" d="M12 64H1188"/>',
      ...stamps.map((stamp, i) => {
        const cx = centers[i];
        const ink = stamp.ink === 'red' ? 'ink1' : 'ink2';
        return [
          `<g transform="rotate(${ROTATIONS[i]} ${cx} 182)"><g class="stamp ${ink}" filter="url(#stRough)" style="animation-delay:${sec(0.35 * i)}">`,
          `<circle class="st" cx="${cx}" cy="182" r="84" stroke-width="4"/><circle class="st" cx="${cx}" cy="182" r="76" stroke-width="1.6"/><circle class="st" cx="${cx}" cy="182" r="56" stroke-width="1.6"/>`,
          `<text class="rim"><textPath href="#rim${i}">${esc(stamp.rim)} · </textPath></text>`,
          `<text class="stname" x="${cx}" y="186" text-anchor="middle" style="font-size:${stamp.nameSize}px">${esc(stamp.name)}</text>`,
          `<text class="stsub" x="${cx}" y="206" text-anchor="middle">${esc(stamp.inner)}</text>`,
          '</g></g>',
        ].join('');
      }),
    ].join('\n');
  },
};
