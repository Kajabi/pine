# Contribution

The Pine Design System uses [Stencil.js](https://stenciljs.com/), which allows for building web components with TypeScript. This guide covers setting up the repository, the checks a pull request must pass, and how changes are reviewed and released.

Pine is maintained by its contributors, with no assigned stewards. The `@Kajabi/dss-devs` code owners review pull requests (see [CODEOWNERS](.github/CODEOWNERS)), and there's no set response time for issues or reviews.

## Getting Started

### Dependencies

Pine uses Node 22 for development (see `.nvmrc`) and requires at least Node 20.

### Setting Up

[Fork and clone](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the Pine GitHub repository.

Please run the following commands for initial setup:

1. `cd pine`
2. `npm install`
3. `brew install mkcert` (Firefox users also run `brew install nss`)
4. `mkcert -install`
5. `cd libs/core`
6. `mkcert -cert-file pineLocalDev.pem -key-file pineLocalDev-key.pem localhost 7300`
7. `cd ../..`

### Create a Branch

Once these steps have been completed and you're ready to code, create a new branch. We use the conventional branch naming convention. Branches that don't adhere to this style won't be able to be pushed, so be sure your branch begins with one of the accepted prefixes. For example, if you'd like to make any CSS changes to a component, you can create a branch similar to this:

```zsh
style/button-accent-update
```

### Generating New Components

To add new components, run the following command:

`npm run stencil.generate pds-[component name]`

When prompted, choose `*.scss Format`, then confirm. The initial component files will be generated. Once they are, you will need them to match other components. It may be best to copy any missing folders such as `stories/` and `docs/` from other components and update any imports or text to match.

A component without a shadow root (`shadow: false`, or `scoped: true`) must declare which kind of light-DOM component it is with a `@lightDom` tag in the JSDoc above `@Component`. The tag is published in `docs.json` and the `components.d.ts` hover text, and a spec fails if it's missing.

- `@lightDom host-only`: `render()` only sets classes, styles or attributes on `<Host>`; it adds no elements.
- `@lightDom renders-markup`: `render()` wraps the slotted content in its own elements, which Stencil won't restore if code outside the component rewrites the light DOM.

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

### Writing component docs

Each component's page is `libs/core/src/components/<name>/docs/<name>.mdx`. Storybook renders it, and the [Pine MCP](https://pine-design-system.netlify.app/?path=/docs/resources-pine-mcp--docs) parses the same file to answer AI assistants, so its structure is a contract. Start from a page that already follows it, such as `pds-chip.mdx`, and keep this order:

1. `<StatusBadge component="pds-name" />`, with the component listed in `libs/core/src/stories/resources/component-status.json`.
2. `# Title`, then a one-paragraph summary. The MCP uses that first paragraph as the component's description.
3. `## Guidelines`, containing `### When to use`, `### When not to use` and `### Accessibility`, with exactly these names, in this order. The MCP matches them case-sensitively and drops any other `###` heading inside Guidelines, so give other guidance its own `##` section. Leave a blank line after `### Accessibility`: without one, the MCP leaves out the component's accessibility notes.
4. `## Properties`, with `<DocArgsTable>`.
5. `## Examples`, with one `###` heading per example.
6. `## Playground`, with a `<Canvas>` of the main story (for example `<Canvas of={stories.Default} />`), as the last section. The MCP ignores everything from this heading on.

Write each example as a `DocCanvas` with both sources, and the same markup as its live preview:

```mdx
<DocCanvas mdxSource={{
  react: `<PdsButton variant="primary">Save</PdsButton>`,
  webComponent: `<pds-button variant="primary">Save</pds-button>`
}}>
  <pds-button variant="primary">Save</pds-button>
</DocCanvas>
```

- The MCP serves the `react` and `webComponent` strings, not the preview. Each string ends at its first backtick, so never put a backtick inside one.
- Keep the `webComponent` snippet to markup, with no `<script>`. Use `Pds*` wrappers with camelCase props in the `react` snippet.
- Keep the wording consumer-neutral: describe Pine's behavior, not a particular app or framework that uses it.
- Everything below `<!-- Auto Generated Below -->` in `readme.md` is generated. To change a prop, event or method description there, edit the JSDoc in the `.tsx` and rebuild.

### Bundle size budgets

PR CI enforces gzipped size budgets on core CDN bundles via `size-limit`. Build core, then check budgets locally:

```zsh
npx nx run @pine-ds/core:build
npm run size
```

When a budget fails, the CLI prints each tracked file with its gzipped size and limit.

The per-component budgets are tight on purpose: one component growing past its budget is worth a look. The `All CDN component chunks` budget is the total of every component, so ordinary feature work grows it a little each time. It is set about 10% above the measured total, so that a new component or prop fits but a sudden jump (a dependency bundled by mistake, a chunk duplicated) fails. Don't raise it in a feature PR to make room. When the headroom drops under about 3%, re-measure on `main` and reset it to about 10% above the total in a separate `chore` PR.

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

### Truncated text

Text clipped with an ellipsis owes the reader a way to see the rest of it, which
`setupTruncationTooltip` (`libs/core/src/utils/truncation-tooltip.ts`) provides. The lint
workflow and the pre-push hook check that every selector that truncates (`text-overflow:
ellipsis` or a numeric `-webkit-line-clamp`) is in a component that calls it. Run it locally
with:

```zsh
npm run truncation.check
```

Pass `-- --ref <rev>` to check a revision without checking it out.

When it reports a selector as `MISSING`, call `setupTruncationTooltip` from that component, as
`pds-copytext` does. If a tooltip wouldn't help the reader, add the selector to `EXEMPT` in
`scripts/check-truncation-tooltip.mjs` with the reason, for review like any exemption. A stale
entry fails too: when a listed selector stops truncating, remove its entry.

### Accessibility gate

Every Storybook story is rendered in headless Chromium and audited with
[axe-core](https://github.com/dequelabs/axe-core) against WCAG 2.1 AA. This runs
as the `test-a11y` job on every PR.

This is the _themed_ half of Pine's accessibility testing. The other half is
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

For a quicker check, open the **Accessibility** tab in Storybook's bottom panel and
press **Run accessibility scan** to audit the story you're viewing. It scans on
demand, so it can't collide with the gate's own axe pass. Treat it as a fast
signal, not a preview of CI: it reports raw axe output, without the page-level
rules the gate disables (`landmark-one-main`, `page-has-heading-one`, `region`)
or the repeat sampling the gate uses to filter out flicker.

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

Pull requests and pushes to `main` / `next` run [Chromatic](https://www.chromatic.com/) via the `chromatic` job in [`.github/workflows/build.yml`](.github/workflows/build.yml). It consumes the Storybook build shared with the accessibility gate rather than building its own — see `build-storybook` in the same file.

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

The branch can now be pushed. When creating your pull request, please fill out the template with as much info as necessary, including before and after screenshots. Once the pull request is ready for review, GitHub requests a review from the `@Kajabi/dss-devs` code owners. Our standards require at least one accepted review before merging.

## Versioning & Deprecation

Pine's component API is a public contract. Before removing, renaming, or changing the default of a prop, event, method, slot, or documented `--pds-*` custom property, read [VERSIONING.md](./VERSIONING.md) — it defines what counts as a breaking change and how to deprecate (mark `@deprecated`, keep it working, remove only in a major with a migration note).

## Architecture Decisions

Significant, long-lived decisions are recorded as [Architecture Decision Records](./docs/adr/README.md) under `docs/adr/`. Read the index before proposing changes that reshape architecture, lock in conventions, or trade off something material — and add a new ADR in the same PR if your change qualifies.

## Troubleshooting

Sometimes, the development environment will experience rendering issues while hot reloading. In most cases, this can be fixed by re-running the `npm run start` command. If that doesn't resolve the issue, search the [existing issues](https://github.com/Kajabi/pine/issues) or [open a new one](https://github.com/Kajabi/pine/issues/new/choose).
