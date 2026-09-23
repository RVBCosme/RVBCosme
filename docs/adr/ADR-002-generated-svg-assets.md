# ADR-002: Every visual is a generated SVG built from one content file

- Status: Accepted, 2026-09-23
- Reference: spec section 7, "Technical architecture"

## Context

GitHub sanitizes README HTML, so there is no CSS or JavaScript, and custom visuals have to be images. An SVG loaded as an image can't fetch external resources like fonts. Two themes double the number of files. And the facts shown will change over time: test counts, versions and roles.

## Decision

- A build script (Node.js, matching Rene's TypeScript and Node stack) generates every SVG in both themes. It works from one content data file plus the shared tokens in ADR-001. The generated files are committed under `assets/`, and the README points at them.
- No SVG may reference an external URL. Fonts are subset and embedded, or converted to outlines. Handwriting that draws itself (Caveat) must stay strokable.
- No third-party widgets: no github-readme-stats cards, no shields.io badge walls, no typing-SVG services, no contribution snake.

## Consequences

- Changing a fact means editing the data file and rebuilding. Nobody hand-edits an SVG.
- Automated checks guard the output:
  - every SVG has both a light and a dark version
  - no SVG contains a URL
  - each SVG is within the size budget
  - each SVG has a reduced-motion block
  - the README points to every file
