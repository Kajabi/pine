import ts from 'typescript';
import { compareStrings } from '../context.mjs';

const DEFAULT_TAGS = new Set(['defaultValue', 'default']);
const KEYWORDS = new Map([
  [ts.SyntaxKind.TrueKeyword, 'true'],
  [ts.SyntaxKind.FalseKeyword, 'false'],
  [ts.SyntaxKind.NullKeyword, 'null'],
]);
const BARE_WORD = /^[^\s()'"`]+$/;

const collapse = (text) => text.trim().replace(/\s+/g, ' ');

/** The value a literal expression stands for, read with the TypeScript compiler; null for any other expression. */
function literal(code) {
  const source = ts.createSourceFile('default.ts', `(${code});`, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const [statement] = source.statements;
  if (source.statements.length !== 1 || !ts.isExpressionStatement(statement) || !ts.isParenthesizedExpression(statement.expression)) return null;
  const { expression } = statement.expression;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return { kind: 'string', value: expression.text };
  if (ts.isNumericLiteral(expression)) return { kind: 'number', value: expression.text };
  if (ts.isPrefixUnaryExpression(expression) && expression.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(expression.operand)) {
    return { kind: 'number', value: `-${expression.operand.text}` };
  }
  if (KEYWORDS.has(expression.kind)) return { kind: 'keyword', value: KEYWORDS.get(expression.kind) };
  if (ts.isIdentifier(expression) && expression.text === 'undefined') return { kind: 'keyword', value: 'undefined' };
  return null;
}

/** The single value a JSDoc default tag states: a literal or one bare word. Null when the tag says more than that. */
function stated(text) {
  return literal(text) ?? (BARE_WORD.test(text) ? { kind: 'word', value: text } : null);
}

/** Compares as the code default's kind: numbers by value, keywords in any letter case, strings exactly. */
function canonical(value, kind) {
  if (kind === 'number') return String(Number(value));
  if (kind === 'keyword') return value.toLowerCase();
  return collapse(value);
}

/**
 * Compares each JSDoc `@defaultValue` (or `@default`) with the prop's default in code, as docs.json gives it. A finding
 * needs both to be single values: a literal in code, and a literal or bare word in the tag. Anything else is listed
 * as not checked. A tag on a prop with no default in code is listed for review, since that default often comes from
 * CSS or a fallback in the component.
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
        const text = collapse(docsTag.text ?? '');
        const where = `${tag}'s ${prop.name} prop: @${docsTag.name}`;
        if (prop.default === undefined) {
          if (text !== 'undefined') unset.push(prop.name);
          continue;
        }
        if (text === collapse(prop.default)) continue;
        const code = literal(prop.default);
        if (code?.kind === 'string' && collapse(code.value) === text) continue;
        const value = text === '' ? null : stated(text);
        if (!code || !value) {
          const why = text === '' ? 'has no value' : !code ? `can't be compared with the code default ${prop.default}, which isn't a literal` : 'says more than a single value';
          findings.push({ line, skipped: true, message: `${where} ${why}.` });
          continue;
        }
        if (canonical(value.value, code.kind) === canonical(code.value, code.kind)) continue;
        findings.push({
          line,
          message: `${where} says ${text}, but the code default is ${prop.default}.`,
          hint: `Make @${docsTag.name} match the code default, or change the default in code if the JSDoc is right.`,
        });
      }
    }
    if (unset.length > 0) {
      const names = [...new Set(unset)].sort(compareStrings);
      findings.push({
        line: source.members.props.get(names[0]) ?? source.componentLine,
        review: true,
        message: `${tag} sets no default in code for ${names.length === 1 ? 'a prop' : `${names.length} props`} whose JSDoc states one: ${names.join(', ')}.`,
        hint: "Check that each stated default is what the component does when the prop isn't set, for example through CSS or a fallback.",
      });
    }
    return findings;
  },
};
