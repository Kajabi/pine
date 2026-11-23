const SOURCE_KEYS = new Set(['webComponent', 'react']);

const indentOf = (line) => line.length - line.trimStart().length;

export const openingIndent = (node, source) => indentOf(source.slice(source.lastIndexOf('\n', node.start) + 1, node.start));

/**
 * A static template literal's text with each line indented as the MDX source has it: the MDX parser strips leading
 * spaces from continuation lines inside a JSX attribute. Undefined when the lines don't match.
 */
export function writtenTemplate(literal, source) {
  const { raw, cooked } = literal.quasis[0].value;
  const written = source.slice(literal.start + 1, literal.end - 1).split(/\r?\n/);
  const rawLines = raw.split('\n');
  const cookedLines = cooked.split('\n');
  const stripped = written.map((line, index) => line.slice(0, line.length - (rawLines[index]?.length ?? 0)));
  const aligned =
    written.length === rawLines.length &&
    cookedLines.length === rawLines.length &&
    written.every((line, index) => line.endsWith(rawLines[index]) && !stripped[index].trim());
  return aligned ? cookedLines.map((line, index) => stripped[index] + line).join('\n') : undefined;
}

/**
 * Removes the indentation the lines share. Code that starts right after the backtick lines up with the left margin or
 * with its property's line, so the other lines lose that line's indentation only when they all have it.
 */
export function dedent(code, openingIndent = 0) {
  const startsOnOpeningLine = !/^\s*\n/.test(code);
  const lines = code.replace(/^\s*\n/, '').replace(/\n\s*$/, '').split('\n');
  const first = startsOnOpeningLine ? [lines.shift().trimStart()] : [];
  const indents = lines.filter((line) => line.trim()).map(indentOf);
  const shared = startsOnOpeningLine
    ? (indents.every((indent) => indent >= openingIndent) ? openingIndent : 0)
    : Math.min(...indents);
  return [...first, ...lines.map((line) => line.slice(Number.isFinite(shared) ? shared : 0))].join('\n');
}

const stringLiteral = (value) => ({
  type: 'Literal',
  value,
  // JSON.stringify leaves U+2028 and U+2029 as they are, and some JavaScript parsers reject them in a string literal.
  raw: JSON.stringify(value).replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`),
});

function restoreExampleCode(docCanvas, source) {
  const mdxSource = docCanvas.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === 'mdxSource');
  const expression = mdxSource?.value?.data?.estree?.body?.[0]?.expression;
  if (expression?.type !== 'ObjectExpression') return;
  for (const property of expression.properties) {
    const literal = property.value;
    if (property.type !== 'Property' || property.computed || !SOURCE_KEYS.has(property.key.name ?? property.key.value)) continue;
    if (literal.type !== 'TemplateLiteral' || literal.expressions.length > 0) continue;
    const written = writtenTemplate(literal, source);
    if (written === undefined) continue;
    const { start, end, loc, range } = literal;
    property.value = { ...stringLiteral(dedent(written, openingIndent(literal, source))), start, end, loc, range };
  }
}

/**
 * Remark plugin for Storybook's MDX compiler. Gives each DocCanvas's `mdxSource.webComponent` and `mdxSource.react`
 * template literal the code docs-content.json has for it, so the code panel and Copy button keep the MDX's indentation.
 */
export function remarkExampleCode() {
  return (tree, file) => {
    const source = String(file);
    const visit = (node) => {
      const isJsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
      if (isJsx && node.name === 'DocCanvas') restoreExampleCode(node, source);
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
