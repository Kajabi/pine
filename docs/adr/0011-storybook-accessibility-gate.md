# 0011. Gate accessibility in CI against a story-level baseline

- **Status:** Accepted
- **Date:** 2026-09-29
- **Deciders:** @Kajabi/dss-devs

## Context

Pine already ran axe-core at the component level: `runAxe` in
`libs/core/src/utils/test/axe.ts`, called from 30 of 36 components' `*.e2e.ts`
specs and executed by `nx affected --target=test`. Two gaps remained.

First, that harness is Stencil's bare E2E page. It renders without the global
stylesheet and with fonts that may not load, so `color-contrast` computes
against incidental colors and flakes run to run. The helper disables the rule
outright, with a comment deferring contrast to "a themed context (Storybook)."
Nothing then checked contrast anywhere, despite Pine claiming WCAG 2.1 AA.

Second, coverage was opt-in. `nx affected --target=test` only runs the tests that
exist; a component shipped without an axe assertion passed silently, and six
components (`pds-combobox`, `pds-container`, `pds-icon`, `pds-multiselect`,
`pds-row`, `_internal`) had none.

`@storybook/addon-a11y` was installed and surfaced an Accessibility panel, but a
panel is not a gate — it fails nothing.

Auditing the whole library at once found **71 story/rule violations across 55 of
252 stories**, dominated by `role-img-alt` (41) and `color-contrast` (20). Failing
CI on all of them from day one would have blocked every PR.

## Decision

Run **axe-core against every Storybook story in headless Chromium on each PR**,
via `@storybook/test-runner`, and fail only on violations absent from a checked-in
baseline.

- The audit lives in `libs/core/.storybook/a11y-hooks.js`.
- `libs/core/.storybook/a11y-baseline.json` maps story ID → the axe rule IDs that
  already failed for it. Baselining is **per story _and_ per rule**: a story
  tolerated for `role-img-alt` still fails on a new `select-name`.
- `libs/core/scripts/a11y.mjs` serves the static Storybook, drives the runner, and
  reports baseline entries that no longer reproduce so the baseline ratchets down.
- A new `test-a11y` composite action runs it against the static Storybook that
  the `build-storybook` job builds and uploads. Chromatic consumes that same
  artifact, so Storybook is built once per run rather than once per consumer.

The gate audits **all** stories rather than `nx affected`. A Storybook build is
needed either way, and a token or global-style change can break contrast in
stories that `affected` would not flag. The full run takes well under two minutes.

Two implementation details are load-bearing:

- **Pine's own axe run, not the addon's.** Storybook 10's `addon-a11y` runs axe
  itself after each story renders, and two axe instances on one page throw "Axe
  is already running." That automatic run is therefore suppressed in `preview.js`
  with `initialGlobals.a11y.manual = true`. The addon skips it when _either_ that
  global is set or `parameters.a11y.test` is `'off'`, but `'off'` additionally
  replaces the Accessibility panel with a "tests are disabled" placeholder,
  taking the on-demand scan away from developers; the `manual` global keeps the
  panel working and costs nothing. The addon's native baseline — marking a story
  `test: 'todo'` — is per story, not per rule, and would scatter the baseline
  across 17 story files.
- **Settle before auditing.** Stencil renders through an async task queue, so
  stories are not painted when Playwright calls the page loaded. The audit waits
  for every `pds-*` element (shadow roots included) to carry Stencil's `hydrated`
  class, then samples axe three times and keeps only rules present in **all**
  samples. Without this the gate failed on noise roughly every other run.

## Consequences

**Positive**

- New accessibility regressions fail CI instead of relying on reviewer attention.
- `color-contrast` is measured for the first time, in the only harness where the
  result means anything.
- Coverage no longer depends on someone remembering to write an axe assertion —
  every story a component ships is audited, including the six components that had
  no axe coverage at all.
- The baseline is one reviewable file. Its diff is the burndown report.

**Negative / accepted costs**

- 71 known violations ship tolerated. The gate stops regressions; it does not fix
  the backlog, and nothing yet forces the backlog to shrink on a schedule.
- The gate downloads Playwright Chromium and runs the audit on every PR. It no
  longer builds Storybook itself: the `build-storybook` job does that once and
  Chromatic consumes the same artifact, so the build is shared rather than
  charged to this gate.
- The gate runs on one Node version (22, matching `.nvmrc`) rather than the full
  `NODE_VERSIONS` matrix. axe's verdict is a function of the rendered DOM and
  Chromium, not of the Node that ran Vite, and `build-core` still covers the
  matrix — so no accessibility signal is lost. What is given up is narrower:
  "does `storybook build` succeed on every supported Node" is no longer covered
  here. 22 is not a free choice — `@storybook/test-runner` and `playwright` both
  declare `node >= 20`, so the older `NODE_VERSIONS` entries cannot run this gate
  at all.
- Intersecting three axe samples will miss a violation that appears in fewer than
  three — the deliberate price of a gate people will not learn to ignore.
- Baseline entries are per story and rule, not per element. A story already
  tolerated for `color-contrast` absorbs a _second_, unrelated contrast failure
  inside that same story. Node-level entries are the obvious next tightening,
  and are more tractable once the current 71 are burnt down.
- `@storybook/test-runner` cannot auto-load `.storybook/test-runner.js` here:
  Storybook 10's loader calls `module.register()`, which Jest 30 rejects. The
  hooks are wired in through `test-runner-jest.config.js`, the runner's own eject
  hatch. A Storybook upgrade may let us delete that indirection.
- A story added to an already-violating component needs a baseline regeneration,
  which is a strictly manual review step.

## Alternatives considered

- **`@storybook/addon-a11y` alone** — rejected: it renders a panel and fails
  nothing. It was already installed, which is precisely why the gap persisted.
- **The addon's `a11y: { test: 'error' }` with `'todo'` as the baseline** — rejected:
  `'todo'` is per story, not per rule, so a baselined story would swallow new
  violations of other rules, and the baseline would live in 17 story files
  instead of one.
- **Extending `runAxe` E2E coverage to the six uncovered components** — rejected as
  the primary answer: it closes a coverage gap but adds no gate, leaves contrast
  unmeasured, and keeps coverage opt-in for component 37.
- **`jest-axe` in Stencil spec tests** — rejected: spec tests run on Stencil's
  mock-doc, which has neither real layout nor computed styles, so axe can check
  almost nothing that matters.
- **`@storybook/addon-vitest` (browser mode)** — rejected for now: it requires
  Storybook ≥ 10.6.1 plus a Vitest browser and Playwright provider stack. Worth
  revisiting when Pine next bumps Storybook.
- **Hard-failing the whole library immediately** — rejected: 71 violations across 20
  components is not a reviewable PR, and a gate that cannot be merged gates nothing.

## References

- `libs/core/.storybook/a11y-hooks.js`
- `libs/core/.storybook/a11y-baseline.json`
- `libs/core/scripts/a11y.mjs`
- `.github/workflows/actions/test-a11y/action.yml`
- `.github/workflows/actions/build-storybook/action.yml` (the shared build)
- `.github/workflows/actions/chromatic/action.yml` (the other consumer — the
  standalone `chromatic.yml` workflow was folded into `build.yml`, since
  artifacts are scoped to a single workflow run)
- `.github/workflows/build.yml` (`build-storybook` → `test-a11y` / `chromatic`)
- `libs/core/src/utils/test/axe.ts` (component-level counterpart)
- CONTRIBUTING.md § Accessibility gate
- Linear DSS-290, DSS-294 (sharing the Storybook build with Chromatic)
