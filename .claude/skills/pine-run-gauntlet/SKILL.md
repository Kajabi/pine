---
name: pine-run-gauntlet
description: Run parallel reviews of Pine design-system changes using specialized reviewer agents (code, security, design, existence). Launches reviewers simultaneously, then consolidates feedback by severity. Use before creating a PR against main.
---

# Run Gauntlet (Pine)

Launch multiple specialized reviewers in parallel against the current
changes in the Pine design system, then consolidate their feedback into a
single prioritized report.

Pine is a Stencil.js web component library orchestrated by Nx. Each
component sits in `libs/core/src/components/<pds-name>/` with its own
`*.tsx`, `*.scss`, `*.tokens.scss`, `*.figma.ts`, `stories/`, `docs/`,
`test/`, and an auto-generated `readme.md`. React wrappers are auto-
generated in `libs/react/`. The reviewer lineup is tuned for component
API quality, design-token discipline, accessibility, security in user-
content surfaces, and duplication.

## When to Use

- After implementing a component / prop / event / token change (before
  opening a PR)
- When asked to review changes thoroughly
- As part of the contribution workflow against `main`

## Reviewer Lineup

Mirrors the kajabi-products gauntlet (same level of rigor), adapted for a
Stencil component library.

| Reviewer | Agent | Focus | When to Include |
|---|---|---|---|
| Code reviewer | `pine-code-reviewer` | Stencil decorators (`@Component`, `@Prop`, `@Event`, `@Method`), TypeScript types, JSDoc consistency across components, lifecycle methods, spec + e2e test coverage, auto-generated file hygiene | Always when `*.tsx` / `*.ts` files change |
| Security reviewer | `pine-security-reviewer` | XSS via `innerHTML` / `dangerouslySetInnerHTML`, slot sanitization, URL-prop validation, event handler injection, secret leakage | Always when component code or stories change |
| Design reviewer | `pine-design-reviewer` | Token discipline (`*.tokens.scss` patterns, `:host` CSS custom properties), `:host-context([data-theme=dark])` dark-mode support, accessibility (keyboard, ARIA, focus, semantic HTML), Figma Code Connect alignment | Always when `*.scss`, `*.tokens.scss`, `*.figma.ts`, or any rendered markup changes |
| Existence reviewer | `pine-existence-reviewer` | Duplication: new component overlapping an existing one, new prop overlapping a sibling component's prop, new token aliasing an existing one | Only if the diff introduces new files under `libs/core/src/components/` (including `*.tokens.scss`), `libs/core/src/global/`, or bumps `@kajabi-ui/styles` |

Accessibility lives inside the design reviewer (matching the kp pattern)
rather than as a separate agent. Pine components are leaf-level UI, so a11y
is a first-class concern within design — but co-locating it with token /
visual review keeps the gauntlet lean.

## Execution

### Step 1: Identify Changes

Run `git diff origin/main...HEAD --name-only` to determine which files have
changed. Pine's base branch is `main`.

If working with staged changes pre-PR, fall back to
`git diff --staged --name-only`.

### Step 2: Determine Which Reviewers to Launch

Classify changed files:

- **Component code** (`libs/core/src/components/**/*.tsx`,
  `**/*.ts` excluding `*.spec.tsx`/`*.e2e.ts`) →
  code-reviewer + security-reviewer + design-reviewer
- **Component styles** (`libs/core/src/components/**/*.scss`,
  `**/*.tokens.scss`) → design-reviewer
- **Figma Code Connect** (`**/*.figma.ts`) →
  design-reviewer
- **Stories** (`libs/core/src/components/**/stories/*.tsx`,
  `**/stories/*.mdx`) → code-reviewer + security-reviewer + design-reviewer
- **Spec / e2e tests only** (`*.spec.tsx`, `*.e2e.ts`) → code-reviewer
- **Token sources** (`libs/core/src/global/styles/`, component
  `*.tokens.scss`, `package.json` / lockfile changes to
  `@kajabi-ui/styles`) → design-reviewer + existence-reviewer
- **React wrapper sources** (`libs/react/src/`) → code-reviewer
  (auto-generated wrappers are out of scope — see below)
- **Documentation only** (hand-authored: `docs/`, `**/*.mdx`,
  `libs/core/src/stories/**`, repo-root ADRs, `.claude/**/*.md`) → skip
  the gauntlet, manual review. This includes changes to the gauntlet's
  own skills and agents under `.claude/`. **Do not** treat auto-generated
  component `readme.md` as docs-only.
- **Auto-generated files** (component `readme.md` under
  `libs/core/src/components/**/`, `libs/core/src/components.d.ts`,
  `libs/core/dist/`, `libs/react/dist/`) → **never review and never edit
  by hand**; if any appear in the diff, launch code-reviewer. If the diff
  is **only** auto-generated artifacts with no matching `*.tsx` (or
  `*.scss` / `*.tokens.scss`) change in the same component directory,
  that's a red flag (stale regen or hand-edit).

Additionally, check whether the diff introduces any **new files** via
`git diff origin/main...HEAD --diff-filter=A --name-only` in:

- `libs/core/src/components/` — new components, sub-components, or
  `*.tokens.scss` files
- `libs/core/src/global/` — new global style / token wiring files
- Shared utility / mixin paths in `libs/core/src/utils/`

If yes, also launch `pine-existence-reviewer`. If the only new files are
specs, stories, or changelog entries, skip the existence reviewer.

### Step 3: Launch Reviewers in Parallel

Launch all applicable reviewers in a **single message** using the Agent tool:

```
Agent(subagent_type: "pine-code-reviewer"):
  "Review the current changes on this branch against Pine standards.
   Run git diff origin/main...HEAD to see all changes. Provide a structured
   review following the pine-review-code skill format."

Agent(subagent_type: "pine-security-reviewer"):
  "Run a security review on the current changes on this branch.
   Run git diff origin/main...HEAD. Check XSS via innerHTML, slot sanitization,
   URL-prop validation, event handler injection, and secrets.
   Follow the pine-security-review skill format."

Agent(subagent_type: "pine-design-reviewer"):
  "Review token, SCSS, .figma.ts, and accessibility-relevant changes on
   this branch. Run git diff origin/main...HEAD. Check token discipline, :host
   custom properties, dark-mode support, keyboard / ARIA / focus,
   semantic HTML, and Figma Code Connect alignment.
   Follow the pine-design-review skill format."

Agent(subagent_type: "pine-existence-reviewer"):
  "Run an existence/duplication review on new files introduced by this
   branch. Run git diff origin/main...HEAD --diff-filter=A --name-only to find
   them, then grep libs/core/src/components/ and libs/core/src/global/
   for similar existing implementations. Flag SHOULD FIX or CONSIDER
   only — never BLOCKER. Follow the pine-existence-review skill format."
```

### Step 4: Consolidate Reviews

After all reviewers complete, merge their feedback.

#### Priority Order

1. **BLOCKER** — Must fix. Raised by code, security, or design reviewers.
   The existence reviewer is advisory and never raises BLOCKER.
2. **SHOULD FIX** — Strongly recommended. From any reviewer.
3. **CONSIDER** — Optional improvements. From any reviewer.

#### Deduplication

If multiple reviewers flag the same issue:
- Keep the highest severity.
- Merge their descriptions.
- Note which reviewers flagged it.

#### Conflict Resolution

If reviewers disagree:
- Security concerns override style preferences.
- Accessibility concerns override visual preferences.
- Pattern compliance with existing Pine components overrides personal taste.
- Token discipline overrides "it looks fine without it."
- Flag genuine disagreements for user decision.

## Output Format

**Number items sequentially across all sections — do not restart
numbering in each section.** If BLOCKERS has 2 items (1–2) and SHOULD FIX
has 3 items, SHOULD FIX starts at 3. CONSIDER continues from there.
Section headers still show per-section counts.

```
## Pine Gauntlet Results

**Reviewers:** [which reviewers ran]
**Files Reviewed:** [list]
**Overall Assessment:** APPROVED | NEEDS CHANGES | BLOCKER

---

### BLOCKERS ([count])

#### 1. [Issue Title] (flagged by: [reviewer(s)])
- **File:** `path/to/file:line`
- **Issue:** [description]
- **Fix:** [specific action]

### SHOULD FIX ([count])

#### 2. [Issue Title] (flagged by: [reviewer(s)])
- **File:** `path/to/file:line`
- **Issue:** [description]
- **Fix:** [specific action]

### CONSIDER ([count])

#### 3. [Issue Title] (flagged by: [reviewer(s)])
- **File:** `path/to/file:line`
- **Suggestion:** [description]

### What's Good
- [Positive observations from reviewers]
```

## After the Gauntlet

### Apply the `ran-gauntlet` label (required)

Always add the `ran-gauntlet` label to the PR to signal to human reviewers
that automated multi-agent review has already run on this branch:

```bash
gh pr edit <PR#> --add-label ran-gauntlet
```

Apply the label unconditionally — including when the gauntlet short-circuits
to manual review for docs-only diffs. The signal is "the gauntlet step was
performed on this branch," not "N agents executed."

If no PR exists yet (common when running the gauntlet before PR creation),
add the label at PR creation time or immediately after the PR is opened.

**First-time setup:** If `gh pr edit … --add-label ran-gauntlet` returns
`'ran-gauntlet' not found`, the repo doesn't have the label yet. Create
it once:

```bash
gh label create ran-gauntlet \
  --description "Multi-agent review gauntlet has been run on this branch" \
  --color "0E8A16"
```

Then re-run the add-label command.

### Present results and offer options

1. **Fix blockers** — Address BLOCKER issues, optionally re-run gauntlet
2. **Fix all** — Address BLOCKER + SHOULD FIX items
3. **Proceed to PR** — Open PR against `main` with current state
4. **Discuss** — Talk through specific issues

**Max re-run cycles:** 2 (to prevent infinite loops)

## Pine specifics

- **Base branch is `main`** — all PRs target `main`.
- **Conventional commits required** — commitlint enforced via lefthook;
  do not skip hooks.
- **Branch name format:** `{type}/{description}` — accepted types are
  `chore`, `ci`, `docs`, `feat`, `fix`, `hotfix`, `perf`, `refactor`,
  `revert`, `style`, `test`. Do **not** include ticket / issue numbers
  in branch names or commit messages.
- **Commit scope = component name** — `feat(pds-table):`,
  `fix(pds-button):`, `style(pds-chip):`, `test(pds-input):`,
  `docs(pds-modal):`, `refactor(pds-form):`, `chore:` for tooling.
- **Two approved reviews required** before merging.
- **If branch is behind `main`, rebase before pushing** (`git rebase main`).
- **After modifying a component's `*.tsx`, rebuild** to regenerate
  `components.d.ts` and `readme.md`. Never hand-edit either.
- **Lefthook hooks are mandatory** — never use `--no-verify`.
