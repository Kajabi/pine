import { compareStrings } from './context.mjs';
import { parseHtml } from './parse-html.mjs';
import { parseReact } from './parse-react.mjs';
import { RULES } from './rules/index.mjs';

/**
 * @typedef {{ kind: 'string', text: string } | { kind: 'bare' } | { kind: 'expression', identifier: string | null }} AttributeValue
 * @typedef {{ name: string, value: AttributeValue, line: number | null, overridable: boolean }} SnippetAttribute
 * @typedef {{ written: string, reactName: string | null, tag: string | null, line: number | null, attributes: SnippetAttribute[], hasSpread: boolean }} SnippetElement
 * @typedef {{ file: string, title: string, language: 'webComponent' | 'react', code: string, line: number, exactLines: boolean }} Snippet
 * @typedef {{ file: string, tag: string, docs: object, source: ReturnType<import('./component-source.mjs').readComponentSource> }} ComponentTarget
 * @typedef {{ file: string, title: string, headingLines: Map<string, number | null>, anchors: Set<string>, dynamicIds: boolean, elements: string[], links: { href: string, line: number | null, target: { id: string, hash: string } | null }[], sections: object[] }} PageTarget
 */

const LANGUAGE_LABELS = { webComponent: 'web component', react: 'React' };

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

/** Keeps the elements the rules look at, `pds-*` tags and Pine React components, with the tag each stands for. */
function pineElements(elements, context) {
  return elements.flatMap((element) => {
    if (element.reactName !== null) {
      const tag = context.reactTags.get(element.reactName) ?? null;
      return [{ ...element, tag, known: tag !== null }];
    }
    if (!element.tag.startsWith('pds-')) return [];
    return [{ ...element, known: context.components.has(element.tag) }];
  });
}

const compareEntries = (a, b) =>
  compareStrings(a.file, b.file) || a.line - b.line || a.order - b.order || compareStrings(a.language, b.language) || compareStrings(a.message, b.message);

/**
 * Runs the rules over every snippet, component and page, and sorts what they report. A rule's `scope` says which of
 * the three it checks. React code with syntax errors isn't checked and is listed in `unparsed`.
 *
 * A rule returns `{ line, message, hint }` findings. It marks an item `review: true` when it's worth a look but doesn't
 * fail the check, and `skipped: true` when the rule can't decide it, so the report says what it didn't check.
 *
 * @param {{ snippets?: Snippet[], components?: ComponentTarget[], pages?: PageTarget[] }} targets
 */
export function checkDocs({ snippets = [], components = [], pages = [] }, context, rules = RULES) {
  const byKey = new Map();
  const review = [];
  const skipped = [];
  const unparsed = [];

  const record = (rule, order, base, item, line) => {
    const entry = { ...base, line, rule: rule.id, order, message: item.message, hint: item.hint };
    if (item.review) return review.push(entry);
    if (item.skipped) return skipped.push(entry);
    const key = JSON.stringify([entry.file, entry.line, entry.language, entry.rule, entry.message]);
    if (byKey.has(key)) byKey.get(key).count++;
    else byKey.set(key, { ...entry, count: 1 });
  };

  const run = (scope, target, base, view, lineOf) => {
    rules.forEach((rule, order) => {
      if (rule.scope !== scope || (scope === 'snippet' && !rule.languages.includes(target.language))) return;
      for (const item of rule.check(view, context)) record(rule, order, base, item, lineOf(item));
    });
  };

  for (const snippet of snippets) {
    const parsed = snippet.language === 'react' ? parseReact(snippet.code) : parseHtml(snippet.code);
    if (!parsed) {
      unparsed.push({ file: snippet.file, line: snippet.line, title: snippet.title });
      continue;
    }
    const view = { ...parsed, language: snippet.language, elements: pineElements(parsed.elements, context) };
    const base = { file: snippet.file, label: `"${snippet.title}" (${LANGUAGE_LABELS[snippet.language]})`, language: snippet.language };
    run('snippet', snippet, base, view, (item) => (item.line !== null && snippet.exactLines ? snippet.line + item.line - 1 : snippet.line));
  }
  for (const component of components) {
    run('component', component, { file: component.file, label: component.tag, language: '' }, component, (item) => item.line ?? 1);
  }
  for (const page of pages) {
    run('page', page, { file: page.file, label: `"${page.title}"`, language: '' }, page, (item) => item.line ?? 1);
  }

  return {
    findings: [...byKey.values()].sort(compareEntries),
    review: review.sort(compareEntries),
    skipped: skipped.sort(compareEntries),
    unparsed: unparsed.sort((a, b) => compareStrings(a.file, b.file) || a.line - b.line),
    totals: {
      snippets: snippets.length - unparsed.length,
      components: components.length,
      pages: pages.length,
      links: pages.reduce((sum, page) => sum + page.links.length, 0),
      sections: pages.reduce((sum, page) => sum + page.sections.length, 0),
    },
  };
}

/** Checks example snippets only. */
export const checkSnippets = (snippets, context, rules = RULES) => checkDocs({ snippets }, context, rules);

const entryLine = (e) => `${e.file}:${e.line}  ${e.rule}  ${e.label}`;

function summary({ findings, totals }) {
  const total = findings.reduce((sum, f) => sum + f.count, 0);
  const examples = `${count(totals.snippets, 'example snippet')} on ${count(totals.pages, 'page')}`;
  if (totals.components === 0 && totals.links === 0 && totals.sections === 0) return { total, line: `in ${examples}` };
  const pageParts = `${count(totals.links, 'link')} and ${count(totals.sections, 'section')}`;
  return { total, line: `in ${examples}, ${pageParts}, and ${count(totals.components, 'component')}` };
}

export function formatReport(result) {
  const { findings, review, skipped, unparsed } = result;
  const lines = [];
  for (const f of findings) {
    lines.push(entryLine(f));
    lines.push(`  ${f.message}${f.count > 1 ? ` (${f.count} times)` : ''}`);
    lines.push(`  Fix: ${f.hint}`, '');
  }
  if (unparsed.length > 0) {
    lines.push(`Not checked: ${count(unparsed.length, 'React example')} with syntax errors.`);
    for (const u of unparsed) lines.push(`  ${u.file}:${u.line}  "${u.title}"`);
    lines.push('');
  }
  if (skipped.length > 0) {
    lines.push(`Not checked: ${count(skipped.length, 'item')} the rules can't decide from the source.`);
    for (const s of skipped) lines.push(`  ${entryLine(s)}`, `    ${s.message}`);
    lines.push('');
  }
  if (review.length > 0) {
    lines.push(`For review: ${count(review.length, 'item')} worth a look, which don't fail the check.`);
    for (const r of review) lines.push(`  ${entryLine(r)}`, `    ${r.message}`, `    ${r.hint}`);
    lines.push('');
  }
  const { total, line } = summary(result);
  lines.push(`docs-check: ${total === 0 ? 'no findings' : count(total, 'finding')} ${line}.`);
  if (total > 0) lines.push('Tags, attributes, values and JSDoc come from dist/docs.json, so rebuild core after changing a component.');
  return `${lines.join('\n')}\n`;
}
