# The workflow, worked end to end

The router lists the four steps; this is one concrete pass through them so the
tool calls are unambiguous. Task: *"Add a destructive confirm button with a
trash icon to the settings card."*

## 1. Orient
```
get_pine_context_for_generation({ task: "destructive confirm button with an icon in a settings card" })
# (or) should_engage_pine_workflow({ task: "..." })  → confirms Pine applies
```

## 2. Resolve every Pine-specific value (never from memory)
```
get_pine_component({ name: "pds-button" })
#   → confirms: variant enum includes "destructive"; icon prop; icon-only flag;
#     which slot the label goes in. Use ONLY these.

list_pine_icons({ search: "trash" })
#   → returns the actual name (e.g. "delete" or "trash") — do not assume "trash".

get_pine_tokens({ purpose: "spacing" })
#   → resolve any --pine-dimension-* you need for layout, if not using a pattern.

# Composed card? start from a pattern instead of hand-assembling:
get_pine_pattern({ name: "card" })   # or list_pine_patterns() to discover
```
Reach for `reference/tokens.md`, `reference/components.md`, `reference/icons.md`
for the common traps — but the tool output wins over any cheat-sheet.

## 3. Write
Compose from the resolved values — real props, a real icon name, real tokens:
```html
<pds-button variant="destructive" icon="<resolved-icon-name>">Delete account</pds-button>
```
If no component/pattern fits, say so — don't approximate one with divs + tokens.

## 4. Validate (gate — loop until clean)
```
validate_pine_layout({ markup: "<the composed UI>" })
#   issues? →
fix_layout_issues({ ... })   # apply, then re-run validate_pine_layout
#   → repeat until it passes. Only then is it done.
```
Details and failure handling: `reference/validation.md`.

## The shape to internalize
**resolve → write → validate → (fix → re-validate)\*.** Every Pine-specific
value enters through a tool call and the result leaves through a validator.
Nothing Pine-specific comes from, or is trusted to, model memory.
