# ADR-003: Light and dark themes switch through `<picture>`

- Status: Accepted, 2026-09-23

## Context

A profile visitor sees whichever theme they chose in GitHub, light or dark. The design in ADR-001 has a whiteprint for light and a blueprint for dark.

## Decision

Every visual ships as two files, `assets/profile/light/<name>.svg` and `assets/profile/dark/<name>.svg`. The README embeds them like this:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/profile/dark/hero.svg">
  <img src="assets/profile/light/hero.svg" width="100%" alt="(full description of what the image shows)">
</picture>
```

## Consequences

- The alt text lives on the `<img>` and describes the content, not the decoration.
- The two files differ only in token values. Their geometry and timing are the same.
