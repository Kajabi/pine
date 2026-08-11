---
name: pine
description: Build UI with the Pine design system (pds-* web components + Pine tokens/icons). Use for any task that renders or edits UI in a Pine-consuming app. Resolves every component, token, and icon through the Pine MCP instead of trained memory, then gates the result behind Pine's own layout validators. Progressive disclosure — this router stays small; load a reference file only when its step applies.
license: MIT
---

# Building with Pine

Pine is Kajabi's design system: `pds-*` web components (Stencil), `--pine-*` CSS
tokens, and a fixed icon set. This skill makes a coding agent produce **real**
Pine — not plausible-looking Pine that uses props, tokens, or icon names that
don't exist.

## The one rule everything else serves

**Your trained knowledge of Pine's API is not reliable.** Component props, slot
names, token names, and icon names are finite, enumerable, and change per
release — and a model's memory of them is exactly the thing that hallucinates.
So for anything Pine-specific, **resolve it through the Pine MCP before you write
it**, and **validate the result through the MCP after** — do not emit a `pds-*`
tag, a `var(--pine-*)` value, or an icon name from memory.

This is tool-gating, not etiquette: the steps below are structured so the
correct value comes from a tool call, and the output is checked mechanically,
rather than trusting the model to remember.

> If the Pine MCP is **not** available in this session, say so and stop — do not
> fall back to writing Pine from memory. Install it with:
> `claude mcp add --transport http pine "https://pine-mcp.netlify.app/mcp"`

## When to engage

Engage for any task that **renders or edits UI** in a Pine-consuming app: new
components/pages, restyling, adding a `pds-*` element, touching `--pine-*`
tokens, or picking an icon. When unsure whether Pine applies, ask the MCP:
`should_engage_pine_workflow`. Skip only for work with no rendered surface
(pure logic, config, tests without UI assertions).

## Workflow (four steps — do them in order)

### 1. Orient
Bootstrap context for the task before writing anything:
- `get_pine_context_for_generation` — task-scoped starting context, **or**
- `should_engage_pine_workflow` if you're unsure Pine is even involved.

### 2. Resolve every Pine-specific value through a tool — never from memory
Match the need to the tool, and **read the tool result, don't guess**:

| Before you write… | Call | Then |
|---|---|---|
| any `pds-*` component | `get_pine_component` (or `list_pine_components` to discover) | use only the props/slots/events it returns |
| any `var(--pine-*)` token | `get_pine_tokens` (search / purpose / priority) | use only tokens it returns; if absent, it doesn't exist |
| any icon name | `list_pine_icons` | use only listed names (see `reference/icons.md`) |
| a composed layout (form, card, nav…) | `get_pine_pattern` / `list_pine_patterns` | start from the pattern, don't reinvent |
| "how should this work" questions | `get_pine_design_doc` / `ask_pine_agent` | follow the doc, cite it |

Load `reference/tokens.md` and `reference/components.md` for the high-frequency
gotchas (they name the exact hallucinations to avoid) — but the MCP is always
the authority over any cheat-sheet.

### 3. Write
Compose from the resolved values. Prefer a Pine **pattern** over hand-assembly;
prefer a Pine component over a raw element. If no Pine component fits, say so
explicitly rather than approximating one with divs + tokens.

### 4. Validate — this is a gate, not a suggestion
After writing UI, run Pine's own validators and **loop until clean** — do not
present the UI as done while issues remain:
1. `validate_pine_layout` (and/or `validate_ui_generation` / `review_generated_layout`)
2. If it reports issues → `fix_layout_issues`, apply, then **re-validate**.
3. Repeat until validation passes. If it can't pass, surface the specific
   blocker to the user; never suppress it.

Full loop details and how to read validator output: `reference/validation.md`.

## Never (the exact failures, not vague advice)

- **Never** invent a token. British spelling, leading zeros, `semi-bold` not
  `semibold`, no `--pine-spacing-*` namespace, and more — see `reference/tokens.md`.
- **Never** use a `pds-text` `size` outside `2xs…2xl` / `h1…h6` (invalid values
  are silently dropped) — see `reference/components.md`.
- **Never** guess an icon name (it's `remove`, not `x`) — see `reference/icons.md`.
- **Never** skip step 4. Unvalidated Pine is not done Pine.
- **Never** fall back to trained memory when the MCP is unavailable — stop instead.

## Reference files (load lazily, only when the step applies)

- `reference/workflow.md` — the four steps in depth, with tool-call examples
- `reference/tokens.md` — token discipline + the hallucinated-token table
- `reference/components.md` — resolving components; `pds-text`/`pds-button` gotchas
- `reference/icons.md` — icon resolution and icon-only controls
- `reference/validation.md` — the validate → fix → re-validate gate
