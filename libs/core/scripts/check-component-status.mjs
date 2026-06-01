/**
 * Component lifecycle-status manifest sync check.
 *
 * Guards `src/stories/resources/component-status.json` (the declared source of
 * truth for StatusBadge and the central Component status table) against
 * `src/components/`, so the two cannot silently drift:
 *
 *   - every top-level `pds-*` component must have a status entry, and
 *   - every status entry must map to a real `pds-*` directory (top-level or a
 *     documented subcomponent, e.g. `pds-filter`).
 *
 * Runs as `lint.status` so it is picked up by `run-p lint.*` and gated through
 * the existing `nx affected --target=lint` CI job — no workflow changes needed.
 *
 * Exits 0 when in sync, 1 (with an actionable report) otherwise.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CORE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = path.join(CORE_ROOT, 'src', 'components');
const MANIFEST_PATH = path.join(CORE_ROOT, 'src', 'stories', 'resources', 'component-status.json');
const MANIFEST_REL = path.relative(CORE_ROOT, MANIFEST_PATH);

/** Directory names under `src/components` matching `pds-*`. */
function pdsDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('pds-'))
    .map((entry) => entry.name);
}

/** Top-level components — these each require a status entry. */
function topLevelComponents() {
  return pdsDirs(COMPONENTS_DIR).sort();
}

/**
 * Every `pds-*` directory, including nested subcomponents. Used to validate
 * manifest entries so a deliberate subcomponent entry (e.g. `pds-filter`) is
 * accepted while a typo or removed component is not.
 */
function allComponentDirs() {
  const names = new Set();
  for (const top of topLevelComponents()) {
    names.add(top);
    for (const nested of pdsDirs(path.join(COMPONENTS_DIR, top))) {
      names.add(nested);
    }
  }
  return names;
}

function readManifestKeys() {
  let raw;
  try {
    raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  } catch {
    throw new Error(`Could not read manifest at ${MANIFEST_REL}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Manifest ${MANIFEST_REL} is not valid JSON: ${err.message}`);
  }
  if (!parsed.components || typeof parsed.components !== 'object') {
    throw new Error(`Manifest ${MANIFEST_REL} is missing a "components" object`);
  }
  return Object.keys(parsed.components);
}

function main() {
  let manifestKeys;
  try {
    manifestKeys = new Set(readManifestKeys());
  } catch (err) {
    console.error(`✖ component-status check failed: ${err.message}`);
    process.exit(1);
  }

  const dirs = allComponentDirs();
  const missing = topLevelComponents().filter((name) => !manifestKeys.has(name));
  const stale = [...manifestKeys].filter((name) => !dirs.has(name)).sort();

  if (missing.length === 0 && stale.length === 0) {
    console.log(`✔ component-status manifest is in sync (${manifestKeys.size} entries).`);
    return;
  }

  console.error(`✖ component-status manifest is out of sync with src/components.\n`);
  if (missing.length > 0) {
    console.error(`Components missing a status entry in ${MANIFEST_REL}:`);
    missing.forEach((name) => console.error(`  - ${name}`));
    console.error(`  → add each as { "status": "stable" | "beta" | "deprecated" }.\n`);
  }
  if (stale.length > 0) {
    console.error(`Status entries with no matching pds-* directory:`);
    stale.forEach((name) => console.error(`  - ${name}`));
    console.error(`  → remove the entry, or fix the component name.\n`);
  }
  process.exit(1);
}

main();
