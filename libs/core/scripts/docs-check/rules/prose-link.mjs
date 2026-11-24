const MARKDOWN_FORMS =
  '[text](#heading) for a heading on the same page, [text](/docs/<id>) for another Storybook page and [text](https://…) for another site';

const written = (link) => (link.href === null ? `<${link.tag}>` : `<${link.tag} href="${link.href}">`);

/**
 * Checks that links in a page's prose are markdown, the only links Storybook styles like pds-link, follows within its
 * UI, and opens in a new tab when they lead to another site. Links in example code aren't prose.
 */
export default {
  id: 'prose-link',
  scope: 'page',
  check(page) {
    return page.jsxLinks.map((link) => ({
      line: link.line,
      message: `${written(link)} is a JSX link in prose. Only markdown links get Storybook's link style, in-app navigation to headings and pages, and a new tab for other sites.`,
      hint: `Write it as markdown: ${MARKDOWN_FORMS}.`,
    }));
  },
};
