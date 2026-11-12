# GitHub profile redesign: design spec

- **Date:** 2026-09-23
- **Repo:** `RVBCosme/RVBCosme` (the public profile README repo)
- **Owner:** Rene Vincent Cosme
- **Status:** Approved by the owner, 2026-09-23. The design was approved in brainstorming using the visual companion; the owner then reviewed and approved this written spec, with the changes listed in section 13.
- **Decisions:** `docs/adr/ADR-001` to `ADR-005`
- **Approved mockup:** `docs/superpowers/mockups/2026-09-23-profile-final.html`. Open it in a browser. It holds the canonical copy, geometry, colors and animation timings.

## 1. Goal and audience

Recruiters and hiring managers should know in about ten seconds:

- who Rene is: a full-stack developer (TypeScript, React, Node, SQLite) with an AI edge
- what proves it: the ANF System, EyeDTrack and the Pookies System
- how to reach him: email, LinkedIn and GitHub

The profile should be unmistakably his own, with nothing that looks like a template.

**Success criteria**

- On github.com the profile renders correctly in both the light and dark GitHub themes, with the matching whiteprint or blueprint images.
- The motion feels alive, because every animation shows real behavior (ADR-004), and it freezes cleanly when a visitor asks for reduced motion.
- Every fact matches its source (section 3), and no private detail or phone number appears (ADR-005).
- On a 375 px phone, everything important can still be read, because it also appears as markdown text.

## 2. Scope

**In scope**

1. The profile `README.md`, with generated SVG assets in light and dark versions.
2. A build pipeline that turns one content file into the SVGs and the README (ADR-002).
3. A checklist of sidebar changes. Some are done in GitHub settings by the owner (section 9).

**Out of scope** (follow-ups, see section 12)

- Polishing the showcase repos.
- Updating the resume and LinkedIn.

## 3. Where the content comes from

| Fact | Source |
|---|---|
| Headline, About, five roles with dates, EyeDTrack team lead and period (Feb to Jun 2025, from the project entry), the Cisco (5), Udacity and freeCodeCamp (2) certificates, pronouns he/him | LinkedIn, `linkedin.com/in/rene-vincent-cosme` (read 2026-09-23) |
| EyeDTrack metrics: 87.12% accuracy, 96.32% yawn precision, about 0.95 s camera to alert; the PMI and Certiport certificates, which aren't on LinkedIn (8 + 2 = 10 certificates) | Resume PDF (owner's copy) |
| ANF System: 4,170 documented automated checks, shown as "4,000+"; 23 screens; 127 decision records; release v1.0.10 on 22 Sep 2026; built 31 May to 12 Sep 2026; features; stack (React, Vite, Tailwind, Express, better-sqlite3, Zod, Vitest, Playwright) | The ANF System's private repository: its system documentation and package files |
| ANF status reads "v1.0.10 handover" until the owner says it should read "in use" | Owner ruling, 2026-09-23 |
| ANF public website: Laravel 13, Filament, MySQL, Pest, Playwright | The ANF website's private repository: its README |
| Pookies stack: React, Vite and Tailwind on the front; Express and better-sqlite3 behind | Public repo `RVBCosme/Pookies-Inventory-System` |
| Pookies status "Update in progress" | Owner ruling, 2026-09-23 |
| EyeDTrack and Pookies repositories are private, so both carry "Private repository, walkthrough on request"; EyeDTrack links its public project site, `eyedtrack.vercel.app`, and Pookies has no link | Owner request, 2026-11-12, matching the owner's portfolio |
| EyeDTrack architecture: Kotlin app, Python/Flask server, OpenCV, CLAHE, Haar Cascade, MobileNetV2, LLaVA | Public repos `thesis-eyedtrack-frontend` and `thesis-eyedtrack-backend`, plus the resume |

Rules (ADR-005): never invent a number, round growing numbers down, and name the source of every change.

## 4. Visual system

See ADR-001 for the direction, tokens and lettering rules.

- **Type:** Barlow (body, labels) and Barlow Semi Condensed (titles, values), both OFL. Caveat (OFL) is used only for handwriting: the "RVC" signature and "Let's connect".
- **Accents:** coral (`red`) marks markups, alerts and stamp ink. Mint (`live`) is only for things that move or are live.
- **Brand marks:** the GitHub mark (from Octicons, MIT) and the LinkedIn "in" (from Simple Icons, CC0), single-colored in the `icon` token (near-black on light, white on dark). They appear only on the contact cards.

## 5. Page structure

The README follows this order. Each visual is a `<picture>` with light and dark files (ADR-003). The text in the "Markdown text" column is real markdown, so it reads on phones and to screen readers.

| # | Block | Asset (viewBox) | What it shows | Markdown text |
|---|---|---|---|---|
| 1 | Hero, sheet 1 of 4 | `hero.svg` (1200×470) | Group 1, business systems: React + Vite → Node + Express → SQLite, Postgres, with the markup "4,000+ tests (ANF)". Group 2, AI systems: Kotlin app → Python server → MobileNetV2 + LLaVA, with "87.12% accuracy" and a dimension line "≈ 0.95 s camera to alert". Revision table by date. Title block with the RVC signature. | none |
| 2 | Intro | none | none | Intro paragraph (appendix A1) |
| 3 | In progress | `now.svg` (1200×262) | Four live rows and a "Next" row | none |
| 4 | Selected work, A | `anf.svg` (1200×300) | ANF System sheet: metrics, title block, test strip, receipt printer | Paragraph, chips, note (A3) |
| 5 | Selected work, B | `eyedtrack.svg` (1200×300) | EyeDTrack sheet: metrics, title block, eye-aspect-ratio trace, landmark eye | Paragraph, chips, note, link (A4) |
| 6 | Selected work, C | `pookies.svg` (1200×300) | Pookies sheet: mini diagram, title block, cookie figure | Paragraph, chips, note (A5) |
| 7 | Experience | `schedule.svg` (1200×352) | Schedule chart of the roles, 2022 to now | Five-item list (A6) |
| 8 | Stack | `stack.svg` (1200×316) | Bill of materials with six rows | none |
| 9 | Certificates | `certificates.svg` (1200×290) | Five issuer stamps | `<details>` titled "All 10 certificates" (A7) |
| 10 | Contact | `contact.svg` (1200×280) | "Let's connect", wired to the Email, LinkedIn and GitHub cards | Three links (A8) |

There's no H1 in the README, because the profile sidebar already shows the name. Section headings are H2: Selected work, Experience, Stack, Certificates, Contact.

## 6. Motion

ADR-004 sets the policy. The values below are the canonical timings from the approved mockup.

| Asset | Motion | Timing |
|---|---|---|
| hero | One-time plot. Frame 0 to 0.9 s; boxes from 0.55 to 1.15 s; arrows from 1.1 to 1.55 s; dimension line at 1.7 s; revision table from 1.6 s; title block from 1.75 s; markups from 2.25 to 2.55 s; RVC signature from 2.65 s (1.1 s long); revision cloud from 3.0 s. A mint crosshair tours the drawing from 0 to 3.9 s. | once |
| hero | Business request flow: packet, API box lights up, packet, data box lights up | 3.2 s loop, starts at 3.4 s |
| hero | AI chain completing in 0.95 s: three frames, server, inference, models, while the dimension-line pulse covers 0 to 31.67% of the loop, then an alert ring. REC dot blinks. | 3 s loop, starts at 3.5 s |
| hero | Revision cloud breathes | 3 s loop |
| now | Stripes slide; live dots ping (staggered 0.4 s); the "Next" ring turns | 0.8 s / 1.8 s / 6 s |
| anf | Test strip (38 ticks, 40 to 600) turns mint in a wave | 4.2 s per tick, 0.06 s stagger |
| anf | Receipt printer: Official Receipts No. 1041 to 1044 print, hold, then tear off | 12 s loop, receipts 3 s apart |
| eyedtrack | Eye-aspect-ratio trace scrolls. Eye blinks at 14.7%, 38.7% and 57.3%. Drowsy closure from 76.7% to 84.7%, when the landmarks turn coral and "alert sent" shows from 78% to 93%. | 6 s loop, all in sync |
| pookies | Request flow like the hero's; status dot pings; cookie turns | 3.2 s / 1.8 s / 24 s |
| schedule | "Now" line pulses; ongoing bars have sliding stripe tips | 2.4 s / 0.8 s |
| stack | Checkmarks draw down the six rows | 6 s loop, 0.35 s stagger |
| certificates | Stamps press in one after another, hold, then fade | 11 s loop, 0.35 s stagger |
| contact | "Let's connect" writes, fills, holds, fades. Hub pulses. Signals run to Email, LinkedIn and GitHub, and each card pings on arrival. | 10 s / 2.4 s / 3 s (cards 1 s apart) |

The staggers are exact: tick *i* on the ANF strip starts 0.06 × *i* s after the first, and row or stamp *i* starts 0.35 × *i* s after the first. The mockup rounds these to 0.1 s steps; the values here win.

Only `transform`, `opacity`, `fill-opacity`, `stroke-dashoffset`, and stroke or fill color are animated. (Fill color is used once: the EyeDTrack landmarks turning coral.) Each SVG freezes to a meaningful final frame under `prefers-reduced-motion: reduce`: the hero fully drawn, one receipt out, the eye open, all checks drawn, the stamps showing and the handwriting filled.

## 7. Technical architecture

**Constraints (GitHub)**

- README HTML is sanitized. Images are the only way to add custom visuals.
- An SVG shown as an image runs no scripts and fetches nothing external. CSS animations and SMIL do work.
- `<picture>` with `prefers-color-scheme` follows the viewer's GitHub theme.
- Repo images are served from `raw.githubusercontent.com` with `Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; sandbox` (checked 2026-09-23). Inline `<style>` and CSS animation work under it. Whether embedded `data:` fonts load under it has to be proven before the build depends on them.

**Font probe (the plan's first task)**

Serve a test SVG with an embedded subset font and these exact response headers, load it through `<img>` in Chromium, Firefox and WebKit, and screenshot the result. If every engine renders the embedded font, keep embedded subset fonts. If any engine blocks it, convert text to outlines (ADR-002 allows either), keeping the handwriting strokable as outline paths. The result answers open question 4 and is confirmed on GitHub itself before merging (section 10).

**Proposed layout** (the implementation plan will finalize names)

```
README.md                          generated by the build; says so in an HTML comment at the top
content/profile.json               single content file: all copy, numbers, dates, links, alt text
assets/fonts/                      Barlow, Barlow Semi Condensed, Caveat, with OFL license files
assets/profile/light/*.svg         generated, committed
assets/profile/dark/*.svg          generated, committed
scripts/build-profile.mjs          entry point: reads the content, writes the SVGs and the README
scripts/lib/tokens.mjs             ADR-001 tokens for both themes
scripts/lib/fonts.mjs              subsets and embeds fonts as WOFF2 data URIs
scripts/components/*.mjs           hero, now, anf, eyedtrack, pookies, schedule, stack, certificates, contact
test/*.test.mjs                    node:test checks (section 10)
package.json                       private; scripts: build, test, preview
```

**SVG conventions**

- Each file is a standalone `<svg xmlns="http://www.w3.org/2000/svg" viewBox="…" role="img">` with `<title>`.
- Its own `<style>` holds that theme's token values as CSS variables, the component CSS, the animations and the reduced-motion block.
- IDs only need to be unique within their own file.
- Fonts are subset to the glyphs actually used and embedded, unless the font probe calls for outlines.
- No `http(s)://` appears anywhere except the SVG namespace. References use `href`, not `xlink:href`, so no second namespace is needed.
- Budget: 150 KB or less per SVG.

**Porting**

Port the geometry and timings from the approved mockup. In the mockup the SVGs are inline, share one CSS file, and switch themes with a class. In the real files, each SVG carries its own CSS with that theme's token values resolved.

## 8. README markup pattern

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/profile/dark/anf.svg">
  <img src="assets/profile/light/anf.svg" width="100%" alt="(alt text from content/profile.json)">
</picture>
```

- Chips are inline code, for example `` `TypeScript` `React` ``.
- Links are plain markdown links.
- The certificate list sits inside `<details><summary>All 10 certificates</summary>…</details>`.
- GitHub markdown can't color or resize text, so the lines the mockup shows in muted gray (chips, notes, experience details) render as normal text. That difference is expected when comparing against the mockup.

## 9. Sidebar checklist

The owner performs or approves each of these. All of them are outward-facing.

| Field | Today | Target | How |
|---|---|---|---|
| Name | Rene Cosme | Rene Vincent Cosme | API or settings |
| Bio | empty | Full-stack developer (SERN stack) and AI enthusiast. BSCS Software Engineering senior at FEU Tech. | API or settings |
| Pronouns | none | he/him | Settings, Public profile (not in the REST API) |
| Location | empty | Manila, Philippines | API or settings |
| Social account | none | https://www.linkedin.com/in/rene-vincent-cosme | `POST /user/social_accounts` or settings |
| Pinned repos | none | Owner's choice. Suggested: Pookies-Inventory-System, thesis-eyedtrack-frontend, thesis-eyedtrack-backend, Bob-Passing (RATCHET) | Profile, Customize your pins (UI only) |

For the API route, the owner runs `gh auth refresh -h github.com -s user` first. Then, after confirming, run:

```
gh api -X PATCH /user -f name=... -f bio=... -f location=...
```

## 10. Verification and acceptance

**Automated** (`npm test`)

- The content file parses and has every required field.
- Every SVG is well-formed XML and has both a light and a dark version.
- No SVG references an external URL (the namespace is allowed).
- Every SVG has a `prefers-reduced-motion` block and a `<title>`.
- Every SVG is within the size budget.
- The README points to every asset and contains the three contact links.
- No phone number pattern appears anywhere. The check uses generic patterns only; no real number is ever written into a test.

**Visual**

- Render the README through GitHub's own markdown renderer, `gh api markdown -f mode=gfm`, into a local page.
- Use Playwright to screenshot it in the light and dark themes, at desktop width and 375 px, plus the reduced-motion view.
- Compare against the approved mockup.

**On GitHub**

- Push to a branch named `profile-redesign`.
- Check the README on the branch page in both themes.
- Merge to `main` only after the owner approves, because the profile shows `main`.

**Done means** all of the above pass, and the owner has seen the live profile and signed off.

## 11. Open questions

Questions 1 and 2 were resolved in the owner's review. Questions 3 and 4 are still open.

1. **ANF status wording.** Resolved 2026-09-23: keep "v1.0.10 handover to the Council" and "v1.0.10, Sep 2026". The owner says when they should change to "in use"; then appendix A, the content file and both alt texts change together.
2. **EyeDTrack period.** Resolved 2026-09-23: "Feb to Jun 2025", from LinkedIn's project entry. The hero's revision date is "02/25".
3. **Pinned repositories.** Which four to six? Asked at the sidebar step (section 9).
4. **Fonts.** Embedded subset fonts are the default. The font probe (section 7) decides whether any text has to be outlined instead, and the owner confirms with that evidence in hand.

## 12. Follow-ups

These are separate efforts.

- `Pookies-Inventory-System`: its README is empty. Add descriptions and topics to the featured repos. Add the demo link back once the update ships.
- Consider renaming `Bob-Passing` to `ratchet` (GitHub redirects old names) and polishing it.
- Update the resume and LinkedIn: the ANF test count went from 550+ to 4,000+, the latest roles, and the EyeDTrack period (the resume still says 2025 to 2026).

## 13. Revisions

**2026-09-23, owner review**

- A3: the paragraph's second and third sentences now describe what the system covers ("It covers … and runs on a single office PC. Officers can reach it …"). The receipt figure's sample strings are listed and marked as an illustration.
- A4, A6 and A9: the EyeDTrack period follows LinkedIn, "Feb to Jun 2025"; its revision date is "02/25".
- A9: the alt text is listed in full and used verbatim.
- Section 3: sources made exact (the version file, the certificate split, the EyeDTrack period, the ANF status ruling).
- Section 6: the staggers are exact values, and the list of animated properties includes fill and fill opacity.
- Section 7: GitHub's image CSP and the font probe; `href` instead of `xlink:href`.
- Section 8: muted text renders as normal text on GitHub.
- Section 11: questions 1 and 2 resolved.
- ADR-001: the letters-and-numbers rule applies to bubbles, so the hero's zone numbers and the bill-of-materials item numbers don't break it.
- Mockup: copy updated to match this spec, and one review note removed.

**2026-11-12, owner request**

- A4 and A5: the two EyeDTrack repositories the profile linked return 404, and the Pookies repository is now private. Both projects now carry the note "Private repository, walkthrough on request." EyeDTrack links its public project site instead; Pookies has no link, as on the owner's portfolio.

---

## Appendix A: Approved copy (verbatim)

**A0. Sidebar**

- Name: Rene Vincent Cosme
- Pronouns: he/him
- Bio: Full-stack developer (SERN stack) and AI enthusiast. BSCS Software Engineering senior at FEU Tech.
- Location: Manila, Philippines
- Link: LinkedIn

**A1. Intro**

I'm a fourth-year Computer Science student specializing in software engineering at FEU Tech. I build web applications, database systems and AI tools that solve practical problems, and I take them from the first sketch to the working system. I'm looking for full-time software engineering or AI/ML roles, based in Manila and open to on-site, hybrid or remote work.

**A2. In progress** (`now.svg`)

- ANF Inventory System: v1.0.10 handover to the Council
- ANF public website: Laravel, Filament, MySQL
- Pookies System: update
- Web development internship, Araneta City
- Next: a full-time software engineering or AI/ML role (bar label: "open to offers"; header: "Updated 2026-09")

**A3. A: ANF Inventory System** (`anf.svg`)

- Header: bubble A, "Business systems", "Sheet 2 of 4"
- Title: ANF Inventory System
- Subtitle: Adoración Nocturna Filipina National Council
- Metrics: 4,000+ automated tests · 23 screens · 127 decision records
- Title block: Role "Sole developer"; Stack "React, Express, SQLite"; Status "v1.0.10, Sep 2026"; Period "May 2026 to now"
- Figure caption: Official Receipts, numbered
- Receipt figure (an illustration with sample values, not data): each receipt reads "OFFICIAL RECEIPT", "No. 1041" to "No. 1044", and "TOTAL" with "1,250.00"
- Paragraph: I started it while working as the Council's assistant office manager, to automate the paperwork I was handling. It covers the Council's stock, Official Receipts, cash and check vouchers, petty cash, members, annual dues and officers, and runs on a single office PC. Officers can reach it from their phones over the office WiFi, and nothing goes to the cloud. Every peso and centavo is exact, and a checked backup is made within two minutes of any change. Built test-first, with every screen checked at eight widths from phone to desktop.
- Chips: TypeScript, React, Vite, Tailwind, Express, SQLite, Zod, Vitest, Playwright
- Note: Private repository, walkthrough on request. Next up: the Council's public website, in Laravel and Filament.

**A4. B: EyeDTrack** (`eyedtrack.svg`)

- Header: bubble B, "AI systems", "Sheet 3 of 4"
- Title: EyeDTrack
- Subtitle: Real-time driver attention monitoring, thesis
- Metrics: 87.12% detection accuracy · 96.32% yawn precision · 0.95 s camera to alert
- Title block: Role "Team lead"; Stack "Kotlin, Python, OpenCV"; Models "MobileNetV2, LLaVA"; Period "Feb to Jun 2025"
- Trace label: "eye aspect ratio, live". Alert tag: "alert sent"
- Paragraph: I led our thesis team. A Kotlin Android app streams in-car camera frames to a Python server, which detects drowsiness, yawning and distracted head movement in real time using CLAHE, Haar Cascade, eye and mouth aspect ratios, MobileNetV2 and LLaVA. Alerts go out by voice and push, with an event log for history.
- Chips: Kotlin, Python, Flask, OpenCV, TensorFlow, PyTorch, scikit-learn
- Note: Private repository, walkthrough on request.
- Link: [Project site](https://eyedtrack.vercel.app)

**A5. C: Pookies System** (`pookies.svg`)

- Header: bubble C, "Business systems", "Sheet 4 of 4"
- Title: Pookies System
- Subtitle: POS and inventory for Pookies, the bakery I co-founded
- Diagram: React + Vite →(REST)→ Express API →(SQL)→ SQLite, normalized
- Figure: cookie with "Ø 8 cm" and the note "batch cost, live"
- Title block: Role "Co-founder, developer"; Stack "React, Express, SQLite"; Status "Update in progress"; Built "Mar to Jun 2026"
- Paragraph: Pookies is the bakery I co-founded in 2023. During my software engineering internship at Highly Succeed, I built its point-of-sale and inventory system, which tracks sales, stock and batch costs in real time. I designed the normalized SQLite schema, built the Express REST API, and worked with the QA and graphics teams on test cases and UI polish. I'm updating it now.
- Chips: React, Vite, Tailwind, Express, SQLite
- Note: Private repository, walkthrough on request.
- Links: none. No demo link until the update ships.

**A6. Experience**

`schedule.svg` rows:

| Row | Start | End |
|---|---|---|
| BSCS, FEU Tech (outlined bar) | Aug 2022 | now |
| Freelance research | Nov 2022 | now |
| Co-founder, Pookies | Aug 2023 | now |
| SWE intern, Highly Succeed | Mar 2026 | Jun 2026 |
| Office manager, ANF | Apr 2026 | now |
| Web dev intern, Araneta | Jul 2026 | now |

The "now" line sits at late Sep 2026.

List:

- **Web development intern (voluntary)**, Araneta City (ACI, Inc.), Quezon City. Jul 2026 to now. Page updates in HTML, content in the CMS, and site checks for broken links and layout errors.
- **Assistant office manager**, Adoración Nocturna Filipina main office, Manila. Apr 2026 to now. Daily operations and sales, a three-person data-entry team, and the ANF System.
- **Software engineering intern**, Highly Succeed, remote. Mar to Jun 2026. Built the Pookies System. All 65 workdays with zero absences, plus four web and database certificates.
- **Co-founder**, Pookies, Taguig. Aug 2023 to now. Sales, stock and budgeting, the software behind them, and the cookies.
- **Freelance research assistant and writer**, remote. Nov 2022 to now. Research, data analysis and reports for confidential clients.

Hero revision table (Date, Revision):

| Date | Revision |
|---|---|
| 08/23 | Co-founded Pookies |
| 02/25 | Led EyeDTrack thesis |
| 03/26 | Highly Succeed intern |
| 05/26 | Built the ANF system |
| 07/26 | Araneta web intern (revision cloud) |

Title block: Title "Rene Vincent Cosme"; Description "Full-stack developer, AI edge"; Drawn by "RVC" (signature); Date "2026-09"; Sheet "1 / 4"; Scale "1 : 1".

**A7. Stack and certificates**

`stack.svg` rows (Item, Parts, Used for):

| Item | Parts | Used for |
|---|---|---|
| 1 | TypeScript, JavaScript, React, Vite, Tailwind CSS | Web clients |
| 2 | Node.js, Express, REST APIs, Zod | APIs and services |
| 3 | SQLite, PostgreSQL, MySQL | Data |
| 4 | Python, TensorFlow, PyTorch, OpenCV, scikit-learn, Pandas | AI and ML |
| 5 | Vitest, Playwright, TDD, Scrum | Quality and process |
| 6 | Kotlin, Java, C++, PHP, Laravel | Also shipped with |

`certificates.svg` stamps (name, inner line, rim text, ink):

| Name | Inner line | Rim text | Ink |
|---|---|---|---|
| Cisco | 5 certificates | MODERN AI · DATA SCIENCE · DEVNET · SECURITY | coral |
| Udacity | AWS AI | AWS AI PRACTITIONER CHALLENGE · 2026 | line |
| freeCodeCamp | 2 certificates | RELATIONAL DATABASE · RESPONSIVE WEB · 2026 | coral |
| PMI | PM Ready | PROJECT MANAGEMENT READY · 2025 | line |
| Certiport | IT Specialist | IT SPECIALIST IN PYTHON · CERTIPORT · 2024 | coral |

Header: "Certificates", with "10 certificates, 5 issuers".

`<details>` list:

- **Cisco:** Introduction to Modern AI (2026), Introduction to Data Science (2026), DevNet Associate (2026), Junior Cybersecurity Analyst Career Path (2025), Introduction to Cybersecurity (2025)
- **Udacity:** AWS AI Practitioner Challenge (2026)
- **freeCodeCamp:** Relational Database (2026), Responsive Web Design (2026)
- **Project Management Institute:** Project Management Ready (2025)
- **Certiport:** IT Specialist in Python (2024)

**A8. Contact** (`contact.svg`)

"Let's connect" is handwritten, wired to three cards:

- Email: renevincentcosme@gmail.com (envelope icon)
- LinkedIn: linkedin.com/in/rene-vincent-cosme ("in" mark)
- GitHub: github.com/RVBCosme (GitHub mark)

Markdown under it:

**Email** [renevincentcosme@gmail.com](mailto:renevincentcosme@gmail.com) · **LinkedIn** [in/rene-vincent-cosme](https://www.linkedin.com/in/rene-vincent-cosme) · **GitHub** [RVBCosme](https://github.com/RVBCosme)

No phone number.

**A9. Alt text** (verbatim; each is the `aria-label` of the same SVG in the mockup)

- `hero.svg`: Engineering drawing of Rene Vincent Cosme's work, drawn in on load. Business systems: React and Vite, Node and Express, SQLite and Postgres, with 4,000+ tests on the ANF system; requests flow between them. AI systems: EyeDTrack, a Kotlin app and Python server running MobileNetV2 and LLaVA; camera frames travel the pipeline in about 0.95 seconds from camera to alert at 87.12% accuracy. Timeline: co-founded Pookies August 2023, led the EyeDTrack thesis February 2025, Highly Succeed internship March 2026, built the ANF system May 2026, Araneta City web internship July 2026, marked as the latest revision.
- `now.svg`: In progress: ANF Inventory System version 1.0.10 handover to the Council; the ANF public website in Laravel, Filament and MySQL; the Pookies System update; the web development internship at Araneta City. Next: a full-time software engineering or AI/ML role, open to offers.
- `anf.svg`: Sheet 2 of 4, detail A, business systems, with a test-runner strip turning green: ANF Inventory System for the Adoración Nocturna Filipina National Council. 4,000+ automated tests, 23 screens, 127 decision records. Sole developer; React, Express, SQLite; version 1.0.10, September 2026; May 2026 to now.
- `eyedtrack.svg`: Sheet 3 of 4, detail B, AI systems, with a live eye aspect ratio trace that raises an alert on a drowsy dip: EyeDTrack, real-time driver attention monitoring, thesis. 87.12% detection accuracy, 96.32% yawn precision, 0.95 seconds camera to alert. Team lead; Kotlin, Python, OpenCV; MobileNetV2 and LLaVA; February to June 2025.
- `pookies.svg`: Sheet 4 of 4, detail C, business systems: Pookies System, point of sale and inventory for Pookies, the bakery Rene co-founded. React and Vite client, Express REST API, normalized SQLite. Co-founder and developer; update in progress; built March to June 2026.
- `schedule.svg`: Schedule, 2022 to now. BSCS at FEU Tech since August 2022. Freelance research since November 2022. Co-founder of Pookies since August 2023. Software engineering intern at Highly Succeed, March to June 2026. Assistant office manager at ANF since April 2026. Web development intern at Araneta City since July 2026.
- `stack.svg`: Bill of materials. Web clients: TypeScript, JavaScript, React, Vite, Tailwind CSS. APIs and services: Node.js, Express, REST APIs, Zod. Data: SQLite, PostgreSQL, MySQL. AI and ML: Python, TensorFlow, PyTorch, OpenCV, scikit-learn, Pandas. Quality and process: Vitest, Playwright, TDD, Scrum. Also shipped with: Kotlin, Java, C++, PHP, Laravel.
- `certificates.svg`: Certificates: Cisco, 5 certificates in modern AI, data science, DevNet and cybersecurity; Udacity AWS AI Practitioner Challenge, 2026; freeCodeCamp Relational Database and Responsive Web Design, 2026; PMI Project Management Ready, 2025; Certiport IT Specialist in Python, 2024.
- `contact.svg`: Let's connect. Email: renevincentcosme@gmail.com. LinkedIn: linkedin.com/in/rene-vincent-cosme. GitHub: github.com/RVBCosme.
