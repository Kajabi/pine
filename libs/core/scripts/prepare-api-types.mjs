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
import { dirname, resolve } from 'node:path';
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

// `dist/types/Users/...` is a stray absolute-path artifact of the Stencil build and is
// not reachable from the entry point; skip it so the staged tree stays clean.
await cp(sourceDir, stagingDir, {
  recursive: true,
  filter: (src) => !src.includes(`${sourceDir}/Users`),
}).catch(() =>
  fail(`could not read ${sourceDir}. Run \`npx nx run @pine-ds/core:build\` first.`)
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
