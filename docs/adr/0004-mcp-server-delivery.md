# 0004. Ship a Pine MCP server for AI tooling

- **Status:** Accepted (retrospective)
- **Date:** 2026-05-15
- **Maintainers:** @Kajabi/dss-devs

## Context

Engineers and designers at Kajabi increasingly draft UI through AI tools (Claude Code, Claude Desktop, Cursor, VSCode Copilot). Without a structured information source, those tools hallucinate Pine props, invent component names that don't exist, and produce code that fails lint on first run. Storybook MDX and the Figma file are not directly consumable by the agents.

## Decision

Ship a **Pine MCP server** hosted at `pine-mcp.netlify.app/mcp`. It exposes:

- Component discovery (list of `pds-*` components, props, events, slots)
- Design-token lookup (semantic and core)
- Code-generation validation

Setup docs live in `libs/core/src/stories/resources/mcp.docs.mdx`. A dedicated Slack channel (`#dss-pine-mcp`) handles community questions.

## Consequences

**Positive**

- AI-generated Pine code is dramatically more likely to compile, lint, and match canonical patterns on the first attempt.
- The MCP server is a single integration point — adding a new IDE/agent is a config change for the consumer, not a Pine team lift.
- Doubles as a Level-5 "Public Design System" deliverable (the maturity model rates MCP servers as a top-tier capability).

**Negative / accepted costs**

- Pine surface now includes an externally-hosted endpoint in addition to the npm packages.
- Schema drift risk — the MCP server needs to stay in sync with the Stencil `components.d.ts` and token releases.
- Auth/quotas/abuse — revisit if traffic warrants.

## Alternatives considered

- **Static rules in each agent's prompt** — rejected because each consumer would maintain their own; drift inevitable.
- **Generated `AGENTS.md` only** — kept (`AGENTS.md` at repo root) but insufficient on its own; agents still need queryable runtime knowledge of props and tokens.
- **OpenAPI doc only** — rejected; MCP is the emerging standard for tool-augmented agents.

## References

- `libs/core/src/stories/resources/mcp.docs.mdx`
- `AGENTS.md`
- Slack: `#dss-pine-mcp`
