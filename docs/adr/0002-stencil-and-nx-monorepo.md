# 0002. Stencil.js components in an Nx monorepo

- **Status:** Accepted (retrospective)
- **Date:** 2026-05-15
- **Maintainers:** @Kajabi/dss-devs

## Context

Pine ships UI primitives that need to work in framework-agnostic contexts (legacy Kajabi Rails surfaces, marketing pages, third-party embeds) **and** in modern React apps. The repo also holds a React wrapper package (`libs/react/`), doc-components (`libs/doc-components/`), Figma Code Connect sources (`libs/figma/`), and Stencil build outputs under `libs/compositions/` — distinct deliverables that share workspace tooling, lint configuration, and release cadence.

## Decision

Component primitives are authored as **Stencil.js** web components (`libs/core/`). The repo is structured as an **Nx monorepo** so the published packages — **`@pine-ds/core`**, **`@pine-ds/react`**, and **`@pine-ds/doc-components`** — share cached `build`, `test`, and `lint` targets with dependency-graph awareness. `libs/figma/` is Code Connect source (wired via root `figma.config.json`, not an Nx project). `libs/compositions/` and `libs/compositions-react/` hold Stencil build artifacts, not versioned npm packages.

## Consequences

**Positive**

- One implementation of each component runs everywhere the browser does — no framework lock-in for consumers.
- Nx provides cached `build`, `test`, and `lint` targets on the published packages; CI is fast.
- React wrappers are generated from Stencil output, keeping API parity automatic.
- Per-package CHANGELOGs (`libs/core`, `libs/react`, `libs/doc-components`) document package-level changes; `nx release` versions them together on a shared semver.

**Negative / accepted costs**

- Stencil's runtime carries some overhead vs. hand-rolled web components or a pure React library.
- Shadow DOM styling requires CSS Shadow Parts / `::part()` for consumer overrides — a learning-curve item for non-Pine contributors.
- Nx orchestration adds a layer of abstraction over plain npm/yarn workspaces.
- Spec and e2e tests run through `@pine-ds/core` only; `react` and `doc-components` do not expose separate e2e targets.

## Alternatives considered

- **Plain React component library** — rejected because legacy Kajabi surfaces are not React-driven; we'd need to maintain a second implementation for them.
- **Lit + Rollup, no monorepo** — rejected because it would push the React wrapper, Figma mapping, and doc-components packages out of band; we'd lose shared tooling.
- **Pure CSS framework (Bootstrap-style)** — rejected because we need encapsulated, scriptable component behavior (accessibility wiring, focus management, controlled state).

## References

- `nx.json`, `package.json` (workspaces)
- `libs/core/stencil.config.ts`
- `libs/react/rollup.config.mjs`
