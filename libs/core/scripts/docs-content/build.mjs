import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocsContent } from './extract.mjs';
import { findDocPages } from './pages.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.resolve(scriptDir, '../..');
const repoDir = path.resolve(coreDir, '../..');
const coreRoot = path.relative(repoDir, coreDir).split(path.sep).join('/');
const distDir = path.join(coreDir, 'dist');
const docsJsonPath = path.join(distDir, 'docs.json');

if (!existsSync(docsJsonPath)) {
  console.error('docs-content: dist/docs.json is missing. Run `npm run build.stencil` first.');
  process.exit(1);
}

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

function currentCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: coreDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

const pages = findDocPages(coreDir).map((relative) => ({
  file: `${coreRoot}/${relative}`,
  source: readFileSync(path.join(coreDir, relative), 'utf8'),
}));

const { content, warnings } = buildDocsContent({
  pages,
  components: readJson(docsJsonPath).components,
  statusManifest: readJson(path.join(coreDir, 'src/stories/resources/component-status.json')).components,
  readStories: (fromFile, specifier) => {
    const absolute = path.resolve(repoDir, path.dirname(fromFile), specifier);
    return { file: absolute, source: readFileSync(absolute, 'utf8') };
  },
  version: readJson(path.join(coreDir, 'package.json')).version,
  commit: currentCommit(),
  coreRoot,
});

writeFileSync(path.join(distDir, 'docs-content.json'), `${JSON.stringify(content, null, 2)}\n`);
copyFileSync(path.join(scriptDir, 'docs-content.d.ts'), path.join(distDir, 'docs-content.d.ts'));

console.log(`docs-content: wrote dist/docs-content.json (${content.docs.length} pages, ${content.components.length} components)`);
if (warnings.length) {
  console.warn(`docs-content: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  for (const warning of warnings) console.warn(`  ${warning}`);
}
