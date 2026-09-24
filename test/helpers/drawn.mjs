import { COMPONENTS } from '../../scripts/components/index.mjs';

/** Content paths whose text reaches a drawing: every string is tagged, then each <text> is read for tags. */
export function drawnPaths(content) {
  const paths = [];
  const tagged = structuredClone(content);
  (function tag(node, at) {
    for (const [key, value] of Object.entries(node)) {
      const path = Array.isArray(node) ? `${at}[${key}]` : at ? `${at}.${key}` : key;
      // kind and id select icons and projects, so they keep their values.
      if (typeof value === 'string' && key !== 'kind' && key !== 'id') {
        node[key] = `${value}\u0001${paths.length}\u0002`;
        paths.push(path);
      } else if (value && typeof value === 'object') tag(value, path);
    }
  })(tagged, '');
  const drawn = new Set();
  for (const component of COMPONENTS) {
    for (const [, inner] of component.render(tagged).matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
      for (const [, index] of inner.matchAll(/\u0001(\d+)\u0002/g)) drawn.add(paths[Number(index)]);
    }
  }
  return drawn;
}
