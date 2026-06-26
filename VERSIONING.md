# Versioning & deprecation policy

Pine's published packages (`@pine-ds/core`, `@pine-ds/react`) are consumed by
kajabi-products and other apps that upgrade on their own schedule. The component
API is a **public contract**. This document defines what counts as a breaking
change, how we deprecate, and how releases are cut.

We follow [Semantic Versioning](https://semver.org/). For the token side of the
system, see the matching policy in the [`ds-tokens`](https://github.com/Kajabi/ds-tokens) repo.

## What is the public API?

The contract a consumer can rely on:

- **Component tags** (`pds-*`) and their existence.
- **Props, events, methods, and named slots** on each component.
- **Exported TypeScript types** (event detail interfaces, prop unions, etc.).
- **Public CSS custom properties** — the `--pds-*` host variables a component
  documents for theming/overrides.
- **The React wrappers** in `@pine-ds/react` (generated from core, so they track
  the same surface).

Not part of the contract: `_internal/` sub-components, `src/utils/` helpers,
generated files, and anything not exported or documented.

## What each version level means

### MAJOR — breaking, requires a migration note
- **Removing** a component, prop, event, method, or named slot.
- **Renaming** any of the above (remove + add — deprecate first; see below).
- **Changing a default** in a way that changes rendered behavior.
- **Changing or removing a documented `--pds-*` custom property** consumers style against.
- **Dropping a framework target** or changing package entry points/exports.

### MINOR — additive, backward compatible
- **Adding** a component, prop, event, method, or slot.
- Adding a new documented custom property or variant.

### PATCH — fixes & internals
- Bug fixes that don't change the API surface.
- Internal refactors, SCSS/visual fixes that don't alter documented behavior.
- Docs, tests, tooling.

When in doubt, size up. Shipping a breaking change as a minor is far more
expensive for consumers than an over-cautious major.

## Deprecation — prefer it over removal

This codifies the convention Pine already follows (see live examples below).
Don't remove or rename a public API in place. Instead:

1. **Mark it deprecated in JSDoc** on the `@Prop` / `@Event` / `@Method`, pointing
   to the replacement:
   ```ts
   /**
    * Determines whether the chip should be displayed in a larger size.
    * @deprecated Use `size` prop instead. Set `size="lg"` for the large variant.
    */
   @Prop() large = false;
   ```
2. **Keep it functional** — a deprecated prop must still work for the whole
   deprecation window so consumers can upgrade without breaking.
3. **Rebuild** (`npx nx run @pine-ds/core:build`) so the generated `readme.md` and
   types pick up the `@deprecated` tag. Stencil renders it as a
   **[DEPRECATED]** marker in the component's docs automatically — don't hand-edit
   generated files.
4. **Remove only in a subsequent major**, with a migration note.

Live examples of this pattern in the codebase:

| Component | Deprecated | Replacement |
| --- | --- | --- |
| `pds-chip` | `large` prop | `size="lg"` |
| `pds-button` | `icon` prop | `start` slot |
| `pds-link` | `external` prop | `target` prop |

## Migration notes

Every breaking change ships with a migration note (in the PR description, carried
into `CHANGELOG.md`) containing what was removed/renamed, the replacement, and a
before/after snippet:

```
### Breaking
- Removed deprecated `large` prop from `pds-chip`.
  Migrate: replace `<pds-chip large>` with `<pds-chip size="lg">`.
```

## How releases are cut

- **Trigger:** maintainers run the release workflow manually
  (`workflow_dispatch`) — releases are intentional, not automatic on merge.
- **Version:** Nx Release computes the bump from the Conventional Commits since the
  last release (`feat` → minor, `fix` → patch, `feat!`/`BREAKING CHANGE:` →
  major). Writing the right commit type is part of getting the version right.
- **Publish:** to npm with provenance (`NPM_CONFIG_PROVENANCE: true`); the version
  commit and tag are pushed by CI.
- **Changelog:** `CHANGELOG.md` is generated from commit history; migration notes
  for breaking changes should be reflected there.

## Consumer guidance

- Pin real ranges (`^3.x`), not `*`, so a release lands on your schedule.
- Read the changelog before a minor/major bump; watch for **[DEPRECATED]** markers
  in component docs and migrate ahead of the eventual major.
