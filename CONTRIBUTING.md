# Contribution

The Pine Design System uses [Stencil.js](https://stenciljs.com/), which allows for building web components with TypeScript. This guide is written to outline how best to contribute to Pine and adhere to the best practices set by Kajabi's Design System team.

## Getting Started

### Dependencies

Pine requires Node `>=16`.

### Setting Up

[Fork and clone](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the Pine GitHub repository.

Please run the following commands for initial setup:

1. `cd pine`
2. `npm install`
3. `brew install mkcert`, if using Firefox run `brew install nss` instead
4. `mkcert -install`
5. `npm run setup`
6. `cd libs/core`
7. `mkcert -cert-file pineLocalDev.pem -key-file pineLocalDev-key.pem localhost 7300`
8. `cd ../..`

### Create a Branch

Once these steps have been completed and you're ready to code, create a new branch. We use the conventional branch naming convention. Branches that don't adhere to this style won't be able to be pushed, so be sure your branch begins with one of the accepted prefixes. For example, if you'd like to make any CSS changes to a component, you can create a branch similar to this:

```zsh
style/button-accent-update
```

### Generating New Components

To add new components, run the following command:

`npm run stencil.generate pds-[component name]`

When prompted, choose `*.scss Format`, then confirm. The initial component files will be generated. Once they are, you will need them to match other components. It may be best to copy any missing folders such as `stories/` and `docs/` from other components and update any imports or text to match.

### Starting the Dev Server

To spin up a local dev server and test your changes, run:

```zsh
npm run start
```

A local instance of Storybook will be served at `http://localhost:6006`.

### Coding Standards

Every component in Pine is well-tested. We ask that for any new features added to components that the corresponding documentation, end-to-end (E2E) tests, and spec tests are added for quality assurance.

We use prettier for linting and Stencil's built-in testing suite for testing TypeScript.

For linting, run:

```zsh
npm run lint.all
```

For spec and e2e testing, run:

```zsh
npm run test.all
```

### Bundle size budgets

PR CI enforces gzipped size budgets on core CDN bundles via `size-limit`. Build core, then check budgets locally:

```zsh
npx nx run @pine-ds/core:build
npm run size
```

When a budget fails, the CLI prints each tracked file with its gzipped size and limit.

### Public API reports

PR CI also enforces the published packages' public TypeScript surface against committed
[API Extractor](https://api-extractor.com/) reports (`libs/core/etc/core.api.md` and
`libs/react/etc/react.api.md`), so a renamed or removed prop, event, method, or exported
type fails the build instead of reaching consumers unnoticed. Check locally with:

```zsh
npm run api.check
```

If the change is intentional, refresh the baselines and commit them in the same PR:

```zsh
npm run api.update
```

A report diff is also a release-sizing signal — removals, renames, and narrowed type
unions are **major** changes. See [VERSIONING.md](./VERSIONING.md#automated-enforcement--the-api-report)
for the mapping and for what the reports deliberately don't cover (slots, `--pds-*`
custom properties, and prop defaults).

### Accessibility gate

Every Storybook story is rendered in headless Chromium and audited with
[axe-core](https://github.com/dequelabs/axe-core) against WCAG 2.1 AA. This runs
as the `test-a11y` job on every PR.

This is the *themed* half of Pine's accessibility testing. The other half is
component-level: `runAxe` in `libs/core/src/utils/test/axe.ts`, used from
`*.e2e.ts` specs, which runs under `npm run test.all`. That harness renders
without the global stylesheet, so it cannot judge `color-contrast` — the
Storybook gate can, and does.

Run it locally from `libs/core`:

```zsh
npm run build.stencil        # Storybook reads dist/docs.json
npm run build.storybook
npm run test.a11y
```

Or from the repo root, against an already-built Storybook: `npm run test.a11y`.

To audit a Storybook you already have running, skip the static build:

```zsh
npm run test.a11y -- --url http://localhost:6006
```

#### The baseline

Pine had pre-existing violations when the gate landed, so the gate is a ratchet,
not a cliff. `libs/core/.storybook/a11y-baseline.json` maps each story ID to the
axe rules that already failed for it. A violation whose rule is not recorded for
that story fails CI; everything in the baseline is tolerated.

The baseline is expected to shrink and **must never grow by hand**. When you fix
a violation the runner tells you the entry is stale — prune it with:

```zsh
npm run test.a11y -- --update-baseline
```

Regenerating is also the right move after adding stories to a component that
still has baselined violations. Review the diff: only removals, or additions for
genuinely new stories of an already-violating component, should appear. A new
rule appearing for an existing story means you introduced a regression.

#### Justified exceptions

When a story legitimately cannot satisfy a rule — it demonstrates the failure
case, or the rule does not apply to a fragment rendered out of context — disable
that one rule on that one story and say why:

```js
export const Default = {
  parameters: {
    a11y: {
      // pds-tooltip is positioned by Floating UI outside the story root, so
      // axe cannot resolve aria-describedby here. Covered by pds-tooltip.e2e.ts.
      config: { rules: [{ id: 'aria-valid-attr-value', enabled: false }] },
    },
  },
};
```

Skip a story entirely with `parameters: { a11y: { disable: true } }`. Prefer the
narrow per-rule form — a blanket `disable` also hides regressions in rules the
story does pass today. Both are reviewed like any other code change; "it was
noisy" is not a justification, and neither is silence.

### Visual regression (Chromatic)

Pull requests and pushes to `main` / `next` run [Chromatic](https://www.chromatic.com/) via [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml). The workflow publishes the static Storybook build from `libs/core/storybook-static`.

Repository maintainers must add a **`CHROMATIC_PROJECT_TOKEN`** secret (from the Chromatic project for this Storybook) so the job can authenticate. Forked pull requests skip Chromatic because secrets are not available to them.

### Releases

`Pine Continuous Deployment` ([`.github/workflows/schedule-release.yml`](.github/workflows/schedule-release.yml)) is triggered **manually** with `workflow_dispatch` (or by another workflow via `workflow_call`). There is no scheduled npm publish cron enabled in-repo yet; see the comment block at the top of that workflow when enabling a cadence.

### Submitting a Pull Request

Once the desired changes have been made, add and commit the necessary files. We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), so please be sure that your commit messages adhere to these standards.

First, ensure that the `main` branch is up to date.

```zsh
git checkout main
git pull upstream main
```

Then, rebase your branch against `main` and resolve conflicts.

```zsh
git checkout your/branch-name
git rebase main
```

The branch can now be pushed. When creating your pull request, please fill out the template with as much info as necessary, including before and after screenshots. Please tag `Kajabi/dss-devs` to notify the Design System team. Our standards require at least two accepted reviews before merging.

## Versioning & Deprecation

Pine's component API is a public contract. Before removing, renaming, or changing the default of a prop, event, method, slot, or documented `--pds-*` custom property, read [VERSIONING.md](./VERSIONING.md) — it defines what counts as a breaking change and how to deprecate (mark `@deprecated`, keep it working, remove only in a major with a migration note).

## Architecture Decisions

Significant, long-lived decisions are recorded as [Architecture Decision Records](./docs/adr/README.md) under `docs/adr/`. Read the index before proposing changes that reshape architecture, lock in conventions, or trade off something material — and add a new ADR in the same PR if your change qualifies.

## Troubleshooting

Sometimes, the development environment will experience rendering issues while hot reloading. In most cases, this can be fixed by re-running the `npm run start` command. For any cases where this doesn't resolve the issue, please feel free to reach out to the team for support.
