# ADR-001: Visual direction is an engineering drawing set

- Status: Accepted, 2026-09-23. Wording of the letters-and-numbers rule clarified in the owner's spec review the same day; the visuals didn't change. Amended 2026-11-12, proposed for the owner's sign-off: two project sheets are added, Lusot and RATCHET, so the set has six sheets (spec section 13).
- Deciders: Rene Vincent Cosme (owner)
- Reference: `docs/superpowers/mockups/2026-09-23-profile-final.html` (approved mockup)

## Context

The brief was a unique, recruiter-facing GitHub profile positioned as "full-stack developer with an AI edge". Three directions were mocked from Rene's own work: an engineering drawing, an accounting ledger, and an EyeDTrack attention monitor. The owner chose the drawing, refined it over several rounds, and approved it.

## Decision

The README reads as a drawing set:

- Sheet 1 (hero) is a system diagram in two numbered groups (1 Business systems, 2 AI systems), plus a revision table (dates only) and a title block.
- Sheets 2 to 6 are project details lettered A to E in the owner's order (ADR-005): A Lusot, B EyeDTrack, C RATCHET, D ANF System, E Pookies Platform. Until 2026-11-12 there were three: A ANF System, B EyeDTrack, C Pookies System.
- It also has an In progress board, a schedule chart, a bill of materials, certificate stamps and a "Let's connect" contact sheet.

In bubbles, letters mean projects only and numbers mean hero groups only. The revision table uses dates, so no bubble means two things. The zone numbers on the hero's border and the item numbers in the bill of materials are ordinary drawing notation, not bubbles.

Light mode is a whiteprint and dark mode is a blueprint. The type is Barlow and Barlow Semi Condensed. Caveat is used only for handwriting: the "RVC" signature and "Let's connect".

| Token | Light (whiteprint) | Dark (blueprint) | Use |
|---|---|---|---|
| sheet | `#F4F6F7` | `#0F2A47` | background |
| grid | `#E1E7EF` | `#1B4066` | 20-unit drafting grid |
| line | `#22407F` | `#E6EEF7` | primary strokes and text |
| line2 | `#52668E` | `#A3B8D2` | secondary strokes, labels |
| title | `#172E5E` | `#FFFFFF` | headings, values |
| red | `#C23F2D` | `#FF8D77` | markups, alerts, stamps (ink 1) |
| live | `#0E8A57` | `#6EE7B7` | anything moving or live, nothing else |
| icon | `#1F2328` | `#FFFFFF` | brand marks (GitHub, LinkedIn) |

## Consequences

- Every new visual uses these tokens and this vernacular: frames, zone markers, bubbles, title blocks, dimension lines and revision clouds. Nothing may be added from outside it.
- The ledger and monitor directions are rejected. They survive only in the local brainstorm files.
