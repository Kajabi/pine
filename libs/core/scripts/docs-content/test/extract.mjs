import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildDocsContent } from '../extract.mjs';

const WIDGET_PAGE = 'libs/core/src/components/pds-widget/docs/pds-widget.mdx';
const GUIDE_PAGE = 'libs/core/src/stories/guides/layouts.docs.mdx';

const WIDGET_STORIES = `
export default { title: 'components/Widget', component: 'pds-widget' };
export const Default = { args: {} };
export const Compact = { args: {} };
`;

const widgetPage = (body) => `import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks';
import { DocArgsTable, DocCanvas } from '@pine-ds/doc-components';
import { components } from '../../../../dist/docs.json';
import { StatusBadge } from '../../../stories/_helpers';
import * as stories from '../stories/pds-widget.stories.js';

<Meta of={stories} />

<StatusBadge component="pds-widget" />

# Widget

A widget groups related controls.

${body}
`;

const guidePage = (body) => `import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Guides/Layouts" />

# Layouts

${body}
`;

function build(pages, { components = [], statusManifest = {}, stories = {} } = {}) {
  return buildDocsContent({
    pages: Object.entries(pages).map(([file, source]) => ({ file, source })),
    components,
    statusManifest,
    readStories: (_fromFile, specifier) => ({ file: specifier, source: stories[specifier] ?? WIDGET_STORIES }),
    version: '1.2.3',
    commit: 'abc123',
  });
}

const doc = (content, file) => content.docs.find((d) => d.file === file);
const section = (sections, slug) => {
  for (const s of sections) {
    if (s.slug === slug) return s;
    const found = section(s.children, slug);
    if (found) return found;
  }
  return undefined;
};

describe('buildDocsContent', () => {
  it('turns a DocCanvas into an example that keeps its place in the section', () => {
    const { content } = build({
      [WIDGET_PAGE]: widgetPage(`## Examples

### Sizes

Widgets come in two sizes.

<DocCanvas
  mdxSource={{
    react: \`
    <PdsWidget size="sm" />
    <PdsWidget size="lg" />
    \`,
    webComponent: \`
    <pds-widget size="sm"></pds-widget>
    <pds-widget size="lg"></pds-widget>
    \`
}}>
  <pds-widget size="sm"></pds-widget>
</DocCanvas>

Use the small size in dense tables.

<DocCanvas mdxSource={{ webComponent: \`<pds-widget size="sm" dense></pds-widget>\` }}>
  <pds-widget size="sm" dense></pds-widget>
</DocCanvas>
`),
    });
    const sizes = section(doc(content, WIDGET_PAGE).sections, 'sizes');

    assert.equal(sizes.markdown, 'Widgets come in two sizes.\n\n<!-- example:0 -->\n\nUse the small size in dense tables.\n\n<!-- example:1 -->');
    assert.deepEqual(sizes.examples, [
      {
        sectionSlug: 'sizes',
        title: 'Sizes',
        prose: 'Widgets come in two sizes.',
        webComponent: '<pds-widget size="sm"></pds-widget>\n<pds-widget size="lg"></pds-widget>',
        react: '<PdsWidget size="sm" />\n<PdsWidget size="lg" />',
      },
      {
        sectionSlug: 'sizes',
        title: 'Sizes',
        prose: 'Use the small size in dense tables.',
        webComponent: '<pds-widget size="sm" dense></pds-widget>',
        react: null,
      },
    ]);
  });

  it('keeps fenced code in place with its language', () => {
    const { content } = build({
      [GUIDE_PAGE]: guidePage(`## Setup

Add the script:

\`\`\`html
<script type="module" src="pine.js"></script>
\`\`\`

Then use the components.`),
    });

    assert.equal(
      section(doc(content, GUIDE_PAGE).sections, 'setup').markdown,
      'Add the script:\n\n```html\n<script type="module" src="pine.js"></script>\n```\n\nThen use the components.',
    );
  });

  it('converts a pds-table to a markdown table', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage(`## Options

<pds-box border border-radius="sm" fit>
  <pds-table component-id="options">
    <pds-table-head>
      <pds-table-head-cell>Field</pds-table-head-cell>
      <pds-table-head-cell>Type</pds-table-head-cell>
    </pds-table-head>
    <pds-table-body>
      <pds-table-row>
        <pds-table-cell><code>badge</code>: <code>{'{ label, sentiment }'}</code></pds-table-cell>
        <pds-table-cell>\`'sm' | 'md'\`, see <a href="#options">Options</a></pds-table-cell>
      </pds-table-row>
      <pds-table-row>
        <pds-table-cell><strong>Default</strong></pds-table-cell>
        <pds-table-cell>Either A | B</pds-table-cell>
      </pds-table-row>
    </pds-table-body>
  </pds-table>
</pds-box>`),
    });

    assert.equal(
      section(doc(content, GUIDE_PAGE).sections, 'options').markdown,
      [
        '| Field | Type |',
        '| --- | --- |',
        "| `badge`: `{ label, sentiment }` | `'sm' \\| 'md'`, see [Options](#options) |",
        '| **Default** | Either A \\| B |',
      ].join('\n'),
    );
    assert.deepEqual(warnings, []);
  });

  it('rewrites Storybook links to pine-doc links and keeps in-page and absolute links', () => {
    const { content, warnings } = build({
      [WIDGET_PAGE]: widgetPage(`## Related

- <pds-link href="../?path=/docs/guides-layouts--docs">Layouts</pds-link>
- <pds-link href="?path=/docs/guides-layouts--docs#grid">Grid</pds-link>
- [Layouts again](/docs/guides-layouts--docs)
- [A story](/docs/components-widget--compact)
- [This page](#related)
- [MDN](https://developer.mozilla.org/)
- [Missing](#nowhere)`),
      [GUIDE_PAGE]: guidePage('## Grid\n\nColumns.'),
    });

    assert.equal(
      section(doc(content, WIDGET_PAGE).sections, 'related').markdown,
      [
        '- [Layouts](pine-doc:guides-layouts--docs)',
        '- [Grid](pine-doc:guides-layouts--docs#grid)',
        '- [Layouts again](pine-doc:guides-layouts--docs)',
        '- [A story](pine-doc:components-widget--docs)',
        '- [This page](#related)',
        '- [MDN](https://developer.mozilla.org/)',
        '- [Missing](#nowhere)',
      ].join('\n'),
    );
    assert.deepEqual(warnings, [
      `${WIDGET_PAGE}:20: link to the story "components-widget--compact" points at its docs page instead`,
      `${WIDGET_PAGE}:23: in-page link #nowhere has no matching heading`,
    ]);
  });

  it("lists each page's headings and the links it converts, with their lines", () => {
    const { pageLinks } = build({
      [WIDGET_PAGE]: widgetPage(`## Related

- [Grid](?path=/docs/guides-layouts--docs#grid)
- [MDN](https://developer.mozilla.org/)
- [This page](#related)
- [Elsewhere](./other.md)

<a href="">Empty</a> <div id="details">Details</div>`),
      [GUIDE_PAGE]: guidePage('## Grid\n\nColumns.'),
    });

    assert.deepEqual(pageLinks.find((page) => page.file === WIDGET_PAGE), {
      file: WIDGET_PAGE,
      storybookId: 'components-widget--docs',
      headings: [{ slug: 'widget', line: 11 }, { slug: 'related', line: 15 }],
      ids: ['details'],
      dynamicIds: false,
      links: [
        { href: '?path=/docs/guides-layouts--docs#grid', line: 17, target: { id: 'guides-layouts--docs', hash: 'grid' } },
        { href: '#related', line: 19, target: { id: 'components-widget--docs', hash: 'related' } },
        { href: './other.md', line: 20, target: null },
      ],
    });
  });

  it('nests headings and marks the sections readers ask for by name', () => {
    const { content } = build({
      [WIDGET_PAGE]: widgetPage(`## Guidelines

### When to use

- Grouping controls.

### When not to use

- A single control.

### When a widget needs \`fit\`

Set \`fit\`.

### Accessibility

- Label the group.

## Properties

<DocArgsTable componentName="pds-widget" docSource={components} />

## Examples

### Sizes

#### Small

Small text.

## Accessibility

A second heading with this name gets no role.`),
    });
    const page = doc(content, WIDGET_PAGE);
    const outline = (sections) => sections.map((s) => [s.level, s.heading, s.slug, s.role, outline(s.children)]);

    assert.deepEqual(outline(page.sections), [
      [2, 'Guidelines', 'guidelines', 'guidelines', [
        [3, 'When to use', 'when-to-use', 'when-to-use', []],
        [3, 'When not to use', 'when-not-to-use', 'when-not-to-use', []],
        [3, 'When a widget needs `fit`', 'when-a-widget-needs-fit', null, []],
        [3, 'Accessibility', 'accessibility', 'accessibility', []],
      ]],
      [2, 'Properties', 'properties', 'properties', []],
      [2, 'Examples', 'examples', 'examples', [
        [3, 'Sizes', 'sizes', null, [[4, 'Small', 'small', null, []]]],
      ]],
      [2, 'Accessibility', 'accessibility-1', null, []],
    ]);
    assert.equal(section(page.sections, 'guidelines').markdown, '');
    assert.equal(section(page.sections, 'sizes').markdown, '');
    assert.equal(section(page.sections, 'small').markdown, 'Small text.');
  });

  it('slugs headings the way Storybook does, including headings inside wrapper elements', () => {
    const { content } = build({
      [GUIDE_PAGE]: guidePage(`<div className="wrapper">

## Layouts

## Compact / Custom-Surface Buttons

## Sage → Pine

</div>`),
    });

    assert.deepEqual(
      doc(content, GUIDE_PAGE).sections.map((s) => s.slug),
      ['layouts-1', 'compact--custom-surface-buttons', 'sage--pine'],
    );
  });

  it('counts headings nested inside other content when it numbers repeated slugs', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage(`## Notes

> ## Notes

## Notes

[Last notes](#notes-2)`),
    });

    assert.deepEqual(doc(content, GUIDE_PAGE).sections.map((s) => s.slug), ['notes', 'notes-2']);
    assert.deepEqual(warnings, []);
  });

  it('takes the summary from the first paragraph under the h1, if there is one', () => {
    const { content } = build({
      [WIDGET_PAGE]: widgetPage('More about widgets.\n\n## Guidelines'),
      [GUIDE_PAGE]: guidePage('## Overview\n\nAn overview.'),
    });

    assert.equal(doc(content, WIDGET_PAGE).summary, 'A widget groups related controls.');
    assert.equal(doc(content, WIDGET_PAGE).markdown, 'A widget groups related controls.\n\nMore about widgets.');
    assert.equal(doc(content, GUIDE_PAGE).summary, null);
    assert.equal(doc(content, GUIDE_PAGE).markdown, '');
  });

  it('keeps the status badge, props tables, stories and token tables as data', () => {
    const { content } = build(
      {
        [WIDGET_PAGE]: widgetPage(`## Properties

<DocArgsTable componentName="pds-widget-item" docSource={components} />

## Tokens

<DocTokenTable category="color" tier="core" />

## Playground

<Canvas of={stories.Compact} />
<Controls of={stories.Compact} />`),
        [GUIDE_PAGE]: guidePage('## Grid'),
      },
      { statusManifest: { 'pds-widget': { status: 'beta', note: 'Sizes may change.' } } },
    );
    const page = doc(content, WIDGET_PAGE);

    assert.equal(page.status, 'beta');
    assert.equal(page.statusNote, 'Sizes may change.');
    assert.deepEqual(section(page.sections, 'properties').embeds, [{ type: 'props', tag: 'pds-widget-item' }]);
    assert.deepEqual(section(page.sections, 'tokens').embeds, [{ type: 'tokens', tier: 'core', category: 'color' }]);
    assert.deepEqual(section(page.sections, 'playground').embeds, [{ type: 'story', storyId: 'components-widget--compact' }]);
    assert.equal(section(page.sections, 'playground').markdown, '');
    assert.equal(doc(content, GUIDE_PAGE).status, null);
  });

  it('describes each page and indexes every component with its parent and page', () => {
    const { content } = build(
      { [WIDGET_PAGE]: widgetPage(''), [GUIDE_PAGE]: guidePage('') },
      {
        components: [
          { tag: 'pds-widget', filePath: 'src/components/pds-widget/pds-widget.tsx' },
          { tag: 'pds-widget-item', filePath: 'src/components/pds-widget/pds-widget-item/pds-widget-item.tsx' },
          { tag: 'mock-pds-widget', filePath: 'src/components/pds-widget/test/mock-pds-widget.tsx' },
        ],
      },
    );

    assert.deepEqual(
      { schemaVersion: content.schemaVersion, version: content.version, commit: content.commit },
      { schemaVersion: 1, version: '1.2.3', commit: 'abc123' },
    );
    assert.deepEqual(content.components, [
      { tag: 'pds-widget', parent: null, doc: 'components-widget--docs' },
      { tag: 'pds-widget-item', parent: 'pds-widget', doc: 'components-widget--docs' },
    ]);
    const { sections, markdown, examples, embeds, summary, ...widget } = doc(content, WIDGET_PAGE);
    assert.deepEqual(widget, {
      kind: 'component',
      tag: 'pds-widget',
      parent: null,
      title: 'Widget',
      storybookId: 'components-widget--docs',
      storybookTitle: 'components/Widget',
      file: WIDGET_PAGE,
      status: null,
      statusNote: null,
    });
    assert.deepEqual(
      [doc(content, GUIDE_PAGE).kind, doc(content, GUIDE_PAGE).tag, doc(content, GUIDE_PAGE).storybookId],
      ['guide', null, 'guides-layouts--docs'],
    );
    assert.deepEqual(content.docs.map((d) => d.file), [WIDGET_PAGE, GUIDE_PAGE]);
  });

  it('leaves no MDX in the markdown and warns about JSX it cannot convert', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage(`## Notes

{/* A comment for authors */}

<Callout>Read this.</Callout>

Plain text.`),
    });

    assert.equal(section(doc(content, GUIDE_PAGE).sections, 'notes').markdown, '<Callout>Read this.</Callout>\n\nPlain text.');
    assert.deepEqual(warnings, [`${GUIDE_PAGE}:11: <Callout> outside a DocCanvas has no conversion; kept as JSX`]);
    assert.doesNotMatch(JSON.stringify(content), /import |<Meta|<StatusBadge|<DocCanvas|mdxSource/);
  });
});

describe('buildDocsContent on input it cannot convert cleanly', () => {
  it('leaves out a DocCanvas or embed nested in a list or quote, with a warning', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage(`## Steps

- Install

  <DocCanvas mdxSource={{ webComponent: \`<pds-widget></pds-widget>\` }}>
    <pds-widget></pds-widget>
  </DocCanvas>

> <DocArgsTable componentName="pds-widget" />

After.`),
    });
    const steps = section(doc(content, GUIDE_PAGE).sections, 'steps');

    assert.deepEqual([steps.examples, steps.embeds], [[], []]);
    assert.equal(steps.markdown, '- Install\n\nAfter.');
    assert.deepEqual(warnings, [
      `${GUIDE_PAGE}:11: a DocCanvas inside a list, quote or table is left out; move it to the top level of its section`,
      `${GUIDE_PAGE}:15: a props block inside a list, quote or table is left out; move it to the top level of its section`,
    ]);
  });

  it('keeps a link the URL parser rejects as it is', () => {
    const { content, warnings } = build({ [GUIDE_PAGE]: guidePage('## Links\n\n<pds-link href="\\\\">Broken</pds-link>') });

    assert.equal(section(doc(content, GUIDE_PAGE).sections, 'links').markdown, '[Broken](\\\\\\\\)');
    assert.deepEqual(warnings, [`${GUIDE_PAGE}:9: link "\\\\" is neither absolute, in-page nor a Storybook docs link; kept as is`]);
  });

  it('treats protocol-relative links as external, even when their path looks like Storybook', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage('## Links\n\n[CDN](//cdn.example.com/docs/guides-layouts--docs) and [other](//other.example.com/?path=/docs/guides-layouts--docs)'),
    });

    assert.equal(
      section(doc(content, GUIDE_PAGE).sections, 'links').markdown,
      '[CDN](//cdn.example.com/docs/guides-layouts--docs) and [other](//other.example.com/?path=/docs/guides-layouts--docs)',
    );
    assert.deepEqual(warnings, []);
  });

  it('resolves reference-style links in the section where the reference sits', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: guidePage(`## Links

See [the grid][grid] and ![a diagram][diagram].

## Definitions

Text.

[grid]: /docs/guides-layouts--docs#links "Grid notes"
[diagram]: https://example.com/diagram.png`),
    });
    const page = doc(content, GUIDE_PAGE);

    assert.equal(section(page.sections, 'links').markdown, 'See [the grid](pine-doc:guides-layouts--docs#links "Grid notes") and ![a diagram](https://example.com/diagram.png).');
    assert.equal(section(page.sections, 'definitions').markdown, 'Text.');
    assert.deepEqual(warnings, []);
  });

  it('leaves out a page whose stories file has no title, with a warning', () => {
    const { content, warnings } = build(
      { [WIDGET_PAGE]: widgetPage(''), [GUIDE_PAGE]: guidePage('') },
      { stories: { '../stories/pds-widget.stories.js': "export default { component: 'pds-widget' };\nexport const Default = {};" } },
    );

    assert.deepEqual(content.docs.map((d) => d.file), [GUIDE_PAGE]);
    assert.deepEqual(warnings, [
      `${WIDGET_PAGE}:7: ../stories/pds-widget.stories.js has no title, so its stories have no Storybook id`,
      `${WIDGET_PAGE}:7: page left out`,
    ]);
  });

  it('gives a page the Storybook id Storybook does, from its name, ids and file name', () => {
    const meta = (attributes) => `import { Meta } from '@storybook/addon-docs/blocks';
import * as stories from '../stories/pds-widget.stories.js';

<Meta of={stories} ${attributes} />

# Widget`;
    const ids = (pages, stories) => build(pages, { stories }).content.docs.map((d) => [d.file.split('/').at(-1), d.storybookId, d.storybookTitle]);

    assert.deepEqual(ids({ [WIDGET_PAGE]: meta('name="Overview"') }), [['pds-widget.mdx', 'components-widget--overview', 'components/Widget']]);
    assert.deepEqual(ids({ [WIDGET_PAGE]: meta('id="widget-docs"') }), [['pds-widget.mdx', 'widget-docs--docs', 'components/Widget']]);
    assert.deepEqual(
      ids({ [WIDGET_PAGE]: meta('') }, { '../stories/pds-widget.stories.js': "export default { title: 'components/Widget', id: 'widget' };\nexport const Default = {};" }),
      [['pds-widget.mdx', 'widget--docs', 'components/Widget']],
    );
    assert.deepEqual(
      ids({ 'libs/core/src/components/pds-widget/docs/widget-recipes.mdx': meta('title="Ignored/When attached"') }),
      [['widget-recipes.mdx', 'components-widget--widget-recipes', 'components/Widget']],
    );
    assert.deepEqual(ids({ [WIDGET_PAGE]: meta('isTemplate'), [GUIDE_PAGE]: guidePage('') }), [['layouts.docs.mdx', 'guides-layouts--docs', 'Guides/Layouts']]);
  });

  it('warns when two pages share a Storybook id', () => {
    const second = 'libs/core/src/stories/guides/layouts-again.docs.mdx';
    const { content, warnings } = build({ [GUIDE_PAGE]: guidePage(''), [second]: guidePage('') });

    assert.equal(content.docs.length, 2);
    assert.deepEqual(warnings, [`${GUIDE_PAGE}: Storybook id guides-layouts--docs is also used by ${second}`]);
  });

  it('keeps a summary paragraph that holds an inline story canvas', () => {
    const { content, warnings } = build({
      [WIDGET_PAGE]: widgetPage('').replace('A widget groups related controls.', 'A widget <Canvas of={stories.Default} /> groups related controls.'),
    });

    assert.equal(doc(content, WIDGET_PAGE).summary, 'A widget  groups related controls.');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /a story block inside a list, quote or table is left out/);
  });

  it('keeps the text of a Storybook link to a page the file does not have', () => {
    const { content, warnings } = build({ [GUIDE_PAGE]: guidePage('## Links\n\n[Gone](/docs/components-gone--docs) stays readable.') });

    assert.equal(section(doc(content, GUIDE_PAGE).sections, 'links').markdown, 'Gone stays readable.');
    assert.deepEqual(warnings, [`${GUIDE_PAGE}:9: Storybook link "components-gone--docs" has no MDX page; kept as plain text`]);
  });

  it('leaves out a page with no Storybook id and builds the rest', () => {
    const noMeta = 'libs/core/src/stories/guides/no-meta.docs.mdx';
    const { content, warnings } = build({ [GUIDE_PAGE]: guidePage(''), [noMeta]: '# No meta\n\nText.' });

    assert.deepEqual(content.docs.map((d) => d.file), [GUIDE_PAGE]);
    assert.deepEqual(warnings, [`${noMeta}: no <Meta> to give the page a Storybook id; page left out`]);
  });

  it('keeps a space between the paragraphs of a table cell', () => {
    const { content } = build({
      [GUIDE_PAGE]: guidePage(`## Notes

<pds-table>
  <pds-table-head>
    <pds-table-head-cell>Note</pds-table-head-cell>
  </pds-table-head>
  <pds-table-body>
    <pds-table-row>
      <pds-table-cell>
        First

        Second
      </pds-table-cell>
    </pds-table-row>
  </pds-table-body>
</pds-table>`),
    });

    assert.equal(section(doc(content, GUIDE_PAGE).sections, 'notes').markdown, '| Note |\n| --- |\n| First Second |');
  });

  it('records a story canvas named by a direct import', () => {
    const { content } = build({
      [WIDGET_PAGE]: `import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as stories from '../stories/pds-widget.stories.js';
import { Compact } from '../stories/pds-widget.stories.js';

<Meta of={stories} />

# Widget

## Playground

<Canvas of={Compact} />`,
    });

    assert.deepEqual(section(doc(content, WIDGET_PAGE).sections, 'playground').embeds, [{ type: 'story', storyId: 'components-widget--compact' }]);
  });

  it('gives a status badge with no component the status Storybook shows for it', () => {
    const { content } = build(
      { [WIDGET_PAGE]: widgetPage('').replace('<StatusBadge component="pds-widget" />', '<StatusBadge />') },
      { statusManifest: { 'pds-widget': { status: 'beta', note: 'Sizes may change.' } } },
    );

    assert.deepEqual([doc(content, WIDGET_PAGE).status, doc(content, WIDGET_PAGE).statusNote], ['stable', null]);
  });

  it('takes the summary from under the h1 when content sits above it', () => {
    const { content, warnings } = build({
      [GUIDE_PAGE]: `import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Guides/Layouts" />

A note above the title.

# Layouts

The real summary.`,
    });
    const page = doc(content, GUIDE_PAGE);

    assert.equal(page.summary, 'The real summary.');
    assert.equal(page.markdown, 'A note above the title.\n\nThe real summary.');
    assert.deepEqual(warnings, [`${GUIDE_PAGE}:7: content above the h1 is kept at the start of the page markdown`]);
  });
});
