# `pine` — the canonical agent skill for building with Pine

This is the **source-of-truth** agent skill for coding agents that build UI with
Pine in any consuming app. It teaches an agent to resolve every Pine component,
token, and icon through the [Pine MCP](https://pine-mcp.netlify.app/mcp) instead
of trained memory, and to gate the result behind Pine's own layout validators.

It is framework-neutral: it speaks in `pds-*` web components and `--pine-*`
tokens, which underlie both raw usage and the `@pine-ds/react` wrappers.

## What's here

- `SKILL.md` — the compact router (small, always-loaded surface).
- `reference/` — lazy-loaded detail, read only when its step applies:
  `tokens.md`, `components.md`, `icons.md`, `validation.md`, `workflow.md`.

The router stays small on purpose; detail lives behind explicit reads
(progressive disclosure).

## Install

**Prerequisite — the Pine MCP.** The skill gates on it; without it, the skill
tells the agent to stop rather than guess.
```bash
claude mcp add --transport http pine "https://pine-mcp.netlify.app/mcp"
```

**Recommended — `npx skills add`.** The docs site serves a discovery manifest at
`/.well-known/skills/index.json` (the [vercel-labs/skills](https://github.com/vercel-labs/skills)
convention). Point the CLI at the docs domain and it installs this skill into
whichever agent you use (Claude Code, Cursor, Copilot, …):
```bash
npx skills add https://<pine-docs-domain>
```

**Manual install.** Copy `skills/pine/` into your repo's skills directory (e.g.
`.claude/skills/pine/`), or fetch the served files under
`/.well-known/skills/pine/`.

### How the manifest is served (compiled, not hand-written)

The `/.well-known/skills/` tree — the manifest **and** the served skill files —
is **generated from `skills/pine/` at docs-build time** by `.storybook/main.js`
(mirroring the existing CHANGELOG copy step) into Storybook's `static`
staticDir. So the served copy is regenerated on every deploy and cannot drift
from source; `skills/pine/` remains the single source of truth.

Manifest schema (per the `vercel-labs/skills` convention):
```json
{ "skills": [ { "name": "pine", "description": "…", "files": ["SKILL.md", "reference/…"] } ] }
```
`files` are paths relative to `/.well-known/skills/pine/`. The `description` is
taken from this skill's `SKILL.md` frontmatter at generation time.

## Relationship to `kp-pine-patterns` (in kajabi-products)

`kp-pine-patterns` is the **KP-local complement** to this skill: it covers the
KP-specific consuming surface — importing the `@pine-ds/react` `Pds*` wrappers,
KP import paths, KP's Sage→Pine migration, and an offline `pine-snapshot.json`
fallback for when the MCP isn't wired into KP. Its own overview already calls
itself "the consuming-side complement to the Pine repo's own component API" —
this skill *is* that API surface.

Division of labor:

| Concern | Lives in |
|---|---|
| Universal Pine rules — token discipline, icon/component gotchas, the resolve→validate workflow | **here** (canonical) |
| React wrappers, app import paths, Sage→Pine, offline snapshot | `kp-pine-patterns` (KP-local) |

The shared rules (the hallucinated-token table, icon/component gotchas) should
have **one** home — this skill. A follow-up will thin `kp-pine-patterns`' copies
down to a pointer here so they can't drift (see the PR's follow-up note).

## License

MIT (per `SKILL.md` frontmatter) — free to vendor into consuming repos.
