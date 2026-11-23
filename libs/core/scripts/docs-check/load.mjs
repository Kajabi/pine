import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { toId } from 'storybook/internal/csf';
import { loadCsf } from 'storybook/internal/csf-tools';
import { parseMdx } from '../docs-content/extract.mjs';
import { coreDir, generateDocsContent } from '../docs-content/generate.mjs';
import { readComponentSource } from './component-source.mjs';
import { buildContext, compareStrings } from './context.mjs';
import { collectSnippets } from './examples.mjs';

const repoDir = path.resolve(coreDir, '../..');
const srcDir = path.join(coreDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const docsJsonPath = path.join(coreDir, 'dist/docs.json');
const require = createRequire(import.meta.url);
const STORIES_FILE = /\.stories\.(js|jsx|ts|tsx)$/;
const UNTITLED = '\u0000untitled';

const isInside = (dir, target) => {
  const relative = path.relative(dir, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};

/**
 * Reads `file` (repo-relative) only if it sits under `dir` and passes `accepts`, since paths come from data. The
 * resolved path is checked too, so a symlink can't lead outside `dir`.
 */
export function readInside(dir, file, accepts, description) {
  const target = path.resolve(repoDir, file);
  if (!accepts(target) || !isInside(dir, target)) throw new Error(`${file} isn't ${description}`);
  const real = realpathSync(target);
  if (!accepts(real) || !isInside(realpathSync(dir), real)) throw new Error(`${file} isn't ${description}`);
  return readFileSync(real, 'utf8');
}

/** Reads a page docs-content lists. Its path comes from data, so only an MDX file under libs/core/src is read. */
export const readDocPage = (file) => readInside(srcDir, file, (target) => target.endsWith('.mdx'), 'an MDX page under libs/core/src');

/** Reads a component's source file. Its path comes from docs.json, so only a TypeScript file under libs/core/src/components is read. */
export const readComponentFile = (file) =>
  readInside(componentsDir, file, (target) => /\.tsx?$/.test(target), 'a TypeScript file under libs/core/src/components');

/** Every stories file Storybook loads, repo-relative and sorted. Mirrors the `*.stories.*` glob in .storybook/main.js. */
function findStoriesFiles() {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') walk(full);
      } else if (STORIES_FILE.test(entry.name)) {
        files.push(path.relative(repoDir, full).split(path.sep).join('/'));
      }
    }
  };
  walk(srcDir);
  return files.sort(compareStrings);
}

/** The title and id Storybook reads from a stories file, or null when it has no title or doesn't parse. */
function storiesMeta(file) {
  const source = readInside(srcDir, file, (target) => STORIES_FILE.test(target), 'a stories file under libs/core/src');
  try {
    const { meta } = loadCsf(source, { fileName: file, makeTitle: (title) => title ?? UNTITLED }).parse();
    return meta.title === UNTITLED ? null : meta;
  } catch {
    return null;
  }
}

/**
 * The docs page id Storybook gives each stories file. Every story is tagged `autodocs`, so a stories file has a
 * docs page even when no MDX page is attached to it. A file without a title gets one from its path, which isn't known here.
 */
function storyDocs() {
  const storyDocsIds = [];
  const unknownStories = [];
  for (const file of findStoriesFiles()) {
    const meta = storiesMeta(file);
    if (meta) storyDocsIds.push(toId(meta.id || meta.title, 'Docs'));
    else unknownStories.push(file);
  }
  return { storyDocsIds, unknownStories };
}

/** Pairs each component in docs.json with what its source file declares. Test components are left out. */
export function componentTargets(components, readSource = readComponentFile) {
  return components
    .filter((component) => component.tag.startsWith('pds-') && !component.filePath.split('/').includes('test'))
    .map((component) => {
      const file = `libs/core/${component.filePath}`;
      return { file, tag: component.tag, docs: component, source: readComponentSource(readSource(file), file) };
    });
}

function walkSections(sections, visit) {
  for (const section of sections) {
    visit(section);
    walkSections(section.children, visit);
  }
}

/** The depth of each heading the extractor's MDX parser finds, by line. */
function headingDepths(source) {
  const depths = new Map();
  const visit = (node) => {
    if (node.type === 'heading') depths.set(node.position?.start.line, node.depth);
    node.children?.forEach(visit);
  };
  visit(parseMdx(source));
  return depths;
}

/**
 * Each docs page with its links, its headings in page order with their lines and depths, and its sections in page
 * order, from the docs-content extractor, and the lines of its MDX source.
 */
export function pageTargets(content, pageLinks, readPage = readDocPage) {
  const linksByFile = new Map(pageLinks.map((page) => [page.file, page]));
  return content.docs.map((doc) => {
    const { headings, links } = linksByFile.get(doc.file);
    const source = readPage(doc.file);
    const depths = headingDepths(source);
    const sections = [];
    walkSections(doc.sections, (section) => sections.push(section));
    return {
      file: doc.file,
      kind: doc.kind,
      tag: doc.tag,
      title: doc.title,
      summary: doc.summary,
      status: doc.status,
      headings: headings.map((h) => ({ ...h, depth: depths.get(h.line) ?? null })),
      headingLines: new Map(headings.map((h) => [h.slug, h.line])),
      links,
      sections,
      lines: source.split('\n'),
    };
  });
}

/**
 * Reads core's dist/docs.json, the installed @pine-ds/icons, the source of each component, and the docs content of
 * the MDX pages and stories files in this checkout.
 */
export function loadDocsCheck() {
  if (!existsSync(docsJsonPath)) throw new Error('dist/docs.json is missing. Run `npm run build.stencil` in libs/core first.');
  const { components } = JSON.parse(readFileSync(docsJsonPath, 'utf8'));
  const { content, pageLinks } = generateDocsContent(components);

  const iconsDir = path.dirname(require.resolve('@pine-ds/icons/package.json'));
  const context = buildContext({
    components: [...components, ...require('@pine-ds/icons/dist/docs.json').components],
    iconNames: readdirSync(path.join(iconsDir, 'dist/svg'))
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.slice(0, -'.svg'.length)),
    iconExports: Object.keys(require('@pine-ds/icons/icons')),
    iconsVersion: require('@pine-ds/icons/package.json').version,
    pages: pageLinks,
    ...storyDocs(),
  });

  return {
    context,
    snippets: collectSnippets(content.docs, readDocPage),
    components: componentTargets(components),
    pages: pageTargets(content, pageLinks),
  };
}
