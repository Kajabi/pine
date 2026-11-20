import ts from 'typescript';
import { closedValues, compareStrings } from '../context.mjs';

const DEFAULT_TAGS = new Set(['defaultValue', 'default']);
const KEYWORDS = new Map([
  [ts.SyntaxKind.TrueKeyword, 'true'],
  [ts.SyntaxKind.FalseKeyword, 'false'],
  [ts.SyntaxKind.NullKeyword, 'null'],
]);
const BOOLEANS = new Set(['true', 'false']);
const WORD = /^[\p{L}\p{N}_#%+-]+(?:\.[\p{L}\p{N}_#%+-]+)*$/u;

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

/**
 * The single value a JSDoc default tag states: a literal, or one word such as `md`, `_blank`, `#fff` or `1.5rem`.
 * Null when the tag says more, including markdown emphasis (`_md_`) and trailing punctuation (`md.`).
 */
function stated(text) {
  const parsed = literal(text);
  if (parsed) return parsed;
  return WORD.test(text) && !(text.length > 2 && text.startsWith('_') && text.endsWith('_')) ? { kind: 'word', value: text } : null;
}

const asNumber = (value) => (value.value !== '' && !Number.isNaN(Number(value.value)) ? Number(value.value) : null);

/**
 * Whether the stated value contradicts the code default: true when it is certainly another value the prop can take,
 * false when it is the same value, and null when it can't be told, such as `MD` or `medium` for `'md'`, `1px` for
 * `1`, or `null` for `undefined`.
 */
function contradicts(value, code, prop) {
  if (code.kind === 'number') {
    const number = asNumber(value);
    return number === null ? null : number !== Number(code.value);
  }
  if (code.kind === 'keyword') {
    const keyword = value.value.toLowerCase();
    if (keyword === code.value) return false;
    return BOOLEANS.has(keyword) && BOOLEANS.has(code.value) ? true : null;
  }
  const text = collapse(value.value);
  if (text === collapse(code.value)) return false;
  return closedValues(prop)?.includes(text) ? true : null;
}

/**
 * Compares each JSDoc `@defaultValue` (or `@default`) with the prop's default in code, as docs.json gives it. It
 * reports only a tag that names another value the prop can take: another of a fixed set of strings, another number,
 * or the other boolean. Anything else that differs is listed as not checked. A tag on a prop with no default in code
 * is listed for review, since that default often comes from CSS or a fallback in the component.
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
        if (text === '') {
          findings.push({ line, skipped: true, message: `${where} has no value.` });
          continue;
        }
        if (prop.default === undefined) {
          if (text !== 'undefined') unset.push(prop.name);
          continue;
        }
        if (text === collapse(prop.default)) continue;
        const code = literal(prop.default);
        const value = stated(text);
        const result = code && value ? contradicts(value, code, prop) : null;
        if (result === false) continue;
        if (result === null) {
          const why = !code
            ? `can't be compared with the code default ${prop.default}, which isn't a literal`
            : !value
              ? 'says more than a single value'
              : `says ${text}, which can't be compared with the code default ${prop.default}`;
          findings.push({ line, skipped: true, message: `${where} ${why}.` });
          continue;
        }
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
