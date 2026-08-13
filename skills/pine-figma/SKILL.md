---
name: pine-figma
description: Author or edit Figma UI that actually *uses* the Pine design system — compose from published Pine component instances, bind every value to a Pine variable or text style, and never hand-draw detached frames or hardcode px. Use whenever generating, editing, or reviewing a Figma design (Figma MCP `generate_figma_design` / `use_figma`, or Figma Make / First Draft output) that should conform to Pine.
license: MIT
---

# pine-figma — build Figma that *uses* Pine, not just *looks* like it

The failure this skill exists to prevent: an AI-authored Figma that visually
resembles Pine but is made of **detached rectangles with hardcoded px and
off-library text**. It has no relationship to code, its layers panel shows raw
frames instead of component instances, and Dev Mode hands off CSS instead of
`pds-*`. It looks like the system and doesn't use it.

The rule is the mirror image of the `pine` code skill: **every element on the
canvas comes from the published Pine library, and every value is a bound
variable or text style — never a raw number or hex typed from memory.**

## When this applies

- Generating a screen or component into Figma (`generate_figma_design`, `use_figma`).
- Editing an existing Figma file that should conform to Pine.
- Reviewing an AI- or human-made Figma for "looks like but doesn't use" drift.

If the work is **code**, not canvas, use the `pine` skill instead. This is its
design-side companion.

## The four steps

**resolve → compose → bind → audit**, the same shape as the code workflow.

1. **Orient on the real library.** `search_design_system` / `get_libraries`
   against the Pine libraries below. Never invent a component or a style name —
   find the published one. Your memory of Pine's Figma is not reliable; the
   library search result wins.

2. **Compose from instances.** Insert *published component instances*, not
   shapes that look like them. A hand-drawn "button" rectangle is the exact
   defect this skill prevents. If a piece has no matching component, it is a
   **primitive** (text or layout) → step 3, not a freehand frame.

3. **Bind every value.** Text uses a Pine **text style**; spacing, color, and
   radius use Pine **variables**. No hardcoded px, no off-library hex, no
   detached type. The primitive→code map lives in `reference/primitives.md`.

4. **Audit (this is a gate, not a suggestion).** Run `get_variable_defs` +
   `get_design_context` over the result and flag every detached instance,
   unbound value, and off-library style. Fix, then re-audit. Only a clean audit
   is done. See `reference/audit.md`.

## The libraries — resolve from these, avoid the others

Pull **only** from the live Pine libraries:

- **`❖ Pine components`** — component instances (button, input, alert, select, …).
- **`✳ Pine styles`** — text styles: `typography/heading/1..6`, `typography/body`,
  `typography/body-sm`, `typography/body/bold|medium|mono`, `brand-text`.
- **`✦ Pine icons`** — the icon set (`@pine-ds/icons`).
- **Pine variables** — spacing, color, radius (the Tokens Studio collection that
  also builds the `--pine-*` CSS tokens, so canvas and code share one source).

**Never** pull from these — they look almost right and are wrong:

- `⛔⛔⛔ DO NOT USE - Sage components ⛔⛔⛔`
- `⛔⛔⛔ [DO NOT USE] Old Mercury styles ⛔⛔⛔`

If a search result comes from a `⛔`/`DO NOT USE` library, discard it and search
again for the Pine equivalent.

## Why grounding, not vibes

`generate_figma_design` will happily *draw* a button. Grounding makes it *insert
the Pine button instance* — which is the only version that Code Connect can
round-trip back to `<pds-button>`, and the only version a designer can restyle by
switching a variant instead of editing pixels. Instances plus bound values are
what make a design a real consumer of the system instead of a screenshot of it.

Detail lives in `reference/` — read a file when its step applies:
`library.md` (find & insert), `primitives.md` (text/layout → code map),
`audit.md` (the gate).
