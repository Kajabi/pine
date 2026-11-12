# Pine icons — the name is not what you'd guess

**Call `list_pine_icons` before writing any icon name.** Pine's icon set is fixed
and named on Pine's terms, not the model's intuition — the classic miss is `x`
for a close/remove control when the actual name is `remove`. Use only names the
tool returns.

## Resolving
```
list_pine_icons()                 // the full set — grep it for the concept you want
list_pine_icons({ search: "…" })  // filter by name or tag
```
Map the *concept* (close, delete, expand, success) to a listed *name* — never
assume the concept and the name match.

## Using an icon
- **Standalone:** `pds-icon` with `name="<listed-name>"`. Its color usually
  expects a `var(...)` wrapper (see `reference/components.md`).
- **On a component:** a `pds-icon` in the component's icon slot (on `pds-button`,
  `slot="start"` or `slot="end"`), with a listed name. `pds-button`'s `icon`
  prop is deprecated. Confirm the slot names via `get_pine_component`.
- **Icon-only controls:** provide an accessible label and set the component's
  icon-only flag — get the exact prop names from `get_pine_component`, don't
  assume `aria-label` alone is wired.

If a concept has no matching icon in the set, say so and ask — don't substitute a
raw SVG or a look-alike from another library.
