import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildDocsContent } from '../../docs-content/extract.mjs';
import { checkDocs, formatReport } from '../check.mjs';
import { buildContext } from '../context.mjs';
import { pageTargets } from '../load.mjs';
import { SECTION_BUDGET } from '../rules/oversize-section.mjs';

const GUIDE = 'libs/core/src/stories/guides/fixture.docs.mdx';
const OTHER = 'libs/core/src/stories/guides/other.docs.mdx';

const page = (title, body) => `import { Meta } from '@storybook/addon-docs/blocks';
import { DocCanvas } from '@pine-ds/doc-components';

<Meta title="Guides/${title}" />

# ${title}

${body}
`;

const OTHER_BODY = '## Usage\n\nText.\n\n## Usage\n\nMore text.\n';

function checkPages(pages, { storyDocsIds = ['components-table-rows--docs'], unknownStories = [], statusManifest = {} } = {}) {
  const { content, pageLinks } = buildDocsContent({
    pages,
    components: [],
    statusManifest,
    readStories: () => {
      throw new Error('no stories');
    },
    version: '0.0.0',
    commit: null,
  });
  const sources = new Map(pages.map(({ file, source }) => [file, source]));
  const context = buildContext({ components: [], iconNames: [], iconExports: [], iconsVersion: '0', pages: pageLinks, storyDocsIds, unknownStories });
  return checkDocs({ pages: pageTargets(content, pageLinks, (file) => sources.get(file)) }, context);
}

/** Checks the fixture page next to a second page, with the docs ids that stories files give. */
function check(body, { other = OTHER_BODY, ...options } = {}) {
  return checkPages([{ file: GUIDE, source: page('Fixture', body) }, { file: OTHER, source: page('Other', other) }], options);
}

const messages = (result) => result.findings.map((f) => `${f.rule}:${f.line}: ${f.message}`);
const ruleMessages = (result, rule) => messages(result).filter((message) => message.startsWith(`${rule}:`));
const skips = (result) => result.skipped.map((s) => `${s.rule}:${s.line}`);

describe('broken-anchor', () => {
  it('passes in-page links to headings, repeated headings numbered the way the slugger does, and #top', () => {
    const body = [
      '## Border',
      '',
      'See [border](#border), [the second](#border-1), [code](#the-size-prop) and [top](#top).',
      '',
      '## Border',
      '',
      '### The `size` prop',
      '',
      '[Encoded](#the%2Dsize%2Dprop) and [inline](<#border>).',
    ].join('\n');
    assert.deepEqual(messages(check(body)), []);
  });

  it('fails an in-page link to a heading the page lacks, with the closest slug', () => {
    const result = check('## Border\n\nSee [border](#bordr) and [missing](#nothing-like-it).\n\n## Border\n\n[Third](#border-2)');
    assert.deepEqual(messages(result), [
      'broken-anchor:10: #bordr matches no heading on this page.',
      'broken-anchor:10: #nothing-like-it matches no heading on this page.',
      'broken-anchor:14: #border-2 matches no heading on this page.',
    ]);
    assert.equal(result.findings[0].hint, 'Did you mean #border?');
  });

  it("fails a link to an element's id, since the docs content follows in-page links only to headings", () => {
    const result = check('## Usage\n\n[Details](#details) <a id="anchor"></a>\n\n<div id="details">Details</div>');
    assert.deepEqual([messages(result), skips(result)], [['broken-anchor:10: #details matches no heading on this page.'], []]);
    assert.match(result.findings[0].hint, /follows in-page links only to headings/);
  });

  it('checks JSX links outside examples, and never links inside a DocCanvas', () => {
    const body = [
      '## Usage',
      '',
      '<pds-link href="#usage">Usage</pds-link> <a href="#nope">Nope</a>',
      '',
      '<DocCanvas mdxSource={{ webComponent: `<a href="#profile">Profile</a>` }}>',
      '  <pds-link href="#profile">Profile</pds-link>',
      '</DocCanvas>',
    ].join('\n');
    assert.deepEqual(ruleMessages(check(body), 'broken-anchor'), ['broken-anchor:10: #nope matches no heading on this page.']);
  });

  it('checks an anchor on another MDX page, and lists one on a page with no MDX file as not checked', () => {
    const body = [
      '## Links',
      '',
      '[Usage](../?path=/docs/guides-other--docs#usage-1) [Rows](../?path=/docs/components-table-rows--docs#anything)',
      '',
      '[Missing](../?path=/docs/guides-other--docs#examples)',
    ].join('\n');
    const result = check(body);
    assert.deepEqual(messages(result), ['broken-anchor:12: ../?path=/docs/guides-other--docs#examples matches no heading on guides-other--docs.']);
    assert.deepEqual(skips(result), ['broken-anchor:10']);
  });

  it('checks links inside JSX the docs content keeps as is, but not example code inside it', () => {
    const body = [
      '## Usage',
      '',
      '<section>',
      '',
      '[Usage](#usage) [Gone](#gone)',
      '',
      '<a href="#also-gone">x</a>',
      '',
      '<DocCanvas mdxSource={{ webComponent: `<a href="#x">x</a>` }}>',
      '  <a href="#profile">Profile</a>',
      '</DocCanvas>',
      '',
      '</section>',
    ].join('\n');
    assert.deepEqual(ruleMessages(check(body), 'broken-anchor'), [
      'broken-anchor:12: #gone matches no heading on this page.',
      'broken-anchor:14: #also-gone matches no heading on this page.',
    ]);
  });
});

describe('broken-docs-link', () => {
  it('passes links to MDX pages and to the docs page a stories file gets', () => {
    const body = '## Links\n\n[Other](../?path=/docs/guides-other--docs) [Rows](/?path=/docs/components-table-rows--docs) [Self](../?path=/docs/guides-fixture--docs)';
    assert.deepEqual(messages(check(body)), []);
  });

  it('fails a link to a docs id no page or stories file has, with the closest id', () => {
    const result = check('## Links\n\n[Other](../?path=/docs/guides-othr--docs)');
    assert.deepEqual(messages(result), ['broken-docs-link:10: ../?path=/docs/guides-othr--docs links to guides-othr--docs, which no MDX page or stories file has.']);
    assert.equal(result.findings[0].hint, 'Did you mean guides-other--docs?');
  });

  it('lists story links and other relative links as not checked, never as findings', () => {
    const result = check('## Links\n\n[Default](../?path=/docs/components-button--default) [Story](../?path=/story/components-button--primary)');
    assert.deepEqual(messages(result), []);
    assert.deepEqual(skips(result), ['broken-docs-link:10', 'broken-docs-link:10']);
  });

  it("doesn't fail an unknown id while a stories file's docs id is unknown, or when only letter case differs", () => {
    const unknown = check('## Links\n\n[Gone](../?path=/docs/guides-gone--docs)', { unknownStories: ['libs/core/src/x.stories.js'] });
    assert.deepEqual([messages(unknown), skips(unknown)], [[], ['broken-docs-link:10']]);
    assert.match(formatReport(unknown), /the docs page id of libs\/core\/src\/x\.stories\.js isn't known/);
    const cased = check('## Links\n\n[Other](../?path=/docs/Guides-Other--docs)');
    assert.deepEqual([messages(cased), skips(cased)], [[], ['broken-docs-link:10']]);
  });
});

describe('prose-link', () => {
  const found = (line, written) =>
    `prose-link:${line}: ${written} is a JSX link in prose. Only markdown links get Storybook's link style, in-app navigation to headings and pages, and a new tab for other sites.`;

  it('fails <a>, <pds-link> and <PdsLink> in a paragraph, a list item, a JSX table cell and a quote on a guide, at their lines', () => {
    const body = [
      '## Links',
      '',
      'See <a href="#links">links</a> and <pds-link href="/docs/guides-other--docs">Other</pds-link>.',
      '',
      '- <a href="https://example.com">Example</a>',
      '- <PdsLink href="#links">Links</PdsLink>',
      '',
      '<pds-table>',
      '  <pds-table-body>',
      '    <pds-table-row>',
      '      <pds-table-cell>See <a href="#links">Links</a>.</pds-table-cell>',
      '      <pds-table-cell><pds-link href="#links">Links</pds-link></pds-table-cell>',
      '    </pds-table-row>',
      '  </pds-table-body>',
      '</pds-table>',
      '',
      '> **Note:** see <a href="#links">links</a>, or <pds-link href="https://example.com" external>Example</pds-link>.',
    ].join('\n');
    const result = check(body);
    assert.deepEqual(messages(result), [
      found(10, '<a href="#links">'),
      found(10, '<pds-link href="/docs/guides-other--docs">'),
      found(12, '<a href="https://example.com">'),
      found(13, '<PdsLink href="#links">'),
      found(18, '<a href="#links">'),
      found(19, '<pds-link href="#links">'),
      found(24, '<a href="#links">'),
      found(24, '<pds-link href="https://example.com">'),
    ]);
    assert.equal(
      result.findings[0].hint,
      'Write it as markdown: [text](#heading) for a heading on the same page, [text](/docs/<id>) for another Storybook page and [text](https://…) for another site.',
    );
  });

  it('fails a JSX link on a component page too', () => {
    const source = page('Widget', 'See <pds-link href="#widget">the widget</pds-link>.');
    const result = checkPages([{ file: 'libs/core/src/components/pds-widget/docs/pds-widget.mdx', source }]);
    assert.deepEqual(ruleMessages(result, 'prose-link'), [found(8, '<pds-link href="#widget">')]);
  });

  it("reports only the link in prose, not those in a DocCanvas preview or its mdxSource, a Canvas, a Story, a code fence or inline code", () => {
    const body = [
      '## Examples',
      '',
      '<DocCanvas mdxSource={{ webComponent: `<a href="#examples">Profile</a>`, react: `<PdsLink href="#examples">Profile</PdsLink>` }}>',
      '  <pds-box>',
      '    <pds-link href="#examples">Profile</pds-link>',
      '  </pds-box>',
      '</DocCanvas>',
      '',
      '<Canvas>',
      '  <a href="#examples">Profile</a>',
      '</Canvas>',
      '',
      '<Story name="Links">',
      '  <pds-link href="#examples">Profile</pds-link>',
      '</Story>',
      '',
      '```html',
      '<a href="#examples">Profile</a>',
      '```',
      '',
      'Write `<a href="#examples">` or `<pds-link href="#examples">` in code.',
      '',
      'Only <a href="#examples">this one</a> is prose.',
    ].join('\n');
    assert.deepEqual(messages(check(body)), [found(30, '<a href="#examples">')]);
  });

  it('reports only the JSX link, not markdown links, reference-style links or markdown inside a JSX wrapper', () => {
    const body = [
      '## Links',
      '',
      '[Links](#links), [Other](/docs/guides-other--docs), [Site](https://example.com) and [a reference][site].',
      '',
      '<pds-box>',
      '',
      '[Links](#links) inside a box.',
      '',
      '</pds-box>',
      '',
      '[site]: https://example.com',
      '',
      'Only <a href="#links">this one</a> is JSX.',
    ].join('\n');
    assert.deepEqual(messages(check(body)), [found(20, '<a href="#links">')]);
  });

  it('reports an <a> whose href is an expression by its tag, and not an <a> with no href, which is an anchor rather than a link', () => {
    const body = ['## Links', '', '<a id="links-anchor"></a> <a name="old-anchor" />', '', 'See <a href={url}>the link</a>.'].join('\n');
    assert.deepEqual(messages(check(body)), [found(12, '<a>')]);
  });
});

describe('oversize-section', () => {
  const atBudget = (heading) => `## ${heading}\n\n${'x'.repeat(SECTION_BUDGET - `## ${heading}\n\n`.length)}`;

  it("passes a section at the budget, and doesn't count its subsections or example code", () => {
    assert.deepEqual(messages(check(atBudget('Big'))), []);
    const longExample = `<DocCanvas mdxSource={{ webComponent: \`${'<pds-button>Long</pds-button>\n'.repeat(400)}\` }} />`;
    const parent = `## Parent\n\n${'x'.repeat(SECTION_BUDGET / 2)}\n\n${longExample}`;
    const child = `### Child\n\n${'y'.repeat(SECTION_BUDGET / 2)}`;
    assert.deepEqual(messages(check(`${parent}\n\n${child}`)), []);
  });

  it('fails a section over the budget at its heading line', () => {
    assert.deepEqual(messages(check(`Intro.\n\n${atBudget('Big')}z`)), [
      `oversize-section:10: "Big" is ${SECTION_BUDGET + 1} characters, over the ${SECTION_BUDGET}-character budget for one section (its heading and text, without subsections or example code).`,
    ]);
  });
});

describe('heading-contract', () => {
  const COMPONENT = 'libs/core/src/components/pds-widget/docs/pds-widget.mdx';
  const BADGE = '<StatusBadge component="pds-widget" />';
  const TEMPLATE = [
    '# Widget',
    '',
    'A widget groups related controls.',
    '',
    '## Guidelines',
    '',
    '### When to use',
    '',
    '- Grouping controls.',
    '',
    '### When not to use',
    '',
    '- A single control.',
    '',
    '### Accessibility',
    '',
    '- Label the group.',
    '',
    '## Properties',
    '',
    '<DocArgsTable componentName="pds-widget" />',
    '',
    '## Examples',
    '',
    '### Default',
    '',
    'A default widget.',
    '',
    '## Playground',
    '',
    'The main story.',
  ].join('\n');

  /** Checks a component page whose body starts at line 9, after the imports, the Meta and the status badge. */
  const checkComponent = (body, { badge = BADGE, statusManifest = { 'pds-widget': { status: 'stable' } } } = {}) => {
    const source = `import { Meta } from '@storybook/addon-docs/blocks';
import { DocArgsTable } from '@pine-ds/doc-components';
import { StatusBadge } from '../../../stories/_helpers';

<Meta title="Components/Widget" />

${badge}

${body}
`;
    return checkPages([{ file: COMPONENT, source }], { statusManifest });
  };

  const THREE = '### When to use, ### When not to use and ### Accessibility';

  it('passes a page that follows the template', () => {
    const result = checkComponent(TEMPLATE);
    assert.deepEqual([messages(result), skips(result)], [[], []]);
  });

  it('passes topic ## sections between Guidelines and Properties, and a page with no ## Examples', () => {
    const topics = TEMPLATE.replace('## Properties', '## Modes\n\nText.\n\n### Filtering\n\nText.\n\n## Triggers\n\nText.\n\n## Properties');
    assert.deepEqual(messages(checkComponent(topics)), []);
    const noExamples = TEMPLATE.replace('## Examples\n\n### Default\n\nA default widget.', '## Usage\n\n### Sizes\n\nText.\n\n## Modal\n\nText.');
    assert.deepEqual(messages(checkComponent(noExamples)), []);
  });

  it('passes a ## Keyboard interactions section after Guidelines, with its own subheadings', () => {
    const keyboard = TEMPLATE.replace('## Properties', '## Keyboard interactions\n\n### On the trigger\n\n- Enter opens it.\n\n#### Arrows\n\n- Down moves.\n\n## Properties');
    assert.deepEqual(messages(checkComponent(keyboard)), []);
  });

  it('passes ## Properties and ## Playground in any letter case, and a blank line that holds spaces', () => {
    const body = TEMPLATE.replace('## Properties', '## properties').replace('## Playground', '## PLAYGROUND').replace('### Accessibility\n\n', '### Accessibility\n  \n');
    assert.deepEqual(messages(checkComponent(body)), []);
  });

  it("doesn't check guides, which have no template", () => {
    const result = check('## Overview\n\nText.');
    assert.deepEqual(result.findings.filter((f) => f.rule === 'heading-contract'), []);
  });

  it('fails a page with no # title, or an empty one, and still checks a # heading after it', () => {
    const noTitle = 'heading-contract:1: The page has no # title, or its # heading is empty.';
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('# Widget\n\n', ''))), [noTitle]);
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('# Widget', '#'))), [noTitle]);
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('# Widget', '#\n\n# Widget'))), [
      noTitle,
      'heading-contract:11: "# Widget" is a second # heading. The docs content takes only the first one as the page title.',
    ]);
  });

  it('fails a second # heading and a heading above the title', () => {
    const second = TEMPLATE.replace('## Examples', '# Examples');
    assert.deepEqual(messages(checkComponent(second)), [
      'heading-contract:31: "# Examples" is a second # heading. The docs content takes only the first one as the page title.',
    ]);
    const above = `## Overview\n\nText.\n\n${TEMPLATE}`;
    assert.deepEqual(messages(checkComponent(above)), [
      'heading-contract:9: "## Overview" comes before the "# Widget" title, which must be the page\'s first heading.',
      'heading-contract:13: The page has no summary under "# Widget", so the docs content has no description for the component.',
    ]);
  });

  it('fails a title with no summary under it, or a first paragraph with no text', () => {
    const summary = 'heading-contract:9: The page has no summary under "# Widget", so the docs content has no description for the component.';
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('A widget groups related controls.\n\n', ''))), [summary]);
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('A widget groups related controls.', '<img src="widget.png" alt="" />'))), [summary]);
  });

  it("doesn't decide which # heading is the title when one sits inside a quote, and never fails for it", () => {
    const quoted = `> # Quoted title\n\n## Overview\n\nText.\n\n${TEMPLATE}`;
    const result = checkComponent(quoted);
    assert.deepEqual(messages(result), ['heading-contract:1: The page has no summary under "# Widget", so the docs content has no description for the component.']);
    assert.deepEqual(skips(result), ['heading-contract:9']);
    assert.match(formatReport(result), /# headings at lines 9, 15 sit outside the page's sections/);
  });

  it('fails a page with no status: no badge, a badge whose component has none, or an invalid status', () => {
    const message = 'heading-contract:9: The docs content has no status for the page. It needs a <StatusBadge> at the top level whose component is in component-status.json, with a status of stable, beta or deprecated.';
    const noBadge = checkComponent(TEMPLATE, { badge: '' });
    assert.deepEqual(messages(noBadge), [message]);
    assert.equal(noBadge.findings[0].hint, 'Put <StatusBadge component="pds-widget" /> above the title, and list pds-widget in libs/core/src/stories/resources/component-status.json.');
    assert.deepEqual(messages(checkComponent(TEMPLATE, { statusManifest: {} })), [message]);
    assert.deepEqual(messages(checkComponent(TEMPLATE, { badge: '<StatusBadge component="pds-widget" status="bogus" />' })), [message]);
  });

  it("passes a status the manifest gives when the badge's own status is an expression", () => {
    assert.deepEqual(messages(checkComponent(TEMPLATE, { badge: '<StatusBadge component="pds-widget" status={current} />' })), []);
  });

  it('checks only the first ## Guidelines', () => {
    const twice = TEMPLATE.replace('## Properties', '## Guidelines\n\n### Anything\n\nText.\n\n## Properties');
    assert.deepEqual(messages(checkComponent(twice)), []);
  });

  it('fails a page with no ## Guidelines, and one whose name differs in letter case', () => {
    const none = TEMPLATE.replace(/## Guidelines[\s\S]*?(?=## Properties)/, '');
    assert.deepEqual(messages(checkComponent(none)), ['heading-contract:9: The page has no ## Guidelines section.']);
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('## Guidelines', '## guidelines'))), [
      'heading-contract:13: "## guidelines" must be "## Guidelines": agents find it by that exact name.',
    ]);
  });

  it('fails a Guidelines heading whose name differs in letter case', () => {
    assert.deepEqual(messages(checkComponent(TEMPLATE.replace('### When to use', '### When to Use'))), [
      'heading-contract:15: "### When to Use" must be "### When to use": agents match the Guidelines headings case-sensitively.',
    ]);
  });

  it('fails Guidelines with one of its three headings missing, repeated or out of order', () => {
    const needs = `heading-contract:13: Guidelines needs exactly ${THREE}, in that order.`;
    const missing = TEMPLATE.replace('### When not to use\n\n- A single control.\n\n', '');
    assert.deepEqual(messages(checkComponent(missing)), [`${needs} It has ### When to use, ### Accessibility.`]);
    const swapped = TEMPLATE.replace('### When to use', '### TEMP').replace('### When not to use', '### When to use').replace('### TEMP', '### When not to use');
    assert.deepEqual(messages(checkComponent(swapped)), [`${needs} It has ### When not to use, ### When to use, ### Accessibility.`]);
    const twice = TEMPLATE.replace('- Label the group.', '- Label the group.\n\n### Accessibility\n\n- Again.');
    assert.deepEqual(messages(checkComponent(twice)), [`${needs} It has ### When to use, ### When not to use, ### Accessibility, ### Accessibility.`]);
  });

  it('fails any other heading inside Guidelines, at any depth', () => {
    const extra = (heading, line) =>
      `heading-contract:${line}: "${heading}" is inside Guidelines, which holds only ${THREE}. Agents drop or misfile any other heading there.`;
    const topic = TEMPLATE.replace('### Accessibility', '### Buttons vs links\n\nText.\n\n### Accessibility');
    assert.deepEqual(messages(checkComponent(topic)), [extra('### Buttons vs links', 23)]);
    const keyboard = TEMPLATE.replace('- Label the group.', '- Label the group.\n\n#### Keyboard interactions\n\n- Enter opens it.\n\n##### On items\n\n- Space selects.');
    const result = checkComponent(keyboard);
    assert.deepEqual(messages(result), [extra('#### Keyboard interactions', 27), extra('##### On items', 31)]);
    assert.equal(result.findings[0].hint, 'Move it and its content to a ## section of its own after Guidelines.');
  });

  it('fails ### Accessibility with no blank line after it', () => {
    const tight = TEMPLATE.replace('### Accessibility\n\n', '### Accessibility\n');
    assert.deepEqual(messages(checkComponent(tight)), [
      'heading-contract:23: No blank line follows "### Accessibility", so the Pine MCP leaves out the accessibility notes.',
    ]);
  });

  it('fails a page with no ## Properties, and one where it comes before Guidelines', () => {
    const none = TEMPLATE.replace('## Properties\n\n<DocArgsTable componentName="pds-widget" />\n\n', '');
    assert.deepEqual(messages(checkComponent(none)), ['heading-contract:9: The page has no ## Properties section.']);
    const early = TEMPLATE.replace('## Properties\n\n<DocArgsTable componentName="pds-widget" />\n\n', '').replace('## Guidelines', '## Properties\n\n<DocArgsTable componentName="pds-widget" />\n\n## Guidelines');
    assert.deepEqual(messages(checkComponent(early)), ['heading-contract:13: "## Properties" comes before "## Guidelines".']);
  });

  it('fails a page with no ## Playground, and one where it is not the last ## section', () => {
    const none = TEMPLATE.replace('## Playground\n\nThe main story.', '');
    assert.deepEqual(messages(checkComponent(none)), ['heading-contract:9: The page has no ## Playground section.']);
    const early = `${TEMPLATE}\n\n## Technical notes\n\nText.`;
    assert.deepEqual(messages(checkComponent(early)), [
      'heading-contract:37: "## Playground" isn\'t the last ## section: "## Technical notes" follows it. The Pine MCP ignores everything from ## Playground on.',
    ]);
    const twice = `${TEMPLATE}\n\n## Technical notes\n\nText.\n\n## Playground\n\nAgain.`;
    assert.deepEqual(messages(checkComponent(twice)), [
      'heading-contract:37: "## Playground" isn\'t the last ## section: "## Technical notes", "## Playground" follow it. The Pine MCP ignores everything from ## Playground on.',
    ]);
  });

  it('lists a heading inside JSX, a list or a quote as not checked, never as a finding', () => {
    const nested = TEMPLATE.replace('- Label the group.', '- Label the group.\n\n> ### Quoted\n\n<pds-alert>\n\n### In an alert\n\n</pds-alert>');
    const result = checkComponent(nested);
    assert.deepEqual([messages(result), skips(result)], [[], ['heading-contract:27', 'heading-contract:31']]);
    assert.match(formatReport(result), /The heading #quoted sits inside JSX, a list or a quote/);
  });
});
