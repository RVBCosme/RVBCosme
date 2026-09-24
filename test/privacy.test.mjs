import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtFiles } from './helpers/build.mjs';

// Generic shapes only (ADR-005): international numbers and Philippine mobile numbers. Never a real number.
const PHONE_PATTERNS = [/\+\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/, /\b09\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/];
// The repository is public: a user's home folder (Windows or Git Bash form) or a coding-session link has no place in it.
const LOCAL_PATTERNS = [/\b[A-Za-z]:[\\/]+Users[\\/]/, /\/[a-z]\/Users\//i, /claude\.ai\/code\/session_/];
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

test('no committed file carries a local file path or a coding-session link (ADR-005)', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter((path) => path && !path.endsWith('.ttf'));
  const problems = [];
  for (const path of files) {
    const text = withoutFontData(readFileSync(join(root, path), 'utf8'));
    for (const pattern of LOCAL_PATTERNS) if (pattern.test(text)) problems.push(`${path} matches ${pattern}`);
  }
  assert.deepEqual(problems, []);
});

test('the README offers no contact route beyond email, LinkedIn and GitHub', async () => {
  const readme = (await builtFiles()).get('README.md');
  assert.doesNotMatch(readme, /\b(tel|sms|whatsapp|viber):/i);
  assert.equal((readme.match(/mailto:/g) ?? []).length, 1);
});
