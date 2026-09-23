import { FACES } from './fonts.mjs';

// Text classes from the approved mockup: which face each uses, its size and its fill.
// The first class on every <text> must be one of these; collectGlyphs() relies on it.
export const TYPE = {
  zone: { face: 'barlow-500', size: 13, style: 'fill:var(--line2);text-anchor:middle' },
  bubt: { face: 'bsc-700', size: 18, style: 'fill:var(--line);text-anchor:middle' },
  asm: { face: 'bsc-600', size: 22, style: 'fill:var(--title)' },
  bx: { face: 'bsc-600', size: 21, style: 'fill:var(--title);text-anchor:middle' },
  cap: { face: 'barlow-400', size: 15, style: 'fill:var(--line2);text-anchor:middle' },
  edge: { face: 'barlow-500', size: 15, style: 'fill:var(--line2);text-anchor:middle' },
  dim: { face: 'barlow-500', size: 17, style: 'fill:var(--line);text-anchor:middle' },
  note: { face: 'barlow-600', size: 17, style: 'fill:var(--red)' },
  tl: { face: 'barlow-400', size: 13, style: 'fill:var(--line2)' },
  tv: { face: 'bsc-600', size: 19, style: 'fill:var(--title)' },
  tname: { face: 'bsc-700', size: 33, style: 'fill:var(--title)' },
  ttl: { face: 'bsc-700', size: 52, style: 'fill:var(--title)' },
  subt: { face: 'barlow-500', size: 24, style: 'fill:var(--line2)' },
  met: { face: 'bsc-700', size: 46, style: 'fill:var(--title)' },
  metl: { face: 'barlow-500', size: 20, style: 'fill:var(--line2)' },
  sheetno: { face: 'barlow-500', size: 18, style: 'fill:var(--line2);text-anchor:end' },
  tl2: { face: 'barlow-400', size: 15, style: 'fill:var(--line2)' },
  tv2: { face: 'bsc-600', size: 23, style: 'fill:var(--title)' },
  earlabel: { face: 'barlow-500', size: 14, style: 'fill:var(--line2)' },
  alertt: { face: 'barlow-600', size: 14, style: 'fill:var(--sheet)' },
  rct: { face: 'barlow-600', size: 9.5, style: 'fill:var(--line2);letter-spacing:.6px' },
  rcn: { face: 'bsc-700', size: 15, style: 'fill:var(--title)' },
  figcap: { face: 'barlow-500', size: 13, style: 'fill:var(--line2)' },
  livenote: { face: 'barlow-600', size: 15, style: 'fill:var(--live)' },
  nowlabel: { face: 'barlow-600', size: 14, style: 'fill:var(--live)' },
  rim: { face: 'barlow-600', size: 11.5, style: 'letter-spacing:1.4px' },
  stname: { face: 'bsc-700', size: null, style: '' }, // size is set per stamp
  stsub: { face: 'barlow-500', size: 13, style: '' },
  sig: { face: 'caveat-700', size: 32, style: 'fill:var(--title)' },
  hwc: { face: 'caveat-700', size: 78, style: 'fill:var(--title)' },
};

export function typographyCss() {
  return Object.entries(TYPE).map(([name, type]) => {
    const { family, weight } = FACES[type.face];
    const generic = family === 'Caveat' ? 'cursive' : 'sans-serif';
    const font = type.size === null
      ? `font-family:"${family}",${generic};font-weight:${weight}`
      : `font:${weight} ${type.size}px "${family}",${generic}`;
    return `.${name}{${[font, type.style].filter(Boolean).join(';')}}`;
  }).join('\n');
}
