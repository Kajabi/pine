import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { coreDir, generateDocsContent } from '../docs-content/generate.mjs';
import { buildContext } from './context.mjs';
import { collectSnippets } from './examples.mjs';

const repoDir = path.resolve(coreDir, '../..');
const pagesDir = path.join(coreDir, 'src');
const docsJsonPath = path.join(coreDir, 'dist/docs.json');
const require = createRequire(import.meta.url);

/** Reads a page docs-content lists. Its path comes from data, so only an MDX file under libs/core/src is read. */
export function readDocPage(file) {
  const target = path.resolve(repoDir, file);
  const relative = path.relative(pagesDir, target);
  if (!target.endsWith('.mdx') || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${file} isn't an MDX page under libs/core/src`);
  }
  return readFileSync(target, 'utf8');
}

/** Reads core's dist/docs.json, the installed @pine-ds/icons, and the docs content of the MDX pages in this checkout. */
export function loadDocsCheck() {
  if (!existsSync(docsJsonPath)) throw new Error('dist/docs.json is missing. Run `npm run build.stencil` in libs/core first.');
  const { components } = JSON.parse(readFileSync(docsJsonPath, 'utf8'));

  const iconsDir = path.dirname(require.resolve('@pine-ds/icons/package.json'));
  const context = buildContext({
    components: [...components, ...require('@pine-ds/icons/dist/docs.json').components],
    iconNames: readdirSync(path.join(iconsDir, 'dist/svg'))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.slice(0, -'.svg'.length)),
    iconExports: Object.keys(require('@pine-ds/icons/icons')),
    iconsVersion: require('@pine-ds/icons/package.json').version,
  });

  const { content } = generateDocsContent(components);
  const snippets = collectSnippets(content.docs, readDocPage);
  return { context, snippets, pages: content.docs.length };
}
