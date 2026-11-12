import { esc, r1 } from '../lib/svg.mjs';

const X0 = 330;
const X1 = 1150;
const NOW_FRACTION = 0.75; // spec A6: the now line sits late in the current month

/** Maps "YYYY-MM" months onto the chart's x axis, one column per year from fromYear to the now year. */
export function scheduleScale(fromYear, nowMonth) {
  const years = Number(nowMonth.slice(0, 4)) - fromYear + 1;
  const yearWidth = (X1 - X0) / years;
  const monthX = (month, fraction = 0) => {
    const index = (Number(month.slice(0, 4)) - fromYear) * 12 + Number(month.slice(5, 7)) - 1 + fraction;
    return X0 + (index * yearWidth) / 12;
  };
  return { years, yearWidth, monthX, nowX: monthX(nowMonth, NOW_FRACTION) };
}

export default {
  name: 'schedule',
  width: 1200,
  height: 352,
  render(content) {
    const { title, range, fromYear, now, nowLabel, rows } = content.experience;
    const { years, yearWidth, monthX, nowX } = scheduleScale(fromYear, now);
    const tipX = r1(nowX - 26);

    const grid = [];
    for (let k = 0; k < years; k += 1) {
      const x = X0 + yearWidth * k;
      grid.push(`<path class="yr" d="M${r1(x)} 96V328"/>`);
      grid.push(`<text class="tl" x="${r1(x + yearWidth / 2)}" y="88" text-anchor="middle">${fromYear + k}</text>`);
    }
    grid.push(`<path class="yr" d="M${X1} 96V328"/>`);

    const clips = [];
    const bars = [];
    rows.forEach((row, i) => {
      const y = 111 + 38 * i;
      const start = monthX(row.start);
      // A finished role ends where the month after its end begins, but never past the now line.
      const end = row.end === null ? nowX : Math.min(monthX(row.end) + yearWidth / 12, nowX);
      bars.push(`<text class="tv" x="36" y="${y + 14}">${esc(row.label)}</text>`);
      bars.push(`<rect class="gbar${row.outline ? ' hollow' : ''}" x="${r1(start)}" y="${y}" width="${r1(end - start)}" height="16" rx="3"/>`);
      if (row.end === null) {
        // Ongoing roles get a striped, sliding tip at the now line.
        clips.push(`<clipPath id="gt${i}"><rect x="${tipX}" y="${y}" width="26" height="16" rx="3"/></clipPath>`);
        const stripes = [0, 1, 2, 3, 4].map((k) => `M${r1(nowX - 56 + 14 * k)} ${y + 16}L${r1(nowX - 40 + 14 * k)} ${y}`).join('');
        bars.push(`<g clip-path="url(#gt${i})"><rect class="tipbg" x="${tipX}" y="${y}" width="26" height="16"/><path class="stripes" d="${stripes}"/></g>`);
      }
      if (i < rows.length - 1) bars.push(`<path class="thin faint" d="M24 ${y + 27}H1176"/>`);
    });

    return [
      `<defs>${clips.join('')}</defs>`,
      '<rect class="sheet" width="1200" height="352"/>',
      '<rect class="frame" x="12" y="12" width="1176" height="328"/>',
      `<text class="asm" x="36" y="50">${esc(title)}</text>`,
      `<text class="tl" x="1164" y="48" text-anchor="end">${esc(range)}</text>`,
      '<path class="ln" d="M12 64H1188"/>',
      ...grid,
      ...bars,
      `<path class="nowline" d="M${r1(nowX)} 94V330"/><text class="nowlabel" x="${r1(nowX + 22)}" y="88" text-anchor="middle">${esc(nowLabel)}</text>`,
    ].join('\n');
  },
};
