import assert from 'node:assert/strict';
import { XMLParser } from 'fast-xml-parser';
import { mockupSvg, mockupViewBox } from './mockup.mjs';

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false, parseAttributeValue: false, trimValues: true });
const zeros = (value) => value.replace(/(^|[^\d.])\.(\d)/g, '$10.$2');

// Classes that exist on one side on purpose: the mockup's page scaffolding (dC, rv-anim), and
// .alertt, which the port adds so that every <text> carries a typography class.
const IGNORED_CLASSES = new Set(['dC', 'rv-anim', 'alertt']);
// Stagger delays are exact in the port (spec section 6) and rounded in the mockup; unit tests pin them.
const STAGGERED = /\b(tk|ck|stamp)\b/;

/** Flattens an <svg> into comparable tokens: tags with sorted, normalized attributes, and text. */
export function svgTokens(markup) {
  const root = parser.parse(markup).find((node) => node.svg);
  const tokens = [];
  (function walk(nodes) {
    for (const node of nodes) {
      const tag = Object.keys(node).find((key) => key !== ':@');
      if (tag === '#text') {
        tokens.push(`text: ${node['#text'].replace(/\s+/g, ' ').trim()}`);
        continue;
      }
      if (tag === 'title' || tag === 'style') continue;
      const original = node[':@'] ?? {};
      const attrs = { ...original };
      if (attrs.class !== undefined) {
        attrs.class = attrs.class.split(/\s+/).filter((c) => c && !IGNORED_CLASSES.has(c)).join(' ');
        if (!attrs.class) delete attrs.class;
      }
      if (attrs.style !== undefined) {
        let parts = attrs.style.split(';').map((part) => part.trim().replace(/\s*:\s*/, ':')).filter(Boolean);
        if (STAGGERED.test(original.class ?? '')) parts = parts.filter((part) => !part.startsWith('animation-delay'));
        attrs.style = parts.sort().join(';');
        if (!attrs.style) delete attrs.style;
      }
      tokens.push(`<${tag} ${Object.keys(attrs).sort().map((key) => `${key}="${zeros(String(attrs[key]))}"`).join(' ')}>`);
      walk(node[tag]);
      tokens.push(`</${tag}>`);
    }
  })(root.svg);
  return tokens;
}

/** Fails with the first differing token when a drawing's markup doesn't match the approved mockup. */
export function assertMatchesMockup(name, body, { width, height }) {
  assert.equal(`0 0 ${width} ${height}`, mockupViewBox(name), `${name}: viewBox differs from the mockup`);
  const actual = svgTokens(`<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`);
  const expected = svgTokens(mockupSvg(name));
  const at = actual.findIndex((token, i) => token !== expected[i]);
  if (at === -1 && actual.length === expected.length) return;
  const i = at === -1 ? Math.min(actual.length, expected.length) : at;
  assert.fail([
    `${name}: generated markup differs from the approved mockup at token ${i} of ${expected.length}`,
    `  mockup:    ${expected[i] ?? '(end)'}`,
    `  generated: ${actual[i] ?? '(end)'}`,
    `  after:     ${expected.slice(Math.max(0, i - 3), i).join(' ')}`,
  ].join('\n'));
}
