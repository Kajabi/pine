import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parseMdx } from '../extract.mjs';
import { findDocPages } from '../pages.mjs';

const coreDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const contentPath = path.join(coreDir, 'dist/docs-content.json');
const markdownParser = unified().use(remarkParse).freeze();
const EXAMPLE_LINE = /^<!-- example:\d+ -->$/;

const DISPLAY_ONLY = new Set(['DocCanvas', 'Meta', 'Controls', 'Canvas', 'Story', 'StatusBadge', 'DocArgsTable', 'DocTokenTable', 'img', 'ChangelogLoader', 'PatternCatalog']);

function walk(node, visit) {
  if (visit(node) === false) return;
  for (const child of node.children ?? []) walk(child, visit);
}

/** Every word of prose a page shows, outside its live previews and data-driven blocks. */
function wordsOf(node) {
  const words = [];
  walk(node, (n) => {
    if (n.type === 'mdxjsEsm' || DISPLAY_ONLY.has(n.name)) return false;
    if (n.type === 'mdxFlowExpression' || n.type === 'mdxTextExpression') {
      const expression = n.data?.estree?.body?.[0]?.expression;
      if (expression?.type === 'Literal' && typeof expression.value === 'string') words.push(...(expression.value.match(/[\p{L}\p{N}_]+/gu) ?? []));
      return false;
    }
    if (typeof n.value === 'string') words.push(...(n.value.match(/[\p{L}\p{N}_]+/gu) ?? []));
    return true;
  });
  return words;
}

const tally = (words) => words.reduce((counts, word) => counts.set(word, (counts.get(word) ?? 0) + 1), new Map());

test('docs-content.json holds every page, heading, example, fenced code block and word of prose', (t) => {
  assert.ok(existsSync(contentPath), 'dist/docs-content.json is missing; run `npm run build.stencil` first');
  const content = JSON.parse(readFileSync(contentPath, 'utf8'));
  const pages = findDocPages(coreDir);
  const byFile = new Map(content.docs.map((doc) => [doc.file, doc]));
  const totals = { pages: 0, headings: 0, examples: 0, fences: 0 };

  assert.equal(content.docs.length, pages.length, 'one entry per MDX page');
  for (const relative of pages) {
    const file = `libs/core/${relative}`;
    const doc = byFile.get(file);
    assert.ok(doc, `${file} has an entry`);

    const mdx = { headings: 0, examples: 0, fences: [] };
    const tree = parseMdx(readFileSync(path.join(coreDir, relative), 'utf8'));
    walk(tree, (n) => {
      if (n.type === 'heading') mdx.headings++;
      if (n.type === 'code') mdx.fences.push(n.lang ?? null);
      if (n.name === 'DocCanvas') {
        mdx.examples++;
        return false;
      }
      return true;
    });

    const json = { headings: 1, examples: 0, fences: [] };
    const words = doc.title.match(/[\p{L}\p{N}_]+/gu) ?? [];
    const checkBody = (where, part, sectionSlug) => {
      json.examples += part.examples.length;
      part.examples.forEach((example, index) => {
        assert.equal(example.sectionSlug, sectionSlug, `${where}: example ${index} names its section`);
        assert.equal(part.markdown.split('\n').filter((line) => line === `<!-- example:${index} -->`).length, 1, `${where}: example ${index} has one line in the markdown`);
      });
      const markdown = markdownParser.parse(part.markdown);
      walk(markdown, (n) => {
        if (n.type === 'code') json.fences.push(n.lang ?? null);
        if (n.type === 'html') assert.match(n.value, EXAMPLE_LINE, `${where}: no markup left in the markdown`);
        if (typeof n.value === 'string' && n.type !== 'html') words.push(...(n.value.match(/[\p{L}\p{N}_]+/gu) ?? []));
        return true;
      });
    };
    checkBody(file, doc, null);
    const visitSection = (section) => {
      json.headings++;
      words.push(...(section.heading.match(/[\p{L}\p{N}_]+/gu) ?? []));
      checkBody(`${file}#${section.slug}`, section, section.slug);
      section.children.forEach(visitSection);
    };
    doc.sections.forEach(visitSection);

    assert.equal(json.headings, mdx.headings, `${file}: every heading`);
    assert.equal(json.examples, mdx.examples, `${file}: every DocCanvas example`);
    assert.deepEqual(json.fences, mdx.fences, `${file}: every fenced code block, in order, with its language`);

    const expected = tally(wordsOf(tree));
    const actual = tally(words);
    const missing = [...expected].filter(([word, count]) => (actual.get(word) ?? 0) < count).map(([word]) => word);
    assert.deepEqual(missing, [], `${file}: no prose lost`);

    totals.pages++;
    totals.headings += json.headings;
    totals.examples += json.examples;
    totals.fences += json.fences.length;
  }
  t.diagnostic(`${totals.pages} pages, ${totals.headings} headings, ${totals.examples} examples, ${totals.fences} fenced code blocks`);
});
