import ts from 'typescript';

const DEFAULT_TAGS = new Set(['defaultValue', 'default']);
const QUOTES = new Set(['"', "'", '`']);
const KEYWORDS = new Map([
  [ts.SyntaxKind.TrueKeyword, 'true'],
  [ts.SyntaxKind.FalseKeyword, 'false'],
  [ts.SyntaxKind.NullKeyword, 'null'],
]);

const collapse = (text) => text.trim().replace(/\s+/g, ' ');

/** The value a JSDoc default tag states, with surrounding quotes removed. */
function stated(text) {
  const value = collapse(text ?? '');
  return value.length >= 2 && QUOTES.has(value[0]) && value.at(-1) === value[0] ? value.slice(1, -1) : value;
}

/** The value a code default stands for when it's a literal, read with the TypeScript compiler; null for any other expression. */
function literal(code) {
  const source = ts.createSourceFile('default.ts', `(${code});`, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const [statement] = source.statements;
  if (source.statements.length !== 1 || !ts.isExpressionStatement(statement) || !ts.isParenthesizedExpression(statement.expression)) return null;
  const { expression } = statement.expression;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return { kind: 'string', value: expression.text };
  if (ts.isNumericLiteral(expression)) return { kind: 'number', value: Number(expression.text) };
  if (ts.isPrefixUnaryExpression(expression) && expression.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(expression.operand)) {
    return { kind: 'number', value: -Number(expression.operand.text) };
  }
  if (KEYWORDS.has(expression.kind)) return { kind: 'keyword', value: KEYWORDS.get(expression.kind) };
  if (ts.isIdentifier(expression) && expression.text === 'undefined') return { kind: 'keyword', value: 'undefined' };
  return null;
}

function matches(value, code) {
  if (collapse(code) === value || stated(code) === value) return true;
  const parsed = literal(code);
  if (!parsed) return null;
  if (parsed.kind === 'string') return collapse(parsed.value) === value;
  if (parsed.kind === 'number') return value !== '' && Number(value) === parsed.value;
  return parsed.value === value;
}

/**
 * Compares each JSDoc `@defaultValue` (or `@default`) with the prop's default in code, as docs.json gives it. Only
 * literal code defaults are compared. A tag on a prop with no default in code can't be checked, so it's listed for
 * review: such a default often comes from CSS or a fallback in the component.
 */
export default {
  id: 'wrong-default',
  scope: 'component',
  check({ tag, docs, source }) {
    const findings = [];
    const unset = [];
    for (const prop of docs.props) {
      const line = source.members.props.get(prop.name) ?? source.componentLine;
      for (const docsTag of prop.docsTags.filter((t) => DEFAULT_TAGS.has(t.name))) {
        const value = stated(docsTag.text);
        if (prop.default === undefined) {
          if (value !== 'undefined') unset.push({ name: prop.name, line });
          continue;
        }
        const result = matches(value, prop.default);
        if (result === true) continue;
        if (result === null) {
          findings.push({ line, skipped: true, message: `${tag}'s ${prop.name} prop: @${docsTag.name} says ${value}, and the code default ${prop.default} isn't a literal to compare it with.` });
          continue;
        }
        findings.push({
          line,
          message: `${tag}'s ${prop.name} prop: @${docsTag.name} says ${value}, but the code default is ${prop.default}.`,
          hint: `Make @${docsTag.name} match the code default, or change the default in code if the JSDoc is right.`,
        });
      }
    }
    if (unset.length > 0) {
      findings.push({
        line: unset[0].line,
        review: true,
        message: `${tag} sets no default in code for ${unset.length === 1 ? 'a prop' : `${unset.length} props`} whose JSDoc states one: ${unset.map((p) => p.name).join(', ')}.`,
        hint: "Check that each stated default is what the component does when the prop isn't set, for example through CSS or a fallback.",
      });
    }
    return findings;
  },
};
