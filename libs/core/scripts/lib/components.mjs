/**
 * Shared component-enumeration helpers for the maturity lint checks
 * (`check-component-status.mjs`, `check-figma-coverage.mjs`).
 *
 * Single source for "what are the components" so the guards cannot diverge on
 * their globbing logic.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo `libs/core` root (this file lives at `libs/core/scripts/lib/`). */
export const CORE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const COMPONENTS_DIR = path.join(CORE_ROOT, 'src', 'components');

/** Directory names directly under `dir` matching `pds-*`. */
function pdsDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('pds-'))
    .map((entry) => entry.name);
}

/** Top-level components — the public surface that needs status + Figma coverage. */
export function topLevelComponents() {
  return pdsDirs(COMPONENTS_DIR).sort();
}

/**
 * Every `pds-*` directory, including nested subcomponents (e.g. `pds-filter`,
 * `pds-table-cell`). Used to accept deliberate subcomponent references while
 * rejecting typos or removed components.
 */
export function allComponentDirs() {
  const names = new Set();
  // Top-level pds-* components.
  for (const top of topLevelComponents()) {
    names.add(top);
  }
  // Nested pds-* subcomponents under ANY top-level directory — including
  // non-pds-* parents like `_internal/` (e.g. `_internal/pds-label`) — so a
  // deliberate subcomponent reference is not falsely rejected.
  for (const entry of fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const nested of pdsDirs(path.join(COMPONENTS_DIR, entry.name))) {
      names.add(nested);
    }
  }
  return names;
}
