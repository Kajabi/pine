# Pine components — resolve the API, don't assume it

**Call `get_pine_component` before using any `pds-*` element.** Prop names, slot
names, event names, and their allowed values are what a model most reliably gets
wrong. Use only what the tool returns.

## Discovering vs. resolving

- `list_pine_components` — when you don't yet know which component fits.
- `get_pine_component({ name: "pds-button" })` — the authoritative API for one
  component: props, slots, events, allowed enum values, examples.
- `get_pine_pattern` / `list_pine_patterns` — for composed UI (forms, cards,
  nav, tables). Prefer a pattern over hand-assembling primitives.

## Rules that hold across components

- **Prefer Pine components over raw elements.** A `<button>` styled with tokens
  is not a `pds-button`. If no Pine component fits, say so explicitly rather than
  approximating one — don't rebuild a component out of divs + tokens.
- **Booleans are attributes.** `?disabled`, `?loading`, `?full-width`, etc. —
  check the component's actual prop list; don't assume a prop exists.
- **Verify before you slot.** Slot names differ per component — get them from
  `get_pine_component`, not from memory of a similar component.

## High-frequency gotchas (still verify against the MCP)

### `pds-text` `size`
Valid `size` values are **`2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`** (body)
and **`h1`–`h6`** (headings). Do **not** use `body-sm`/`body-md`/… (the `body-`
prefix is applied internally — `size="md"` maps to `--pine-font-size-body-md`),
nor bare `body`/`p`. **Invalid values are silently dropped**, so the text falls
back to the size implied by its `tag` — a bug you won't see in the source.

- `pds-text` `weight` enum uses `semibold` (no hyphen); the CSS *token* is
  `--pine-font-weight-semi-bold` (hyphen). They are different surfaces — match
  the enum on the component, the token in CSS.

### Icons on components
Icon props take a **name from `list_pine_icons`** — see `reference/icons.md`.
Icon-only controls usually need an explicit accessible-label prop and an
`icon-only`/`hide-label` flag; confirm the exact prop names via
`get_pine_component`.

### Colors on sub-parts
`pds-icon` color expects a `var(...)` wrapper; `pds-text` color takes a bare
`--pine-*` token. Confirm per component — don't generalize one to the other.

## After composing
Return to the SKILL router's **step 4** and run the validators. A component that
renders is not the same as a component that passes `validate_pine_layout`.
