# The audit gate

Authoring is not done until the design passes an audit for "uses Pine," the same
way the `pine` code skill isn't done until the layout validators pass. Run this
every time you generate or edit Pine UI in Figma, and loop until clean.

## What to check

Over the frame you produced (or are reviewing):

1. **Instances, not shapes.** Every interactive/structured element is a
   component instance from `❖ Pine components`. No rectangle-buttons, no
   frame-inputs, no detached instances.
2. **Text is styled.** Every text layer has a `✳ Pine styles` `typography/*`
   style applied. No raw font size/weight.
3. **Values are bound.** Every gap, padding, radius, fill, and border resolves to
   a Pine **variable**, not a typed number or hex.
4. **No `⛔` libraries.** Nothing pulled from `DO NOT USE - Sage components` or
   `Old Mercury styles`.

## How to check with the MCP

```
get_variable_defs({ nodeId, fileKey })
#   → lists the variables actually bound on the node. A spacing/color/radius
#     that you set but that does NOT appear here is hardcoded — that's a finding.

get_design_context({ nodeId, fileKey })   # (or get_metadata for structure)
#   → inspect the node tree: instances vs raw frames/rectangles, which library
#     each instance comes from, which text layers carry a style.
```

A value that comes back from `get_variable_defs` as a **raw number/hex instead of
a token name** is the concrete signal of an unbound value. A child that is a
`FRAME`/`RECTANGLE` where a component was expected is a detached/hand-drawn
element. Both are findings.

## The loop

1. Audit the frame against the four checks.
2. For each finding, fix it at the source: swap the shape for the instance,
   apply the text style, bind the value, or replace the `⛔` asset with its Pine
   equivalent.
3. **Re-audit.** A fix can surface another (binding a gap reveals a detached
   parent). Only a clean pass counts.

## Non-negotiables

- **Don't present an unaudited Figma as "Pine-conformant."** "It looks right" is
  not "it uses the system" — a detached button and a real one are pixel-identical
  and only one round-trips to code.
- **Don't paper over a gap.** If a needed variant/variable genuinely doesn't
  exist in Pine, surface it as a **design-system gap to raise**, not a detach or
  a hardcoded value to sneak in.

## This is also the seed for an automated check

The four checks above are mechanical: instances-not-shapes, styled-text,
bound-values, no-`⛔`-libraries — all readable from `get_variable_defs` +
`get_design_context`. They are the spec for a repo-side "Figma adoption audit"
(the design twin of the `no-hardcoded-colors` / `prefer-pds-box-layout` code
linters): point it at a file, report unbound values and detached instances, and
turn "it feels like too many px" into a number a design review can hold.
