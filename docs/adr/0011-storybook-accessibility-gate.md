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
  already failed for it. Baselining is **per story *and* per rule**: a story
  tolerated for `role-img-alt` still fails on a new `select-name`.
- `libs/core/scripts/a11y.mjs` serves the static Storybook, drives the runner, and
  reports baseline entries that no longer reproduce so the baseline ratchets down.
- A new `test-a11y` composite action runs it, reusing `build-core`'s `dist`
  artifact the way `size-check` does.

The gate audits **all** stories rather than `nx affected`. A Storybook build is
needed either way, and a token or global-style change can break contrast in
stories that `affected` would not flag. The full run takes well under two minutes.

Two implementation details are load-bearing:

- **Pine's own axe run, not the addon's.** Storybook 10's `addon-a11y` runs axe
  itself, and two axe instances on one page throw "Axe is already running." The
  addon's automated check is therefore set to `test: 'off'` in `preview.js` (the
  panel is untouched). Its native baseline — marking a story `test: 'todo'` — is
  per story, not per rule, and would scatter the baseline across 17 story files.
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
- Storybook must be built in CI (roughly a minute) and Playwright Chromium
  downloaded. New job, new wall-clock on every PR.
- Intersecting three axe samples will miss a violation that appears in fewer than
  three — the deliberate price of a gate people will not learn to ignore.
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
- `libs/core/src/utils/test/axe.ts` (component-level counterpart)
- CONTRIBUTING.md § Accessibility gate
- Linear DSS-290
