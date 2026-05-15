# Figma Code Connect coverage

This file tracks which Pine `pds-*` components have a matching Code Connect file under `libs/figma/`. Update this list when you add or remove mappings.

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
| `pds-box` | Layout primitive; may map to layout frames rather than a single component node. |
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
| `pds-text` | |
| `pds-tooltip` | |
