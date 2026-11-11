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
claude mcp add --transport http pine "https://pine-mcp.netlify.app/mcp" \
  --header "x-pine-mcp-client: <your-repo-or-app-name>"
```
The `x-pine-mcp-client` header names your project, so its usage and validation
results can be told apart from other callers'. Use a stable name per repo or
app, with no spaces. Prefix test and verification runs with `test-` to keep them
out of the quality dashboards.

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

## App-specific skills

A consuming app may keep its own local skill for app-only concerns: importing the
`@pine-ds/react` `Pds*` wrappers, the app's import paths, migrating off a legacy
UI library, or an offline snapshot for when the MCP isn't wired in.

The universal Pine rules (token discipline, icon and component gotchas, the
resolve→validate workflow) live **here**. App-specific skills should link here
rather than copy these rules.

## License

MIT (per `SKILL.md` frontmatter) — free to vendor into consuming repos.
