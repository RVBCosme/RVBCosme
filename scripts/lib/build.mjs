import { mkdir, writeFile } from 'node:fs/promises';
import { COMPONENTS } from '../components/index.mjs';
import { assetPath } from './assets.mjs';
import { altText } from './content.mjs';
import { fontFaceCss } from './fonts.mjs';
import { collectGlyphs, svgDocument } from './svg.mjs';
import { THEMES } from './tokens.mjs';

/** Builds every output file in memory: repo-relative path -> text. */
export async function buildAll(content) {
  const files = new Map();
  for (const component of COMPONENTS) {
    const body = component.render(content);
    // Both themes share the same text, so they share one set of font subsets.
    const fontCss = await fontFaceCss(collectGlyphs(body));
    for (const theme of THEMES) {
      files.set(assetPath(theme, component.name), svgDocument({
        width: component.width,
        height: component.height,
        title: altText(content, component.name),
        body,
        theme,
        fontCss,
      }));
    }
  }
  return files;
}

export async function writeFiles(files, root = new URL('../../', import.meta.url)) {
  for (const [path, text] of files) {
    const target = new URL(path, root);
    await mkdir(new URL('./', target), { recursive: true });
    await writeFile(target, text);
  }
}
