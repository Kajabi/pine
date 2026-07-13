# 0009. Use vetted third-party libraries for positioning and sanitization

- **Status:** Accepted (retrospective)
- **Date:** 2026-07-13
- **Maintainers:** @Kajabi/dss-devs

## Context

Two pieces of component behavior are genuinely hard to get right by hand: **overlay positioning** (keeping a popover/combobox anchored, flipped, and shifted within the viewport) and **sanitizing consumer-supplied HTML** that a component renders as `innerHTML`. Both are well-solved problems with mature libraries, and both are risky to reinvent — positioning for correctness, sanitization for security.

## Decision

Depend on small, well-maintained libraries for these instead of hand-rolling:

- **`@floating-ui/dom`** for overlay positioning — used in `pds-combobox`, `pds-multiselect`, and the truncation tooltip util.
- **`DOMPurify`** for sanitizing consumer-supplied markup that gets read as HTML — used in `pds-combobox` (`sanitizeHtml` cleans an option's `innerHTML` before rendering the selected-option layout), configured to allow Pine components while stripping dangerous content, to prevent XSS.

## Consequences

**Positive**

- Correct, battle-tested viewport-aware positioning without bespoke geometry code.
- A real XSS defense on the one place a component reads consumer markup as HTML — which is the safety cost of the slots/rich-content model (ADR-0007).

**Negative / accepted costs**

- These are **runtime** dependencies that ship in the bundle; their size counts against the `size-limit` budgets enforced in CI.
- **DOMPurify is load-bearing security** — removing or bypassing `sanitizeHtml` reintroduces XSS via option markup. Any refactor of `pds-combobox`'s option rendering must preserve it.
- The libraries must be kept current (security patches for DOMPurify especially).

## Alternatives considered

- **Hand-rolled positioning** — rejected: re-implements `@floating-ui/dom` (flip, shift, viewport collision) and is error-prone.
- **Manual escaping / trusting consumer markup** — rejected: manual escaping is fragile and an XSS liability; DOMPurify is the standard for this.

## References

- `libs/core/src/utils/truncation-tooltip.ts`, `pds-combobox`, `pds-multiselect` (`@floating-ui/dom`)
- `libs/core/src/components/pds-combobox/pds-combobox.tsx` (`sanitizeHtml` via `DOMPurify`)
- ADR-0007 (slots/rich content — the reason sanitization is needed)
