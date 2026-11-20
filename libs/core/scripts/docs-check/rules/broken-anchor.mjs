import { closest } from '../suggest.mjs';

/** Doc blocks that render no ids of their own, apart from Storybook's, which start with these prefixes. */
const DOC_BLOCKS = new Map([
  ['Meta', []],
  ['DocCanvas', []],
  ['DocArgsTable', []],
  ['DocTokenTable', []],
  ['StatusBadge', []],
  ['Canvas', ['story--', 'anchor--']],
  ['Story', ['story--', 'anchor--']],
  ['Controls', ['control-', 'set-']],
]);

const isComponentName = (name) => name[0] !== name[0].toLowerCase();

/**
 * A browser scrolls to the element whose id is the fragment as written or percent-decoded, and to the top of the
 * page for `#top` (HTML Standard, "find a potential indicated element").
 */
function resolves(hash, anchors) {
  if (anchors.has(hash) || hash.toLowerCase() === 'top') return true;
  try {
    return anchors.has(decodeURIComponent(hash));
  } catch {
    return false;
  }
}

/** Why the page may render an id the check can't see, or null when its headings and JSX ids are all it has. */
function unknownIds(target, hash, context) {
  if (target.dynamicIds) return 'sets an id with an expression or a spread, or renders content from code';
  for (const name of target.elements) {
    const prefixes = DOC_BLOCKS.get(name);
    if (prefixes?.some((prefix) => hash.startsWith(prefix))) return `renders <${name}>, whose Storybook ids start with ${prefixes.join(' or ')}`;
    if (!prefixes && isComponentName(name)) return `renders <${name}>, which can add ids of its own`;
    if (context.idTags.has(name)) return `renders <${name}>, which adds ids of its own`;
  }
  return null;
}

/**
 * Checks links to an anchor: `#slug` on the same page, and `#slug` on another MDX page. Anchors are headings, slugged
 * the way Storybook does, and the ids of JSX elements. A link is reported only when the page renders nothing else that
 * could hold an id; otherwise it's listed as not checked. A page with no MDX file has no anchors to check.
 */
export default {
  id: 'broken-anchor',
  scope: 'page',
  check(page, context) {
    return page.links.flatMap((link) => {
      if (!link.target?.hash) return [];
      const inPage = link.href.startsWith('#');
      const target = inPage ? page : context.anchors.get(link.target.id);
      if (!target || resolves(link.target.hash, target.anchors)) return [];
      const where = inPage ? 'this page' : link.target.id;
      const why = unknownIds(target, link.target.hash, context);
      if (why) return [{ line: link.line, skipped: true, message: `${link.href} matches no heading or element id on ${where}, which ${why}.` }];
      const suggestion = closest(link.target.hash, target.anchors);
      return [{
        line: link.line,
        message: `${link.href} matches no heading or element id on ${where}.`,
        hint: suggestion ? `Did you mean #${suggestion}?` : `Link to a heading that's on ${where}, or remove the anchor.`,
      }];
    });
  },
};
