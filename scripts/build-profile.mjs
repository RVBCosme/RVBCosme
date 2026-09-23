import { buildAll, writeFiles } from './lib/build.mjs';
import { loadContent } from './lib/content.mjs';

try {
  const files = await buildAll(await loadContent());
  await writeFiles(files);
  for (const [path, text] of files) console.log(`${path.padEnd(42)} ${(Buffer.byteLength(text) / 1024).toFixed(1).padStart(6)} KB`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
