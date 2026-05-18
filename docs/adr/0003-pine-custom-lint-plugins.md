# 0003. Custom Pine lint plugins enforce semantic-token usage

- **Status:** Accepted (retrospective)
- **Date:** 2026-05-15
- **Maintainers:** @Kajabi/dss-devs

## Context

Two recurring failure modes were caught only in code review:

1. New components shipped with hardcoded color values (`#1a1a1a`, `rgba(0,0,0,0.5)`), which break tokenized theming and dark-mode parity.
2. Components used **core** tokens (`--pine-grey-150`) directly instead of **semantic** tokens (`--pine-color-surface-secondary`), so a token-level theme switch couldn't reach them.

Stylelint's built-in rules can't express "prefer this token over that one" with the precision Pine needs. We also wanted the suggestion to name the closest valid semantic alternative, not just reject the input.

## Decision

Ship **custom Stylelint plugins** under `libs/core/lint-plugins/` and enforce them in CI:

- `stylelint-plugin-pine-colors.cjs` — `pine-design-system/no-hardcoded-colors`
- `stylelint-plugin-pine-semantic-tokens.cjs` — `pine-design-system/prefer-semantic-tokens`

An **`eslint-plugin-pine-colors.cjs`** counterpart for TS/TSX strings also lives in that directory but is **not wired into ESLint today** (see `libs/core/lint-plugins/README.md`).

Token mappings are loaded from `@kajabi-ui/styles/lint-mappings` (see ADR-0001) so the rules stay in lockstep with the upstream token source.

## Consequences

**Positive**

- Hardcoded colors and core-token misuse in **SCSS** fail CI via Stylelint, not human review.
- Dark-mode rollout (see ADR-0005) becomes mechanical — semantic tokens already encode light/dark variants.
- New contributors get immediate, named suggestions instead of generic "don't do that."

**Negative / accepted costs**

- Hardcoded colors in **TS/TSX** strings are not blocked until the ESLint plugin is enabled.
- Pine-only lint rules are not shareable with consumer apps without extracting them to a separate plugin package.
- The plugin loader has to handle three resolution paths (published package, monorepo `node_modules`, sibling `ds-tokens` checkout).
- Adding a new core token also requires a lint-mapping update in `@kajabi-ui/styles`.

## Alternatives considered

- **Generic `stylelint-declaration-strict-value`** — rejected because it can ban literals but can't suggest the right token.
- **Code review and JSDoc-based reminders** — tried, didn't scale; violations slipped through.
- **Codemod / one-time migration** — would fix existing code but not prevent regressions in new code.

## References

- `libs/core/lint-plugins/stylelint-plugin-pine-colors.cjs`
- `libs/core/lint-plugins/stylelint-plugin-pine-semantic-tokens.cjs`
- `libs/core/lint-plugins/eslint-plugin-pine-colors.cjs` (not enabled)
- `libs/core/lint-plugins/README.md`
- ADR-0001 (externalized tokens)
- ADR-0005 (dark mode via semantic tokens)
