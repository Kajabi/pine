import ts from 'typescript';

const PART_SEPARATOR = /[\t\n\f\r ]+/;

const lineOf = (node, source) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

const decoratorsOf = (node) => (ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : []);

function decoratorCall(node, name) {
  for (const decorator of decoratorsOf(node)) {
    const { expression } = decorator;
    if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression) && expression.expression.text === name) return expression;
  }
  return null;
}

function memberName(member) {
  return member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : null;
}

/** `@Event({ eventName: 'x' })` names the event `x`; otherwise Stencil uses the property name. */
function eventName(call, propertyName) {
  const [options] = call.arguments;
  if (!options || !ts.isObjectLiteralExpression(options)) return propertyName;
  for (const property of options.properties) {
    if (ts.isPropertyAssignment(property) && memberName(property) === 'eventName') {
      return ts.isStringLiteralLike(property.initializer) ? property.initializer.text : null;
    }
  }
  return propertyName;
}

/**
 * The text of a JSX attribute written as a string literal, `name="x"` or `name={'x'}`; null for anything else. The
 * compiler leaves HTML entities in `name="…"` undecoded, so such text with an `&` counts as unknown too.
 */
function literalValue(attribute) {
  const { initializer } = attribute;
  if (initializer && ts.isStringLiteral(initializer)) return initializer.text.includes('&') ? null : initializer.text;
  if (initializer && ts.isJsxExpression(initializer) && initializer.expression && ts.isStringLiteral(initializer.expression)) return initializer.expression.text;
  return null;
}

const attributeName = (attribute) => (ts.isIdentifier(attribute.name) ? attribute.name.text : null);

/** The keys of an object literal whose keys are all written out, such as `{ role: 'x', 'aria-busy': y }`; else null. */
function literalKeys(object) {
  const keys = new Set();
  for (const property of object.properties) {
    if (!(ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property))) return null;
    const name = memberName(property);
    if (name === null) return null;
    keys.add(name);
  }
  return keys;
}

/**
 * What a component's source file declares, read with the TypeScript compiler: the lines of its `@Component` class
 * and its `@Prop`, `@Event` and `@Method` members, the slots and parts its JSX renders, and whether its JSX sets an
 * `id`. A spread counts unless it spreads a `const` object literal in the file whose keys are all written out and
 * don't include `id`. Slots and parts whose names are only known at run time are listed apart.
 */
export function readComponentSource(code, fileName) {
  const kind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, kind);
  const members = { props: new Map(), events: new Map(), methods: new Map() };
  const slots = [];
  const parts = [];
  const dynamic = [];
  let componentLine = null;
  const ids = { onHost: false, anywhere: false };
  const objectKeys = new Map();
  const spreads = [];
  const setsId = (onHost) => {
    ids.anywhere = true;
    if (onHost) ids.onHost = true;
  };

  const addMember = (kind, name, node) => {
    if (name !== null && !members[kind].has(name)) members[kind].set(name, lineOf(node, source));
  };

  const visitOpening = (opening) => {
    const attributes = opening.attributes.properties;
    const onHost = ts.isIdentifier(opening.tagName) && opening.tagName.text === 'Host';
    for (const attribute of attributes) {
      if (ts.isJsxSpreadAttribute(attribute)) spreads.push({ onHost, name: ts.isIdentifier(attribute.expression) ? attribute.expression.text : null });
      else if (attributeName(attribute) === 'id') setsId(onHost);
    }
    const isSlot = ts.isIdentifier(opening.tagName) && opening.tagName.text === 'slot';
    if (isSlot) {
      const nameAttribute = attributes.find((a) => ts.isJsxAttribute(a) && attributeName(a) === 'name');
      const hasSpread = attributes.some((a) => ts.isJsxSpreadAttribute(a));
      const name = nameAttribute ? literalValue(nameAttribute) : hasSpread ? null : '';
      if (name === null) dynamic.push({ kind: 'slot', line: lineOf(opening, source) });
      else slots.push({ name, line: lineOf(opening, source) });
    }
    for (const attribute of attributes) {
      if (!ts.isJsxAttribute(attribute) || attributeName(attribute) !== 'part') continue;
      const value = literalValue(attribute);
      if (value === null) {
        dynamic.push({ kind: 'part', line: lineOf(attribute, source) });
        continue;
      }
      for (const name of value.split(PART_SEPARATOR).filter(Boolean)) parts.push({ name, line: lineOf(attribute, source) });
    }
  };

  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && ts.getCombinedNodeFlags(node) & ts.NodeFlags.Const) {
      const keys = node.initializer && ts.isObjectLiteralExpression(node.initializer) ? literalKeys(node.initializer) : null;
      objectKeys.set(node.name.text, objectKeys.has(node.name.text) ? null : keys);
    }
    if (ts.isClassDeclaration(node) && componentLine === null && decoratorCall(node, 'Component')) componentLine = lineOf(node.name ?? node, source);
    if (ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) {
      if (decoratorCall(node, 'Prop')) addMember('props', memberName(node), node.name);
    }
    if (ts.isPropertyDeclaration(node)) {
      const name = memberName(node);
      if (decoratorCall(node, 'Prop')) addMember('props', name, node.name);
      const event = decoratorCall(node, 'Event');
      if (event) addMember('events', name === null ? null : eventName(event, name), node.name);
    }
    if (ts.isMethodDeclaration(node) && decoratorCall(node, 'Method')) addMember('methods', memberName(node), node.name);
    if (ts.isJsxElement(node)) visitOpening(node.openingElement);
    if (ts.isJsxSelfClosingElement(node)) visitOpening(node);
    ts.forEachChild(node, visit);
  };
  visit(source);
  for (const spread of spreads) {
    const keys = spread.name === null ? null : objectKeys.get(spread.name);
    if (!keys || keys.has('id')) setsId(spread.onHost);
  }

  return { componentLine, members, slots, parts, dynamic, ids };
}
