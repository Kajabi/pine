# 0010. Enforce the public API contract with API Extractor reports

- **Status:** Accepted
- **Date:** 2026-09-29
- **Deciders:** @Kajabi/dss-devs

## Context

[`VERSIONING.md`](../../VERSIONING.md) declares Pine's component API a public contract and
defines precisely which changes are breaking. Nothing enforced it. A prop rename, a
removed event, or a narrowed type union reached `@pine-ds/core` consumers
(kajabi-products, kajabi-communities, mobile) only if a reviewer happened to notice.

Two facts made that risk concrete:

1. Pine has a two-person maintainer team, so "a reviewer will catch it" is a thin control.
2. Stencil already commits its generated declarations at `libs/core/src/components.d.ts` —
   a ~300 KB file. Prop changes *do* appear in a PR diff today, but buried in generated
   noise, and nothing fails when one shows up.

The DSS engineering-health audit flagged this as the highest-leverage contract-control gap
(dim-1).

## Decision

Adopt **[API Extractor](https://api-extractor.com/)** to snapshot each published package's
public TypeScript surface into a committed **API report**, and fail CI when the surface
drifts from it:

- `libs/core/etc/core.api.md` — every component's props (`Components.*`), every `onPds*`
  event handler (`LocalJSX.*`), every exported event-detail and union type.
- `libs/react/etc/react.api.md` — the wrapper surface: which `Pds*` components are
  exported and each `forwardRef` signature.

`npm run api.check` (nx target `api.check`, wired into CI as the `api-check` job)
regenerates and compares; `npm run api.update` accepts an intentional change.
`VERSIONING.md` maps a report diff to a semver level, so a failure resolves to a release
decision rather than just a red check.

Two implementation details are worth recording because neither is obvious:

- **Core is analyzed from a staged copy of `dist/types`, not from it directly.** Stencil
  emits `export { LocalJSX as JSX };`, and API Extractor aborts with an internal error on
  an aliased namespace re-export. `libs/core/scripts/prepare-api-types.mjs` stages the
  declarations with that one line rewritten to `export { LocalJSX };`, which analyzes
  fine. The script asserts the line is present exactly once and fails loudly otherwise, so
  a future Stencil upgrade that changes the output shape cannot silently degrade the check.
  Consequence: the report names the namespace `LocalJSX` rather than `JSX`.
- **`@pine-ds/core` is deliberately not bundled into the React report.** The React
  wrappers are type aliases over core's `JSX.*` interfaces and carry no prop detail of
  their own. Inlining core would duplicate ~3k lines and make every core prop change
  produce two diffs to review.

## Consequences

**Positive**

- Removing or renaming a prop, event, method, or exported type, and narrowing a type
  union, now fail CI with a legible diff instead of shipping on reviewer attention.
- The report is a readable contract document. `core.api.md` is ~3.2k lines of flat prop
  declarations, versus ~300 KB of generated `components.d.ts` with mapped types.
- API changes become explicit in review: an intentional break shows up as a deliberate
  `etc/*.api.md` commit, which is exactly the artifact a reviewer should be looking at.

**Negative / accepted costs**

- Parts of the contract `VERSIONING.md` defines are **not** covered, because they are not
  TypeScript: named slots, public `--pds-*` custom properties, and prop default values.
  Those remain a review responsibility, and the gate's green check must not be read as
  "no breaking change."
- One more baseline to keep current. A legitimate API change now costs an extra
  `npm run api.update` and a committed report.
- The `prepare-api-types.mjs` shim is coupled to a quirk of Stencil's generated output and
  will need revisiting on a Stencil major.
- The reports are generated from a build, so `api.check` depends on `build` — the CI job
  pays a core build (nx cache permitting).
- Coverage stops at the two published, consumer-facing packages. `@pine-ds/doc-components`
  is published but is Storybook tooling rather than a consumer contract, and `libs/figma`
  has no build target at all; neither is gated.

## Alternatives considered

- **Reviewer vigilance plus `VERSIONING.md`** — the status quo; it is what the audit
  flagged, and it does not scale to a two-person team.
- **Diffing the committed `libs/core/src/components.d.ts` in CI** — needs no new
  dependency, but it cannot distinguish a breaking change from generated-output churn
  (Stencil rewrote every `IntrinsicElements` entry between 4.38 and 4.43), and the file is
  too noisy to review.
- **A hand-rolled `ts-morph` prop differ** — could classify breaking vs. additive
  automatically and understand slots, but means owning a bespoke TypeScript-AST tool. Not
  worth it before the standard snapshot-and-diff gate exists.
- **Snapshotting Stencil's `docs.json` instead** — it does cover slots and CSS custom
  properties, which is genuinely attractive. Rejected *for now* because it is a
  Stencil-specific format with no diff tooling; revisit it as a complement to close the
  slots and custom-property gap.

## References

- Linear [DSS-291](https://linear.app/kajabi/issue/DSS-291/pine-detect-breaking-changes-to-component-prop-interfaces-in-ci)
- [`VERSIONING.md`](../../VERSIONING.md) — "Automated enforcement — the API report"
- `libs/core/api-extractor.json`, `libs/react/api-extractor.json`
- `libs/core/scripts/prepare-api-types.mjs`
- `.github/workflows/actions/api-check/action.yml`
- ADR-0002 (Stencil in an Nx monorepo), ADR-0006 (React wrappers via output target)
