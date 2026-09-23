import { esc, sec } from '../lib/svg.mjs';

export default {
  name: 'stack',
  width: 1200,
  height: 316,
  render(content) {
    const { title, headers, rows } = content.stack;
    const [item, parts, use] = headers;
    const rules = rows.map((_, i) => `M12 ${100 + 34 * i}H1188`).join('');
    return [
      '<rect class="sheet" width="1200" height="316"/>',
      '<rect class="frame" x="12" y="12" width="1176" height="292"/>',
      `<text class="asm" x="36" y="50">${esc(title)}</text>`,
      '<path class="ln" d="M12 66H1188"/>',
      `<path class="thin" d="${rules}M92 66V304M860 66V304"/>`,
      `<text class="tl" x="36" y="88">${esc(item)}</text><text class="tl" x="108" y="88">${esc(parts)}</text><text class="tl" x="876" y="88">${esc(use)}</text>`,
      ...rows.map((row, i) => {
        const y = 123 + 34 * i;
        return `<text class="tv" x="40" y="${y}">${i + 1}</text><text class="tv" x="108" y="${y}">${esc(row.parts)}</text><text class="tv" x="876" y="${y}">${esc(row.use)}</text>`;
      }),
      rows.map((_, i) => `<path class="ck" d="M1143 ${118 + 34 * i} l6 6 l12 -13" style="animation-delay:${sec(0.35 * i)}"/>`).join(''),
    ].join('\n');
  },
};
