import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { builtFiles } from './helpers/build.mjs';

// Generic shapes only (ADR-005): international numbers and Philippine mobile numbers. Never a real number.
const PHONE_PATTERNS = [/\+\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/, /\b09\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/];
const withoutFontData = (text) => text.replace(/url\(data:[^)]*\)/g, 'url(data:)');

async function published() {
  const content = readFileSync(new URL('../content/profile.json', import.meta.url), 'utf8');
  return [['content/profile.json', content], ...[...(await builtFiles())].map(([path, text]) => [path, withoutFontData(text)])];
}

test('no phone number appears in the content, the README or any drawing', async () => {
  for (const [path, text] of await published()) {
    for (const pattern of PHONE_PATTERNS) assert.doesNotMatch(text, pattern, `${path} contains something shaped like a phone number`);
  }
});

test('Pookies is never called live and has no demo link (owner ruling, ADR-005)', async () => {
  for (const [path, text] of await published()) {
    assert.doesNotMatch(text, /live on vercel/i, path);
    assert.doesNotMatch(text, /vercel\.app/i, path);
  }
});

test('the README offers no contact route beyond email, LinkedIn and GitHub', async () => {
  const readme = (await builtFiles()).get('README.md');
  assert.doesNotMatch(readme, /\b(tel|sms|whatsapp|viber):/i);
  assert.equal((readme.match(/mailto:/g) ?? []).length, 1);
});
