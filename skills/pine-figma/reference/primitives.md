# Primitives: text and layout have no component — bind them instead

Most of any screen is **text** and **layout (spacing)**. Neither has a Pine
*component* to instantiate:

- **Text** in Pine's Figma is a set of **text styles** (`✳ Pine styles`), not a
  "Text" component. You apply a style to a text layer.
- **Layout** is **auto-layout** with **bound spacing/radius variables**, not a
  "Box" or "Stack" component.

This is exactly why AI-drawn Figmas leak into raw px: the two things every screen
is mostly made of are the two things you can't drag in from the components panel.
The relationship is preserved a different way — **by using the right text style
and by binding every spacing value to a Pine variable**, so the primitive maps
cleanly to `pds-text` / `pds-box` in code (and Dev Mode + the `pine` code skill
translate it for you).

## Text → `pds-text`

Apply a `✳ Pine styles` text style. Never set a raw font size/weight/line-height.

| Figma text style (`✳ Pine styles`) | Code |
|---|---|
| `typography/heading/1` … `/6` | `<pds-text tag="h1">` … `tag="h6">` |
| `typography/body/@` (default) | `<pds-text>` (default body) |
| `typography/body/bold` | `<pds-text weight="bold">` |
| `typography/body/medium` | `<pds-text weight="medium">` |
| `typography/body/mono` | `<pds-text>` with the mono style |
| `typography/body-sm/@` | `<pds-text size="sm">` |
| `typography/body-sm/bold` | `<pds-text size="sm" weight="bold">` |
| `typography/body/brand-text`, `body-sm/brand-text` | brand text styles (marketing surfaces) |

`pds-text` value ranges (from the component API — resolve via the `pine` skill /
`get_pine_component` if unsure): `size` ∈ `2xs…2xl` and `h1…h6`; `tag` is the
semantic element (`h1…h6`, `p`, `span`, …); `align` ∈ `start|center|end|justify`.
An invalid `size` is silently dropped, so it must come from the style, not memory.

**Anti-pattern:** a text layer with a hand-typed 18px / 600 weight and no style
applied. That's the leak. Apply `typography/heading/…` (or `body/…`) instead.

## Layout → `pds-box` (auto-layout + bound variables)

Build layout with **auto-layout frames**, and bind spacing/radius to **Pine
variables** — never a typed px gap or corner radius.

| Auto-layout property | Bind to | Code (`pds-box`) |
|---|---|---|
| Direction (horizontal / vertical) | — | `direction="row"` / `direction="column"` |
| Item spacing (gap) | Pine **spacing** variable | `gap="<token>"` (e.g. `sm`, `md`, `lg`) |
| Padding | Pine **spacing** variable | box padding / surrounding spacing utility |
| Primary-axis align | — | `justify-content="start\|center\|end\|space-between\|space-around\|space-evenly"` |
| Counter-axis align | — | `align-items="start\|center\|end\|baseline\|stretch"` |
| Corner radius | Pine **radius** variable | `border-radius="none\|xs\|sm\|md\|lg\|circle"` |
| Fill / background | Pine **color** variable | `background-color="<bound color>"` |
| Border color | Pine **color** variable | `border` + `border-color="<bound color>"` |

The names line up on purpose: a `gap` bound to the `md` spacing variable in Figma
is `gap="md"` in code, and both resolve to the same `--pine-dimension-*` value.
That shared source is what keeps canvas and code from drifting.

**Anti-pattern:** an auto-layout frame with a literal `24` gap and a `12` corner
radius typed in. Bind them to the spacing/radius variables of the same value; if
the exact value has no variable, that's a token gap to raise — not a number to
hardcode.

## Binding is the whole game

A value that is *bound to a variable* shows up in `get_variable_defs` as a token
name. A value typed by hand shows up as a raw number — and a raw number is the
signal, in the audit (`audit.md`), that the design has slipped off the system.
Bind first; audit confirms.
