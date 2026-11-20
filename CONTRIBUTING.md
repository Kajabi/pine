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

A component without a shadow root (`shadow: false`, `scoped: true`, or no `shadow` option) must declare which kind of light-DOM component it is with a `@lightDom` tag in the JSDoc above `@Component`. The tag is published in `docs.json` and the `components.d.ts` hover text, and a spec fails if it's missing.

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

### Docs as data (`docs-content.json`)

The core build also publishes the docs as data, for tools and AI agents that read them without parsing MDX. After `stencil build`, it parses every MDX page Storybook shows and writes `libs/core/dist/docs-content.json`, which ships in `@pine-ds/core` next to `docs.json`. That covers the component pages and the pages under `libs/core/src/stories/`. `dist/docs-content.d.ts` describes every field; its source is `libs/core/scripts/docs-content/docs-content.d.ts`.

Each page becomes an entry with its summary, its status and a tree of its sections. Each section has its heading, the anchor Storybook gives it, its own markdown and its `DocCanvas` examples. The conversion relies on the page conventions above, plus:

- Each `mdxSource` string is plain text, with no `${…}`.
- `DocCanvas`, `<Canvas>` and `<DocArgsTable>` sit at the top level of their section, not inside a list, quote or table.
- Doc tables are `<pds-table>` elements with `<pds-table-head>` and `<pds-table-body>`. They become markdown tables.
- Links to another page use its Storybook path (`/docs/<id>` or `?path=/docs/<id>`). They become `pine-doc:<id>` links.
- Headings are markdown headings, not JSX.

A component outside a `DocCanvas` that the converter doesn't know stays in the markdown as JSX, and the build prints a warning. Add a conversion for it in `libs/core/scripts/docs-content/extract.mjs` instead of leaving the warning.

Core's `npm test` checks the content against every page's sections, words, table cells, examples, code blocks and links. To run that check on its own:

```zsh
npm run test.docs-content --workspace @pine-ds/core
```

### Docs check

PR CI's `docs-check` job checks the examples, each component's JSDoc, and the links and section sizes of every docs page. Data comes from `dist/docs.json` and the installed `@pine-ds/icons`.

The code in every `DocCanvas` (`react` and `webComponent`) on component pages and guides:

- **unknown-component**: a `pds-*` tag that isn't in `docs.json`, or a React `Pds*` name that maps to no tag.
- **unknown-icon**: a literal `name` on `pds-icon` or `PdsIcon` that isn't in the icon set, or a React `icon={x}` whose `x` the snippet imports from `@pine-ds/icons/icons` but the package doesn't export.
- **unknown-attribute** (web component code only): an attribute on a `pds-*` element that is neither the component's nor a global attribute (`id`, `class`, `slot`, `aria-*`, `data-*`, `on*` and the rest of the HTML standard's list).
- **invalid-value**: a literal value for a prop whose type is a fixed set of strings, such as `variant`, that isn't in the set. Props that also take free text or CSS lengths aren't checked.

It doesn't check fenced code blocks in prose.

Each component's JSDoc, from `docs.json` and the component's `.tsx`:

- **missing-description**: a prop, event or method with no description. Deprecated members are skipped.
- **undocumented-slot**: a `<slot>` in the component's JSX with no `@slot` line. Document the default slot as `@slot (default) - …`.
- **undocumented-part**: a name in a JSX `part="…"` with no `@part` line.
- **wrong-default**: an `@defaultValue` or `@default` that contradicts the prop's default in code by naming another of the prop's fixed set of strings, another number, or the other of `true` and `false`. Quotes and whitespace don't count.

Only the component's own file is read. A slot name or part set with an expression, a template literal or a spread isn't checked. Neither is a default the check can't be sure of, such as `@defaultValue 'sm' (small)`, `MD` for `'md'`, a prop that takes any string, or a default in code that isn't a literal. A prop that states a default but sets none in code is listed for review, since its default often comes from CSS or a fallback.

Each docs page, through the docs-content extractor:

- **broken-anchor**: a link to `#slug`, on the same page or another MDX page, that matches no heading. Anchors come from the slugger Storybook uses, so the second "Border" heading is `#border-1`. The docs content follows in-page links only to headings, so a link to another element's `id` fails too: link to the heading above it.
- **broken-docs-link**: a `?path=/docs/<id>--docs` link whose id is neither an MDX page nor the docs page of a stories file. Links to a single story need Storybook's own index, so they aren't checked.
- **oversize-section**: a section over 8,000 characters, counting its heading and text in `docs-content.json` but not its subsections or example code. Agents read docs one section at a time, and the Pine MCP caps a response at 15,000 characters.

Links inside a `DocCanvas` are example code, so they aren't checked. Run it locally with:

```zsh
npm run docs.check
```

That builds core first. After a build, `npm run docs.check --workspace @pine-ds/core` runs only the check, which reads the MDX and component source as they are now.

Each finding gives the file and line, the rule, what's wrong and a fix. For an example, it also gives the example's heading:

```text
libs/core/src/components/pds-button/docs/pds-button.mdx:77  invalid-value  "Secondary" (React)
  <PdsButton variant="secondry">: pds-button accepts only "accent", "destructive", "disclosure", "filter", "primary", "secondary", "tertiary", "unstyled".
  Fix: Did you mean "secondary"?
```

For React code, the line is the element's own line. For web component code, it's the snippet's first line, so look for the quoted tag in that snippet. For JSDoc, it's the line of the prop, event, method, slot or part in the component's `.tsx`.

The report also lists what it couldn't decide under "Not checked" (React code with a syntax error, a slot name or part set with an expression, a default it can't be sure of, a story link) and what's worth a look under "For review". Neither fails the check. The command exits 0 when there are no findings, 1 when there are findings, and 2 when the check itself fails.

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
