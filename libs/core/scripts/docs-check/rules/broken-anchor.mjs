import { closest } from '../suggest.mjs';

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

/**
 * Checks links to an anchor: `#slug` on the same page, and `#slug` on another MDX page. Anchors are headings, slugged
 * the way Storybook does, and the ids of JSX elements. A page with no MDX file has no anchors to check.
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
      if (target.dynamicIds) {
        return [{ line: link.line, skipped: true, message: `${link.href} matches no heading or element id on ${where}, which sets an id with an expression or a spread.` }];
      }
      const suggestion = closest(link.target.hash, target.anchors);
      return [{
        line: link.line,
        message: `${link.href} matches no heading or element id on ${where}.`,
        hint: suggestion ? `Did you mean #${suggestion}?` : `Link to a heading that's on ${where}, or remove the anchor.`,
      }];
    });
  },
};
