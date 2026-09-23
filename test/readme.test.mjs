import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPONENTS } from '../scripts/components/index.mjs';
import { altText, loadContent } from '../scripts/lib/content.mjs';
import { README_NOTICE, renderReadme } from '../scripts/lib/readme.mjs';
import { builtFiles } from './helpers/build.mjs';
import { fixture } from './helpers/content.mjs';

const content = fixture();
const readme = renderReadme(content);
const attr = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

test('starts with the generated notice and has no H1 (spec section 5)', () => {
  assert.ok(readme.startsWith(`${README_NOTICE}\n\n<picture>`));
  assert.doesNotMatch(readme, /^# /m);
});

test('section headings are H2, in the approved order', () => {
  assert.deepEqual([...readme.matchAll(/^## (.+)$/gm)].map((m) => m[1]), ['Selected work', 'Experience', 'Stack', 'Certificates', 'Contact']);
});

test('every drawing appears once as a <picture>, in order, with its alt text verbatim (spec section 8)', () => {
  const pictures = [...readme.matchAll(/<picture>\n {2}<source media="\(prefers-color-scheme: dark\)" srcset="assets\/profile\/dark\/(\w+)\.svg">\n {2}<img src="assets\/profile\/light\/(\w+)\.svg" width="100%" alt="([^"]*)">\n<\/picture>/g)];
  assert.deepEqual(pictures.map((m) => m[1]), COMPONENTS.map((c) => c.name));
  for (const [, dark, light, alt] of pictures) {
    assert.equal(light, dark);
    assert.equal(alt, attr(altText(content, dark)));
  }
});

test('project blocks: picture, paragraph, then chips as inline code with the note or links', () => {
  for (const p of content.projects) assert.ok(readme.includes(`\n\n${p.paragraph}\n\n`), p.id);
  assert.ok(readme.includes("`TypeScript` `React` `Vite` `Tailwind` `Express` `SQLite` `Zod` `Vitest` `Playwright`<br>Private repository, walkthrough on request. Next up: the Council's public website, in Laravel and Filament."));
  assert.ok(readme.includes('`Kotlin` `Python` `Flask` `OpenCV` `TensorFlow` `PyTorch` `scikit-learn`<br>[Android app](https://github.com/RVBCosme/thesis-eyedtrack-frontend) · [Detection server](https://github.com/RVBCosme/thesis-eyedtrack-backend)'));
  assert.ok(readme.includes('`React` `Vite` `Tailwind` `Express` `SQLite`<br>[Repository](https://github.com/RVBCosme/Pookies-Inventory-System)'));
});

test('experience list and certificate details (spec A6, A7)', () => {
  assert.ok(readme.includes('- **Web development intern (voluntary)**, Araneta City (ACI, Inc.), Quezon City. Jul 2026 to now.<br>Page updates in HTML, content in the CMS, and site checks for broken links and layout errors.'));
  assert.equal((readme.match(/^- \*\*.+\*\*, .+<br>.+$/gm) ?? []).length, 5);
  assert.match(readme, /<details>\n<summary>All 10 certificates<\/summary>\n\n- \*\*Cisco:\*\* Introduction to Modern AI \(2026\), /);
  assert.match(readme, /- \*\*Certiport:\*\* IT Specialist in Python \(2024\)\n\n<\/details>/);
});

test('contact is exactly the spec A8 line: email, LinkedIn and GitHub', () => {
  assert.ok(readme.endsWith('**Email** [renevincentcosme@gmail.com](mailto:renevincentcosme@gmail.com) · **LinkedIn** [in/rene-vincent-cosme](https://www.linkedin.com/in/rene-vincent-cosme) · **GitHub** [RVBCosme](https://github.com/RVBCosme)\n'));
  assert.equal((readme.match(/mailto:/g) ?? []).length, 1);
});

test('copy with HTML specials is escaped (Review Focus 4)', () => {
  const c = fixture();
  c.projects[0].alt = 'A "quoted" <b>alt</b> & more';
  c.intro = 'I like <script> tags & R&D.';
  const text = renderReadme(c);
  assert.ok(text.includes('alt="A &quot;quoted&quot; &lt;b&gt;alt&lt;/b&gt; &amp; more"'));
  assert.ok(text.includes('\nI like &lt;script&gt; tags & R&D.\n'));
});

test('a project with neither note nor links gets no dangling line break', () => {
  const c = fixture();
  c.projects[1].links = [];
  assert.ok(renderReadme(c).includes('`scikit-learn`\n\n<picture>'));
});

test('the build writes the README', async () => {
  assert.equal((await builtFiles()).get('README.md'), renderReadme(await loadContent()));
});
