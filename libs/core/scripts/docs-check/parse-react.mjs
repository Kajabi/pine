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

/** Functions, classes, enums and namespaces, declared or as expressions, whose name shadows an import of the same name. */
const isNamedScope = (node) =>
  (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isClassDeclaration(node) || ts.isClassExpression(node) ||
    ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node)) &&
  node.name !== undefined &&
  ts.isIdentifier(node.name);

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
 * The Pine element a JSX tag stands for: a `@pine-ds/react` import under any local name or through a namespace
 * import, a `Pds*` name the snippet doesn't import, or a `pds-*` tag (lowercased, as the DOM does). A name the
 * snippet also declares may be shadowed, so it is skipped. Null for anything else.
 */
function pineTarget(tagName, imports, declared) {
  if (ts.isPropertyAccessExpression(tagName) && ts.isIdentifier(tagName.expression)) {
    const namespace = tagName.expression.text;
    const imported = imports.get(namespace);
    const member = tagName.name.text;
    const isPine = imported?.namespace && imported.from === PINE_REACT && !declared.has(namespace) && COMPONENT_NAME.test(member);
    return isPine ? { written: `${namespace}.${member}`, reactName: member, tag: null } : null;
  }
  if (!ts.isIdentifier(tagName)) return null;
  const written = tagName.text;
  if (ELEMENT_NAME.test(written)) return { written, reactName: null, tag: written.toLowerCase() };
  if (declared.has(written)) return null;
  const imported = imports.get(written);
  if (imported) {
    const isPine = imported.from === PINE_REACT && !imported.namespace && COMPONENT_NAME.test(imported.name ?? '');
    return isPine ? { written, reactName: imported.name, tag: null } : null;
  }
  return COMPONENT_NAME.test(written) ? { written, reactName: written, tag: null } : null;
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
      if (clause?.name) imports.set(clause.name.text, { from, name: null, namespace: false });
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) imports.set(bindings.name.text, { from, name: null, namespace: true });
      if (bindings && ts.isNamedImports(bindings)) {
        for (const specifier of bindings.elements) {
          const name = (specifier.propertyName ?? specifier.name).text;
          imports.set(specifier.name.text, { from, name, namespace: false });
          if (from === PINE_ICONS) iconImports.set(specifier.name.text, name);
        }
      }
    } else if (isNamedScope(node)) {
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
    const target = pineTarget(node.tagName, imports, declared);
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
    elements.push({ ...target, line: lineOf(node), attributes, hasSpread: lastSpread !== -1 });
  }
  return { elements, iconImports, usesAddIcons };
}
