import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { THEMES } from '../scripts/lib/tokens.mjs';
import { builtFiles } from './helpers/build.mjs';

const ROOT = new URL('../', import.meta.url);
const onDisk = (path) => readFileSync(new URL(path, ROOT), 'utf8').replace(/\r\n/g, '\n');

test('the committed README and drawings match a fresh build (nobody edited them by hand)', async () => {
  const stale = [];
  for (const [path, text] of await builtFiles()) if (!existsSync(new URL(path, ROOT)) || onDisk(path) !== text) stale.push(path);
  assert.deepEqual(stale, [], `Run npm run build and commit the result. Out of date: ${stale.join(', ')}`);
});

test('assets/profile holds only files the build makes', async () => {
  const files = await builtFiles();
  const extra = [];
  for (const theme of THEMES) {
    const dir = new URL(`assets/profile/${theme}/`, ROOT);
    for (const name of existsSync(dir) ? readdirSync(dir) : []) {
      if (!files.has(`assets/profile/${theme}/${name}`)) extra.push(`assets/profile/${theme}/${name}`);
    }
  }
  assert.deepEqual(extra, []);
});
