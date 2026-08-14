# Finding and inserting Pine from the library

The single most important habit: **insert an instance you found by searching the
live library**, never a shape you drew to look like one. This is what fills the
layers panel with `Pine/Button` instances instead of anonymous `Rectangle` /
`Frame` nodes — the difference a reviewer sees at a glance.

## Resolve, don't invent

```
search_design_system({ query: "button", fileKey: "<the file you're authoring>" })
#   → returns matching components + their library. Insert the one from
#     "❖ Pine components". Its componentKey is the thing to instantiate.

search_design_system({ query: "primary secondary destructive", fileKey })
#   → use the returned variant/property names to set the instance, don't guess.
```

- If the best match's `libraryName` is a `⛔ DO NOT USE` Sage or Mercury library,
  **discard it** and search again — those render almost identically and are the
  classic source of "looks like Pine, isn't Pine."
- If nothing in `❖ Pine components` fits, the piece is probably a **primitive**
  (text or layout), not a missing component. Go to `primitives.md`; do not
  hand-assemble a component out of shapes + tokens.

## The three Pine libraries and what each is for

| Library | Holds | Use it for |
|---|---|---|
| `❖ Pine components` | Component instances | Every interactive/structured element: button, input, select, alert, chip, tabs, modal, avatar, … |
| `✳ Pine styles` | Text styles | All text — apply a `typography/*` style, never a raw font size/weight |
| `✦ Pine icons` | Icon components | Every icon (maps to `@pine-ds/icons`) |
| Pine variables (Tokens Studio collection) | Spacing / color / radius values | Every gap, padding, fill, border, corner radius |

## The tell you're doing it right

- **Layers panel** shows component instances (with the diamond/instance glyph),
  not a stack of rectangles and text nodes.
- **Selecting an instance** shows component *properties* (Variant, Size, State) in
  the right rail — the same enums the code component exposes — not raw fills and
  strokes.
- **Detaching** an instance to "tweak" it is the anti-pattern. If you need a
  variant that doesn't exist, that's a gap to raise, not a detach to make.

## Why this is the load-bearing step

Code Connect (`libs/figma/*.figma.ts`) can only round-trip a design back to
`pds-*` code when the design is built from **connected component instances**. A
detached rectangle has no node for Code Connect to attach to, so it hands off as
CSS. Composing from instances is therefore not a style preference — it's the
precondition for the whole code↔design bridge to work.
