# ADR-004: Motion policy, where every animation tells a true story

- Status: Accepted, 2026-09-23
- Reference: approved mockup, whose timings are canonical; spec section 6

## Context

The owner asked twice for more motion, and it has to feel enjoyable. Images start animating as soon as the page loads, so a one-time entrance on anything below the fold is over before anyone scrolls to it. Motion also has to respect visitors who ask for less.

## Decision

1. The hero is the only place with a one-time sequence. The drawing "plots" itself: frame, boxes, arrows, red markups, the "RVC" signature and a revision cloud around the newest role. A mint plotter crosshair travels the drawing as it plots, about 3.9 s in total. After that the hero loops.
2. Everything else loops gently, and every loop mirrors something real:
   - request flow through React → Express → SQLite
   - the AI pipeline finishing in exactly 0.95 s, in step with the dimension-line pulse and ending in an alert ping
   - the ANF test-runner strip and receipt printer (Official Receipts No. 1041 to 1044)
   - the EyeDTrack eye-aspect-ratio trace, with the landmark eye blinking in sync, the drowsy closure and "alert sent"
   - the Pookies cookie turning, with "batch cost, live"
   - the In progress stripes, the schedule's "now" line, the bill-of-materials checkmarks and the stamps pressing in
   - "Let's connect" handwriting, with signals running to the contact cards
3. Mint (`live`) is used for moving or live things only.
4. Every SVG contains `@media (prefers-reduced-motion: reduce)` rules that freeze to a meaningful final frame, not an empty one.
5. Nothing flashes more than three times a second. There's no strobe, and alerts fade.

## Consequences

- New motion must pass the test "what real behavior does this show?", or it doesn't go in.
- The reduced-motion rules are part of each component and are checked automatically.
