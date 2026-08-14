# Pine tokens — resolve, don't remember

**Always call `get_pine_tokens` before writing any `var(--pine-*)` value.** The
token set is finite and enumerable; if a token you want isn't in the MCP output,
it does not exist — use the closest returned token or a raw CSS value. This table
is a fast-path for the mistakes models make most often, but the MCP is the
authority.

## Querying

```
get_pine_tokens({ purpose: "background-colors" })   // slice by what you're styling
get_pine_tokens({ search: "border" })               // filter by name
get_pine_tokens({ priority: "semantic" })           // prefer semantic over core
```
Purposes: `text-colors`, `background-colors`, `spacing`, `typography`,
`borders`, `shadows`, `all`. Prefer **semantic** tokens; fall back to **core**
only when no semantic token fits.

## Hallucinated tokens — these do NOT exist (WRONG → RIGHT)

| Wrong (do not use) | Correct |
|---|---|
| `--pine-color-border-default` | `--pine-color-border` |
| `--pine-color-background-surface` | `--pine-color-background-container` |
| `--pine-color-background-contained-hover` | `--pine-color-background-container-hover` |
| `--pine-color-text-default` / `-enabled` | `--pine-color-text` |
| `--pine-color-text-link` | `--pine-color-text-accent` |
| `--pine-color-text-primary` (for body text) | `--pine-color-text` / `--pine-color-text-strong` (note: `-text-primary` = `#FFF`, text ON a primary button) |
| `--pine-color-focus` | `--pine-color-focus-ring` |
| `--pine-color-primary-600` | `--pine-color-purple-600` (core palette) |
| `--pine-color-gray-*` (American) | `--pine-color-grey-*` (British) |
| `--pine-color-grey-50` | `--pine-color-grey-050` (leading zero) |
| `--pine-font-size-sm` / `-md` / `-lg` | `--pine-font-size-body-sm` / `-body-md` / `-body-lg` |
| `--pine-font-size-caption` | `--pine-font-size-heading-caption` |
| `--pine-font-family-mono` | `monospace` (no mono token) |
| `--pine-font-family-base` | `--pine-font-family-body` |
| `--pine-font-weight-semibold` | `--pine-font-weight-semi-bold` (hyphen) |
| `--pine-font-weight-normal` | `--pine-font-weight-regular` |
| `--pine-dimension-25` / `-50` | `--pine-dimension-025` / `-050` (leading zero) |
| `--pine-dimension-075` / `-75` | `6px` (no 6px token) |
| `--pine-dimension-3xs` | `--pine-dimension-2xs` (smallest semantic = 4px) |
| `--pine-dimension-full` | `100%` (width/height) or `9999px` (pill radius) |
| `--pine-spacing-*` | `--pine-dimension-*` (no `spacing` namespace) |
| `--pine-shadow-sm` / `-md` / `-large` | `--pine-box-shadow-050` / `-100` / `-400` |
| `--pine-border-radius-large` | `--pine-border-radius-full` (valid: `sm` 4px, `md` 10px, `lg` 16px, `full` 9999px) |
| `--pine-border-width-100` | `--pine-border-width-thin` (1px) |
| `--pine-gray-700` (missing `color`) | `--pine-color-text-muted` |

## Dimension tokens (complete set)

- **Semantic (prefer):** `none`, `2xs`(4px), `xs`(8px), `sm`(16px), `md`(24px), `lg`(32px), `xl`(40px), `2xl`(48px)
- **Core (fallback):** `025`(2px), `050`(4px), `100`(8px), `125`(10px), `150`(12px), `200`(16px), `250`(20px), `300`(24px), `350`(28px), `400`(32px), `450`(36px), `500`(40px), `550`(44px), `600`(48px), `650`(52px), `700`(56px), `750`(60px), `800`(64px)

There is **no** 6px dimension token — use `6px` raw.

## Escape hatch

Only disable the token lint rule for a genuine reason (third-party CSS you can't
change, or a token shipped to Pine but not yet in the installed package):

```scss
/* stylelint-disable-next-line pine-design-system/no-unknown-pine-tokens -- reason */
```
Never disable it to silence a token that simply doesn't exist — fix it instead.
