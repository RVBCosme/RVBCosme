# ADR-004: Motion policy, where every animation tells a true story

- Status: Accepted, 2026-09-23. Amended 2026-11-12 at the owner's request: the hero's AI loop no longer claims a time (rule 2). Amended again 2026-11-12: once the hero drew the rebuilt pipeline, the loop was timed to its published 713 ms (rule 2). Amended a third time 2026-11-12, proposed for the owner's sign-off: the Lusot and RATCHET loops (rule 2).
- Reference: approved mockup, whose timings are canonical; spec section 6

## Context

The owner asked twice for more motion, and it has to feel enjoyable. Images start animating as soon as the page loads, so a one-time entrance on anything below the fold is over before anyone scrolls to it. Motion also has to respect visitors who ask for less.

## Decision

1. The hero is the only place with a one-time sequence. The drawing "plots" itself: frame, boxes, arrows, red markups, the "RVC" signature and a revision cloud around the newest role. A mint plotter crosshair travels the drawing as it plots, about 3.9 s in total. After that the hero loops.
2. Everything else loops gently, and every loop mirrors something real:
   - request flow through React → Express → SQLite
   - frames running EyeDTrack's pipeline from camera to result, in step with the dimension-line pulse and ending in an alert ping. The pulse lasts 0.71 s of a 2.25 s loop, the published 713 ms (95th percentile, one phone at a desk), so the loop is to scale (spec section 13, 2026-11-12).
   - the ANF test-runner strip and receipt printer (Official Receipts No. 1041 to 1044)
   - the EyeDTrack eye-openness trace, an illustration of its time rule, with the landmark eye blinking in sync, the drowsy closure and "alert spoken"
   - Lusot reading a sample street photo: water rises up a car's wheel and the nine-level gauge fills to the same level, knee; then a photo with no wheel or adult clear enough to read gets "can't tell", the answer Lusot gives instead of guessing
   - a RATCHET run moving through its five phases, the hook refusing a call outside the phase, each step written to the chained ledger as it happens, and the verify script checking the records in order
   - the Pookies cookie turning, with "batch cost, live"
   - the In progress stripes, the schedule's "now" line, the bill-of-materials checkmarks and the stamps pressing in
   - "Let's connect" handwriting, with signals running to the contact cards
3. Mint (`live`) is used for moving or live things only.
4. Every SVG contains `@media (prefers-reduced-motion: reduce)` rules that freeze to a meaningful final frame, not an empty one.
5. Nothing flashes more than three times a second. There's no strobe, and alerts fade.

## Consequences

- New motion must pass the test "what real behavior does this show?", or it doesn't go in.
- The reduced-motion rules are part of each component and are checked automatically.
