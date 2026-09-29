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

## Automated enforcement — the API report

The TypeScript half of the contract above is enforced in CI, not left to reviewer
vigilance. [API Extractor](https://api-extractor.com/) snapshots each published
package's public surface into a checked-in **API report**:

| Package | Report |
| --- | --- |
| `@pine-ds/core` | [`libs/core/etc/core.api.md`](./libs/core/etc/core.api.md) |
| `@pine-ds/react` | [`libs/react/etc/react.api.md`](./libs/react/etc/react.api.md) |

`core.api.md` is the substantive one: it lists every component's props with their exact
types and optionality (the `Components.*` interfaces), every `onPds*` event handler
(the `LocalJSX.*` interfaces), and every exported event-detail and union type.
`react.api.md` covers the wrapper surface — which `Pds*` components `@pine-ds/react`
exports and each `forwardRef` signature.

The `api-check` CI job runs `npm run api.check`, which regenerates both reports and
**fails if either differs from the committed copy**. Check locally with the same command.

### When the check fails

A failure is not automatically a bug — it means the public API moved and a human has to
classify the move. Read the diff the job prints, then:

1. **Unintentional?** Fix the code. A prop you didn't mean to rename, a type you
   accidentally narrowed — that's the check doing its job.
2. **Intentional?** Update the baseline and commit it in the same PR:

   ```zsh
   npm run api.update
   ```

   The updated `libs/*/etc/*.api.md` is then part of the diff, so the API change is
   reviewed explicitly rather than buried in generated output.
3. **Size the release.** Map the diff to the levels above — this is the step that makes
   the check more than a red X:

   | Diff in the report | Version level |
   | --- | --- |
   | A prop / event / method / exported type **disappears** or is **renamed** | **MAJOR** — and it should have been deprecated first |
   | A type union **loses** a member, or an optional prop (`"x"?:`) becomes required (`"x":`) | **MAJOR** |
   | A new prop / event / method / exported type **appears** | MINOR |
   | A type union **gains** a member, or a required prop becomes optional | MINOR |
   | Report unchanged | PATCH as far as the TS contract goes |

   A MAJOR-level diff also needs a migration note (see below) and a `feat!` /
   `BREAKING CHANGE:` commit so Nx Release computes the right bump.

### What the report does not cover

The report is generated from TypeScript declarations, so parts of the contract that
aren't TypeScript stay a **review** responsibility:

- **Named slots** — not expressed in the generated types.
- **Public `--pds-*` custom properties** — CSS, invisible to the extractor.
- **Default-value changes** — Stencil's declarations carry the prop type, not the
  default, so flipping a default is still a MAJOR change the report won't flag.

Two mechanical notes: the report names the JSX namespace `LocalJSX` rather than `JSX`
(see `libs/core/scripts/prepare-api-types.mjs` for why), and it is generated from a
build, so run `npx nx run-many -t build` — or just use `npm run api.check`, which builds
first — before comparing.

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
- **Publish:** to npm through [trusted publishing](https://docs.npmjs.com/trusted-publishers)
  (a short-lived OIDC token from the workflow run, no stored npm token) with
  provenance; the version commit and tag are pushed by CI.
- **Changelog:** `CHANGELOG.md` is generated from commit history; migration notes
  for breaking changes should be reflected there.

## Consumer guidance

- Pin real ranges (`^3.x`), not `*`, so a release lands on your schedule.
- Read the changelog before a minor/major bump; watch for **[DEPRECATED]** markers
  in component docs and migrate ahead of the eventual major.
