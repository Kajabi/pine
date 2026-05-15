# Architecture Decision Records

This directory records significant decisions made about the Pine Design System — *why* the codebase looks the way it does, not just *what* it does.

## Why ADRs?

Several long-lived choices in Pine (externalized token package, custom lint plugins, MCP delivery, dark-mode strategy) are not obvious from reading the code. Without a record, the same decisions get re-litigated whenever a new contributor or stakeholder asks "why?".

## Format

We use a lightweight [MADR](https://adr.github.io/madr/) variant. Each ADR is a single short Markdown file capturing:

1. **Context** — what problem or pressure prompted the decision
2. **Decision** — what we chose
3. **Consequences** — what we accept by choosing it (good and bad)
4. **Alternatives considered** — what we rejected and why

See [`0000-template.md`](./0000-template.md).

## Index

| # | Title | Status |
| --- | --- | --- |
| [0001](./0001-externalized-token-package.md) | Externalize design tokens to `@kajabi-ui/styles` | Accepted |
| [0002](./0002-stencil-and-nx-monorepo.md) | Stencil.js components in an Nx monorepo | Accepted |
| [0003](./0003-pine-custom-lint-plugins.md) | Custom Pine lint plugins enforce semantic-token usage | Accepted |
| [0004](./0004-mcp-server-delivery.md) | Ship a Pine MCP server for AI tooling | Accepted |
| [0005](./0005-dark-mode-via-semantic-tokens.md) | Roll out dark mode via semantic-token migration | Accepted |

## When to write a new ADR

Write one when a change:

- Reshapes architecture (new package, new platform target, new build system)
- Locks in a long-lived convention (lint rule, naming pattern, theming strategy)
- Trades off something material (perf vs. ergonomics, ownership vs. autonomy)
- Will be expensive to reverse later

Smaller code-level decisions belong in commit messages and PR descriptions, not here.

## Process

1. Copy `0000-template.md` to `NNNN-short-kebab-title.md` (next available number).
2. Draft in the same PR that implements the decision (or in a separate "Proposed" PR if you want discussion first).
3. Add the row to the Index above.
4. Mark as **Accepted** when the PR merges. Use **Superseded by ADR-NNNN** when a later ADR replaces it; keep the old file for the record.
