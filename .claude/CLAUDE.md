# Pine Design System — Claude Code Instructions

## Project Overview
- Stencil.js web component library orchestrated with Nx (monorepo)
- Core components live in `libs/core/src/components/`
- All components are prefixed with `pds-` (e.g., `pds-button`, `pds-table`)
- Each component may include: `*.tsx`, `*.scss`, `*.figma.ts`, `stories/`, `docs/`, `test/`, and auto-generated `readme.md`
- Composite components have nested subcomponent directories (e.g., `pds-table/pds-table-row/`)
- React wrappers are generated in `libs/react/`

## Git Conventions
- Commits, branches, and linting are enforced by lefthook hooks (commitlint, validate-branch-name, lint-staged) — do not skip hooks
- Branch names must follow: `{type}/{description}` — accepted types: `chore`, `ci`, `docs`, `feat`, `fix`, `hotfix`, `perf`, `refactor`, `revert`, `style`, `test`
- Do NOT include ticket or issue numbers in branch names or commit messages
- Commit scope should match the component name (e.g., `feat(pds-table):`, `fix(pds-button):`)
- Keep commit messages to a single line

### Commit type rules — use the correct type for the files being committed:
- `feat(component):` — new props, events, methods, or component behavior in `*.tsx`
- `fix(component):` — bug fixes in component code
- `test(component):` — test files (`*.spec.tsx`, `*.e2e.ts`)
- `docs(component):` — MDX docs, Storybook stories, and documentation updates
- `style(component):` — SCSS/CSS-only changes
- `refactor(component):` — code restructuring with no behavior change
- `chore:` — tooling, config, dependencies

## Pull Requests
- PR title must follow conventional commits format: `type(scope): description`
- Always use the repo PR template at `.github/pull_request_template.md` for the PR body
- If your branch is behind `main`, rebase before pushing: `git rebase main`
- Requires at least two approved reviews before merging
- See `CONTRIBUTING.md` for full contributor guidelines

## Testing
- Spec tests go in the component's `test/` folder (e.g., `pds-chip/test/pds-chip.spec.tsx`) using Stencil's `newSpecPage`
- E2E tests also in the component's `test/` folder using Stencil's `newE2EPage`
- Every new prop, event, or behavior needs corresponding test coverage

## Documentation
- JSDoc descriptions on `@Prop`, `@Event`, and `@Method` must use consistent terminology across components — review similar props/events on other components before writing new descriptions
- When adding a prop or event that exists in a similar form on another component, match the wording and phrasing of the existing description

## Build & Test (Nx)
- Build all: `npm run build.all` (`npx nx run-many --target=build`)
- Test all: `npm run test.all` (`npx nx run-many --target=test`)
- Lint all: `npm run lint.all` (`npx nx run-many --target=lint`)
- Target core only: `npx nx run @pine-ds/core:build`, `npx nx run @pine-ds/core:test`
- After modifying a component's `*.tsx`, rebuild to regenerate `components.d.ts` and `readme.md`
- Dev server: `npm run start` (Storybook at localhost:6006)
- Linting: ESLint (with `@stencil-community/recommended` + `@typescript-eslint`), Prettier, and Stylelint
- Generate a new component: `npm run stencil.generate pds-[component-name]` — choose `*.scss Format` when prompted, then copy `stories/` and `docs/` folders from an existing component

## Boundaries
- **Always:** follow existing component patterns, run lint and tests before committing, use conventional commits with component scope, match JSDoc terminology from similar components
- **Ask first:** adding new dependencies, creating files outside component directories, making breaking API changes (removing props/events), modifying CI/CD or build config
- **Never:** skip lefthook hooks, edit auto-generated files (`readme.md`, `components.d.ts`) manually, commit secrets or `.env` files, modify `node_modules/` or `dist/`
