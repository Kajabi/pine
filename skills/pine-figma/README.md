# `pine-figma` — the design-side companion to the `pine` code skill

This agent skill teaches a coding/design agent to **author Figma that actually
uses Pine** — composing from published component instances and binding every
value to a Pine variable or text style — instead of hand-drawing detached frames
full of hardcoded px that merely *look* like Pine.

It is the mirror of the `pine` code skill:

| Direction | Skill | The rule |
|---|---|---|
| Prompt → **code** | `pine` | Resolve every component/token/icon through the Pine MCP; gate on the layout validators. |
| Prompt → **Figma** | `pine-figma` (this) | Resolve every element from the published Pine library; bind every value; gate on the adoption audit. |

## What's here

- `SKILL.md` — the compact router (the four steps + which libraries to use/avoid).
- `reference/` — lazy-loaded detail:
  - `library.md` — find & insert Pine component instances (never draw them).
  - `primitives.md` — text and layout have no component; the text-style→`pds-text`
    and auto-layout→`pds-box` maps, and the bind-don't-hardcode rule.
  - `audit.md` — the gate: detached instances, unbound values, off-library styles.

## Why this skill exists

Code Connect (`libs/figma/*.figma.ts`), the Pine text/color/spacing **variables**,
and the `pine` code skill already make the **read** direction good — a design
built from instances hands off clean `pds-*` code. What was missing is a guardrail
on the **author** direction: nothing forced AI-authored Figmas to compose from
instances and bound variables in the first place. Without that, `generate_figma_design`
draws shapes, the layers panel fills with rectangles, and the result looks like the
system but has no relationship to it. This skill is that guardrail.

## Relationship to the Figma MCP's own skills

The Figma plugin ships `/figma-generate-design` (how to translate a layout into
Figma) and friends. Those are **framework-neutral**. `pine-figma` is the
**Pine-specific grounding overlay** on top of them: run the Figma generate/use
workflow, but resolve everything from the Pine libraries and gate on the Pine
adoption audit. Use both together — the generic *how*, plus the Pine *what*.

## Install

**Prerequisite — the Figma MCP** (the official Figma plugin), which provides
`search_design_system`, `get_variable_defs`, `get_design_context`,
`generate_figma_design`, etc. The skill gates on these.

**Manual install.** Copy `skills/pine-figma/` into your agent's skills directory
(e.g. `.claude/skills/pine-figma/`).

Once the docs-site `/.well-known/skills/` manifest generator (added alongside the
`pine` skill) is generalized to enumerate every `skills/*` directory, this skill
will also be installable via `npx skills add https://<pine-docs-domain>`. Until
then, install it manually. (Follow-up: generalize the generator in
`libs/core/.storybook/main.js` from the single hardcoded `skills/pine` to all
`skills/*`.)

## License

MIT (per `SKILL.md` frontmatter).
