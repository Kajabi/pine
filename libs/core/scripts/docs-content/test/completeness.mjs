import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { CORE_ROOT, parseMdx } from '../extract.mjs';
import { findDocPages } from '../pages.mjs';

const coreDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const contentPath = path.join(coreDir, 'dist/docs-content.json');
const markdownParser = unified().use(remarkParse).freeze();
const EXAMPLE_LINE = /^<!-- example:\d+ -->$/;

const DISPLAY_ONLY = new Set(['DocCanvas', 'Meta', 'Controls', 'Canvas', 'Story', 'StatusBadge', 'DocArgsTable', 'DocTokenTable', 'img', 'ChangelogLoader', 'PatternCatalog']);

const wordsIn = (text) => text.match(/[\p{L}\p{N}_]+/gu) ?? [];

function walk(node, visit) {
  if (visit(node) === false) return;
  for (const child of node.children ?? []) walk(child, visit);
}

function staticText(expression) {
  if (expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) return expression.quasis[0].value.cooked;
  return '';
}

/** Every word of prose a page shows, outside its live previews and data-driven blocks. */
function wordsOf(tree) {
  const words = [];
  walk(tree, (n) => {
    if (n.type === 'mdxjsEsm' || DISPLAY_ONLY.has(n.name)) return false;
    if (n.type === 'mdxFlowExpression' || n.type === 'mdxTextExpression') {
      words.push(...wordsIn(staticText(n.data?.estree?.body?.[0]?.expression)));
      return false;
    }
    if (typeof n.value === 'string') words.push(...wordsIn(n.value));
  });
  return words;
}

const tally = (words) => words.reduce((counts, word) => counts.set(word, (counts.get(word) ?? 0) + 1), new Map());

test('docs-content.json holds every page, heading, example, fenced code block and word of prose', (t) => {
  if (!existsSync(contentPath)) {
    t.skip('dist/docs-content.json is missing; run `npm run build.stencil` first');
    return;
  }
  const content = JSON.parse(readFileSync(contentPath, 'utf8'));
  const pages = findDocPages(coreDir);
  const byFile = new Map(content.docs.map((doc) => [doc.file, doc]));
  const totals = { pages: 0, headings: 0, examples: 0, fences: 0 };

  assert.equal(content.docs.length, pages.length, 'one entry per MDX page');
  for (const relative of pages) {
    const file = `${CORE_ROOT}/${relative}`;
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
    });

    const json = { headings: 1, examples: 0, fences: [] };
    const words = wordsIn(doc.title);
    const checkBody = (where, part, sectionSlug) => {
      json.examples += part.examples.length;
      const lines = part.markdown.split('\n');
      part.examples.forEach((example, index) => {
        assert.equal(example.sectionSlug, sectionSlug, `${where}: example ${index} names its section`);
        assert.equal(lines.filter((line) => line === `<!-- example:${index} -->`).length, 1, `${where}: example ${index} has one line in the markdown`);
      });
      walk(markdownParser.parse(part.markdown), (n) => {
        if (n.type === 'code') json.fences.push(n.lang ?? null);
        if (n.type === 'html') assert.match(n.value, EXAMPLE_LINE, `${where}: no markup left in the markdown`);
        else if (typeof n.value === 'string') words.push(...wordsIn(n.value));
      });
    };
    checkBody(file, doc, null);
    const visitSection = (section) => {
      json.headings++;
      words.push(...wordsIn(section.heading));
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
    const extra = [...actual].filter(([word, count]) => (expected.get(word) ?? 0) < count).map(([word]) => word);
    assert.deepEqual(missing, [], `${file}: no prose lost`);
    assert.deepEqual(extra, [], `${file}: no text the page doesn't show`);

    totals.pages++;
    totals.headings += json.headings;
    totals.examples += json.examples;
    totals.fences += json.fences.length;
  }
  t.diagnostic(`${totals.pages} pages, ${totals.headings} headings, ${totals.examples} examples, ${totals.fences} fenced code blocks`);
});
