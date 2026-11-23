import { readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Every MDX page Storybook indexes, as paths relative to `coreDir`, sorted.
 * Mirrors the `stories` globs in .storybook/main.js: `src/**\/docs/*.mdx` and `src/stories/**\/*.docs.mdx`.
 */
export function findDocPages(coreDir) {
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(path.join(coreDir, dir), { withFileTypes: true })) {
      const relative = path.posix.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') walk(relative);
      } else if (entry.name.endsWith('.mdx')) {
        const inDocsFolder = path.posix.basename(dir) === 'docs';
        const isStoriesPage = relative.startsWith('src/stories/') && entry.name.endsWith('.docs.mdx');
        if (inDocsFolder || isStoriesPage) pages.push(relative);
      }
    }
  };
  walk('src');
  return pages.sort();
}
