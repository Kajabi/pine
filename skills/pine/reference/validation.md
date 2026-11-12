# The validation gate

Generation is not done until Pine's own validators pass. This is the step that
turns "looks like Pine" into "is Pine" — run it every time you produce or edit
Pine UI, and loop until it's clean.

## The loop

1. **Validate** what you wrote:
   - `validate_pine_layout({ code, scope: "snippet" })` — checks the markup you
     wrote or changed against Pine's layout rules and returns each violation
     with a fix. Send markup, not a whole existing file: for one changed hunk
     of an existing file use `scope: "diff"`, and for a whole file
     `scope: "file"`, then keep only the findings on lines you changed.
   - `validate_ui_generation({ request, generatedCode })` — the full workflow
     for a generated UI: detects Pine usage, validates, and auto-fixes
     mobile-first violations. `request` is the user's original ask.

   When in doubt, run `validate_pine_layout` first.

2. **If issues are reported** → apply the fix each violation gives (or use the
   corrected code `validate_ui_generation` returns), then **go back to step 1
   and re-validate**. Fixes can surface or introduce follow-on issues; only a
   clean re-validation counts.

3. **Repeat until validation passes.** Then, and only then, present the UI as
   done.

## Non-negotiables

- **Do not present unvalidated UI as complete.** "It renders" is not "it
  passed." A silently-dropped `pds-text size`, an invalid icon name, or an
  off-palette token can render fine and still be wrong.
- **Do not suppress a blocker.** If validation cannot pass, stop and surface the
  *specific* issue to the user with the validator's message — don't paper over it
  with a disable comment or a raw-CSS workaround.
- **Re-validate after every fix.** Never assume a fix is clean without a fresh
  validator run.

## Deprecated tools — don't call them

The MCP still lists these for older clients, but they'll be removed:

- `review_generated_layout` → use `validate_pine_layout`.
- `fix_layout_issues` → use `validate_pine_layout`. It only diagnoses a
  described problem and doesn't rewrite code.
- `should_engage_pine_workflow` → call `get_pine_context_for_generation` before
  writing and `validate_ui_generation` after.

## Why a gate and not a guideline

Instruction hopes the model complies; a gate checks. Resolving values through
the MCP (steps 1–2 of the router) removes most hallucinations *before* writing;
this validation loop catches whatever slipped through *after* writing. Together
they make correct Pine the path of least resistance rather than a matter of the
model remembering to be careful.
