import { readFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const FONT_DIR = new URL('../../assets/fonts/', import.meta.url);

// The six faces the approved mockup renders. The mockup asks for Barlow 700 on stamp rims but loads
// only 400 to 600, so browsers drew 600; typography.mjs maps .rim to barlow-600 to match what was approved.
export const FACES = {
  'barlow-400': { family: 'Barlow', weight: 400, file: 'Barlow-Regular.ttf' },
  'barlow-500': { family: 'Barlow', weight: 500, file: 'Barlow-Medium.ttf' },
  'barlow-600': { family: 'Barlow', weight: 600, file: 'Barlow-SemiBold.ttf' },
  'bsc-600': { family: 'Barlow Semi Condensed', weight: 600, file: 'BarlowSemiCondensed-SemiBold.ttf' },
  'bsc-700': { family: 'Barlow Semi Condensed', weight: 700, file: 'BarlowSemiCondensed-Bold.ttf' },
  'caveat-700': { family: 'Caveat', weight: 700, file: 'Caveat-VariableFont_wght.ttf', axes: { wght: 700 } },
};

const sources = new Map();

function source(face) {
  if (!sources.has(face.file)) sources.set(face.file, readFile(new URL(face.file, FONT_DIR)));
  return sources.get(face.file);
}

/** Subsets one face to the given characters and returns WOFF2 bytes. */
export async function subsetFace(key, text) {
  const face = FACES[key];
  if (!face) throw new Error(`Unknown font face "${key}"`);
  return subsetFont(await source(face), text, { targetFormat: 'woff2', ...(face.axes && { variationAxes: face.axes }) });
}

/** One @font-face rule per face that has glyphs, in FACES order, with the subset inlined as a data URI. */
export async function fontFaceCss(glyphs) {
  for (const key of glyphs.keys()) if (!FACES[key]) throw new Error(`Unknown font face "${key}"`);
  const rules = [];
  for (const [key, face] of Object.entries(FACES)) {
    const text = glyphs.get(key);
    if (!text) continue;
    const woff2 = await subsetFace(key, text);
    rules.push(`@font-face{font-family:"${face.family}";font-weight:${face.weight};src:url(data:font/woff2;base64,${woff2.toString('base64')}) format("woff2")}`);
  }
  return rules.join('');
}
