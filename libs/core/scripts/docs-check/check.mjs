import { compareStrings } from './context.mjs';
import { parseHtml } from './parse-html.mjs';
import { parseReact } from './parse-react.mjs';
import { RULES } from './rules/index.mjs';

/**
 * @typedef {{ kind: 'string', text: string } | { kind: 'bare' } | { kind: 'expression', identifier: string | null }} AttributeValue
 * @typedef {{ name: string, value: AttributeValue, line: number | null, overridable: boolean }} SnippetAttribute
 * @typedef {{ written: string, reactName: string | null, tag: string | null, line: number | null, attributes: SnippetAttribute[], hasSpread: boolean }} SnippetElement
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

function compareFindings(a, b) {
  return compareStrings(a.file, b.file) || a.line - b.line || a.order - b.order || compareStrings(a.language, b.language) || compareStrings(a.message, b.message);
}

/**
 * Runs the rules over every snippet. React code with syntax errors isn't checked and is listed in `unparsed`.
 *
 * @param {{ file: string, title: string, language: 'webComponent' | 'react', code: string, line: number, exactLines: boolean }[]} snippets
 */
export function checkSnippets(snippets, context, rules = RULES) {
  const byKey = new Map();
  const unparsed = [];
  for (const snippet of snippets) {
    const parsed = snippet.language === 'react' ? parseReact(snippet.code) : parseHtml(snippet.code);
    if (!parsed) {
      unparsed.push({ file: snippet.file, line: snippet.line, title: snippet.title });
      continue;
    }
    const view = { ...parsed, language: snippet.language, elements: pineElements(parsed.elements, context) };
    rules.forEach((rule, order) => {
      if (!rule.languages.includes(snippet.language)) return;
      for (const finding of rule.check(view, context)) {
        const line = finding.line !== null && snippet.exactLines ? snippet.line + finding.line - 1 : snippet.line;
        const entry = { file: snippet.file, line, title: snippet.title, language: snippet.language, rule: rule.id, order, message: finding.message, hint: finding.hint };
        const key = JSON.stringify([entry.file, entry.line, entry.language, entry.rule, entry.message]);
        if (byKey.has(key)) byKey.get(key).count++;
        else byKey.set(key, { ...entry, count: 1 });
      }
    });
  }
  return {
    findings: [...byKey.values()].sort(compareFindings),
    unparsed: unparsed.sort((a, b) => compareStrings(a.file, b.file) || a.line - b.line),
    checked: snippets.length - unparsed.length,
  };
}

export function formatReport({ findings, unparsed, checked }, pages) {
  const lines = [];
  for (const f of findings) {
    lines.push(`${f.file}:${f.line}  ${f.rule}  "${f.title}" (${LANGUAGE_LABELS[f.language]})`);
    lines.push(`  ${f.message}${f.count > 1 ? ` (${f.count} times)` : ''}`);
    lines.push(`  Fix: ${f.hint}`, '');
  }
  if (unparsed.length > 0) {
    lines.push(`Not checked: ${count(unparsed.length, 'React example')} with syntax errors.`);
    for (const u of unparsed) lines.push(`  ${u.file}:${u.line}  "${u.title}"`);
    lines.push('');
  }
  const total = findings.reduce((sum, f) => sum + f.count, 0);
  lines.push(`docs-check: ${total === 0 ? 'no findings' : count(total, 'finding')} in ${count(checked, 'example snippet')} on ${count(pages, 'page')}.`);
  if (total > 0) lines.push('Tags, attributes and values come from dist/docs.json, so rebuild core after changing a component.');
  return `${lines.join('\n')}\n`;
}
