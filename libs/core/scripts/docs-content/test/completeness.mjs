import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { CORE_ROOT, parseMdx } from '../extract.mjs';
import { coreDir, generateDocsContent } from '../generate.mjs';
import { findDocPages } from '../pages.mjs';

const markdownParser = unified().use(remarkParse).freeze();
const EXAMPLE_LINE = /^<!-- example:\d+ -->$/;
const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;
const TABLE_SEPARATOR = /^\|(\s*-+\s*\|)+$/;

const DISPLAY_ONLY = new Set(['DocCanvas', 'Meta', 'Controls', 'Canvas', 'Story', 'StatusBadge', 'DocArgsTable', 'DocTokenTable', 'img', 'ChangelogLoader', 'PatternCatalog']);

const wordsIn = (text) => text.match(/[\p{L}\p{N}_]+/gu) ?? [];
const tally = (words) => words.reduce((counts, word) => counts.set(word, (counts.get(word) ?? 0) + 1), new Map());
const squash = (code) => (code ?? '').replace(/\s+/g, '');

function walk(node, visit) {
  if (visit(node) === false) return;
  for (const child of node.children ?? []) walk(child, visit);
}

function staticText(expression) {
  if (expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) return expression.quasis[0].value.cooked;
  return '';
}

/** Cells in markdown pipe-table rows, separator rows excluded. */
function pipeTableCells(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|') && !TABLE_SEPARATOR.test(line))
    .reduce((cells, line) => cells + line.slice(1, -1).split(/(?<!\\)\|/).length, 0);
}

function isTemplatePage(tree) {
  const meta = tree.children.find((node) => node.name === 'Meta');
  return Boolean(meta?.attributes?.some((a) => a.name === 'isTemplate' && (a.value == null || a.value?.data?.estree?.body?.[0]?.expression?.value === true)));
}

/**
 * What the MDX shows, read straight from its syntax tree: one bucket per section in page order (the first
 * holds everything up to the first heading after the h1), plus every DocCanvas's code in order.
 */
function readMdx(tree, source) {
  const buckets = [{ words: [], cells: 0 }];
  const examples = [];
  let headings = 0;
  let titleSeen = false;
  walk(tree, (n) => {
    if (n.type === 'mdxjsEsm' || n.name === 'Story') return false;
    if (n.name === 'DocCanvas') {
      const source = n.attributes.find((a) => a.name === 'mdxSource')?.value?.data?.estree?.body?.[0]?.expression;
      const code = (key) => staticText(source?.properties?.find((p) => (p.key?.name ?? p.key?.value) === key)?.value);
      examples.push({ webComponent: squash(code('webComponent')), react: squash(code('react')) });
      return false;
    }
    if (DISPLAY_ONLY.has(n.name)) return false;
    const bucket = () => buckets.at(-1);
    if (n.type === 'heading') {
      headings++;
      if (n.depth === 1 && !titleSeen) titleSeen = true;
      else buckets.push({ words: [], cells: 0 });
    }
    if (n.name === 'pds-table-cell' || n.name === 'pds-table-head-cell') bucket().cells++;
    if (n.type === 'paragraph') bucket().cells += pipeTableCells(source.slice(n.position.start.offset, n.position.end.offset));
    if (n.type === 'mdxFlowExpression' || n.type === 'mdxTextExpression') {
      bucket().words.push(...wordsIn(staticText(n.data?.estree?.body?.[0]?.expression)));
      return false;
    }
    if (typeof n.value === 'string') bucket().words.push(...wordsIn(n.value));
  });
  return { buckets, examples, headings };
}

/** The same buckets read from the JSON: the page's own content, then each section in page order. */
function readJson(doc) {
  const buckets = [];
  const examples = [];
  const links = [];
  const add = (heading, part, sectionSlug, where) => {
    const words = wordsIn(heading);
    part.examples.forEach((example, index) => {
      assert.equal(example.sectionSlug, sectionSlug, `${where}: example ${index} names its section`);
      assert.equal(part.markdown.split('\n').filter((line) => line === `<!-- example:${index} -->`).length, 1, `${where}: example ${index} has one line in the markdown`);
      examples.push({ webComponent: squash(example.webComponent), react: squash(example.react) });
    });
    walk(markdownParser.parse(part.markdown), (n) => {
      if (n.type === 'html') assert.match(n.value, EXAMPLE_LINE, `${where}: no markup left in the markdown`);
      else if (typeof n.value === 'string') words.push(...wordsIn(n.value));
      if (n.type === 'link') links.push({ url: n.url, where });
    });
    buckets.push({ words, cells: pipeTableCells(part.markdown), fences: [] });
  };
  add(doc.title, doc, null, doc.file);
  const visit = (section) => {
    add(section.heading, section, section.slug, `${doc.file}#${section.slug}`);
    section.children.forEach(visit);
  };
  doc.sections.forEach(visit);
  return { buckets, examples, links };
}

test('docs-content.json holds every page, section, word, table cell, example and link of the MDX', (t) => {
  const docsJsonPath = path.join(coreDir, 'dist/docs.json');
  const components = existsSync(docsJsonPath) ? JSON.parse(readFileSync(docsJsonPath, 'utf8')).components : [];
  const { content } = generateDocsContent(components);
  const byFile = new Map(content.docs.map((doc) => [doc.file, doc]));
  const byId = new Map(content.docs.map((doc) => [doc.storybookId, doc]));
  const slugsOf = (doc) => {
    const slugs = new Set();
    const visit = (section) => {
      slugs.add(section.slug);
      section.children.forEach(visit);
    };
    doc.sections.forEach(visit);
    return slugs;
  };
  const totals = { pages: 0, sections: 0, examples: 0, cells: 0, links: 0 };

  assert.equal(byId.size, content.docs.length, 'every page has its own storybookId');
  const pages = findDocPages(coreDir).filter((relative) => !isTemplatePage(parseMdx(readFileSync(path.join(coreDir, relative), 'utf8'))));
  assert.equal(content.docs.length, pages.length, 'one entry per MDX page');

  for (const relative of pages) {
    const file = `${CORE_ROOT}/${relative}`;
    const doc = byFile.get(file);
    assert.ok(doc, `${file} has an entry`);
    assert.ok(doc.status === null || ['stable', 'beta', 'deprecated'].includes(doc.status), `${file}: status is a known value`);

    const source = readFileSync(path.join(coreDir, relative), 'utf8');
    const mdx = readMdx(parseMdx(source), source);
    const json = readJson(doc);

    assert.equal(json.buckets.length, mdx.buckets.length, `${file}: every heading`);
    json.buckets.forEach((bucket, index) => {
      const expected = tally(mdx.buckets[index].words);
      const actual = tally(bucket.words);
      const missing = [...expected].filter(([word, count]) => (actual.get(word) ?? 0) < count).map(([word]) => word);
      const extra = [...actual].filter(([word, count]) => (expected.get(word) ?? 0) < count).map(([word]) => word);
      assert.deepEqual({ missing, extra }, { missing: [], extra: [] }, `${file}, section ${index}: same words as the MDX section`);
      assert.equal(bucket.cells, mdx.buckets[index].cells, `${file}, section ${index}: same number of table cells`);
    });
    assert.deepEqual(json.examples, mdx.examples, `${file}: every DocCanvas example, in order, with its code`);

    const ownSlugs = slugsOf(doc);
    for (const { url, where } of json.links) {
      if (url.startsWith('#')) assert.ok(ownSlugs.has(url.slice(1)), `${where}: ${url} is a heading on the page`);
      else if (url.startsWith('pine-doc:')) {
        const [id, slug] = url.slice('pine-doc:'.length).split('#');
        assert.ok(byId.has(id), `${where}: ${url} names a page in the file`);
        if (slug) assert.ok(slugsOf(byId.get(id)).has(slug), `${where}: ${url} is a heading on that page`);
      } else assert.match(url, ABSOLUTE_URL, `${where}: ${url} is absolute`);
    }

    totals.pages++;
    totals.sections += json.buckets.length - 1;
    totals.examples += json.examples.length;
    totals.cells += json.buckets.reduce((sum, bucket) => sum + bucket.cells, 0);
    totals.links += json.links.length;
  }
  t.diagnostic(`${totals.pages} pages, ${totals.sections} sections, ${totals.examples} examples, ${totals.cells} table cells, ${totals.links} links`);
});

test('fenced code blocks stay in place with their language', () => {
  const { content } = generateDocsContent([]);
  const byFile = new Map(content.docs.map((doc) => [doc.file, doc]));
  for (const relative of findDocPages(coreDir)) {
    const tree = parseMdx(readFileSync(path.join(coreDir, relative), 'utf8'));
    if (isTemplatePage(tree)) continue;
    const expected = [];
    walk(tree, (n) => {
      if (n.name === 'DocCanvas') return false;
      if (n.type === 'code') expected.push(`${n.lang ?? ''}:${n.value}`);
    });
    const actual = [];
    const doc = byFile.get(`${CORE_ROOT}/${relative}`);
    const visit = (part) => {
      walk(markdownParser.parse(part.markdown), (n) => {
        if (n.type === 'code') actual.push(`${n.lang ?? ''}:${n.value}`);
      });
      part.sections?.forEach(visit);
      part.children?.forEach(visit);
    };
    visit(doc);
    assert.deepEqual(actual, expected, `${relative}: every fenced code block, in order, with its language`);
  }
});
