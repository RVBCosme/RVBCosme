# GitHub profile redesign: design spec

- **Date:** 2026-09-23
- **Repo:** `RVBCosme/RVBCosme` (the public profile README repo)
- **Owner:** Rene Vincent Cosme
- **Status:** Approved by the owner, 2026-09-23. The design was approved in brainstorming using the visual companion; the owner then reviewed and approved this written spec, with the changes listed in section 13.
- **Decisions:** `docs/adr/ADR-001` to `ADR-005`
- **Approved mockup:** `docs/superpowers/mockups/2026-09-23-profile-final.html`. Open it in a browser. It holds the canonical copy, geometry, colors and animation timings.

## 1. Goal and audience

Recruiters and hiring managers should know in about ten seconds:

- who Rene is: an AI engineer and full-stack developer (Python and computer vision; TypeScript, React, Node, SQLite)
- what proves it: the ANF System, EyeDTrack and the Pookies Platform
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
| Headline, About, five roles with dates, the EyeDTrack thesis start (Feb 2025, from the project entry; the hero's revision date), the Cisco (5), Udacity and freeCodeCamp (2) certificates, pronouns he/him | LinkedIn, `linkedin.com/in/rene-vincent-cosme` (read 2026-09-23) |
| The PMI and Certiport certificates, which aren't on LinkedIn (8 + 2 = 10 certificates) | Resume PDF (owner's copy) |
| Certificates, 14 from 6 issuers: the four the profile lacked, AWS Certified AI Practitioner (AIF-C01, issued Sep 2026, the portfolio's featured one), CCNA: Introduction to Networks (Cisco), Relational Database V8 and Legacy Responsive Web Design V8 (freeCodeCamp); DevNet Associate and CCNA: Introduction to Networks are course badges; "certificates and course badges" | The owner's portfolio (its certifications list and FAQ), read 2026-11-12 |
| EyeDTrack figures, each with its caveat: 713 ms from camera capture to result, 95th percentile (one phone at a desk, Nov 11, 2026; 887 ms with the server PC heavily loaded); 1,200+ automated checks on the server, the app and the phone; 26 of 30 yawn alerts were real yawns (an idealized episode count from the sealed final test, which met 0 of its 15 accuracy targets; the same count missed 22 yawn episodes). The rebuild from October 2026, tested once on people it had never seen, missed its accuracy targets | The owner's portfolio (its EyeDTrack entry) and the project site, `eyedtrack.vercel.app`, read 2026-11-12 |
| ANF System: 4,170 documented automated checks on Sep 12, 2026, all passing, shown as "4,000+"; built 31 May to 12 Sep 2026; features; stack (React, Vite, Tailwind, Express, better-sqlite3, Zod, Vitest, Playwright) | The ANF System's private repository: its system documentation and package files |
| ANF System: the name "ANF System"; "20+" screens (the documentation counts them two ways, so rounded down); "140+" decision records; every screen checked at nine widths in two browser engines, 1,000+ layout checks (1,092 at the release of Sep 24, 2026); status "In use since Sep 2026; online ordering in progress"; the new public website is built, not live yet, and its online shop is in progress | The owner's portfolio (its ANF System entry and More work), read 2026-11-12 |
| ANF status reads "In use since Sep 2026". The 2026-09-23 ruling kept "v1.0.10 handover" until the owner said "in use"; his portfolio now says so | The owner's portfolio, read 2026-11-12 |
| ANF public website: Laravel 13, Filament, MySQL, Pest, Playwright | The ANF website's private repository: its README |
| Pookies stack: React, Vite and Tailwind on the front; Express and better-sqlite3 behind | Public repo `RVBCosme/Pookies-Inventory-System` |
| Pookies status "Update in progress" | Owner ruling, 2026-09-23 |
| Pookies: the name "Pookies Platform" and the period "Mar 2026 to now" | The owner's portfolio (its Pookies entry), read 2026-11-12 |
| Araneta City internship: Jul to Nov 2026, now ended; built an internal IT technical inventory system in CakePHP and MySQL in seven milestones, with 2,406 unit, property and browser tests, all passing in GitHub Actions CI on Oct 16, 2026; manual and automated QA on the company's other products; website updates through the CMS. The portfolio doesn't call it voluntary. The ANF role is "Assistant office manager" | The owner's portfolio (its experience entries; the Araneta one is written from his weekly reports, and his manager agreed to the company and the system being shown), read 2026-11-12 |
| Positioning "AI engineer and full-stack developer"; open to full-time roles now, on-site, hybrid or remote, from Manila; expects to graduate in January 2027; wants a software engineering or AI and machine learning role; what is in progress in November 2026 (NASA Space Apps Challenge 2026 as team owner, Nov 14 to 15; online ordering for the ANF System; EyeDTrack's newer yawn detector, frozen until it is tested once on new people; the Pookies update) | The owner's portfolio (profile, now list and FAQ), read 2026-11-12 |
| EyeDTrack and Pookies repositories are private, so both carry "Private repository, walkthrough on request"; EyeDTrack links its public project site, `eyedtrack.vercel.app`, and Pookies has no link | Owner request, 2026-11-12, matching the owner's portfolio |
| EyeDTrack as rebuilt in Oct to Nov 2026, the system its figures were measured on: a Kotlin app on an Android phone, a Python and Flask server, dlib's 68 facial landmarks, OpenCV, NumPy and MySQL; a time rule; spoken alerts; "says so" when it can't see the face; role "Thesis team lead; sole developer of the rebuild"; period "2025 and Oct to Nov 2026"; a teammate updated the app in mid-2026; built with an AI coding agent | The owner's portfolio (its EyeDTrack entry and skills list), read 2026-11-12 |

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
| 1 | Hero, sheet 1 of 4 | `hero.svg` (1200×470) | Group 1, business systems: React + Vite → Node + Express → SQLite, Postgres, with the markup "4,000+ checks (ANF)". Group 2, AI systems: Kotlin app → Python server → dlib 68 landmarks, with "1,200+ checks (EyeDTrack)" and a dimension line "713 ms to result (p95)". Revision table by date. Title block with the RVC signature. | none |
| 2 | Intro | none | none | Intro paragraph (appendix A1) |
| 3 | In progress | `now.svg` (1200×262) | Four live rows and a "Next" row | none |
| 4 | Selected work, A | `anf.svg` (1200×300) | ANF System sheet: metrics, title block, test strip, receipt printer | Paragraph, chips, note (A3) |
| 5 | Selected work, B | `eyedtrack.svg` (1200×300) | EyeDTrack sheet: metrics, title block, an illustrated eye-openness trace, landmark eye | Paragraph, chips, note, link (A4) |
| 6 | Selected work, C | `pookies.svg` (1200×300) | Pookies sheet: mini diagram, title block, cookie figure | Paragraph, chips, note (A5) |
| 7 | Experience | `schedule.svg` (1200×352) | Schedule chart of the roles, 2022 to now | Five-item list (A6) |
| 8 | Stack | `stack.svg` (1200×316) | Bill of materials with six rows | none |
| 9 | Certificates | `certificates.svg` (1200×290) | Five issuer stamps, led by AWS | `<details>` titled "All 14 certificates and badges" (A7) |
| 10 | Contact | `contact.svg` (1200×280) | "Let's connect", wired to the Email, LinkedIn and GitHub cards | Three links (A8) |

There's no H1 in the README, because the profile sidebar already shows the name. Section headings are H2: Selected work, Experience, Stack, Certificates, Contact.

## 6. Motion

ADR-004 sets the policy. The values below are the canonical timings from the approved mockup.

| Asset | Motion | Timing |
|---|---|---|
| hero | One-time plot. Frame 0 to 0.9 s; boxes from 0.55 to 1.15 s; arrows from 1.1 to 1.55 s; dimension line at 1.7 s; revision table from 1.6 s; title block from 1.75 s; markups from 2.25 to 2.55 s; RVC signature from 2.65 s (1.1 s long); revision cloud from 3.0 s. A mint crosshair tours the drawing from 0 to 3.9 s. | once |
| hero | Business request flow: packet, API box lights up, packet, data box lights up | 3.2 s loop, starts at 3.4 s |
| hero | AI chain from camera to result, to scale: three frames, server, inference, landmarks, while the dimension-line pulse covers 0 to 31.67% of the loop (0.71 s, EyeDTrack's published 713 ms), then an alert ring. REC dot blinks. | 2.25 s loop, starts at 3.5 s |
| hero | Revision cloud breathes | 3 s loop |
| now | Stripes slide; live dots ping (staggered 0.4 s); the "Next" ring turns | 0.8 s / 1.8 s / 6 s |
| anf | Test strip (38 ticks, 40 to 600) turns mint in a wave | 4.2 s per tick, 0.06 s stagger |
| anf | Receipt printer: Official Receipts No. 1041 to 1044 print, hold, then tear off | 12 s loop, receipts 3 s apart |
| eyedtrack | Eye-openness trace scrolls (an illustration, not driver data). Eye blinks at 14.7%, 38.7% and 57.3%. Drowsy closure from 76.7% to 84.7%, when the landmarks turn coral and "alert spoken" shows from 78% to 93%. | 6 s loop, all in sync |
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
- The certificate list sits inside `<details><summary>All 14 certificates and badges</summary>…</details>`.
- GitHub markdown can't color or resize text, so the lines the mockup shows in muted gray (chips, notes, experience details) render as normal text. That difference is expected when comparing against the mockup.

## 9. Sidebar checklist

The owner performs or approves each of these. All of them are outward-facing.

| Field | Today | Target | How |
|---|---|---|---|
| Name | Rene Cosme | Rene Vincent Cosme | API or settings |
| Bio | empty | AI engineer and full-stack developer. BSCS Software Engineering senior at FEU Tech, graduating in January 2027. | API or settings |
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

1. **ANF status wording.** Resolved 2026-09-23: keep "v1.0.10 handover to the Council" and "v1.0.10, Sep 2026". The owner says when they should change to "in use"; then appendix A, the content file and both alt texts change together. Updated 2026-11-12: the owner's portfolio says "In use since Sep 2026", so the sheet, the In progress board and both alt texts now follow it.
2. **EyeDTrack period.** Resolved 2026-09-23: "Feb to Jun 2025", from LinkedIn's project entry. The hero's revision date is "02/25". Updated 2026-11-12: the sheet's period is "2025 and Oct to Nov 2026", as on the owner's portfolio; the hero's revision date stays "02/25".
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
- Section 3, A4 and A9: EyeDTrack's résumé figures are retired, because the project's own sealed final test superseded them. The sheet shows the figures the owner's portfolio publishes, and the paragraph and the alt text carry their caveats. No accuracy percentage is shown.
- Sections 5 and 6, A9 and ADR-004: the hero's AI markup is "1,200+ checks (EyeDTrack)", and its dimension line reads "camera to alert" with no time. The published 713 ms was measured on the 2026 rebuild, on one phone at a desk, which the project site describes without MobileNetV2 or LLaVA, so it isn't drawn across the in-car chain the hero shows. That loop keeps its timings and is not to scale.

**2026-11-12, matching the owner's updated portfolio**

The owner's portfolio was brought up to date on 2026-11-12, and these changes make the profile agree with it (section 3 names each source).

- Sections 3, 5 and 6, A4, A9 and ADR-004: EyeDTrack's sheet and the hero's AI boxes describe the 2026 rebuild that its figures were measured on: a Kotlin app on an Android phone, a Python and Flask server, and dlib's 68 facial landmarks with OpenCV, NumPy and MySQL. The thesis pipeline (MobileNetV2, LLaVA, CLAHE, Haar Cascade) is no longer drawn. The role, period, chips and paragraph follow the portfolio; the trace is labeled as an illustration, and the alert is spoken.
- Sections 5 and 6, A9 and ADR-004: with the boxes naming the pipeline the 713 ms was measured on, the hero's dimension line carries the time again, "713 ms to result (p95)", and the AI loop runs in 2.25 s, so its pulse (the first 31.67%) lasts 0.71 s, to scale. The caveat that doesn't fit the drawing (one phone at a desk, November 2026) is in the hero's alt text and the EyeDTrack paragraph.
- Sections 3 and 5, A3 and A9: the ANF sheet is titled "ANF System", shows 20+ screens and 140+ decision records, reads "In use since Sep 2026", and calls its 4,000+ "automated checks", as the portfolio does (the hero's markup too). The paragraph says every screen is checked at nine widths in two browser engines, 1,000+ layout checks, that online ordering is being added, and carries each number's caveat. The note no longer calls the public website "next up": it is built and not live yet, and its online shop is in progress.
- Sections 1 and 3, A2, A5, A6 and A9: the Pookies system is named "Pookies Platform", as on the portfolio, and its title block reads Period "Mar 2026 to now" instead of Built "Mar to Jun 2026": he built it during the Highly Succeed internship and is still updating it.
- Sections 1, 3 and 9, A0, A1, A2, A6 and A9: the positioning is "AI engineer and full-stack developer" (the hero's title block, the intro and the sidebar bio), the intro says he expects to graduate in January 2027 and is open to full-time roles now, and the month shown in three places is 2026-11. The In progress board follows the portfolio's November list: NASA Space Apps Challenge 2026, online ordering for the ANF System, EyeDTrack's newer yawn detector and the Pookies update, with the next role "available now". The ended Araneta internship and the built ANF website leave the board.
- Sections 3, A6 and A9: the Araneta internship ran from July to November 2026 and has ended, so its schedule bar stops at the now line (a role that ends in the current month no longer runs past it) and loses its striped tip. Its entry describes the IT technical inventory system he built there and his QA work, from the portfolio, and drops "(voluntary)", which the portfolio doesn't say. The ANF schedule row reads "Assistant office manager, ANF", his actual title, instead of "Office manager, ANF".
- Sections 3, 5 and 8, A7 and A9: the certificates follow the portfolio's list of 14 from 6 issuers. The AWS Certified AI Practitioner, its featured one, takes the first stamp; Cisco's stamp counts 6 badges and freeCodeCamp's 4 certificates; Udacity's AWS AI Practitioner Challenge moves to the list only. DevNet Associate and CCNA: Introduction to Networks are labeled course badges, as on the portfolio. The README list isn't drawn, so the content check now lets it name more issuers than the five stamps show.

---

## Appendix A: Approved copy (verbatim)

**A0. Sidebar**

- Name: Rene Vincent Cosme
- Pronouns: he/him
- Bio: AI engineer and full-stack developer. BSCS Software Engineering senior at FEU Tech, graduating in January 2027.
- Location: Manila, Philippines
- Link: LinkedIn

**A1. Intro**

I'm an AI engineer and full-stack developer, and a fourth-year Computer Science student specializing in software engineering at FEU Tech. I expect to graduate in January 2027. I build web applications, database systems and AI tools that solve practical problems, and I take them from the first sketch to the working system. I'm open to full-time software engineering or AI/ML roles now: on-site, hybrid or remote, from Manila.

**A2. In progress** (`now.svg`)

- NASA Space Apps Challenge 2026, Manila: team owner, Nov 14 to 15
- ANF System: adding online ordering; the shop pages are in progress
- EyeDTrack: still improving; a newer yawn detector awaits a test on new people
- Pookies Platform: update
- Next: a full-time software engineering or AI/ML role (bar label: "available now"; header: "Updated 2026-11")

**A3. A: ANF System** (`anf.svg`)

- Header: bubble A, "Business systems", "Sheet 2 of 4"
- Title: ANF System
- Subtitle: Adoración Nocturna Filipina National Council
- Metrics: 4,000+ automated checks · 20+ screens · 140+ decision records
- Title block: Role "Sole developer"; Stack "React, Express, SQLite"; Status "In use since Sep 2026"; Period "May 2026 to now"
- Figure caption: Official Receipts, numbered
- Receipt figure (an illustration with sample values, not data): each receipt reads "OFFICIAL RECEIPT", "No. 1041" to "No. 1044", and "TOTAL" with "1,250.00"
- Paragraph: I started it while working as the Council's assistant office manager, to automate the paperwork I was handling. It covers the Council's stock, Official Receipts, cash and check vouchers, petty cash, members, annual dues and officers, and runs on a single office PC. Officers can reach it from their phones over the office WiFi, and nothing goes to the cloud. Every peso and centavo is exact, and a checked backup is made within about two minutes of any change. Built test-first, with every screen checked at nine widths in two browser engines, 1,000+ layout checks in all. It has been in use since September 2026, and I'm adding online ordering. The 4,000+ is 4,170 checks, all passing, on Sep 12, 2026, and the layout checks were 1,092 at the release of Sep 24, 2026; both have grown since. The documentation counts the screens two ways, so I round down to 20+.
- Chips: TypeScript, React, Vite, Tailwind, Express, SQLite, Zod, Vitest, Playwright
- Note: Private repository, walkthrough on request. I also built the Council's new public website, in Laravel and Filament; it isn't live yet, and its online shop is in progress.

**A4. B: EyeDTrack** (`eyedtrack.svg`)

- Header: bubble B, "AI systems", "Sheet 3 of 4"
- Title: EyeDTrack
- Subtitle: Driver attention monitoring, thesis and solo rebuild
- Metrics: 713 ms camera to result, p95 · 1,200+ automated checks · 26 of 30 yawn alerts were real
- Title block: Role "Thesis team lead; solo rebuild"; Stack "Kotlin, Python, Flask, MySQL"; Vision "dlib 68 landmarks, OpenCV"; Period "2025 and Oct to Nov 2026"
- Trace label: "eye openness, illustrated". Alert tag: "alert spoken"
- Paragraph: I led our thesis team in 2025, and a teammate updated the app in mid-2026. From October 2026 I rebuilt it alone, directing an AI coding agent, and measured it. A Kotlin app on an Android phone sends camera frames over the driver's own network to a Python and Flask server, which finds the face with dlib's 68 facial landmarks and OpenCV and measures how open the eyes and mouth are and where the head points. A time rule decides what counts, the app speaks the alert, and when it can't see the face it says so instead of guessing. I tested it once on people it had never seen: it met 0 of its 15 accuracy targets, and the project site says so. The 713 ms is the 95th percentile from camera capture to result, on one phone at a desk on Nov 11, 2026; it rose to 887 ms with the server PC heavily loaded. The 26 of 30 is an idealized episode count from that sealed final test, and the same count missed 22 yawn episodes. It's an academic prototype, not a safety device.
- Chips: Kotlin, Android, Python, Flask, OpenCV, dlib, NumPy, MySQL
- Note: Private repository, walkthrough on request.
- Link: [Project site](https://eyedtrack.vercel.app)

**A5. C: Pookies Platform** (`pookies.svg`)

- Header: bubble C, "Business systems", "Sheet 4 of 4"
- Title: Pookies Platform
- Subtitle: POS and inventory for Pookies, the bakery I co-founded
- Diagram: React + Vite →(REST)→ Express API →(SQL)→ SQLite, normalized
- Figure: cookie with "Ø 8 cm" and the note "batch cost, live"
- Title block: Role "Co-founder, developer"; Stack "React, Express, SQLite"; Status "Update in progress"; Period "Mar 2026 to now"
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
| Assistant office manager, ANF | Apr 2026 | now |
| Web dev intern, Araneta | Jul 2026 | Nov 2026 |

The "now" line sits at late Nov 2026.

List:

- **Web development intern**, Araneta City (ACI, Inc.), Quezon City. Jul to Nov 2026. Built an internal IT technical inventory system in CakePHP and MySQL in seven milestones, with 2,406 unit, property and browser tests, all passing in GitHub Actions CI on Oct 16, 2026. Manual and automated QA on the company's other products, and website updates through the CMS.
- **Assistant office manager**, Adoración Nocturna Filipina main office, Manila. Apr 2026 to now. Daily operations and sales, a three-person data-entry team, and the ANF System.
- **Software engineering intern**, Highly Succeed, remote. Mar to Jun 2026. Built the Pookies Platform. All 65 workdays with zero absences, plus four web and database certificates.
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

Title block: Title "Rene Vincent Cosme"; Description "AI engineer and full-stack developer"; Drawn by "RVC" (signature); Date "2026-11"; Sheet "1 / 4"; Scale "1 : 1".

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
| AWS | AI Practitioner | AWS CERTIFIED AI PRACTITIONER · AIF-C01 · 2026 | coral |
| Cisco | 6 badges | MODERN AI · DATA SCIENCE · DEVNET · NETWORKS · SECURITY | line |
| freeCodeCamp | 4 certificates | RELATIONAL DATABASE · RESPONSIVE WEB · 2026 | coral |
| PMI | PM Ready | PROJECT MANAGEMENT READY · 2025 | line |
| Certiport | IT Specialist | IT SPECIALIST IN PYTHON · CERTIPORT · 2024 | coral |

Header: "Certificates", with "14 certificates and badges, 6 issuers". The five stamps show five of the six issuers; Udacity is in the list.

`<details>` list:

- **Amazon Web Services:** AWS Certified AI Practitioner, AIF-C01 (2026)
- **Cisco:** Introduction to Modern AI (2026), Introduction to Data Science (2026), DevNet Associate course badge (2026), Junior Cybersecurity Analyst Career Path (2025), Introduction to Cybersecurity (2025), CCNA: Introduction to Networks course badge (2024)
- **Udacity:** AWS AI Practitioner Challenge (2026)
- **freeCodeCamp:** Relational Database (2026), Relational Database V8 (2026), Responsive Web Design (2026), Legacy Responsive Web Design V8 (2026)
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

- `hero.svg`: Engineering drawing of Rene Vincent Cosme's work, drawn in on load. Business systems: React and Vite, Node and Express, SQLite and Postgres, with 4,000+ automated checks on the ANF system (4,170, all passing, in September 2026); requests flow between them. AI systems: EyeDTrack, a Kotlin phone app and a Python server that finds the face with dlib's 68 facial landmarks, with 1,200+ automated checks; camera frames travel the pipeline in 713 milliseconds from camera capture to result, the 95th percentile on one phone at a desk in November 2026, and the loop runs to that time. Timeline: co-founded Pookies August 2023, led the EyeDTrack thesis February 2025, Highly Succeed internship March 2026, built the ANF system May 2026, Araneta City web internship July 2026, marked as the latest revision.
- `now.svg`: In progress, updated November 2026: NASA Space Apps Challenge 2026 in Manila, as team owner, November 14 to 15; adding online ordering to the ANF System, with the shop pages in progress; EyeDTrack, still improving, with a newer yawn detector waiting to be tested once on new people; the Pookies Platform update. Next: a full-time software engineering or AI/ML role, available now.
- `anf.svg`: Sheet 2 of 4, detail A, business systems, with a test-runner strip turning green: ANF System for the Adoración Nocturna Filipina National Council. 4,000+ automated checks (4,170, all passing, on September 12, 2026), 20+ screens, 140+ decision records. Sole developer; React, Express, SQLite; in use since September 2026, with online ordering in progress; May 2026 to now.
- `eyedtrack.svg`: Sheet 3 of 4, detail B, AI systems, with an illustrated eye-openness trace that raises a spoken alert on a drowsy dip: EyeDTrack, driver attention monitoring, thesis and solo rebuild. 713 milliseconds from camera capture to result at the 95th percentile, on one phone at a desk in November 2026; 1,200+ automated checks on the server, the app and the phone; 26 of 30 yawn alerts were real yawns, an idealized episode count from a sealed final test that met 0 of its 15 accuracy targets. Thesis team lead, then sole developer of the rebuild; Kotlin, Python, Flask and MySQL; dlib's 68 facial landmarks and OpenCV; 2025, and October to November 2026.
- `pookies.svg`: Sheet 4 of 4, detail C, business systems: Pookies Platform, point of sale and inventory for Pookies, the bakery Rene co-founded. React and Vite client, Express REST API, normalized SQLite. Co-founder and developer; update in progress; March 2026 to now.
- `schedule.svg`: Schedule, 2022 to now. BSCS at FEU Tech since August 2022. Freelance research since November 2022. Co-founder of Pookies since August 2023. Software engineering intern at Highly Succeed, March to June 2026. Assistant office manager at ANF since April 2026. Web development intern at Araneta City, July to November 2026.
- `stack.svg`: Bill of materials. Web clients: TypeScript, JavaScript, React, Vite, Tailwind CSS. APIs and services: Node.js, Express, REST APIs, Zod. Data: SQLite, PostgreSQL, MySQL. AI and ML: Python, TensorFlow, PyTorch, OpenCV, scikit-learn, Pandas. Quality and process: Vitest, Playwright, TDD, Scrum. Also shipped with: Kotlin, Java, C++, PHP, Laravel.
- `certificates.svg`: Certificates: 14 certificates and badges from 6 issuers. Stamps for AWS Certified AI Practitioner, AIF-C01, 2026; Cisco, 6 badges in modern AI, data science, DevNet, networks and cybersecurity, two of them course badges; freeCodeCamp, 4 certificates in relational databases and responsive web design, 2026; PMI Project Management Ready, 2025; and Certiport IT Specialist in Python, 2024. The list below also names Udacity's AWS AI Practitioner Challenge, 2026.
- `contact.svg`: Let's connect. Email: renevincentcosme@gmail.com. LinkedIn: linkedin.com/in/rene-vincent-cosme. GitHub: github.com/RVBCosme.
