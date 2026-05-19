# 0001. Externalize design tokens to `@kajabi-ui/styles`

- **Status:** Accepted (retrospective)
- **Date:** 2026-05-15
- **Maintainers:** @Kajabi/dss-devs

## Context

Pine's tokens (color, spacing, typography, radius, border, box-shadow, z-index) are consumed by Pine web components AND by non-Pine surfaces inside Kajabi (legacy Rails views, marketing pages, internal tooling). Embedding the token source set inside `libs/core/` would tie token releases to component releases and force every non-Pine consumer to depend on the full component bundle.

## Decision

Design tokens are authored and released from an external package, **`@kajabi-ui/styles`** (versioned independently in the sibling `ds-tokens` repo). Pine consumes it as a regular npm dependency and re-exports the CSS variables via `libs/core/src/global/styles/`.

## Consequences

**Positive**

- Non-Pine consumers can adopt tokens without pulling Pine components.
- Token releases ship on their own cadence; component PRs don't block on token changes.
- The `stylelint-plugin-pine-semantic-tokens.cjs` plugin loads its mappings from `@kajabi-ui/styles/lint-mappings`, keeping lint enforcement and the token source in lockstep.

**Negative / accepted costs**

- Two-repo workflow for any change that spans tokens and components.
- Pine cannot unilaterally add or rename a token — requires a `ds-tokens` release first.
- Local development against in-flight token changes needs `npm link` or path overrides.

## Alternatives considered

- **In-repo tokens under `libs/tokens/`** — rejected because it forces all non-Pine consumers to depend on the Pine monorepo's release cycle.
- **Tokens authored in Figma only, generated to Pine on build** — rejected because we still need a canonical source-of-truth package for consumers and lint mappings.

## References

- `libs/core/src/global/styles/app.scss` (consumes `@kajabi-ui/styles`)
- `libs/core/lint-plugins/stylelint-plugin-pine-semantic-tokens.cjs` (loads `@kajabi-ui/styles/lint-mappings`)
- Sibling repo: `Kajabi/ds-tokens`
