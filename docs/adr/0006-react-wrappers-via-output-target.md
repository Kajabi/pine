# 0006. Generate React wrappers via Stencil's output target

- **Status:** Accepted (retrospective)
- **Date:** 2026-07-13
- **Maintainers:** @Kajabi/dss-devs

## Context

Pine authors components as framework-agnostic Stencil web components (`pds-*`), but a large share of consumers are React apps. Consuming raw custom elements from React has real ergonomic gaps: events don't map to `on*` props, boolean/object props need manual marshalling, and there's no typed component surface.

## Decision

Generate typed **React wrappers** with `@stencil/react-output-target` (configured in `libs/core/stencil.config.ts`) and publish them as a separate package, **`@pine-ds/react`** (`libs/react/`), which depends on `@pine-ds/core` at a caret range (`^3.26.4`) and re-exports each component as an idiomatic React component with typed props and wired events.

## Consequences

**Positive**

- React consumers get a typed, idiomatic API — events as props, proper types — instead of raw custom-element interop.
- The wrappers are generated from the source components, so they can't drift from the core API by hand.

**Negative / accepted costs**

- A second published package to version and release in lockstep with core; the caret dep on `@pine-ds/core` has to stay coherent across releases.
- Wrapper output is generated — a stale build produces stale wrappers, so the React package must be rebuilt when core changes.
- Adds a React-specific surface to maintain alongside the framework-agnostic core.

## Alternatives considered

- **Consume raw custom elements in React** — rejected: poor ergonomics (events, refs, typing) push friction onto every consumer.
- **Hand-write React wrappers** — rejected: unbounded maintenance and guaranteed drift from the core API.

## References

- `libs/core/stencil.config.ts` (`reactOutputTarget(...)`)
- `libs/react/` (`@pine-ds/react` package)
