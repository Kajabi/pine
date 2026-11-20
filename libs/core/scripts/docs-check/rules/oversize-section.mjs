/**
 * Docs tools hand agents one section per response, so each section has to fit in one. The Pine MCP caps a response
 * at 15,000 characters, and the page title, summary and list of subsections share that space with the section.
 */
export const SECTION_BUDGET = 8000;

/** A section as docs-content.json gives it: its heading and own markdown, where each example is a one-line placeholder. */
export const sectionSize = (section) => `${'#'.repeat(section.level)} ${section.heading}\n\n${section.markdown}`.length;

export default {
  id: 'oversize-section',
  scope: 'page',
  check(page) {
    return page.sections.flatMap((section) => {
      const size = sectionSize(section);
      if (size <= SECTION_BUDGET) return [];
      return [{
        line: page.headingLines.get(section.slug) ?? null,
        message: `"${section.heading}" is ${size} characters, over the ${SECTION_BUDGET}-character budget for one section (its heading and text, without subsections or example code).`,
        hint: 'Split it under subheadings, or move detail to the section or page it belongs to.',
      }];
    });
  },
};
