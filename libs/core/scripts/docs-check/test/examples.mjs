import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildDocsContent } from '../../docs-content/extract.mjs';
import { collectSnippets } from '../examples.mjs';

const FILE = 'libs/core/src/stories/fixture.docs.mdx';

const PAGE = `import { Meta } from '@storybook/addon-docs/blocks';
import { DocCanvas } from '@pine-ds/doc-components';

<Meta title="Guides/Fixture" />

# Fixture

<DocCanvas
  mdxSource={{
    react: \`
    <PdsButton>Intro</PdsButton>
    \`,
    webComponent: \`


      <pds-button>Intro</pds-button>
      <pds-text>Second line</pds-text>
    \`,
  }}
>
  <pds-button>Intro</pds-button>
</DocCanvas>

## Variants

- A list item
  <DocCanvas mdxSource={{ webComponent: \`<pds-button>Dropped</pds-button>\` }} />

### Primary

<DocCanvas mdxSource={{ webComponent: \`<pds-button variant="primary">Save</pds-button>\` }} />

<DocCanvas mdxSource={{ react: \`<PdsButton>Same</PdsButton>\` }} />

<DocCanvas mdxSource={{ react: \`<PdsButton>Same</PdsButton>\` }} />

<DocCanvas mdxSource={{ webComponent: "<pds-button>Plain\\nstring</pds-button>" }} />
`;

function snippetsOf(source) {
  const { content } = buildDocsContent({
    pages: [{ file: FILE, source }],
    components: [],
    statusManifest: {},
    readStories: () => {
      throw new Error('no stories');
    },
    version: '0.0.0',
    commit: null,
  });
  return collectSnippets(content.docs, (file) => {
    assert.equal(file, FILE);
    return source;
  });
}

describe('collectSnippets', () => {
  it('gives each example the MDX line its code starts on', () => {
    const lines = PAGE.split('\n');
    const snippets = snippetsOf(PAGE);
    assert.deepEqual(
      snippets.map(({ title, language, line, exactLines }) => [title, language, line, exactLines]),
      [
        ['Fixture', 'webComponent', 16, true],
        ['Fixture', 'react', 11, true],
        ['Primary', 'webComponent', 31, true],
        ['Primary', 'react', 33, true],
        ['Primary', 'react', 35, true],
        ['Primary', 'webComponent', 37, false],
      ],
    );
    for (const snippet of snippets.filter((s) => s.exactLines)) {
      assert.ok(lines[snippet.line - 1].includes(snippet.code.split('\n')[0]), `line ${snippet.line}`);
    }
  });

  it('ignores a dropped DocCanvas with the same code as a kept one', () => {
    const source = [
      "<Meta title=\"Guides/Fixture\" />",
      '',
      '# Fixture',
      '',
      '## Section',
      '',
      '- Item',
      '  <DocCanvas mdxSource={{ webComponent: `<pds-button>Same</pds-button>` }} />',
      '',
      '> <DocCanvas mdxSource={{ webComponent: `<pds-button>Same</pds-button>` }} />',
      '',
      '<DocCanvas mdxSource={{ webComponent: `<pds-button>Same</pds-button>` }} />',
      '',
    ].join('\n');
    assert.deepEqual(snippetsOf(source).map((s) => s.line), [12]);
  });

  it('keeps the code the extractor gives', () => {
    const [first] = snippetsOf(PAGE);
    assert.equal(first.code, '<pds-button>Intro</pds-button>\n<pds-text>Second line</pds-text>');
  });

  it('fails loudly when an example has no matching DocCanvas', () => {
    const { content } = buildDocsContent({
      pages: [{ file: FILE, source: PAGE }],
      components: [],
      statusManifest: {},
      readStories: () => ({ file: '', source: '' }),
      version: '0.0.0',
      commit: null,
    });
    const changed = PAGE.replace('variant="primary"', 'variant="secondary"');
    assert.throws(() => collectSnippets(content.docs, () => changed), /no DocCanvas matches the "Primary" example/);
  });
});
