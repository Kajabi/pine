import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { coreDir, generateDocsContent } from './generate.mjs';

const distDir = path.join(coreDir, 'dist');
const docsJsonPath = path.join(distDir, 'docs.json');

if (!existsSync(docsJsonPath)) {
  console.error('docs-content: dist/docs.json is missing. Run `npm run build.stencil` first.');
  process.exit(1);
}

const { content, warnings } = generateDocsContent(JSON.parse(readFileSync(docsJsonPath, 'utf8')).components);

writeFileSync(path.join(distDir, 'docs-content.json'), `${JSON.stringify(content, null, 2)}\n`);
copyFileSync(path.join(coreDir, 'scripts/docs-content/docs-content.d.ts'), path.join(distDir, 'docs-content.d.ts'));

console.log(`docs-content: wrote dist/docs-content.json (${content.docs.length} pages, ${content.components.length} components)`);
if (warnings.length) {
  console.warn(`docs-content: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  for (const warning of warnings) console.warn(`  ${warning}`);
}
