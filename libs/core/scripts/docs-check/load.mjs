import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { coreDir, generateDocsContent } from '../docs-content/generate.mjs';
import { buildContext } from './context.mjs';
import { collectSnippets } from './examples.mjs';

const repoDir = path.resolve(coreDir, '../..');
const require = createRequire(import.meta.url);
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/** Reads core's dist/docs.json, the installed @pine-ds/icons, and the docs content of the MDX pages in this checkout. */
export function loadDocsCheck() {
  const docsJsonPath = path.join(coreDir, 'dist/docs.json');
  if (!existsSync(docsJsonPath)) throw new Error('dist/docs.json is missing. Run `npm run build.stencil` in libs/core first.');
  const { components } = readJson(docsJsonPath);

  const iconsDir = path.dirname(require.resolve('@pine-ds/icons/package.json'));
  const context = buildContext({
    components: [...components, ...readJson(path.join(iconsDir, 'dist/docs.json')).components],
    iconNames: readdirSync(path.join(iconsDir, 'dist/svg'))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.slice(0, -'.svg'.length)),
    iconExports: Object.keys(require('@pine-ds/icons/icons')),
    iconsVersion: readJson(path.join(iconsDir, 'package.json')).version,
  });

  const { content } = generateDocsContent(components);
  const snippets = collectSnippets(content.docs, (file) => readFileSync(path.join(repoDir, file), 'utf8'));
  return { context, snippets, pages: content.docs.length };
}
