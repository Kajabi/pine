# 0005. Roll out dark mode via incremental semantic-token migration

- **Status:** Accepted (retrospective)
- **Date:** 2026-05-15
- **Maintainers:** @Kajabi/dss-devs

## Context

Dark mode was first attempted on a feature branch (`feat/add-dark-mode`, last touched 2025-11-21 with a `fix: remove temp dark mode styles` commit). That approach — implement dark mode as one large feature branch — produced a stale, hard-to-rebase delta and was abandoned. The team needed a strategy that:

1. Doesn't block on a single massive merge.
2. Surfaces parity gaps mechanically rather than by review.
3. Lets dark-mode-ready components ship as soon as they're done.

## Decision

Adopt a **per-component, semantic-token-led migration**:

1. Every component that uses **semantic tokens** (e.g., `--pine-color-text-primary`) inherits dark mode automatically, because the token resolves differently under `[data-theme="dark"]`.
2. The `pine-design-system/prefer-semantic-tokens` lint rule (see ADR-0003) blocks core-token usage in new SCSS and is being applied component-by-component to existing SCSS.
3. Each migrated component lands as a small `style(pds-name): adopt … dark-mode-aware tokens` PR. Example: commit `6cf3324e`, `style(pds-chip): adopt chip-namespaced dark-mode-aware text tokens`.

No global dark-mode launch — readiness is per-component, tracked in `libs/core/src/stories/resources/component-status.docs.mdx` (once landed).

## Consequences

**Positive**

- No big-bang merge; rollback risk per PR is small.
- Lint enforces the rule; new components are born dark-mode-ready.
- Designers can validate dark mode component-by-component in Storybook.

**Negative / accepted costs**

- The Pine surface is "partially dark-mode" for an extended period — consuming apps need to know which components are ready.
- Token authoring in `@kajabi-ui/styles` (ADR-0001) has to keep up: every component that needs a namespaced dark variant requires a token addition first.
- The previous feature branch (`feat/add-dark-mode`) is left stale rather than deleted, in case anything in it is still useful as reference.

## Alternatives considered

- **Single feature-branch landing** — tried, produced the stale branch above; rejected.
- **`prefers-color-scheme` media query only, no token rework** — rejected because it would couple Pine to OS theme and can't support per-app override or sub-brand themes.
- **Ship dark mode as a separate `@pine-ds/dark` overlay package** — rejected because consumers would have to import two packages and reason about precedence.

## References

- `libs/core/lint-plugins/stylelint-plugin-pine-semantic-tokens.cjs`
- Recent migration commits: `6cf3324e` (pds-chip namespaced dark-mode tokens), `ed4a457f` (pds-alert link hover)
- ADR-0001 (externalized tokens)
- ADR-0003 (lint plugins)
