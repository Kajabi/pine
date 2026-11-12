# The workflow, worked end to end

The router lists the four steps; this is one concrete pass through them so the
tool calls are unambiguous. Task: *"Add a destructive confirm button with a
trash icon to the settings card."*

## 1. Orient
```
get_pine_context_for_generation()
#   → every blocking, warning, and guidance rule. Takes no arguments.
```

## 2. Resolve every Pine-specific value (never from memory)
```
get_pine_component({ componentName: "pds-button" })
#   → confirms: variant enum includes "destructive"; the default slot holds the
#     label and the start/end slots hold icons; the icon-only flag.
#     Use ONLY these.

list_pine_icons({ search: "trash" })
#   → returns the actual name — do not assume it matches the concept.

get_pine_tokens({ purpose: "spacing" })
#   → resolve any --pine-dimension-* you need for layout, if not using a pattern.

# Composed settings screen? start from a pattern instead of hand-assembling:
get_pine_pattern({ patternId: "settings-page" })   # or list_pine_patterns() to discover
```
Reach for `reference/tokens.md`, `reference/components.md`, `reference/icons.md`
for the common traps — but the tool output wins over any cheat-sheet.

## 3. Write
Compose from the resolved values — real props, a real icon name, real tokens.
Icons go in the component's slots; `pds-button`'s `icon` prop is deprecated:
```html
<pds-button variant="destructive">
  <pds-icon slot="start" name="trash"></pds-icon>
  Delete account
</pds-button>
```
(`trash` is the name `list_pine_icons` returned.) If no component/pattern fits,
say so — don't approximate one with divs + tokens.

## 4. Validate (gate — loop until clean)
```
validate_pine_layout({ code: "<the composed UI>", scope: "snippet" })
#   issues? → apply the fix each violation gives, then re-run validate_pine_layout
#   → repeat until it passes. Only then is it done.
```
Details and failure handling: `reference/validation.md`.

## The shape to internalize
**resolve → write → validate → (fix → re-validate)\*.** Every Pine-specific
value enters through a tool call and the result leaves through a validator.
Nothing Pine-specific comes from, or is trusted to, model memory.
