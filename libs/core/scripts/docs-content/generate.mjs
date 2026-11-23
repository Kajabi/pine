import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocsContent, CORE_ROOT } from './extract.mjs';
import { findDocPages } from './pages.mjs';

export const coreDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repoDir = path.resolve(coreDir, '../..');
const srcDir = path.join(coreDir, 'src');

function currentCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: coreDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function readStories(fromFile, specifier) {
  const absolute = path.resolve(repoDir, path.dirname(fromFile), specifier);
  const fromSrc = path.relative(srcDir, absolute);
  if (fromSrc.startsWith('..') || path.isAbsolute(fromSrc)) {
    throw new Error(`docs-content: ${fromFile} imports stories from outside libs/core/src (${specifier})`);
  }
  return { file: absolute, source: readFileSync(absolute, 'utf8') };
}

/**
 * Builds docs-content.json from the MDX pages in this checkout.
 *
 * @param {{ tag: string, filePath: string }[]} components `components` from dist/docs.json.
 */
export function generateDocsContent(components) {
  const pages = findDocPages(coreDir).map((relative) => ({
    file: `${CORE_ROOT}/${relative}`,
    source: readFileSync(path.join(coreDir, relative), 'utf8'),
  }));
  const status = JSON.parse(readFileSync(path.join(srcDir, 'stories/resources/component-status.json'), 'utf8'));
  return buildDocsContent({
    pages,
    components,
    statusManifest: status.components,
    statusDefinitions: status.statuses,
    readStories,
    version: JSON.parse(readFileSync(path.join(coreDir, 'package.json'), 'utf8')).version,
    commit: currentCommit(),
  });
}
