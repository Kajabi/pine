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
 * Checks links to a heading: `#slug` on the same page, and `#slug` on another MDX page. Anchors come from the same
 * slugger the docs content uses, which matches Storybook's. The docs content promises that `#slug` points at a
 * heading, so a link to any other element's id counts as broken. A page with no MDX file has no headings to check,
 * so a link to one is listed as not checked.
 */
export default {
  id: 'broken-anchor',
  scope: 'page',
  check(page, context) {
    return page.links.flatMap((link) => {
      if (!link.target?.hash) return [];
      const inPage = link.href.startsWith('#');
      const anchors = inPage ? page.headingLines : context.anchors.get(link.target.id);
      if (!anchors) {
        if (!context.docsIds.has(link.target.id)) return [];
        return [{ line: link.line, skipped: true, message: `${link.href}: ${link.target.id} has no MDX page, so its headings aren't known.` }];
      }
      if (resolves(link.target.hash, anchors)) return [];
      const where = inPage ? 'this page' : link.target.id;
      const suggestion = closest(link.target.hash, anchors.keys());
      return [{
        line: link.line,
        message: `${link.href} matches no heading on ${where}.`,
        hint: suggestion
          ? `Did you mean #${suggestion}?`
          : `Link to a heading on ${where}. The docs content follows in-page links only to headings, so link to the heading above an element rather than to its id.`,
      }];
    });
  },
};
