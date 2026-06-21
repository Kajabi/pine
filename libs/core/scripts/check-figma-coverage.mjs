/**
 * Figma Code Connect coverage check.
 *
 * Guards that every top-level `pds-*` component is either:
 *   - mapped: has a `libs/figma/components/<name>.figma.ts`, or
 *   - explicitly waived: listed in `libs/figma/code-connect-waivers.json`.
 *
 * This stops a new component from silently shipping with no Code Connect
 * mapping and no deliberate decision. It also flags stale waivers (a waived
 * component that has since been mapped, or that no longer exists) so the
 * waiver list cannot rot.
 *
 * Runs as `lint.figma` via `run-p lint.*`, gated through the existing
 * `nx affected --target=lint` CI job. `@pine-ds/core` declares an implicit
 * dependency on `@pine-ds/figma` so figma-only PRs still schedule core lint,
 * and the core `lint` target inputs include waiver/mapping paths so Nx cache
 * invalidates when those files change.
 *
 * Exits 0 when coverage is accounted for, 1 (with an actionable report) otherwise.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CORE_ROOT, topLevelComponents } from './lib/components.mjs';

const FIGMA_ROOT = path.resolve(CORE_ROOT, '..', 'figma');
const FIGMA_COMPONENTS_DIR = path.join(FIGMA_ROOT, 'components');
const WAIVERS_PATH = path.join(FIGMA_ROOT, 'code-connect-waivers.json');
const WAIVERS_REL = path.relative(path.resolve(CORE_ROOT, '..', '..'), WAIVERS_PATH);

/** Component names with a `<name>.figma.ts` under libs/figma/components. */
function mappedComponents() {
  if (!fs.existsSync(FIGMA_COMPONENTS_DIR)) return new Set();
  const names = fs
    .readdirSync(FIGMA_COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.figma.ts'))
    .map((entry) => entry.name.replace(/\.figma\.ts$/, ''));
  return new Set(names);
}

function readWaivers() {
  let raw;
  try {
    raw = fs.readFileSync(WAIVERS_PATH, 'utf8');
  } catch {
    throw new Error(`Could not read waivers at ${WAIVERS_REL}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Waivers file ${WAIVERS_REL} is not valid JSON: ${err.message}`);
  }
  if (!parsed.waived || typeof parsed.waived !== 'object' || Array.isArray(parsed.waived)) {
    throw new Error(`Waivers file ${WAIVERS_REL} is missing a "waived" object`);
  }
  return new Set(Object.keys(parsed.waived));
}

function main() {
  let waived;
  try {
    waived = readWaivers();
  } catch (err) {
    console.error(`✖ figma-coverage check failed: ${err.message}`);
    process.exit(1);
  }

  const components = topLevelComponents();
  const mapped = mappedComponents();
  const componentSet = new Set(components);

  // A component with neither a mapping nor a waiver is an unaccounted gap.
  const uncovered = components.filter((name) => !mapped.has(name) && !waived.has(name));
  // A waiver for a component that is now mapped should be removed.
  const redundant = [...waived].filter((name) => mapped.has(name)).sort();
  // A waiver for a component that no longer exists is stale.
  const orphaned = [...waived].filter((name) => !componentSet.has(name)).sort();

  if (uncovered.length === 0 && redundant.length === 0 && orphaned.length === 0) {
    console.log(
      `✔ figma code connect coverage accounted for ` +
        `(${mapped.size} mapped, ${waived.size} waived, ${components.length} components).`,
    );
    return;
  }

  console.error(`✖ figma code connect coverage is unaccounted for.\n`);
  if (uncovered.length > 0) {
    console.error(`Components with no .figma.ts and no waiver:`);
    uncovered.forEach((name) => console.error(`  - ${name}`));
    console.error(
      `  → add libs/figma/components/<name>.figma.ts, ` +
        `or add an entry to ${WAIVERS_REL} with a reason.\n`,
    );
  }
  if (redundant.length > 0) {
    console.error(`Waivers for components that are already mapped (remove the waiver):`);
    redundant.forEach((name) => console.error(`  - ${name}`));
    console.error('');
  }
  if (orphaned.length > 0) {
    console.error(`Waivers for components that no longer exist (remove or rename):`);
    orphaned.forEach((name) => console.error(`  - ${name}`));
    console.error('');
  }
  process.exit(1);
}

main();
