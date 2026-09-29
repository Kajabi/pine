/**
 * Stages the Stencil-generated declarations into `temp/api-types/` for API Extractor.
 *
 * Why this exists
 * ---------------
 * `dist/types/components.d.ts` ends with:
 *
 *     declare namespace LocalJSX { ... }
 *     export { LocalJSX as JSX };
 *
 * API Extractor cannot analyze an *aliased* re-export of a namespace and aborts with
 * "Internal Error: Unable to analyze the export \"JSX\"". Re-exporting the same
 * namespace under its own name is analyzed fine, so we stage a copy of the
 * declarations with that single line rewritten. The namespace therefore appears in
 * the API report as `LocalJSX` rather than `JSX` — the members (every component's
 * props and `onPds*` event handlers) are identical, which is what the report diffs.
 *
 * Nothing under `dist/` is modified; Stencil's output is left untouched.
 */
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = resolve(packageRoot, 'dist/types');
const stagingDir = resolve(packageRoot, 'temp/api-types');

const ALIASED_EXPORT = 'export { LocalJSX as JSX };';
const PLAIN_EXPORT = 'export { LocalJSX };';

const fail = (message) => {
  console.error(`\nprepare-api-types: ${message}\n`);
  process.exit(1);
};

await rm(stagingDir, { force: true, recursive: true });

/**
 * Stencil mirrors the *absolute* checkout path into `dist/types/` for the few declarations it
 * emits from outside `src` (e.g. `.stencil/scripts/…`). That mirrored subtree is rooted at the
 * first segment of the absolute package path, so it is `dist/types/Users/…` on macOS but
 * `dist/types/home/…` on the Linux CI runner — derive the segment rather than hardcoding one,
 * or the filter silently does nothing in the environment that actually gates merges.
 *
 * Match the directory exactly, too: a substring test would also drop a legitimately named
 * sibling such as `UsersGuide.d.ts`, quietly shrinking the surface this report exists to cover.
 */
const [strayRootSegment] = relative(resolve(sep), packageRoot).split(sep);

if (!strayRootSegment) {
  fail(`could not derive the stray declaration root from ${packageRoot}.`);
}

const strayDir = resolve(sourceDir, strayRootSegment);

await cp(sourceDir, stagingDir, {
  recursive: true,
  filter: (src) => src !== strayDir && !src.startsWith(`${strayDir}${sep}`),
}).catch((error) =>
  fail(
    `could not stage ${sourceDir}: ${error.message}\n` +
      'If the directory is missing, run `npx nx run @pine-ds/core:build` first.'
  )
);

const componentsPath = resolve(stagingDir, 'components.d.ts');
const original = await readFile(componentsPath, 'utf8').catch(() =>
  fail(`${componentsPath} is missing. Run \`npx nx run @pine-ds/core:build\` first.`)
);

const occurrences = original.split(ALIASED_EXPORT).length - 1;

if (occurrences !== 1) {
  fail(
    `expected exactly one \`${ALIASED_EXPORT}\` in components.d.ts but found ${occurrences}.\n` +
      "Stencil's generated output has changed shape. Re-check whether API Extractor still\n" +
      'needs this rewrite (try pointing it at dist/types directly) and update this script.'
  );
}

await writeFile(componentsPath, original.replace(ALIASED_EXPORT, PLAIN_EXPORT));

console.log(`prepare-api-types: staged declarations in ${stagingDir}`);
