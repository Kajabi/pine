import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildDocsContent } from '../../docs-content/extract.mjs';
import { checkDocs } from '../check.mjs';
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

const OTHER_PAGE = page('Other', '## Usage\n\nText.\n\n## Usage\n\nMore text.\n');

/** Checks the fixture page next to a second page, with the docs ids that stories files give. */
function check(body, { storyDocsIds = ['components-table-rows--docs'], unknownStories = [] } = {}) {
  const { content, pageLinks } = buildDocsContent({
    pages: [{ file: GUIDE, source: page('Fixture', body) }, { file: OTHER, source: OTHER_PAGE }],
    components: [],
    statusManifest: {},
    readStories: () => {
      throw new Error('no stories');
    },
    version: '0.0.0',
    commit: null,
  });
  const context = buildContext({ components: [], iconNames: [], iconExports: [], iconsVersion: '0', pages: pageLinks, storyDocsIds, unknownStories });
  return checkDocs({ pages: pageTargets(content, pageLinks) }, context);
}

const messages = (result) => result.findings.map((f) => `${f.rule}:${f.line}: ${f.message}`);
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
    assert.deepEqual(messages(check(body)), ['broken-anchor:10: #nope matches no heading on this page.']);
  });

  it('checks an anchor on another MDX page, and skips one on a page with no MDX file', () => {
    const body = [
      '## Links',
      '',
      '[Usage](../?path=/docs/guides-other--docs#usage-1) [Rows](../?path=/docs/components-table-rows--docs#anything)',
      '',
      '[Missing](../?path=/docs/guides-other--docs#examples)',
    ].join('\n');
    assert.deepEqual(messages(check(body)), ['broken-anchor:12: ../?path=/docs/guides-other--docs#examples matches no heading on guides-other--docs.']);
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
    const cased = check('## Links\n\n[Other](../?path=/docs/Guides-Other--docs)');
    assert.deepEqual([messages(cased), skips(cased)], [[], ['broken-docs-link:10']]);
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
