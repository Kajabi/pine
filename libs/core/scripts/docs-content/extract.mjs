import GithubSlugger from 'github-slugger';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import path from 'node:path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { loadCsf } from 'storybook/internal/csf-tools';
import { toId } from 'storybook/internal/csf';
import { unified } from 'unified';

/** Repo-relative path of @pine-ds/core; every page's `file` starts with it. */
export const CORE_ROOT = 'libs/core';

const SCHEMA_VERSION = 1;
const COMPONENTS_DIR = `${CORE_ROOT}/src/components`;
const STATUSES = ['stable', 'beta', 'deprecated'];
const UNWRAPPED_ELEMENTS = new Set(['div', 'span', 'p', 'pds-box', 'pds-text']);
const DROPPED_ELEMENTS = new Set(['Meta', 'Controls', 'Story', 'StatusBadge', 'img']);
const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;
const UNTITLED = '\u0000untitled';

const mdxParser = unified().use(remarkParse).use(remarkMdx).freeze();

export const parseMdx = (source) => mdxParser.parse(source);

const markdownOptions = {
  bullet: '-',
  emphasis: '_',
  fences: true,
  listItemIndent: 'one',
  rule: '-',
  extensions: [
    mdxToMarkdown(),
    {
      handlers: {
        example: (node) => `<!-- example:${node.index} -->`,
        table: tableToMarkdown,
      },
    },
  ],
};

const toMd = (nodes) => toMarkdown({ type: 'root', children: nodes }, markdownOptions).trim();

function tableToMarkdown(node, _parent, state, info) {
  const cell = (c) =>
    state
      .containerPhrasing(c, { ...info, before: '|', after: '|' })
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ');
  const rows = node.children.map((row) => `| ${row.children.map(cell).join(' | ')} |`);
  const separator = `| ${node.children[0].children.map(() => '---').join(' | ')} |`;
  return [rows[0], separator, ...rows.slice(1)].join('\n');
}

const compareStrings = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const isJsx = (node) => node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
const attribute = (node, name) => node?.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
const attributeString = (node, name) => {
  const value = attribute(node, name)?.value;
  return typeof value === 'string' ? value : undefined;
};
const attributeExpression = (node, name) => attribute(node, name)?.value?.data?.estree?.body?.[0]?.expression;

function staticString(expression) {
  if (expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) return expression.quasis[0].value.cooked;
  return undefined;
}

function dedent(code) {
  const lines = code.replace(/^\s*\n/, '').replace(/\n\s*$/, '').split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length);
  const shared = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(shared)).join('\n');
}

/** A heading's text with inline code kept in backticks, the way readers see it. */
function headingText(node) {
  return node.children
    .map((child) => {
      if (child.type === 'inlineCode') return `\`${child.value}\``;
      if (child.children) return headingText(child);
      return child.value ?? '';
    })
    .join('');
}

/** The text Storybook's rehype-slug reads to make a heading's anchor. */
const slugText = (heading) => toString(heading, { includeImageAlt: false });

/**
 * Slugs every heading in page order, the way rehype-slug does in Storybook, and stores the slug on the
 * heading node so the section tree and the link checks read the same value. Maps each slug to its line.
 */
function slugHeadings(tree) {
  const slugger = new GithubSlugger();
  const slugs = new Map();
  const visit = (node) => {
    if (node.type === 'heading') {
      const slug = slugger.slug(slugText(node));
      node.data = { ...node.data, slug };
      slugs.set(slug, node.position?.start.line ?? null);
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return slugs;
}

const containsJsx = (value) => {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsJsx);
  if (value.type === 'JSXElement' || value.type === 'JSXFragment') return true;
  return Object.keys(value).some((key) => key !== 'loc' && key !== 'range' && containsJsx(value[key]));
};

const rendersInCode = (node) => {
  if (node.type === 'mdxjsEsm') return containsJsx(node.data?.estree);
  const program = node.data?.estree;
  return program?.body.length > 0 && staticString(program.body[0].expression) === undefined;
};

/**
 * What the page renders that a link can scroll to besides headings: the `id` of each JSX element and the `name` of
 * each `<a>`, plus the names of all its JSX elements. An id set by an expression or a spread, or anything an
 * expression or JSX in code renders, can't be read, so `dynamic` says the page has one.
 */
function pageElements(tree) {
  const ids = new Set();
  const names = new Set();
  let dynamic = false;
  const visit = (node) => {
    if (['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression'].includes(node.type) && rendersInCode(node)) dynamic = true;
    if (isJsx(node)) {
      if (node.name) names.add(node.name);
      for (const attr of node.attributes ?? []) {
        if (attr.type !== 'mdxJsxAttribute' || containsJsx(attr.value?.data?.estree)) {
          dynamic = true;
          continue;
        }
        if (attr.name !== 'id' && !(attr.name === 'name' && node.name === 'a')) continue;
        const value = typeof attr.value === 'string' ? attr.value : staticString(attr.value?.data?.estree?.body?.[0]?.expression);
        if (value === undefined) dynamic = true;
        else ids.add(value);
      }
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return { ids, names, dynamic };
}

function referenceDefinitions(tree) {
  const definitions = new Map();
  const visit = (node) => {
    if (node.type === 'definition') definitions.set(node.identifier, node);
    node.children?.forEach(visit);
  };
  visit(tree);
  return definitions;
}

/** Storybook names an attached page after its MDX file unless that file shares its stories file's name. */
function autoName(mdxFile, storiesFile) {
  const stem = (file) => path.posix.basename(file).split('.')[0];
  return stem(mdxFile) === stem(storiesFile) ? 'Docs' : stem(mdxFile);
}

function isTemplate(meta) {
  const flag = attribute(meta, 'isTemplate');
  return Boolean(flag) && (flag.value == null || attributeExpression(meta, 'isTemplate')?.value === true);
}

function storiesImports(tree) {
  const imports = new Map();
  for (const node of tree.children) {
    if (node.type !== 'mdxjsEsm') continue;
    for (const statement of node.data?.estree?.body ?? []) {
      if (statement.type !== 'ImportDeclaration' || !/\.stories\.[jt]sx?$/.test(statement.source.value)) continue;
      for (const specifier of statement.specifiers) {
        const exportName = specifier.type === 'ImportSpecifier' ? specifier.imported.name ?? specifier.imported.value : null;
        imports.set(specifier.local.name, { source: statement.source.value, exportName });
      }
    }
  }
  return imports;
}

function storybookLinkTarget(href) {
  let url;
  try {
    url = new URL(href, 'https://storybook.invalid/docs-root/');
  } catch {
    return undefined;
  }
  const pathParam = url.searchParams.get('path') ?? url.pathname;
  if (!pathParam.startsWith('/docs/')) return undefined;
  return { id: pathParam.slice('/docs/'.length), hash: url.hash.slice(1) };
}

/** toMarkdown can't write the docCanvas and embed nodes, so any left inside a list, quote or table is dropped. */
function withoutNestedBlocks(node, page) {
  if (!node.children) return node;
  const children = node.children.flatMap((child) => {
    if (child.type === 'docCanvas' || child.type === 'embed') {
      page?.warn(child, `${child.type === 'docCanvas' ? 'a DocCanvas' : `a ${child.embed.type} block`} inside a list, quote or table is left out; move it to the top level of its section`);
      return [];
    }
    const kept = withoutNestedBlocks(child, page);
    return kept ? [kept] : [];
  });
  return children.length === 0 && node.children.length > 0 ? null : { ...node, children };
}

function body(nodes, title, sectionSlug, page) {
  const examples = [];
  const embeds = [];
  const content = [];
  let prose = [];
  for (const node of nodes) {
    if (node.type === 'docCanvas') {
      examples.push({ sectionSlug, title, prose: toMd(prose), webComponent: node.webComponent, react: node.react });
      content.push({ type: 'example', index: examples.length - 1 });
      prose = [];
    } else if (node.type === 'embed') {
      embeds.push(node.embed);
    } else {
      const flow = withoutNestedBlocks(node, page);
      if (flow) {
        content.push(flow);
        prose.push(flow);
      }
    }
  }
  return { markdown: toMd(content), examples, embeds };
}

function roleOf(name, parentName) {
  if (parentName === null && ['guidelines', 'properties', 'examples'].includes(name)) return name;
  if (parentName === 'guidelines' && name === 'when to use') return 'when-to-use';
  if (parentName === 'guidelines' && name === 'when not to use') return 'when-not-to-use';
  if (name === 'accessibility') return 'accessibility';
  return null;
}

/**
 * Builds docs-content.json from Pine's Storybook MDX pages.
 *
 * @param {object} input
 * @param {{ file: string, source: string }[]} input.pages MDX pages, `file` repo-relative.
 * @param {{ tag: string, filePath: string }[]} input.components `components` from docs.json; `filePath` relative to libs/core.
 * @param {Record<string, { status: string, note?: string }>} input.statusManifest `components` from component-status.json.
 * @param {(fromFile: string, specifier: string) => { file: string, source: string }} input.readStories Reads a stories file a page imports.
 * @param {string} input.version
 * @param {string | null} input.commit
 */
export function buildDocsContent({ pages, components, statusManifest, readStories, version, commit }) {
  const warnings = [];
  const csfCache = new Map();

  /** The parsed stories file, or null (with a warning) when it can't be read or has no title. */
  function loadStoriesFile(fromFile, specifier, warn, node) {
    const key = `${fromFile}\u0000${specifier}`;
    if (!csfCache.has(key)) {
      let csf = null;
      try {
        const stories = readStories(fromFile, specifier);
        csf = loadCsf(stories.source, { fileName: stories.file, makeTitle: (title) => title ?? UNTITLED }).parse();
        if (csf.meta.title === UNTITLED) {
          warn(node, `${specifier} has no title, so its stories have no Storybook id`);
          csf = null;
        }
      } catch (error) {
        warn(node, `couldn't read ${specifier}: ${error.message.split('\n')[0]}`);
      }
      csfCache.set(key, csf);
    }
    return csfCache.get(key);
  }

  /** Mirrors how Storybook's indexer titles and ids an MDX docs page. */
  function storybookMeta(tree, file, imports, warn) {
    const meta = tree.children.find((node) => isJsx(node) && node.name === 'Meta');
    if (!meta) return warn(null, 'no <Meta> to give the page a Storybook id; page left out');
    if (isTemplate(meta)) return null;
    const of = attributeExpression(meta, 'of');
    const binding = of?.type === 'Identifier' ? imports.get(of.name) : undefined;
    if (of && !binding) return warn(meta, "<Meta of> doesn't name an imported stories file; page left out");
    const csf = binding ? loadStoriesFile(file, binding.source, warn, meta) : null;
    if (binding && !csf) return warn(meta, 'page left out');
    const title = csf?.meta.title || attributeString(meta, 'title');
    if (!title) return warn(meta, 'no title to give the page a Storybook id; page left out');
    const name = attributeString(meta, 'name') || (binding ? autoName(file, binding.source) : 'Docs');
    return { storybookTitle: title, storybookId: toId(csf?.meta.id || attributeString(meta, 'id') || title, name) };
  }

  const parsed = [...pages].sort((a, b) => compareStrings(a.file, b.file)).flatMap(({ file, source }) => {
    const tree = parseMdx(source);
    const imports = storiesImports(tree);
    const warn = (node, message) => {
      warnings.push(`${file}${node?.position ? `:${node.position.start.line}` : ''}: ${message}`);
    };
    const meta = storybookMeta(tree, file, imports, warn);
    if (!meta) return [];
    const parts = file.split('/');
    const isComponentPage = file.startsWith(`${COMPONENTS_DIR}/`) && parts.at(-2) === 'docs';
    return [{
      file,
      tree,
      imports,
      kind: isComponentPage ? 'component' : 'guide',
      componentDir: isComponentPage ? parts.slice(0, -2).join('/') : null,
      slugs: slugHeadings(tree),
      elements: pageElements(tree),
      definitions: referenceDefinitions(tree),
      links: [],
      warn,
      ...meta,
    }];
  });
  const pagesById = new Map();
  for (const page of parsed) {
    if (pagesById.has(page.storybookId)) page.warn(null, `Storybook id ${page.storybookId} is also used by ${pagesById.get(page.storybookId).file}`);
    else pagesById.set(page.storybookId, page);
  }

  function convertHref(href, page, node) {
    if (ABSOLUTE_URL.test(href)) return href;
    const line = node.position?.start.line ?? null;
    if (href.startsWith('#')) {
      page.links.push({ href, line, target: { id: page.storybookId, hash: href.slice(1) } });
      if (!page.slugs.has(href.slice(1))) page.warn(node, `in-page link ${href} has no matching heading`);
      return href;
    }
    const target = storybookLinkTarget(href);
    if (href !== '') page.links.push({ href, line, target: target ?? null });
    if (!target) {
      page.warn(node, `link "${href}" is neither absolute, in-page nor a Storybook docs link; kept as is`);
      return href;
    }
    let { id } = target;
    const docsId = `${id.split('--')[0]}--docs`;
    if (!pagesById.has(id) && !id.endsWith('--docs') && pagesById.has(docsId)) {
      page.warn(node, `link to the story "${id}" points at its docs page instead`);
      id = docsId;
    }
    if (!pagesById.has(id)) {
      page.warn(node, `Storybook link "${id}" has no MDX page; kept as plain text`);
      return null;
    }
    if (target.hash && !pagesById.get(id).slugs.has(target.hash)) page.warn(node, `link to ${id}#${target.hash} has no matching heading`);
    return `pine-doc:${id}${target.hash ? `#${target.hash}` : ''}`;
  }

  function convertDocCanvas(node, page) {
    const source = {};
    const mdxSource = attributeExpression(node, 'mdxSource');
    if (mdxSource?.type !== 'ObjectExpression') page.warn(node, '<DocCanvas> has no mdxSource object');
    for (const property of mdxSource?.properties ?? []) {
      const key = property.key?.name ?? property.key?.value;
      const value = staticString(property.value);
      if (value === undefined) page.warn(node, `mdxSource.${key} isn't a static string; left out`);
      else source[key] = dedent(value);
    }
    return { type: 'docCanvas', position: node.position, webComponent: source.webComponent ?? null, react: source.react ?? null };
  }

  function convertCanvas(node, page) {
    const of = attributeExpression(node, 'of');
    const binding = page.imports.get(of?.type === 'MemberExpression' ? of.object.name : of?.name);
    const exportName = of?.type === 'MemberExpression' ? of.property.name : binding?.exportName;
    const stories = binding && exportName ? loadStoriesFile(page.file, binding.source, page.warn, node)?._stories : undefined;
    const story = stories && Object.hasOwn(stories, exportName) ? stories[exportName] : undefined;
    if (!story) {
      page.warn(node, "<Canvas of> doesn't name a story in an imported stories file");
      return [];
    }
    return [{ type: 'embed', position: node.position, embed: { type: 'story', storyId: story.id } }];
  }

  function convertTable(node, page) {
    const cellsOf = (parent) =>
      (parent.children ?? []).flatMap((child) => {
        if (child.name === 'pds-table-cell' || child.name === 'pds-table-head-cell') {
          const phrasing = child.children.flatMap((c, index) =>
            c.type === 'paragraph' ? [...(index > 0 ? [{ type: 'text', value: ' ' }] : []), ...c.children] : [c],
          );
          return [{ type: 'tableCell', children: transform(phrasing, page) }];
        }
        return child.type === 'paragraph' ? cellsOf(child) : [];
      });
    const rows = [];
    for (const part of node.children) {
      if (part.name === 'pds-table-head') rows.push({ type: 'tableRow', children: cellsOf(part) });
      if (part.name !== 'pds-table-body') continue;
      for (const row of part.children) {
        if (row.name === 'pds-table-row') rows.push({ type: 'tableRow', children: cellsOf(row) });
        else if (row.type === 'mdxFlowExpression') page.warn(row, '<pds-table> rows are built at render time; only the header row is kept');
      }
    }
    if (rows.length === 0) {
      page.warn(node, '<pds-table> has no rows; dropped');
      return [];
    }
    return [{ type: 'table', children: rows }];
  }

  function convertExpression(node, page) {
    const program = node.data?.estree;
    if (program && program.body.length === 0) return [];
    const value = staticString(program?.body?.[0]?.expression);
    if (value !== undefined) return [{ type: 'text', value }];
    page.warn(node, `{${node.value.trim().slice(0, 40)}…} runs at render time; dropped`);
    return [];
  }

  function convertJsx(node, page) {
    if (DROPPED_ELEMENTS.has(node.name)) return [];
    if (UNWRAPPED_ELEMENTS.has(node.name)) return transform(node.children, page);
    switch (node.name) {
      case 'DocCanvas':
        return [convertDocCanvas(node, page)];
      case 'Canvas':
        return convertCanvas(node, page);
      case 'DocArgsTable':
        return [{ type: 'embed', position: node.position, embed: { type: 'props', tag: attributeString(node, 'componentName') ?? null } }];
      case 'DocTokenTable': {
        const embed = { type: 'tokens', tier: attributeString(node, 'tier') ?? null, category: attributeString(node, 'category') ?? null };
        const use = attributeString(node, 'use');
        return [{ type: 'embed', position: node.position, embed: use ? { ...embed, use } : embed }];
      }
      case 'ChangelogLoader':
        return [{ type: 'embed', position: node.position, embed: { type: 'changelog' } }];
      case 'PatternCatalog':
        return [{ type: 'embed', position: node.position, embed: { type: 'patterns' } }];
      case 'pds-table':
        return convertTable(node, page);
      case 'pds-link':
      case 'a':
        return linkOrText(convertHref(attributeString(node, 'href') ?? '', page, node), node, page);
      case 'code':
        return [{ type: 'inlineCode', value: toString({ type: 'root', children: transform(node.children, page) }) }];
      case 'strong':
        return [{ type: 'strong', children: transform(node.children, page) }];
      case 'em':
        return [{ type: 'emphasis', children: transform(node.children, page) }];
      default:
        page.warn(node, `<${node.name ?? ''}> outside a DocCanvas has no conversion; kept as JSX`);
        return [node];
    }
  }

  function linkOrText(url, node, page) {
    const children = transform(node.children, page);
    return url === null ? children : [{ ...(node.type === 'link' ? node : {}), type: 'link', url, children }];
  }

  function transform(nodes, page) {
    const out = [];
    for (const node of nodes) {
      if (node.type === 'mdxjsEsm') continue;
      if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') out.push(...convertExpression(node, page));
      else if (isJsx(node)) out.push(...convertJsx(node, page));
      else if (node.type === 'link') out.push(...linkOrText(convertHref(node.url, page, node), node, page));
      else if (node.type === 'definition') continue;
      else if (node.type === 'linkReference') {
        const definition = page.definitions.get(node.identifier);
        const url = definition ? convertHref(definition.url, page, node) : null;
        out.push(...linkOrText(url, { type: 'link', title: definition?.title ?? null, children: node.children }, page));
      } else if (node.type === 'imageReference') {
        const definition = page.definitions.get(node.identifier);
        out.push(definition ? { type: 'image', url: definition.url, title: definition.title ?? null, alt: node.alt } : { type: 'text', value: node.alt ?? '' });
      }
      else if (node.children) out.push({ ...node, children: transform(node.children, page) });
      else out.push(node);
    }
    return out;
  }

  function statusOf(page) {
    const badge = page.tree.children.find((node) => isJsx(node) && node.name === 'StatusBadge');
    if (!badge) return { status: null, statusNote: null };
    const tag = page.componentDir.split('/').at(-1);
    const badgeTag = attributeString(badge, 'component');
    if (badgeTag !== undefined && badgeTag !== tag) page.warn(badge, `StatusBadge names ${badgeTag}, but the page documents ${tag}`);
    const statusProp = attributeString(badge, 'status');
    const entry = badgeTag === undefined ? undefined : statusManifest[badgeTag];
    const fromManifest = statusProp === undefined ? entry : undefined;
    const value = statusProp ?? fromManifest?.status ?? (badgeTag === undefined ? 'stable' : undefined);
    return {
      status: STATUSES.includes(value) ? value : null,
      statusNote: attributeString(badge, 'note') ?? fromManifest?.note ?? null,
    };
  }

  function pageEntry(page, parentOf) {
    const nodes = transform(page.tree.children, page);
    const root = { level: 1, name: null, nodes: [], children: [] };
    const stack = [root];
    let title = null;
    let afterTitle = 0;
    for (const node of nodes) {
      if (node.type !== 'heading') {
        stack.at(-1).nodes.push(node);
        continue;
      }
      if (node.depth === 1 && title === null) {
        title = headingText(node);
        afterTitle = root.nodes.length;
        if (afterTitle > 0) page.warn(node, 'content above the h1 is kept at the start of the page markdown');
        continue;
      }
      if (node.depth === 1) page.warn(node, 'a second h1 is kept as a level-1 section');
      const section = { level: node.depth, node, name: slugText(node).trim().toLowerCase(), nodes: [], children: [] };
      while (stack.length > 1 && stack.at(-1).level >= node.depth) stack.pop();
      stack.at(-1).children.push(section);
      stack.push(section);
    }
    if (title === null) page.warn(null, 'no h1');

    let accessibilityTaken = false;
    const finish = (section, parent) => {
      let role = roleOf(section.name, parent.name);
      if (role === 'accessibility') {
        if (accessibilityTaken) role = null;
        accessibilityTaken = true;
      }
      const heading = headingText(section.node);
      const slug = section.node.data.slug;
      return {
        level: section.level,
        heading,
        slug,
        role,
        ...body(section.nodes, heading, slug, page),
        children: section.children.map((child) => finish(child, section)),
      };
    };
    const intro = body(root.nodes, title ?? '', null, page);
    const sections = root.children.map((section) => finish(section, root));
    const firstParagraph = root.nodes.slice(afterTitle).find((node) => node.type === 'paragraph');
    const summary = firstParagraph && withoutNestedBlocks(firstParagraph, null);
    const tag = page.kind === 'component' ? page.componentDir.split('/').at(-1) : null;

    return {
      kind: page.kind,
      tag,
      parent: tag ? parentOf.get(tag) ?? null : null,
      title: title ?? '',
      storybookId: page.storybookId,
      storybookTitle: page.storybookTitle,
      file: page.file,
      ...(page.kind === 'component' ? statusOf(page) : { status: null, statusNote: null }),
      summary: summary ? toMd([summary]) : null,
      ...intro,
      sections,
    };
  }

  const componentIndex = buildComponentIndex(components, parsed);
  const parentOf = new Map(componentIndex.map((entry) => [entry.tag, entry.parent]));
  const docs = parsed.map((page) => pageEntry(page, parentOf));
  for (const entry of componentIndex) if (!entry.doc) warnings.push(`${entry.tag}: no page documents it or its parent`);

  return {
    content: { schemaVersion: SCHEMA_VERSION, version, commit, components: componentIndex, docs },
    warnings,
    pageLinks: parsed.map((page) => ({
      file: page.file,
      storybookId: page.storybookId,
      headings: [...page.slugs].map(([slug, line]) => ({ slug, line })),
      ids: [...page.elements.ids].sort(compareStrings),
      dynamicIds: page.elements.dynamic,
      elements: [...page.elements.names].sort(compareStrings),
      links: page.links,
    })),
  };
}

function buildComponentIndex(components, pages) {
  const pageDirs = new Map(pages.filter((page) => page.kind === 'component').map((page) => [page.componentDir, page.storybookId]));
  const tagDirs = new Map();
  for (const component of components) {
    if (component.filePath.split('/').includes('test')) continue;
    tagDirs.set(component.tag, path.posix.dirname(`${CORE_ROOT}/${component.filePath}`));
  }
  const knownDirs = new Set(tagDirs.values());
  for (const dir of pageDirs.keys()) {
    if (!knownDirs.has(dir)) tagDirs.set(path.posix.basename(dir), dir);
  }
  const tagByDir = new Map([...tagDirs].map(([tag, dir]) => [dir, tag]));
  const ancestors = (dir) => {
    const out = [];
    for (let d = path.posix.dirname(dir); d.startsWith(`${COMPONENTS_DIR}/`); d = path.posix.dirname(d)) out.push(d);
    return out;
  };
  return [...tagDirs.entries()]
    .sort(([a], [b]) => compareStrings(a, b))
    .map(([tag, dir]) => {
      const above = ancestors(dir);
      const parentDir = above.find((d) => tagByDir.has(d));
      const pageDir = [dir, ...above].find((d) => pageDirs.has(d));
      return { tag, parent: parentDir ? tagByDir.get(parentDir) : null, doc: pageDir ? pageDirs.get(pageDir) : null };
    });
}
