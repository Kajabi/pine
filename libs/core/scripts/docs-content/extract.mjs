import GithubSlugger from 'github-slugger';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString } from 'mdast-util-to-string';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { loadCsf } from 'storybook/internal/csf-tools';
import { toId } from 'storybook/internal/csf';
import { unified } from 'unified';

export const SCHEMA_VERSION = 1;

const mdxParser = unified().use(remarkParse).use(remarkMdx).freeze();

export const parseMdx = (source) => mdxParser.parse(source);

const STATUSES = ['stable', 'beta', 'deprecated'];
const UNWRAPPED_ELEMENTS = new Set(['div', 'span', 'p', 'pds-box', 'pds-text']);
const DROPPED_ELEMENTS = new Set(['Meta', 'Controls', 'Story', 'StatusBadge', 'img']);

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

const isJsx = (node) => node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
const attribute = (node, name) => node?.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
const attributeString = (node, name) => {
  const value = attribute(node, name)?.value;
  return typeof value === 'string' ? value : undefined;
};
const attributeExpression = (node, name) => attribute(node, name)?.value?.data?.estree?.body?.[0]?.expression;
const lineOf = (node) => node.position?.start.line;

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

function storybookLinkTarget(href) {
  const url = new URL(href, 'https://storybook.invalid/docs-root/');
  const pathParam = url.searchParams.get('path') ?? url.pathname;
  if (!pathParam.startsWith('/docs/')) return undefined;
  return { id: pathParam.slice('/docs/'.length), hash: url.hash.slice(1) };
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
 * @param {string} [input.coreRoot] Repo-relative path of @pine-ds/core.
 */
export function buildDocsContent({ pages, components, statusManifest, readStories, version, commit, coreRoot = 'libs/core' }) {
  const warnings = [];
  const warn = (file, node, message) => warnings.push(`${file}${node && lineOf(node) ? `:${lineOf(node)}` : ''}: ${message}`);
  const csfCache = new Map();

  const sorted = [...pages].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
  const parsed = sorted.map((page) => {
    const tree = parseMdx(page.source);
    const stories = storiesImports(tree, page.file);
    const meta = storybookMeta(tree, page.file, stories);
    return { ...page, tree, stories, ...meta, slugs: headingSlugs(tree) };
  });
  const pagesById = new Map(parsed.map((page) => [page.storybookId, page]));

  function loadStoriesFile(fromFile, specifier) {
    const key = `${fromFile}\u0000${specifier}`;
    if (!csfCache.has(key)) {
      const stories = readStories(fromFile, specifier);
      csfCache.set(key, loadCsf(stories.source, { fileName: stories.file, makeTitle: (title) => title }).parse());
    }
    return csfCache.get(key);
  }

  function storiesImports(tree, file) {
    const imports = new Map();
    for (const node of tree.children) {
      if (node.type !== 'mdxjsEsm') continue;
      for (const statement of node.data?.estree?.body ?? []) {
        if (statement.type !== 'ImportDeclaration' || !/\.stories\.[jt]sx?$/.test(statement.source.value)) continue;
        for (const specifier of statement.specifiers) imports.set(specifier.local.name, statement.source.value);
      }
    }
    return { file, imports };
  }

  function storybookMeta(tree, file, stories) {
    const meta = tree.children.find((node) => isJsx(node) && node.name === 'Meta');
    if (!meta) throw new Error(`${file}: no <Meta>, so the page has no Storybook id`);
    const title = attributeString(meta, 'title');
    if (title) return { storybookTitle: title, storybookId: toId(title, 'Docs') };
    const of = attributeExpression(meta, 'of');
    const specifier = of?.type === 'Identifier' ? stories.imports.get(of.name) : undefined;
    if (!specifier) throw new Error(`${file}: <Meta of> doesn't name an imported stories file`);
    const csfTitle = loadStoriesFile(file, specifier).meta.title;
    if (!csfTitle) throw new Error(`${file}: the stories file ${specifier} has no title`);
    return { storybookTitle: csfTitle, storybookId: toId(csfTitle, 'Docs') };
  }

  function headingSlugs(tree) {
    const slugger = new GithubSlugger();
    const slugs = [];
    const visit = (node) => {
      if (node.type === 'heading') slugs.push(slugger.slug(slugText(node)));
      for (const child of node.children ?? []) {
        if (!(isJsx(child) && child.name === 'DocCanvas')) visit(child);
      }
    };
    visit(tree);
    return new Set(slugs);
  }

  function convertHref(href, ctx, node) {
    if (/^[a-z][a-z\d+.-]*:/i.test(href)) return href;
    if (href.startsWith('#')) {
      if (!ctx.page.slugs.has(href.slice(1))) warn(ctx.page.file, node, `in-page link ${href} has no matching heading`);
      return href;
    }
    const target = storybookLinkTarget(href);
    if (!target) {
      warn(ctx.page.file, node, `link "${href}" is neither absolute, in-page nor a Storybook docs link; kept as is`);
      return href;
    }
    let { id } = target;
    if (!pagesById.has(id) && !id.endsWith('--docs') && pagesById.has(`${id.split('--')[0]}--docs`)) {
      warn(ctx.page.file, node, `link to the story "${id}" points at its docs page instead`);
      id = `${id.split('--')[0]}--docs`;
    }
    if (!pagesById.has(id)) warn(ctx.page.file, node, `Storybook link "${id}" has no MDX page`);
    else if (target.hash && !pagesById.get(id).slugs.has(target.hash)) warn(ctx.page.file, node, `link to ${id}#${target.hash} has no matching heading`);
    return `pine-doc:${id}${target.hash ? `#${target.hash}` : ''}`;
  }

  function convertDocCanvas(node, ctx) {
    const source = {};
    const mdxSource = attributeExpression(node, 'mdxSource');
    if (mdxSource?.type !== 'ObjectExpression') warn(ctx.page.file, node, '<DocCanvas> has no mdxSource object');
    for (const property of mdxSource?.properties ?? []) {
      const key = property.key?.name ?? property.key?.value;
      const value = staticString(property.value);
      if (value === undefined) warn(ctx.page.file, node, `mdxSource.${key} isn't a static string; left out`);
      else source[key] = dedent(value);
    }
    return { type: 'docCanvas', webComponent: source.webComponent ?? null, react: source.react ?? null };
  }

  function convertCanvas(node, ctx) {
    const of = attributeExpression(node, 'of');
    const specifier = of?.type === 'MemberExpression' ? ctx.page.stories.imports.get(of.object.name) : undefined;
    const exportName = of?.property?.name;
    const story = specifier ? loadStoriesFile(ctx.page.file, specifier)._stories[exportName] : undefined;
    if (!story) {
      warn(ctx.page.file, node, "<Canvas of> doesn't name a story in an imported stories file");
      return [];
    }
    return [{ type: 'embed', embed: { type: 'story', storyId: story.id } }];
  }

  function convertTable(node, ctx) {
    const cellsOf = (row) => {
      const cells = [];
      const collect = (parent) => {
        for (const child of parent.children ?? []) {
          if (child.name === 'pds-table-cell' || child.name === 'pds-table-head-cell') {
            const phrasing = child.children.flatMap((c) => (c.type === 'paragraph' ? c.children : [c]));
            cells.push({ type: 'tableCell', children: transform(phrasing, ctx) });
          } else if (child.type === 'paragraph') {
            collect(child);
          }
        }
      };
      collect(row);
      return cells;
    };
    const rows = [];
    for (const part of node.children) {
      if (part.name === 'pds-table-head') rows.push({ type: 'tableRow', children: cellsOf(part) });
      if (part.name !== 'pds-table-body') continue;
      for (const row of part.children) {
        if (row.name === 'pds-table-row') rows.push({ type: 'tableRow', children: cellsOf(row) });
        else if (row.type === 'mdxFlowExpression') warn(ctx.page.file, row, '<pds-table> rows are built at render time; only the header row is kept');
      }
    }
    if (rows.length === 0) {
      warn(ctx.page.file, node, '<pds-table> has no rows; dropped');
      return [];
    }
    return [{ type: 'table', children: rows }];
  }

  function convertExpression(node, ctx) {
    const program = node.data?.estree;
    if (program && program.body.length === 0) return [];
    const value = staticString(program?.body?.[0]?.expression);
    if (value !== undefined) return [{ type: 'text', value }];
    warn(ctx.page.file, node, `{${node.value.trim().slice(0, 40)}…} runs at render time; dropped`);
    return [];
  }

  function convertJsx(node, ctx) {
    if (DROPPED_ELEMENTS.has(node.name)) return [];
    if (UNWRAPPED_ELEMENTS.has(node.name)) return transform(node.children, ctx);
    switch (node.name) {
      case 'DocCanvas':
        return [convertDocCanvas(node, ctx)];
      case 'Canvas':
        return convertCanvas(node, ctx);
      case 'DocArgsTable':
        return [{ type: 'embed', embed: { type: 'props', tag: attributeString(node, 'componentName') ?? null } }];
      case 'DocTokenTable': {
        const embed = { type: 'tokens', tier: attributeString(node, 'tier') ?? null, category: attributeString(node, 'category') ?? null };
        const use = attributeString(node, 'use');
        return [{ type: 'embed', embed: use ? { ...embed, use } : embed }];
      }
      case 'ChangelogLoader':
        return [{ type: 'embed', embed: { type: 'changelog' } }];
      case 'PatternCatalog':
        return [{ type: 'embed', embed: { type: 'patterns' } }];
      case 'pds-table':
        return convertTable(node, ctx);
      case 'pds-link':
      case 'a':
        return [{ type: 'link', url: convertHref(attributeString(node, 'href') ?? '', ctx, node), children: transform(node.children, ctx) }];
      case 'code':
        return [{ type: 'inlineCode', value: toString({ type: 'root', children: transform(node.children, ctx) }) }];
      case 'strong':
        return [{ type: 'strong', children: transform(node.children, ctx) }];
      case 'em':
        return [{ type: 'emphasis', children: transform(node.children, ctx) }];
      default:
        warn(ctx.page.file, node, `<${node.name ?? ''}> outside a DocCanvas has no conversion; kept as JSX`);
        return [node];
    }
  }

  function transform(nodes, ctx) {
    const out = [];
    for (const node of nodes) {
      if (node.type === 'mdxjsEsm') continue;
      if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') out.push(...convertExpression(node, ctx));
      else if (isJsx(node)) out.push(...convertJsx(node, ctx));
      else if (node.type === 'link') out.push({ ...node, url: convertHref(node.url, ctx, node), children: transform(node.children, ctx) });
      else if (node.children) out.push({ ...node, children: transform(node.children, ctx) });
      else out.push(node);
    }
    return out;
  }

  function body(nodes, title, sectionSlug) {
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
        content.push(node);
        prose.push(node);
      }
    }
    return { markdown: toMd(content), examples, embeds };
  }

  function roleOf(section, parent) {
    const heading = slugText(section.node).trim().toLowerCase();
    const parentHeading = parent.node ? slugText(parent.node).trim().toLowerCase() : null;
    if (!parent.node && ['guidelines', 'properties', 'examples'].includes(heading)) return heading;
    if (parentHeading === 'guidelines' && heading === 'when to use') return 'when-to-use';
    if (parentHeading === 'guidelines' && heading === 'when not to use') return 'when-not-to-use';
    if (heading === 'accessibility') return 'accessibility';
    return null;
  }

  function pageEntry(page, componentIndex) {
    const ctx = { page };
    const kind = page.file.startsWith(`${coreRoot}/src/components/`) && page.file.split('/').at(-2) === 'docs' ? 'component' : 'guide';
    const nodes = transform(page.tree.children, ctx);
    const slugger = new GithubSlugger();
    const root = { level: 1, node: null, nodes: [], children: [] };
    const stack = [root];
    let title = null;
    for (const node of nodes) {
      if (node.type !== 'heading') {
        stack.at(-1).nodes.push(node);
        continue;
      }
      const slug = slugger.slug(slugText(node));
      if (node.depth === 1 && title === null) {
        title = headingText(node);
        continue;
      }
      if (node.depth === 1) warn(page.file, node, 'a second h1 is kept as a level-1 section');
      const section = { level: node.depth, node, slug, nodes: [], children: [] };
      while (stack.length > 1 && stack.at(-1).level >= node.depth) stack.pop();
      stack.at(-1).children.push(section);
      stack.push(section);
    }
    if (title === null) warn(page.file, null, 'no h1');

    let accessibilityTaken = false;
    const finish = (section, parent) => {
      let role = roleOf(section, parent);
      if (role === 'accessibility') {
        if (accessibilityTaken) role = null;
        accessibilityTaken = true;
      }
      const heading = headingText(section.node);
      return {
        level: section.level,
        heading,
        slug: section.slug,
        role,
        ...body(section.nodes, heading, section.slug),
        children: section.children.map((child) => finish(child, section)),
      };
    };
    const intro = body(root.nodes, title ?? '', null);
    const sections = root.children.map((section) => finish(section, root));
    const summary = root.nodes.find((node) => node.type === 'paragraph');

    let tag = null;
    let status = null;
    let statusNote = null;
    if (kind === 'component') {
      tag = page.file.split('/').at(-3);
      const badge = page.tree.children.find((node) => isJsx(node) && node.name === 'StatusBadge');
      const badgeTag = attributeString(badge, 'component');
      if (badgeTag !== undefined && badgeTag !== tag) warn(page.file, badge, `StatusBadge names ${badgeTag}, but the page documents ${tag}`);
      const statusProp = attributeString(badge, 'status');
      const entry = statusManifest[badgeTag ?? tag];
      if (statusProp !== undefined) status = STATUSES.includes(statusProp) ? statusProp : null;
      else if (badge && entry) status = STATUSES.includes(entry.status) ? entry.status : null;
      statusNote = attributeString(badge, 'note') ?? (badge && statusProp === undefined ? entry?.note : undefined) ?? null;
    }

    return {
      kind,
      tag,
      parent: tag ? componentIndex.find((c) => c.tag === tag)?.parent ?? null : null,
      title: title ?? '',
      storybookId: page.storybookId,
      storybookTitle: page.storybookTitle,
      file: page.file,
      status,
      statusNote,
      summary: summary ? toMd([summary]) : null,
      ...intro,
      sections,
    };
  }

  const componentIndex = buildComponentIndex(components, parsed, coreRoot);
  const docs = parsed.map((page) => pageEntry(page, componentIndex));
  for (const entry of componentIndex) if (!entry.doc) warnings.push(`${entry.tag}: no page documents it or its parent`);

  return {
    content: { schemaVersion: SCHEMA_VERSION, version, commit, components: componentIndex, docs },
    warnings,
  };
}

function buildComponentIndex(components, pages, coreRoot) {
  const dirOf = (file) => file.split('/').slice(0, -1).join('/');
  const pageDirs = new Map();
  for (const page of pages) {
    const parts = page.file.split('/');
    if (page.file.startsWith(`${coreRoot}/src/components/`) && parts.at(-2) === 'docs') pageDirs.set(parts.slice(0, -2).join('/'), page.storybookId);
  }
  const tagDirs = new Map();
  for (const component of components) {
    if (component.filePath.split('/').includes('test')) continue;
    tagDirs.set(component.tag, dirOf(`${coreRoot}/${component.filePath}`));
  }
  for (const dir of pageDirs.keys()) {
    if (![...tagDirs.values()].includes(dir)) tagDirs.set(dir.split('/').at(-1), dir);
  }
  const tagByDir = new Map([...tagDirs].map(([tag, dir]) => [dir, tag]));
  const ancestors = (dir) => {
    const out = [];
    for (let d = dirOf(dir); d.startsWith(`${coreRoot}/src/components/`); d = dirOf(d)) out.push(d);
    return out;
  };
  return [...tagDirs.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([tag, dir]) => {
      const parentDir = ancestors(dir).find((d) => tagByDir.has(d));
      const pageDir = [dir, ...ancestors(dir)].find((d) => pageDirs.has(d));
      return { tag, parent: parentDir ? tagByDir.get(parentDir) : null, doc: pageDir ? pageDirs.get(pageDir) : null };
    });
}
