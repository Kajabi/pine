# Figma Code Connect coverage

This file tracks which Pine `pds-*` components have a matching Code Connect file under `libs/figma/`. Update this list when you add or remove mappings.

## How mappings reach Figma

The `.figma.ts` files are published to Figma by the **Figma Code Connect** workflow (`.github/workflows/code-connect.yml`):

- **PRs** touching `libs/figma/**` or `figma.config.json` run `figma connect parse` — a local validation that every mapping compiles and resolves, no token, no publish.
- **Merges to `main`** (and manual dispatch) run `figma connect publish`, which requires the `FIGMA_ACCESS_TOKEN` secret (a Figma PAT with Code Connect write scope).

Before this workflow, publishing was a manual, undocumented local step — Dev Mode was only as fresh as the last person who remembered to run it.

## Mapped (Code Connect present)

| Pine component / pattern | Code Connect file |
| --- | --- |
| `pds-alert` | `components/pds-alert.figma.ts` |
| `pds-avatar` | `components/pds-avatar.figma.ts` |
| `pds-button` | `components/pds-button.figma.ts` |
| `pds-checkbox` | `components/pds-checkbox.figma.ts` |
| `pds-chip` | `components/pds-chip.figma.ts` |
| `pds-divider` | `components/pds-divider.figma.ts` |
| `pds-filter` (subcomponent of filters) | `components/pds-filter.figma.ts` |
| `pds-filters` | `components/pds-filters.figma.ts` |
| `pds-input` | `components/pds-input.figma.ts` |
| `pds-link` | `components/pds-link.figma.ts` |
| `pds-loader` | `components/pds-loader.figma.ts` |
| `pds-modal` | `components/pds-modal.figma.ts` |
| `pds-progress` | `components/pds-progress.figma.ts` |
| `pds-property` | `components/pds-property.figma.ts` |
| `pds-radio` | `components/pds-radio.figma.ts` |
| `pds-radio-group` | `components/pds-radio-group.figma.ts` |
| `pds-select` | `components/pds-select.figma.ts` |
| `pds-switch` | `components/pds-switch.figma.ts` |
| `pds-tabs` | `components/pds-tabs.figma.ts` |
| `pds-textarea` | `components/pds-textarea.figma.ts` |
| `pds-toast` | `components/pds-toast.figma.ts` |
| Pattern: list | `patterns/pds-list.figma.ts` |
| Pattern: page heading | `patterns/pds-page-heading.figma.ts` |

## Not yet mapped (no Code Connect file)

Use `figma.config.json` at the repo root (`documentUrlSubstitutions`) when adding a new `.figma.ts` so Figma URLs stay centralized.

| Pine component | Notes |
| --- | --- |
| `pds-accordion` | Add `components/pds-accordion.figma.ts` when the Figma node is ready. |
| `pds-combobox` | |
| `pds-container` | |
| `pds-copytext` | |
| `pds-dropdown-menu` | |
| `pds-icon` | Icon set lives in `@pine-ds/icons`; map if Figma documents a dedicated icon wrapper. |
| `pds-image` | |
| `pds-multiselect` | |
| `pds-popover` | |
| `pds-row` | Often used with `pds-box`; may share layout documentation. |
| `pds-sortable` | Figma substitutions exist for sortable list patterns; wire a `pds-sortable.figma.ts` when aligned. |
| `pds-table` | Composite; consider per-subcomponent mappings (row, cell, head) if needed. |
| `pds-tooltip` | |

## Primitives — not Code-Connectable (no component node)

`pds-box` and `pds-text` **cannot** take a `.figma.ts` file: Code Connect's `figma.connect()` attaches to a Figma **component node**, and neither exists as one in the Pine Figma file:

- **`pds-text`** — text is represented by **text styles** (`✳ Pine styles`: `typography/heading/1..6`, `typography/body`, `typography/body-sm`, …), not a "Text" component.
- **`pds-box`** — layout is **auto-layout + bound spacing/radius variables**, not a "Box"/"Stack"/"Container" component.

Their relationship to code is instead carried as a **style/variable → code map** in the `pine-figma` authoring skill (`skills/pine-figma/reference/primitives.md`): text-style → `pds-text` and auto-layout → `pds-box`. Do not open Code Connect files for these — there is no node to bind to.
