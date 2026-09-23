// A small CSS reader for comparing the port's stylesheet with the mockup's, rule for rule.
// It understands plain rules, @keyframes, @media (prefers-reduced-motion) and skips other at-rules.

/** Collapses whitespace, quotes and leading zeros so equivalent CSS compares equal. */
export const squash = (text) => text
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,()])\s*/g, '$1')
  .replace(/'/g, '"')
  .replace(/(^|[^\d.])\.(\d)/g, '$10.$2')
  .replace(/;}/g, '}')
  .replace(/;$/, '');

function matchingBrace(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0) return i;
  }
  throw new Error('Unbalanced braces in CSS');
}

function walk(css, target, model, scope) {
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) return;
    const prelude = css.slice(i, open).trim();
    const close = matchingBrace(css, open);
    const body = css.slice(open + 1, close);
    i = close + 1;
    if (prelude.startsWith('@keyframes')) {
      model.keyframes.set(prelude.split(/\s+/)[1], squash(body));
    } else if (prelude.startsWith('@media')) {
      if (prelude.includes('prefers-reduced-motion')) walk(body, model.reduced, model, scope);
    } else if (!prelude.startsWith('@')) {
      for (const raw of prelude.split(',')) {
        let selector = raw.trim().replace(/\s+/g, ' ');
        if (scope) {
          if (!selector.startsWith(`${scope} `)) continue;
          selector = selector.slice(scope.length + 1);
        }
        const declarations = target.get(selector) ?? new Map();
        for (const declaration of body.split(';')) {
          const colon = declaration.indexOf(':');
          if (colon !== -1) declarations.set(declaration.slice(0, colon).trim(), squash(declaration.slice(colon + 1)));
        }
        target.set(selector, declarations);
      }
    }
  }
}

/** Parses CSS into rules and reduced-motion rules (selector -> property -> value) and keyframes (name -> body). */
export function cssModel(css, { scope = null } = {}) {
  const model = { rules: new Map(), reduced: new Map(), keyframes: new Map() };
  walk(css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]*;/g, ''), model.rules, model, scope);
  return model;
}

/** A plain object with sorted keys, for readable assertion diffs. */
export const plain = (rules) => Object.fromEntries([...rules].sort(([a], [b]) => a.localeCompare(b)).map(([selector, declarations]) => [selector, Object.fromEntries([...declarations].sort())]));
