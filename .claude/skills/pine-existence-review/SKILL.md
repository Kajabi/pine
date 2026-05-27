---
name: pine-existence-review
description: Existence/duplication review for Pine. Given a diff, flags new pds-* components, sub-components, tokens, and shared utilities that appear to duplicate something already in the library.
---

# Existence Review (Pine)

Review a diff for new artifacts that likely duplicate something already
in Pine. The goal is to ask "should this extend X instead?" — not to
block. Pine is a design system; duplication of UI atoms is particularly
costly because it creates competing sources of truth for consumers.

## When to Use

- As part of the gauntlet, automatically whenever the diff introduces
  new files under `libs/core/src/components/` (including `*.tokens.scss`),
  `libs/core/src/global/`, or `@kajabi-ui/styles` version bumps
- When reviewing a PR that adds new components, sub-components, tokens,
  or utility modules

## Scope — What to Check

Only inspect **newly introduced** artifacts. Renames, deletions, and
edits to existing files are out of scope.

| Artifact type | Conventional directory | New-file signal |
|---|---|---|
| Component | `libs/core/src/components/pds-<name>/` | New `pds-<name>.tsx` with `@Component({ tag: 'pds-<name>' })` |
| Sub-component | `libs/core/src/components/pds-<parent>/pds-<sub>/` | Nested `pds-<sub>.tsx` inside a parent component dir |
| Component tokens | `libs/core/src/components/pds-<name>/*.tokens.scss` | New `<name>.tokens.scss` file |
| Shared types | `libs/core/src/utils/types.ts` (and friends) | New exported type alias |
| Shared utilities | `libs/core/src/utils/`, mixin SCSS files | New `.ts` or `_*.scss` file |
| Design tokens (root) | `libs/core/src/global/styles/` or `@kajabi-ui/styles` (external package) | New global wiring or dependency bump |
| Figma Code Connect | `libs/core/src/components/pds-<name>/*.figma.ts` | New `*.figma.ts` (usually paired with a new component) |

**Out of scope:** spec files (`*.spec.tsx`), e2e tests (`*.e2e.ts`),
story files (`stories/`), generated files (`dist/`, `readme.md`,
`components.d.ts`), `.claude/` workflow files.

## Review Process

1. **Identify new files** —
   `git diff main...HEAD --diff-filter=A --name-only`
2. **Filter** to the directories above; ignore specs, stories, and
   generated files.
3. **Extract concrete names:**
   - Component tag (`pds-<name>`) from `@Component({ tag: '…' })`
   - Sub-component names from nested directories
   - Shared type aliases (`export type X = …`)
   - Token names from `*.tokens.scss` and shared token sources
4. **Grep for similar names** in the same conventional area:
   - Exact tag minus generic suffix (e.g. `pds-icon-button` → search
     for `button`, `icon`)
   - Semantic synonyms (`pds-pill` → check `pds-chip`, `pds-badge`,
     `pds-tag`)
   - Concept overlap (`pds-status-indicator` → check `pds-chip`,
     `pds-dot`, `pds-tag`)
5. **For each candidate**, read 20–40 lines of the existing file to
   confirm it does related work (avoid false positives from purely
   naming collisions).
6. **Output** the candidates as "should this extend X?" prompts with
   severity.

## Severity Guidance

### SHOULD FIX

- New component does essentially the same job as an existing one with
  a different tag (e.g. `pds-pill` overlapping `pds-chip`).
- New sub-component covers ground already served by a sibling
  sub-component or by a prop variant of the parent.
- New token whose value is identical to an existing token in the same
  category.
- New shared utility duplicates a function already in
  `libs/core/src/utils/`.

### CONSIDER

- Loose name similarity but different responsibilities.
- Existing component could be extended via a new prop / variant, but
  the extension might be a larger refactor than a separate component.
- New component that fills a legitimately distinct niche but is worth
  flagging so the maintainer confirms.

### Not flagged

- Renames or moves (caught by code review).
- Pure spec / story additions (parallel siblings to components are
  expected).
- Distinct family variants (`pds-icon-button` as a legitimate sub-API
  of `pds-button`, if that pattern is established).
- Sub-component creation that follows the
  `pds-parent/pds-sub/` nesting convention.

## Anti-Patterns in Reviewing

- Do NOT flag based on filename alone — confirm overlap by reading
  the existing file.
- Do NOT raise BLOCKER severity — existence checks are advisory.
- Do NOT re-survey the entire library on every run — work only from
  the diff.
- Do NOT search outside the Pine library directories.
- Do NOT grep the filesystem root — anchor searches via `Grep`,
  `Glob`, or `git grep`.
- Do NOT review spec / story files for duplication — they're parallel
  siblings to components, not separate components.

## Output Format

**Number items sequentially across all sections — do not restart
numbering in each section.** Section headers still show per-section
counts.

```
## Pine Existence Review

**New Artifacts Checked:** [count and list]
**Overall:** CLEAN | POSSIBLE DUPLICATION

### SHOULD FIX ([count])

#### 1. [New artifact] may duplicate [existing artifact]
- **New file:** `path/to/new_file.tsx:line`
- **Existing candidate:** `path/to/existing_file.tsx:line`
- **Overlap:** [specific behaviors / props / variants that look
  duplicated]
- **Recommendation:** Extend the existing component (or
  rename / generalize it) rather than introducing a second
  implementation. If the new component is a distinct concept, document
  the distinction in the JSDoc class comment.

### CONSIDER ([count])

#### 2. [New artifact] has loose overlap with [existing artifact]
- **New file:** `path/to/new_file.tsx:line`
- **Existing candidate:** `path/to/existing_file.tsx:line`
- **Note:** [why this might be worth discussing]

### Artifacts Checked, No Duplication Found
- `path/to/clean_artifact.tsx` — no similar implementations in
  `libs/core/src/components/`
```

## Example

New file: `libs/core/src/components/pds-pill/pds-pill.tsx`

Grep `libs/core/src/components/` for `pill`, `chip`, `badge`, `tag`:

- Finds `libs/core/src/components/pds-chip/pds-chip.tsx`
- Read pds-chip — sentiment-colored pill with optional dot/icon, three
  variants (text / tag / dropdown), Figma Code Connect already set up.
  Matches the pds-pill concept exactly.

Flag:

```
#### 1. pds-pill may duplicate pds-chip
- **New file:** libs/core/src/components/pds-pill/pds-pill.tsx:1
- **Existing candidate:** libs/core/src/components/pds-chip/pds-chip.tsx:1
- **Overlap:** Both render a rounded sentiment-colored container with
  optional indicator. pds-chip already supports text / tag / dropdown
  variants and a sentiment enum (accent, danger, info, neutral,
  success, warning, brand).
- **Recommendation:** Extend pds-chip with a new variant or size if a
  Pill aesthetic is needed. If Pill is genuinely distinct, document
  the distinction in JSDoc and update the design-system docs so
  consumers know when to choose which.
```
