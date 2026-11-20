import { parseMdx } from '../docs-content/extract.mjs';

export const LANGUAGES = ['webComponent', 'react'];

const normalize = (code) =>
  code
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

function staticTemplate(expression) {
  if (expression?.type === 'Literal' && typeof expression.value === 'string') return { cooked: expression.value, raw: expression.raw.slice(1, -1) };
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0) return expression.quasis[0].value;
  return null;
}

/**
 * Where each language's code starts in the MDX file. The extractor drops leading blank lines, so the first kept line
 * follows them. Escaped newlines would shift every later line, so then only the DocCanvas line is known.
 */
function codeStart(property, canvasLine) {
  const text = staticTemplate(property.value);
  if (!text) return null;
  const leading = /^\s*\n/.exec(text.cooked)?.[0] ?? '';
  const exact = text.cooked.split('\n').length === text.raw.split('\n').length;
  return {
    normalized: normalize(text.cooked),
    line: exact ? property.value.loc.start.line + leading.split('\n').length - 1 : canvasLine,
    exact,
  };
}

/**
 * The DocCanvas elements the extractor can turn into examples. It drops any inside a list, quote, table or
 * paragraph, so those are skipped here too, or one with the same code could take a kept example's line.
 */
function docCanvases(source) {
  const canvases = [];
  const visit = (node) => {
    if (node.type !== 'root' && node.type !== 'mdxJsxFlowElement') return;
    if (node.name === 'DocCanvas') {
      const mdxSource = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === 'mdxSource');
      const object = mdxSource?.value?.data?.estree?.body?.[0]?.expression;
      const code = {};
      for (const property of object?.type === 'ObjectExpression' ? object.properties : []) {
        const key = property.key?.name ?? property.key?.value;
        if (LANGUAGES.includes(key)) code[key] = codeStart(property, node.position.start.line);
      }
      canvases.push(code);
    }
    node.children?.forEach(visit);
  };
  visit(parseMdx(source));
  return canvases;
}

function pageExamples(doc) {
  const examples = [...doc.examples];
  const walk = (sections) => {
    for (const section of sections) {
      examples.push(...section.examples);
      walk(section.children);
    }
  };
  walk(doc.sections);
  return examples;
}

/**
 * The code of every DocCanvas example in docs-content, with the MDX line its code starts on.
 * An example is matched to the next DocCanvas in the file whose code is the same apart from indentation.
 *
 * @param {import('../docs-content/docs-content').DocsContentDoc[]} docs
 * @param {(file: string) => string} readSource Reads a repo-relative file.
 */
export function collectSnippets(docs, readSource) {
  const snippets = [];
  for (const doc of docs) {
    const examples = pageExamples(doc);
    if (examples.length === 0) continue;
    const canvases = docCanvases(readSource(doc.file));
    let next = 0;
    for (const example of examples) {
      const matches = (canvas) =>
        LANGUAGES.every((language) => (example[language] === null ? !canvas[language] : canvas[language]?.normalized === normalize(example[language])));
      while (next < canvases.length && !matches(canvases[next])) next++;
      if (next === canvases.length) throw new Error(`${doc.file}: no DocCanvas matches the "${example.title}" example in docs-content`);
      const canvas = canvases[next++];
      for (const language of LANGUAGES) {
        if (example[language] === null) continue;
        const { line, exact } = canvas[language];
        snippets.push({ file: doc.file, title: example.title, language, code: example[language], line, exactLines: exact });
      }
    }
  }
  return snippets;
}
