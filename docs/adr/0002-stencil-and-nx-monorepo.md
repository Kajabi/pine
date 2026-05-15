# 0002. Stencil.js components in an Nx monorepo

- **Status:** Accepted
- **Date:** 2026-05-15
- **Deciders:** @Kajabi/dss-devs

## Context

Pine ships UI primitives that need to work in framework-agnostic contexts (legacy Kajabi Rails surfaces, marketing pages, third-party embeds) **and** in modern React apps. The repo also holds a React wrapper package, a Figma Code Connect package, a compositions package, and a doc-components package — distinct deliverables that share build tooling, lint configuration, and release cadence.

## Decision

Component primitives are authored as **Stencil.js** web components (`libs/core/`). The repo is structured as an **Nx monorepo** so that `core`, `react`, `compositions`, `compositions-react`, `doc-components`, and `figma` can be built, tested, linted, and released through a single shared toolchain with task caching and dependency-graph awareness.

## Consequences

**Positive**

- One implementation of each component runs everywhere the browser does — no framework lock-in for consumers.
- Nx provides cached `build`, `test`, `lint`, and `e2e` targets across packages; CI is fast.
- React wrappers are generated from Stencil output, keeping API parity automatic.
- Per-package CHANGELOGs and independent versioning let `react` ship without bumping `core` for cosmetic-only changes.

**Negative / accepted costs**

- Stencil's runtime carries some overhead vs. hand-rolled web components or a pure React library.
- Shadow DOM styling requires CSS Shadow Parts / `::part()` for consumer overrides — a learning-curve item for non-Pine contributors.
- Nx orchestration adds a layer of abstraction over plain npm/yarn workspaces.

## Alternatives considered

- **Plain React component library** — rejected because legacy Kajabi surfaces are not React-driven; we'd need to maintain a second implementation for them.
- **Lit + Rollup, no monorepo** — rejected because it would push the React wrapper, Figma mapping, and doc-components packages out of band; we'd lose shared tooling.
- **Pure CSS framework (Bootstrap-style)** — rejected because we need encapsulated, scriptable component behavior (accessibility wiring, focus management, controlled state).

## References

- `nx.json`, `package.json` (workspaces)
- `libs/core/stencil.config.ts`
- `libs/react/rollup.config.mjs`
