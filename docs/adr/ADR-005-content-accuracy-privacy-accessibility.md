# ADR-005: Content is sourced, private details stay out, and the text works without the images

- Status: Accepted, 2026-09-23. Amended 2026-11-12 and approved by the owner the same day: the project order follows his portfolio, and Lusot's demo joins EyeDTrack's site as a live link (rule 4).
- Reference: spec section 3 (sources) and appendix A (approved copy)

## Decision

1. **Every fact has a source:** LinkedIn, the resume PDF, or the repo's own documentation. Nothing is invented.
2. **Numbers that grow are rounded down,** so they stay true. ANF's documented 4,170 automated checks become "4,000+".
3. **Private details stay out:**
   - no phone number anywhere on the profile (owner's choice, 2026-09-23)
   - no internal install status or other private-repo internals beyond the approved copy
   - private work is labeled "Private repository, walkthrough on request"
4. **Owner rulings from 2026-09-23, amended 2026-11-12:**
   - Projects appear in the owner's order. On 2026-09-23 that was ANF System, EyeDTrack (thesis), Pookies System. Since 2026-11-12 it is the order in which his portfolio features his work: Lusot, EyeDTrack, RATCHET, ANF System, Pookies Platform. The portfolio lists the Araneta system between ANF and Pookies; the profile shows it under Experience. When the portfolio's order changes, this one follows it.
   - Only Lusot and EyeDTrack link a live site (Lusot's demo and EyeDTrack's project site), as on his portfolio.
   - Pookies' status is "Update in progress", never "Live on Vercel", and there's no demo link until the update ships.
   - Contact is exactly three items: email, LinkedIn and GitHub.
5. **Accessibility and phones:**
   - Every image has alt text that describes its content.
   - Everything a recruiter needs also appears as markdown text: the intro, each project's paragraph, the experience list, the certificate list and the contact links. That text reads on a phone and to a screen reader.
   - Links are markdown links, because images on GitHub can't be clicked.

## Consequences

- To change copy, update the spec's appendix A and the data file together, and name the source.
- Committed docs are public once pushed, because the profile repo is public. Private context lives only in local memory notes.
