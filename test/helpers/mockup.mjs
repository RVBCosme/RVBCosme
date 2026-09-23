import { readFileSync } from 'node:fs';

const MOCKUP = new URL('../../docs/superpowers/mockups/2026-09-23-profile-final.html', import.meta.url);
export const MOCKUP_ORDER = ['hero', 'now', 'anf', 'eyedtrack', 'pookies', 'schedule', 'stack', 'certificates', 'contact'];

let html;
const source = () => (html ??= readFileSync(MOCKUP, 'utf8').replace(/\r\n/g, '\n'));

/** The approved mockup's <svg> for one drawing, as written in the mockup. */
export function mockupSvg(name) {
  const blocks = source().match(/<svg class="[^"]*\bdC\b[^"]*"[\s\S]*?<\/svg>/g) ?? [];
  if (blocks.length !== MOCKUP_ORDER.length) throw new Error(`Expected ${MOCKUP_ORDER.length} drawings in the mockup, found ${blocks.length}`);
  const index = MOCKUP_ORDER.indexOf(name);
  if (index === -1) throw new Error(`The mockup has no drawing named "${name}"`);
  return blocks[index];
}

export const mockupViewBox = (name) => /viewBox="([^"]+)"/.exec(mockupSvg(name))[1];

/** Every <style> block in the mockup, concatenated. */
export const mockupCss = () => [...source().matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
