import ts from 'typescript';

const PINE_REACT = '@pine-ds/react';
const PINE_ICONS = '@pine-ds/icons/icons';
const COMPONENT_NAME = /^Pds[A-Z]/;
const ELEMENT_NAME = /^pds-/i;

function syntaxErrors(source) {
  return ts.transpileModule(source, {
    fileName: 'snippet.tsx',
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.Latest },
  }).diagnostics.length;
}

function bindingNames(name, out) {
  if (ts.isIdentifier(name)) out.add(name.text);
  else for (const element of name.elements) if (!ts.isOmittedExpression(element)) bindingNames(element.name, out);
}

function attributeValue(initializer) {
  if (!initializer) return { kind: 'bare' };
  if (ts.isStringLiteral(initializer)) return { kind: 'string', text: initializer.text };
  const expression = ts.isJsxExpression(initializer) ? initializer.expression : undefined;
  if (expression && (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression))) {
    return { kind: 'string', text: expression.text };
  }
  return { kind: 'expression', identifier: expression && ts.isIdentifier(expression) ? expression.text : null };
}

/**
 * The Pine element a JSX tag name stands for: a `@pine-ds/react` import under any local name, a `Pds*` name the
 * snippet doesn't import or declare, or a `pds-*` tag (lowercased, as the DOM does). Null for anything else.
 */
function pineTarget(written, imports, declared) {
  const imported = imports.get(written);
  if (imported) return imported.from === PINE_REACT && COMPONENT_NAME.test(imported.name ?? '') ? { reactName: imported.name, tag: null } : null;
  if (ELEMENT_NAME.test(written)) return { reactName: null, tag: written.toLowerCase() };
  if (COMPONENT_NAME.test(written) && !declared.has(written)) return { reactName: written, tag: null };
  return null;
}

/**
 * Parses a React snippet with the TypeScript compiler. A snippet of sibling JSX elements is parsed inside a
 * fragment. Returns null when the snippet has syntax errors either way, because a recovered tree can't be trusted.
 *
 * An attribute followed by a spread is `overridable`: the spread may replace it at runtime.
 *
 * @returns {{ elements: import('./check.mjs').SnippetElement[], iconImports: Map<string, string>, usesAddIcons: boolean } | null}
 */
export function parseReact(code) {
  const attempt = [
    { source: code, offset: 0 },
    { source: `<>\n${code}\n</>`, offset: 1 },
  ].find(({ source }) => syntaxErrors(source) === 0);
  if (!attempt) return null;

  const sourceFile = ts.createSourceFile('snippet.tsx', attempt.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const lineOf = (node) => sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1 - attempt.offset;
  const imports = new Map();
  const iconImports = new Map();
  const declared = new Set();
  const jsx = [];
  let usesAddIcons = false;

  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const from = node.moduleSpecifier.text;
      const clause = node.importClause;
      if (clause?.name) imports.set(clause.name.text, { from, name: null });
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) imports.set(bindings.name.text, { from, name: null });
      if (bindings && ts.isNamedImports(bindings)) {
        for (const specifier of bindings.elements) {
          const name = (specifier.propertyName ?? specifier.name).text;
          imports.set(specifier.name.text, { from, name });
          if (from === PINE_ICONS) iconImports.set(specifier.name.text, name);
        }
      }
    } else if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name) {
      declared.add(node.name.text);
    } else if (ts.isVariableDeclaration(node) || ts.isParameter(node)) {
      bindingNames(node.name, declared);
    } else if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      jsx.push(node);
    } else if (ts.isIdentifier(node) && node.text === 'addIcons') {
      usesAddIcons = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  const elements = [];
  for (const node of jsx) {
    if (!ts.isIdentifier(node.tagName)) continue;
    const written = node.tagName.text;
    const target = pineTarget(written, imports, declared);
    if (!target) continue;
    const properties = node.attributes.properties;
    const lastSpread = properties.findLastIndex((p) => ts.isJsxSpreadAttribute(p));
    const attributes = [];
    properties.forEach((attribute, index) => {
      if (!ts.isJsxAttribute(attribute)) return;
      attributes.push({
        name: ts.isIdentifier(attribute.name) ? attribute.name.text : attribute.name.getText(sourceFile),
        value: attributeValue(attribute.initializer),
        line: lineOf(attribute),
        overridable: index < lastSpread,
      });
    });
    elements.push({ written, ...target, line: lineOf(node), attributes, hasSpread: lastSpread !== -1 });
  }
  return { elements, iconImports, usesAddIcons };
}
