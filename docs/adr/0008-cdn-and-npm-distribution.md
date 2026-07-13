# 0008. Dual distribution via npm and CDN with a lazy loader

- **Status:** Accepted (retrospective)
- **Date:** 2026-07-13
- **Maintainers:** @Kajabi/dss-devs

## Context

Pine's consumers split into two camps: bundler-based apps that `npm install`, and server-rendered / no-build surfaces (Rails views, marketing pages) that can only add a `<link>` and `<script>`. Both need the same components.

## Decision

Publish `@pine-ds/core` to **npm** and serve the same artifact over the **jsDelivr CDN**, and ship a **lazy loader** so components self-register on use. The package exposes multiple entry points (`main`, `module`, `unpkg`, `collection`, `loader`); CDN consumers drop in a pinned `<link>` + ESM `<script type="module">` + `nomodule` fallback:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/pine-core.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@pine-ds/core@[VERSION]/dist/pine-core/index.esm.js"></script>
```

This is the counterpart to the token side — see ds-tokens ADR-0004.

## Consequences

**Positive**

- No-build surfaces get full components with three tags; bundler apps get tree-shakeable npm imports.
- The lazy loader registers components on demand and the `nomodule` bundle covers older browsers.
- One published artifact backs both channels.

**Negative / accepted costs**

- CDN versions are pinned by hand, and **`@pine-ds/core` and `@kajabi-ui/styles` CDN versions must be kept in sync** — the consuming ERB literally carries a comment saying so. A stale CDN pin won't surface as a dependency warning (as it wouldn't for tokens — see ds-tokens ADR-0004).
- Multiple entry points (`main`/`module`/`unpkg`/`collection`/`loader`) to keep coherent across releases.
- Runtime styling on CDN surfaces depends on jsDelivr availability.

## Alternatives considered

- **npm-only** — rejected: excludes the no-build server-rendered surfaces that are a large part of consumption.
- **A single eager bundle** — rejected: loses lazy registration and the `nomodule` fallback.

## References

- `README.md` (CDN link + module + nomodule snippet)
- `libs/core/package.json` (`main`, `module`, `unpkg`, `collection`, loader entry points)
- kajabi-products `app/views/shared/_pine_assets.html.erb` (pinned CDN tags; core/styles sync comment)
- ds-tokens ADR-0004 (CDN distribution for tokens)
