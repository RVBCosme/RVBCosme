import { esc, sec } from '../lib/svg.mjs';

// Diagonal stripes that slide inside a progress bar whose top edge is at y = top.
const stripes = (top) => {
  const segments = [];
  for (let x = 774; x <= 1138; x += 14) segments.push(`M${x} ${top + 12}L${x + 12} ${top}`);
  return segments.join('');
};

export default {
  name: 'now',
  width: 1200,
  height: 262,
  render(content) {
    const { title, updated, items, next } = content.now;
    const clips = items.map((_, i) => `<clipPath id="qb${i}"><rect x="800" y="${88 + 36 * i}" width="350" height="12" rx="3"/></clipPath>`).join('');
    const rows = items.map((item, i) => {
      const cy = 94 + 36 * i;
      const rule = i === items.length - 1 ? 'ln' : 'thin';
      return [
        `<circle class="ping" cx="44" cy="${cy}" r="5" style="animation-delay:${sec(0.4 * i)}"/><circle class="livedot" cx="44" cy="${cy}" r="5"/>`,
        `<text class="tv" x="66" y="${cy + 6}">${esc(item)}</text>`,
        `<g clip-path="url(#qb${i})"><path class="stripes" d="${stripes(cy - 6)}"/></g>`,
        `<rect class="bar" x="800" y="${cy - 6}" width="350" height="12" rx="3"/>`,
        `<path class="${rule}" d="M12 ${cy + 18}H1188"/>`,
      ].join('\n');
    });
    return [
      `<defs>${clips}</defs>`,
      '<rect class="sheet" width="1200" height="262"/>',
      '<rect class="frame" x="12" y="12" width="1176" height="238"/>',
      `<text class="asm" x="36" y="50">${esc(title)}</text>`,
      `<text class="tl" x="1164" y="48" text-anchor="end">${esc(updated)}</text>`,
      '<path class="ln" d="M12 64H1188"/>',
      ...rows,
      '<circle class="nextring" cx="44" cy="238" r="6"/>',
      `<text class="tv nexttext" x="66" y="244">${esc(next.text)}</text>`,
      `<rect class="bar queued" x="800" y="232" width="350" height="12" rx="3"/><text class="tl" x="975" y="242" text-anchor="middle">${esc(next.bar)}</text>`,
    ].join('\n');
  },
};
