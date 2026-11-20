import ts from 'typescript';

export const compareStrings = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** The React wrapper name for a tag, as `@pine-ds/react` derives it (`dashToPascalCase`). */
export const reactName = (tag) =>
  tag
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

/** The attribute name the React wrappers set for a prop name (`camelToDashCase`). */
export const dashCase = (name) => name.replace(/([A-Z])/g, (letter) => `-${letter[0].toLowerCase()}`);

/** The string literals of a type written as a union of string literals only, such as `"sm" | "md"`; otherwise null. */
function stringLiteralUnion(type) {
  const source = ts.createSourceFile('type.ts', `type T = ${type};`, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const statement = source.statements[0];
  if (source.statements.length !== 1 || !statement || !ts.isTypeAliasDeclaration(statement)) return null;
  const members = ts.isUnionTypeNode(statement.type) ? statement.type.types : [statement.type];
  const literals = [];
  for (const member of members) {
    if (!ts.isLiteralTypeNode(member) || !ts.isStringLiteral(member.literal)) return null;
    literals.push(member.literal.text);
  }
  return literals;
}

/**
 * The values a prop accepts when docs.json says its type is exactly a union of string literals, or null when
 * the type is open (`string`, `string & Record<never, never>`, numbers, booleans, objects).
 */
export function closedValues(prop) {
  const { values = [] } = prop;
  if (values.length === 0 || !values.every((v) => v.type === 'string' && typeof v.value === 'string')) return null;
  const declared = stringLiteralUnion(prop.type ?? '');
  if (!declared) return null;
  const listed = values.map((v) => v.value).sort(compareStrings);
  const typed = [...new Set(declared)].sort(compareStrings);
  return listed.length === typed.length && listed.every((value, i) => value === typed[i]) ? listed : null;
}

/** Each page's heading anchors by Storybook id. When two pages share an id, the first keeps it, as in the docs content. */
function anchorsById(pages) {
  const anchors = new Map();
  for (const page of pages) {
    if (!anchors.has(page.storybookId)) anchors.set(page.storybookId, new Set(page.headings.map((h) => h.slug)));
  }
  return anchors;
}

/**
 * Everything the rules look up, built from plain data so tests can pass fixtures.
 *
 * @param {object} input
 * @param {object[]} input.components `components` from docs.json files: core's and the one `@pine-ds/icons` ships.
 * @param {string[]} input.iconNames Icon names `pds-icon` accepts in `name`.
 * @param {string[]} input.iconExports Names `@pine-ds/icons/icons` exports.
 * @param {string} input.iconsVersion
 * @param {{ storybookId: string, headings: { slug: string }[] }[]} [input.pages] Every MDX page with its heading anchors.
 * @param {string[]} [input.storyDocsIds] The docs page id Storybook gives each stories file, which exists even with no MDX page.
 * @param {string[]} [input.unknownStories] Stories files with no title or that don't parse, whose docs page id isn't known.
 */
export function buildContext({ components, iconNames, iconExports, iconsVersion, pages = [], storyDocsIds = [], unknownStories = [] }) {
  const byTag = new Map();
  for (const component of components) {
    if (!component.tag.startsWith('pds-')) continue;
    // docs.json omits `attr` for array, object and function props, but Stencil's runtime still observes an attribute
    // named after the prop (`m[1] || propName` in its observedAttributes), so `value='["a"]'` reaches the prop.
    const props = component.props.map((prop) => ({ name: prop.name, attribute: prop.attr ?? prop.name, values: closedValues(prop) }));
    byTag.set(component.tag, {
      tag: component.tag,
      byAttr: new Map(props.map((p) => [p.attribute, p])),
      byName: new Map(props.map((p) => [p.name, p])),
    });
  }
  const tags = [...byTag.keys()].sort(compareStrings);
  return {
    tags,
    components: byTag,
    reactTags: new Map(tags.map((tag) => [reactName(tag), tag])),
    iconNames: new Set(iconNames),
    iconExports: new Set(iconExports),
    iconsVersion,
    anchors: anchorsById(pages),
    docsIds: new Set([...pages.map((page) => page.storybookId), ...storyDocsIds]),
    unknownStories: [...unknownStories].sort(compareStrings),
  };
}
