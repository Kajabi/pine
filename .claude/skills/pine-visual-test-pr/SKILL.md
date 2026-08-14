---
name: pine-visual-test-pr
description: Self-iterating visual test harness for Pine PRs. Builds Stencil + serves Storybook, maps changed pds-* components to their stories, captures Playwright screenshots across light/dark themes, viewports, and interactive states, self-evaluates each against the embedded rules, rejects and retries failures, and posts a markdown report as a PR comment. Optional before/after baseline diff for modified components.
argument-hint: "[PR number — auto-detects from current branch if omitted]"
---

# Visual Test PR (Pine)

Automated visual testing for Pine design-system pull requests. Pine ships
leaf-level web components consumed by every Kajabi app, so a visual
regression here propagates everywhere — and the most common one is a
dark-mode / token break that never shows in a light-theme review.

This skill builds Stencil, serves Storybook, discovers the stories for the
components the PR touched, captures Playwright screenshots across **theme
(light/dark)**, viewport, and interactive state, evaluates each against the
rules below, and loops until every shot passes or a structural blocker
requires human input. As of today this is the **only** pixel-level regression
check Pine has: `@chromatic-com/storybook` is installed as a local Storybook
panel, but the Chromatic **CI** job is not merged (it lives on an open PR). So
a clean result here is currently the whole pixel-level signal — weigh it
accordingly. Once Chromatic CI lands, this stays useful as the fast, local,
agent-evaluated pass you run before pushing and before that job.

## When to Use

- After changing any `libs/core/src/components/pds-*/**` file (`.tsx`, `.scss`/`.tokens.scss`, `.stories.*`)
- As a complement to `pine-design-review` (token/a11y code review) and `pine-run-gauntlet`
- Before requesting human review, to pre-validate rendered output in both themes
- To sanity-check a change locally before pushing (and, once the Chromatic CI job lands, without waiting for it)

**Not the right tool when:** the PR only touches docs (`*.mdx`), build config, or non-component TypeScript with no rendered surface — there is nothing to screenshot. Say so and stop.

## Prerequisites

- Playwright MCP configured in this Claude Code session
- Node deps installed at the Pine repo root (`node_modules/` present)
- `gh` CLI authenticated
- Able to run `libs/core` scripts (`build.stencil`, `start.storybook`)

## Progress Tracking

At the start of Phase 0, create tasks for all phases:

```
TaskCreate: "Phase 0: Environment preflight"
TaskCreate: "Phase 1: PR resolution + component scope"
TaskCreate: "Phase 2: Storybook up + story index"
TaskCreate: "Phase 3: Capture plan"
TaskCreate: "Phase 4: Baseline decision"
TaskCreate: "Phase 5: Screenshot capture + evaluation loop"
TaskCreate: "Phase 6: Report"
```

Mark each `in_progress` when started, `completed` when done.

### Pivoting Away (Early Exit)

If the skill is abandoned mid-run (user redirects, structural blocker, or the PR has no visual surface), clean up the task list before stopping:

1. Mark the current `in_progress` task `completed` (or `deleted` if no meaningful work was done)
2. Mark all remaining `pending` tasks `deleted`

Do this immediately when a pivot is decided — before switching to any other work — so stale `in_progress` tasks don't persist across sessions.

---

## Phase 0 — Environment Preflight

Run all checks from the Pine repo root before touching anything. If **any** check fails, print the exact fix command and stop — do not continue to Phase 1.

```bash
# 1. gh CLI authenticated
gh auth status

# 2. Repo root has deps installed
ls node_modules >/dev/null && echo "root deps OK"

# 3. libs/core scripts present
node -e "const s=require('./libs/core/package.json').scripts; ['build.stencil','start.storybook'].forEach(k=>{if(!s[k]){console.error('missing script '+k);process.exit(1)}}); console.log('core scripts OK')"

# 4. Node version matches
cat .nvmrc
```

Also verify Playwright MCP is reachable by calling `mcp__playwright__browser_snapshot` — if it throws a tool-not-found or connection error, the MCP is down.

| Check | Failure Symptom | Fix |
|---|---|---|
| `gh auth status` | "not logged in" | `gh auth login` |
| `node_modules` | "No such file or directory" | `npm install` at repo root |
| core scripts | "missing script" | Confirm you're in the Pine repo; scripts live in `libs/core/package.json` |
| Playwright MCP | Tool error / connection refused | Re-open Claude Code — MCP connection dropped |

**Do not proceed until all checks pass.**

---

## Phase 1 — PR Resolution + Component Scope

1. **Resolve the PR number into `<number>` and thread it through every `gh` call below.** A bare `gh pr diff` / `gh pr view` resolves against the *current branch's* PR — so if the skill is invoked with an explicit number while checked out on a different branch (exactly what the `argument-hint` promotes), an un-numbered call silently scopes the wrong PR. Always pass `<number>` explicitly.
   - **If a PR number argument was provided:** use it as `<number>`.
   - **Otherwise:** auto-detect from the current branch and read the number back out:
     ```bash
     gh pr view --json number,url,title,headRefName,baseRefName,body   # <number> = .number
     ```
2. **Verify you're on the PR's head branch — capture renders the checked-out tree, not the number.** Phase 2 builds `dist/` from whatever is currently checked out, so threading `<number>` only fixes *scope* (step 1); an explicit number from a **different** branch would compute the right file list but screenshot the wrong code. Compare, and stop on mismatch — do not auto-switch (branch changes are the user's call):
   ```bash
   test "$(git branch --show-current)" = "$(gh pr view <number> --repo Kajabi/pine --json headRefName --jq .headRefName)" \
     && echo 'on PR branch' || echo 'MISMATCH — check out the PR head branch first'
   ```
   On mismatch, stop and tell the user to `git checkout <headRef>` (and pull) before re-running — do **not** proceed to capture.
3. **Get changed files** (always numbered):
   ```bash
   gh pr diff <number> --name-only
   ```
4. **Determine component scope.** Reduce the diff to the set of changed components:
   ```bash
   gh pr diff <number> --name-only | grep -oE 'libs/core/src/components/[^/]+' | sort -u
   ```
   Each entry is a component directory (e.g. `pds-button`, `pds-alert`). This is the scope — the skill only screenshots stories for these components (plus their child components, e.g. `pds-tabs` → `pds-tab`, `pds-tabpanel`).
5. **Classify each changed file** to predict the visual risk (drives the capture plan):
   | Changed file | Visual risk | Emphasis |
   |---|---|---|
   | `*.tokens.scss` / `*.scss` | color, spacing, dark-mode | **both themes**, all variants |
   | `*.tsx` | markup/DOM, slots, states | interactive states, variant coverage |
   | `*.stories.*` | the story itself changed | capture the new/changed stories |
   | shared token/global SCSS | broad | widen scope — may affect many components |

**If no PR found:** stop and tell the user to create one first.
**If the diff touches no `libs/core/src/components/**` files** and no shared token/global styles: there is no component visual surface — say so and stop (this PR is out of scope for the skill).

---

## Phase 2 — Storybook Up + Story Index

Pine's visual surface is Storybook. Stories render compiled components from `dist/`, so Stencil must be built **before** Storybook starts. **Never guess story IDs — always read them from `/index.json`.**

1. **Build Stencil** (produces/refreshes `libs/core/dist/`):
   ```bash
   ( cd libs/core && npm run build.stencil )
   ```
2. **Start Storybook** on port 6006 as a background process (it stays up for the whole run):
   ```bash
   ( cd libs/core && npm run start.storybook )   # run_in_background: true
   ```
3. **Health check** — poll until the story index is served (up to ~60s; Storybook's first Vite optimize pass is slow):
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:6006/index.json
   ```
   Retry until `200`. If it never comes up, read the background process output for the failure (common: port 6006 already taken → a server **for this same branch** is fine to reuse, but one left over from another branch is **not** — stop it with `lsof -ti:6006 | xargs kill` and start fresh, or you'll screenshot the wrong bundle; or a Stencil build error → fix and rebuild).
4. **Fetch the story index** and keep it — this is the authoritative story list (the Pine analog of `worktree-server list`):
   ```bash
   curl -s http://localhost:6006/index.json > /tmp/pine-stories.json
   # entries is a map keyed by story id; keep only real stories (not docs)
   node -e "const e=require('/tmp/pine-stories.json').entries; Object.values(e).filter(x=>x.type==='story').forEach(x=>console.log(x.id+'\t'+x.title+'\t'+x.name))"
   ```

Store `http://localhost:6006` as `$SB` for all subsequent phases.

### Resolving changed components → story IDs

Story IDs are `slug(title)` + `--` + `slug(exportName)` (e.g. title `components/Button`, story `Primary` → `components-button--primary`). The directory name (`pds-button`) is **not** the title — so map through the story file, don't assume:

1. For each changed component dir, read its story file's `title:` field:
   ```bash
   grep -h "title:" libs/core/src/components/<component>/**/stories/*.stories.* 
   ```
2. Match that title against the index by **exact equality** on the title (or an exact nested-path prefix like `components/Tabs` → also `components/Tabs/Tab`, `components/Tabs/Tabpanel`). Do **not** use a loose substring match — `includes('tab')` wrongly pulls in `components/Table` and `components/Sortable`. Every entry whose title equals (or is nested under) a scoped title is a story to capture.

```bash
# exact + nested-path match for a set of scoped titles
node -e "const e=require('/tmp/pine-stories.json').entries; const t=process.argv.slice(1);
Object.values(e).filter(x=>x.type==='story' && t.some(p=>x.title===p||x.title.startsWith(p+'/')))
 .forEach(x=>console.log(x.id))" 'components/Tabs'
```

---

## Phase 3 — Capture Plan

Build the explicit shot list **before** opening a browser, and output it so the user can see coverage.

### Axes

For every in-scope story, the capture matrix is:

- **Theme (required, both):** `light` and `dark`. This is Pine's highest-value axis — dark-mode token regressions are the most common Pine visual bug. Never skip dark.
- **Viewport:** `desktop` (1280×800) for every story. Add `mobile` (375×812) only for components with responsive layout behavior (e.g. `pds-nav`, `pds-modal`, `pds-tabs` overflow, `pds-filters`, `pds-table`). Document which components you flagged responsive and why.
- **Interactive states** (desktop only, only for the states the component actually has, and only when the changed files could affect them):
  - `hover`, `focus` (keyboard focus ring), `active`/`pressed`
  - `disabled` (usually already a dedicated story — prefer the story over synthesizing)
  - `error`/`invalid` for form components (`pds-input`, `pds-select`, `pds-textarea`, `pds-radio`, `pds-checkbox`, `pds-combobox`, `pds-multiselect`)
  - `open`/expanded for overlay components (`pds-modal`, `pds-dropdown-menu`, `pds-tooltip`, `pds-accordion`, `pds-combobox`)

> **RTL is intentionally out of scope for now.** Storybook does expose a `direction` global (`.storybook/preview.js` defines the `withDirection` decorator), but this skill does not yet plumb it through the Phase 5 loop or add a mirroring rule to evaluate it against. Rather than ship a half-wired axis, RTL is omitted; add it as a full axis (loop + URL param + rule) in a later iteration if needed.

### Variant coverage

Pine encodes variants as separate stories (e.g. Button → Primary, Secondary, Destructive, IconOnly, Loading, Sizes…). Capture **every** story for a changed component rather than one representative — variant-specific token regressions are exactly what this catches. If a component has many stories and the change is narrowly scoped (single `.tsx` branch), you may capture the directly-affected variants plus the default; state the reduction explicitly in the plan.

### Story render URL

Capture from the chrome-free iframe endpoint (no Storybook toolbar/sidebar in frame):

```
$SB/iframe.html?id=<storyId>&viewMode=story&globals=theme:dark
$SB/iframe.html?id=<storyId>&viewMode=story&globals=theme:light
```

### Output location (absolute path — important)

The Playwright MCP browser runs in its **own** working directory, which is often **not** your shell's cwd (in practice it may be a parent folder). A relative `filename` silently lands the PNG outside the repo. Always pass an **absolute** path into a per-run directory, and create it first:

```bash
mkdir -p "$(pwd)/.claude/visual-test-reports/pr-<number>"
```
```
mcp__playwright__browser_take_screenshot({
  filename: "<repo-abs-path>/.claude/visual-test-reports/pr-<number>/<name>.png"
})
```
After the first capture, confirm the file exists at that absolute path before continuing — if it's missing, the MCP wrote it relative to its own cwd; fix the path, don't keep shooting into the void.

### Naming convention

```
<component>__<story>__<viewport>__<theme>[__<state>].png
# e.g. button__primary__desktop__dark.png
#      button__primary__desktop__light__hover.png
#      modal__default__mobile__dark__open.png
```

**Output the full capture plan as a checklist.** Do not proceed without a complete plan.

---

## Phase 4 — Baseline Decision (before/after)

Decide, per component, whether to also capture a **baseline** (the component as it renders on the PR's base branch) for a before/after comparison.

- **Modified existing component** (component existed on base) → baseline recommended. A screenshot alone can't tell an intended restyle from a regression; the before/after can.
- **Brand-new component / new story** → no baseline (nothing to compare); validate against the rules only.
- **Token-only or SCSS-only diffs** → baseline strongly recommended (this is the highest-risk, easiest-to-miss category).

If capturing baselines, note that it requires rebuilding Stencil on the base branch — do it in one batch after the PR-branch capture (Phase 5b), not interleaved. If the working tree is dirty or the user is mid-task, ask before switching branches.

Skipping baselines is always acceptable — say so in the report and rely on the rules-based evaluation. (Once Chromatic CI lands it will be the authoritative pixel-diff; until then this baseline mode is the closest thing to one, so prefer running it on token/SCSS diffs.)

---

## Phase 5 — Screenshot Capture + Evaluation Loop

Core loop. Run until every item in the capture plan has a passing screenshot or is classified as a structural blocker.

### For each item (storyId × theme × viewport × state):

**Step 1 — Navigate** to the chrome-free iframe:
```
mcp__playwright__browser_navigate({ url: "$SB/iframe.html?id=<storyId>&viewMode=story&globals=theme:<theme>" })
```

**Step 2 — Set viewport, then wait for render:**
```
mcp__playwright__browser_resize({ width: 1280, height: 800 })          # or 375×812 for mobile
mcp__playwright__browser_wait_for({ selector: "<pds-component>" })     # the custom element tag
mcp__playwright__browser_wait_for({ timeout: 500 })                    # let fonts/tokens settle
```
Confirm the custom element actually upgraded (has a shadow root / rendered content) — a bare unstyled tag means `dist/` wasn't loaded (see Rule 2 retry).

**Step 3 — Capture both themes, reading the console after *each* navigation.** Run this block for `theme:light`, then `theme:dark`. Read the console **immediately after each navigation** — Playwright MCP's per-navigation read (`all` omitted) only reports errors since the last `navigate`, so a single read at the end of the story would miss the earlier theme entirely:
```
# for THEME in light, dark:
mcp__playwright__browser_navigate({ url: "$SB/iframe.html?id=<storyId>&viewMode=story&globals=theme:<THEME>" })
mcp__playwright__browser_resize({ width: 1280, height: 800 })       # 375×812 for flagged responsive
mcp__playwright__browser_wait_for({ selector: "<pds-component>" })
mcp__playwright__browser_wait_for({ timeout: 500 })
mcp__playwright__browser_take_screenshot({ filename: "<REPORT_DIR>/<component>__<story>__desktop__<THEME>.png" })
mcp__playwright__browser_console_messages({ level: "error" })       # per-navigation; judge per Step 5
```
`<REPORT_DIR>` is the **absolute** per-run directory from Phase 3 (`<repo-abs>/.claude/visual-test-reports/pr-<number>`). Never pass a bare relative filename — the MCP browser's cwd is not your shell's, so a relative name lands the PNG outside the repo (see "Output location" in Phase 3).

**Step 4 — Capture interactive states** (desktop, per the plan; capture per theme where the state is theme-sensitive, e.g. the focus ring). Read the console again after interacting, still per-navigation:
```
mcp__playwright__browser_hover({ selector: "<interactive part>" })
mcp__playwright__browser_take_screenshot({ filename: "<REPORT_DIR>/<component>__<story>__desktop__<theme>__hover.png" })

# keyboard focus (focus ring is a frequent dark-mode regression)
mcp__playwright__browser_press_key({ key: "Tab" })
mcp__playwright__browser_take_screenshot({ filename: "<REPORT_DIR>/<component>__<story>__desktop__<theme>__focus.png" })

# open/expanded overlays
mcp__playwright__browser_click({ selector: "<trigger>" })
mcp__playwright__browser_take_screenshot({ filename: "<REPORT_DIR>/<component>__<story>__desktop__<theme>__open.png" })

mcp__playwright__browser_console_messages({ level: "error" })       # after interaction, still per-navigation
```

**Step 5 — Judge the console reads.** The per-navigation reads from Steps 3–4 are what you judge — **never pass `all: true`**: it returns the whole session and, after any Storybook restart, floods with stale `ERR_CONNECTION_REFUSED` (the dead server) and `NoStoryMatchError` (a tab pointed at a story the new index lacks), none of which are findings. **Filter harness noise before judging** — a `favicon.ico` (or other static-asset) 404 and Vite HMR chatter are expected and are **not** findings. A message fails Rule 4 only when it originates from the component bundle (stack/URL includes `pine-core/*.js`) or the story itself — e.g. a Stencil render/hydration error, a missing-token throw, or a thrown event listener. Those are real findings: capture the full message text into the report.

**Step 6 — Evaluate every screenshot against the rules below.**

### Visual Test Rules (Pine)

| # | Rule | Check |
|---|---|---|
| 1 | Component renders | Not blank; the custom element upgraded and shows its expected content/shape |
| 2 | Assets loaded | Styles applied (not raw unstyled DOM), icons/fonts present — a flash-of-unstyled tag means `dist/` didn't load |
| 3 | Both themes correct | Light **and** dark both render; no invisible text, no unthemed white box on dark, contrast holds |
| 4 | No console errors | No **component-origin** `error`-level output (stack/URL points at `pine-core/*.js` or the story). Ignore harness noise: `favicon.ico` and other static-asset 404s, and Vite HMR chatter — these are not findings |
| 5 | Focus visible | Keyboard focus produces a visible focus ring in both themes (Pine a11y requirement) |
| 6 | Correct viewport | Frame matches 1280×800 (or 375×812 for flagged responsive components) |
| 7 | No clipping | Overlays (modal/tooltip/dropdown) fully visible, not cut by the iframe; no truncated content |
| 8 | Token discipline | No obviously hard-coded/off-palette color vs the rest of the set (pairs with `pine-design-review`) |
| 9 | Naming convention | `<component>__<story>__<viewport>__<theme>[__<state>].png` |
| 10 | Variant coverage | Every in-scope story captured (or documented reduction) |

**If all applicable rules pass:** add to the approved set; move on.

**If a rule fails — retry by rule:**

| Rule failed | Retry action |
|---|---|
| 1/2 — blank or unstyled | Verify `libs/core/dist/` exists and is fresh; rebuild `npm run build.stencil`; hard-reload the iframe; re-capture |
| 3 — theme broken | Re-check the `globals=theme:` value in the URL; confirm `data-theme` on `<html>`; if genuinely broken in one theme, that's a **real finding** — record it, don't retry away |
| 4 — console error | Capture the message text into the report; if it's a real runtime error it's a finding, not a flake |
| 5 — no focus ring | Ensure you Tabbed into the element (not just navigated); re-capture; if still absent it's a real a11y finding |
| 6 — wrong viewport | Resize to the correct dimensions, re-capture |
| 7 — clipped overlay | Grow the viewport height or scroll the overlay into view, re-capture |
| 9 — naming | Rename the file — no re-capture needed |

**Max 3 retries per item.** After 3 failures on the same item, classify it as a **structural blocker**, record the reason, and continue. Never stop the loop. Distinguish a *harness* blocker (couldn't capture) from a *real finding* (captured fine, but the render is wrong) — real findings are the point of the skill and belong in the report as issues, not blockers.

### Phase 5b — Baseline capture (if elected in Phase 4)

After all PR-branch shots are approved:

1. Record the current branch (you'll return to it in step 6).
2. **Reset the two build-generated files first** — a prior `build.stencil` leaves `libs/core/src/components.d.ts` and `libs/react/src/components/react-component-lib/createComponent.tsx` dirty, and a branch switch **aborts** ("would be overwritten") while they are:
   ```bash
   git checkout -- libs/core/src/components.d.ts libs/react/src/components/react-component-lib/createComponent.tsx
   ```
   ⚠️ `createComponent.tsx` is **not** purely generated: it carries a hand-authored double-registration guard the stock `@stencil/react-output-target` template lacks, and `build.stencil` strips it back to the vendor version. `git checkout --` is the right move *because* it restores the **committed** (guarded) copy — never resolve this by deleting the file, keeping the built version, or `git add`-ing the stripped one.
3. **Only now check for genuine WIP.** If `git status` still shows unrelated changes, `git stash` them and restore after — never discard the user's work. Doing the step-2 reset **first** is what stops the stash from snapshotting the vendor-stripped `createComponent.tsx` — otherwise a later `git stash pop` would silently reintroduce the guard-less version.
4. **Stop the running Storybook first, then** `git checkout <baseRef>` → `( cd libs/core && npm run build.stencil )` → start Storybook again. You must stop first — nothing else frees port 6006, and a second `start.storybook` either errors (address in use) or the health check falls through to Phase 2's "reuse the existing server", which would screenshot the **wrong branch's** bundle (the `NoStoryMatchError` trap):
   ```bash
   lsof -ti:6006 | xargs kill 2>/dev/null      # or KillShell the Phase 2 background task
   ```
5. Re-capture the **same** story×theme×viewport matrix into `*__baseline.png` filenames (same absolute `<REPORT_DIR>`). Note that **stories new in the PR won't exist on base** — compare only shared stories (e.g. `--default`); a new story with no baseline is validated against the rules alone.
6. Stop Storybook again, re-run step 2's reset, `git checkout <headRef>`, rebuild Stencil, **then run step 2's reset once more** — the rebuild re-strips `createComponent.tsx`'s authored guard, so without this final reset you'd leave the tree with a real fix silently reverted. Now confirm the tree is clean of **skill-induced** changes (the two generated files match committed). **Restore any step-3 stash last** — that re-dirties the tree with the user's own WIP, which is expected and is **not** a failure of this clean check.
7. For each pair, compare before/after and note: **intended** (matches the PR's stated change) vs **regression** (unexpected delta, esp. in a theme/variant the PR didn't claim to touch). A console error present on a new story but absent from the shared `--default` on both branches is **PR-introduced and scoped to that story** — the highest-signal verdict this mode produces.

### Loop termination

- **Continue** while unchecked plan items remain.
- **Exit** when every item is approved, a real finding, or a structural blocker.
- **Never** loop indefinitely — track attempts per item.

---

## Phase 6 — Report

Write the filled-in report to a file, then post it **once**.

**Screenshots can't be auto-attached.** `gh` cannot upload images or video to a PR comment — GitHub only accepts them via drag-drop in the browser. So the posted comment is a **text** report (scope, findings, verdict) that references the local screenshot filenames; the PNGs stay in `<REPORT_DIR>` for the user to drag in if they want them inline. Do **not** write `![](local-path)` — local files won't render on GitHub.

1. **Write the report to a file** — the post step reads it back, so it must exist on disk; don't just print the template:
   ```bash
   REPORT=".claude/visual-test-reports/pr-<number>-visual-test.md"
   mkdir -p "$(dirname "$REPORT")"
   ```
   Fill the template below and write it to `$REPORT` with the **Write tool**.

2. **Dedup guard — do not double-post.** This skill is built to be re-run (Phase 5 retry loop, Phase 5b baseline), so re-posting is the normal case, not the edge case. Before posting, check for a prior run's comment and **skip unless the user explicitly asks to post again** (mirrors the guard `pine-run-gauntlet` added after #746):
   ```bash
   gh pr view <number> --repo Kajabi/pine --json comments \
     --jq '.comments[].body' | grep -q "Posted by pine-visual-test-pr" && echo "already posted — skip or edit the existing comment"
   ```
   If found, tell the user in-chat and stop (or edit the existing comment) rather than adding another.

### Report template

```markdown
# Visual Test Report — Pine PR #<number>

**PR:** [<title>](<url>)
**Branch:** <headRef> → <baseRef>
**Storybook:** http://localhost:6006 (local)
**Tested:** <date>
**Result:** PASS (<N>/<N>) | PARTIAL (<N>/<M> — see findings/blockers) | BLOCKED

## Components in scope
- <component> — <n stories> — <light+dark | +mobile>

## Approved Screenshots

### <Component> — <Story>
**Light** [<file>__light.png]   **Dark** [<file>__dark.png]
**States** [<file>__hover.png] [<file>__focus.png] [<file>__open.png]
<!-- if baseline captured -->
**Before/After (dark):** [<file>__dark__baseline.png] → [<file>__dark.png] — <intended|regression>

## Findings (real visual/a11y issues)
### <Component> — <Story> — <theme/state>
- **Rule:** <e.g. 3 both-themes / 5 focus-visible / 4 console-error>
- **Observed:** <what's wrong>
- **Screenshot:** [<file>]

## Structural Blockers
### <Item>
- **Rule:** <n> — **Attempts:** 3 — **Observed:** <…> — **Needs:** <human action>

## Rules Applied
- [x] Component renders  - [x] Assets loaded  - [x] Both themes  - [x] No console errors
- [x] Focus visible  - [x] Viewport  - [x] No clipping  - [x] Token discipline
- [x] Naming  - [x] Variant coverage

---
_Posted by pine-visual-test-pr_
```

The `_Posted by pine-visual-test-pr_` footer is the marker the Step 2 dedup guard greps for — keep it in the template.

3. **Post from the file** — never a double-quoted `--body "$(cat …)"` (report bodies contain backticks, quotes, and `$`-sequences the shell would re-evaluate); always pass `--repo` so it targets Pine even when run from another checkout:
```bash
gh pr comment <number> --repo Kajabi/pine --body-file "$REPORT"
```

---

## Completion

```markdown
## Visual Test Complete: Pine PR #<number>

### Result
- Approved: N screenshots across <k> components (light + dark)
- Real findings: F  (see PR comment)
- Structural blockers: M

### PR Comment
<url>
```

If there are real findings, tell the user which components/themes regressed before they request review. If clean, note it's pre-validated locally — and that, until Chromatic CI lands, this is currently Pine's only pixel-level check, so treat it as the main signal rather than a secondary one.

---

## Error Handling

| Phase | Failure | Recovery |
|---|---|---|
| 0 | Playwright MCP unreachable | Print fix, stop — no browser ops |
| 0 | `gh` not authenticated | `gh auth login`, stop |
| 0 | root deps missing | `npm install` at root, stop |
| 2 | Stencil build fails | Surface the Stencil error, fix/rebuild — Storybook renders nothing without `dist/` |
| 2 | Storybook never serves `/index.json` | Read background output; port 6006 taken by a server for **this same branch** → reuse; after a branch switch (5b) never reuse — `lsof -ti:6006 \| xargs kill` first, then start fresh; else stop with the error |
| 2 | Title→id mapping empty | Component may have no stories — note it; nothing to capture for that component |
| 5 | Blank/unstyled render | Rebuild Stencil, hard-reload; 3x → structural blocker |
| 5b | Dirty tree at branch switch | Ask before `git checkout`; never discard the user's work |

## Anti-Patterns

- Do NOT guess story IDs — always read them from `/index.json`.
- Do NOT skip dark theme — it's the single highest-value axis for Pine.
- Do NOT `start.storybook` without a fresh `build.stencil` — you'll screenshot stale/absent components.
- Do NOT retry away a genuine theme/focus/console problem — that's a **finding**, the whole point; record it.
- Do NOT loop indefinitely — 3 retries per item, then blocker.
- Do NOT include blank/unstyled or error screenshots in the approved set.
- Do NOT switch branches for a baseline without confirming a clean tree.
- Do NOT `git add` the vendor-stripped `createComponent.tsx` after a build — restore the committed (guarded) copy with `git checkout --`.
- Do NOT describe Chromatic CI as an existing gate — only the local Storybook panel is merged today; hedge to "once Chromatic CI lands".

## Related Skills

- `pine-design-review` — token / SCSS / a11y / Figma code review (pair with this; it reads code, this reads pixels)
- `pine-run-gauntlet` — parallel multi-reviewer pass before a PR (code/security/design/existence)
- `pine-existence-review` — checks whether a component/API already exists before adding new
- Chromatic — `@chromatic-com/storybook` is installed as a local Storybook panel; the Chromatic **CI** pixel-diff job is not merged yet. Until it lands, this skill is Pine's only pixel-level regression check; after it lands, this is the fast local complement.
