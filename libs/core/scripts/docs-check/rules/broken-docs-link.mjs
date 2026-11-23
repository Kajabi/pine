import { closest } from '../suggest.mjs';

const DOCS_SUFFIX = '--docs';

/**
 * Checks Storybook links to a docs page (`?path=/docs/<id>--docs`) against every MDX page and every stories file's
 * docs page. Links to a single story need Storybook's own index, so they're listed as not checked.
 */
export default {
  id: 'broken-docs-link',
  scope: 'page',
  check(page, context) {
    return page.links.flatMap((link) => {
      if (link.href.startsWith('#')) return [];
      if (!link.target) {
        return [{ line: link.line, skipped: true, message: `${link.href} isn't an in-page, Storybook docs or absolute link.` }];
      }
      const { id } = link.target;
      if (!id.endsWith(DOCS_SUFFIX)) {
        return [{ line: link.line, skipped: true, message: `${link.href} links to a story, and story ids need Storybook's own index.` }];
      }
      if (context.docsIds.has(id)) return [];
      if (context.unknownStories.length > 0 || context.docsIds.has(id.toLowerCase())) {
        const why = context.unknownStories.length > 0 ? `the docs page id of ${context.unknownStories.join(', ')} isn't known` : 'it differs from a docs page id only in letter case';
        return [{ line: link.line, skipped: true, message: `${link.href} matches no docs page, but ${why}.` }];
      }
      const suggestion = closest(id, context.docsIds);
      return [{
        line: link.line,
        message: `${link.href} links to ${id}, which no MDX page or stories file has.`,
        hint: suggestion ? `Did you mean ${suggestion}?` : 'Link to an existing docs page; its id is in the page URL.',
      }];
    });
  },
};
