import { buildAll } from '../../scripts/lib/build.mjs';
import { loadContent } from '../../scripts/lib/content.mjs';

let built;

/** The real content, built once per test file. */
export const builtFiles = () => (built ??= loadContent().then(buildAll));
