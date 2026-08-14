# The validation gate

Generation is not done until Pine's own validators pass. This is the step that
turns "looks like Pine" into "is Pine" — run it every time you produce or edit
Pine UI, and loop until it's clean.

## The loop

1. **Validate** what you wrote:
   - `validate_pine_layout` — structural/layout correctness of the composed UI.
   - `validate_ui_generation` — correctness of generated UI against Pine's rules.
   - `review_generated_layout` — a review pass over the generated layout.

   Use the one(s) that fit what you produced; when in doubt, run
   `validate_pine_layout` first.

2. **If issues are reported** → call `fix_layout_issues`, apply the fixes it
   returns, then **go back to step 1 and re-validate**. Fixes can surface or
   introduce follow-on issues; only a clean re-validation counts.

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

## Why a gate and not a guideline

Instruction hopes the model complies; a gate checks. Resolving values through
the MCP (steps 1–2 of the router) removes most hallucinations *before* writing;
this validation loop catches whatever slipped through *after* writing. Together
they make correct Pine the path of least resistance rather than a matter of the
model remembering to be careful.
