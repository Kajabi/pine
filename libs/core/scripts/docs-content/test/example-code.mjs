import mdxLoader from '@storybook/addon-docs/mdx-loader';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { babelParse, traverse } from 'storybook/internal/babel';
import { remarkExampleCode } from '../example-code.mjs';

const page = (body) => `import { DocCanvas } from '@pine-ds/doc-components';
import { CodeSample } from '../../../stories/_helpers';

# Widget

${body}
`;

/** Compiles a page with the MDX loader Storybook ships, which runs the same compiler as its Vite plugin. */
const compile = (source, remarkPlugins) =>
  new Promise((resolve, reject) => {
    mdxLoader.call(
      {
        async: () => (error, code) => (error ? reject(error) : resolve(code)),
        getOptions: () => ({ mdxCompileOptions: { remarkPlugins } }),
        resourcePath: 'page.mdx',
      },
      source,
    );
  });

/** Each `component` element's props on the compiled page: the source text of each value, and the value when it's static. */
function props(code, component) {
  const found = [];
  traverse(babelParse(code), {
    CallExpression(path) {
      const [type, elementProps] = path.node.arguments;
      if (type?.type !== 'Identifier' || type.name !== component || elementProps?.type !== 'ObjectExpression') return;
      const entries = path.get('arguments.1.properties').map((property) => {
        const value = property.get('value');
        const { confident, value: staticValue } = value.evaluate();
        const text = code.slice(value.node.start, value.node.end);
        return [property.node.key.name ?? property.node.key.value, { text, value: confident ? staticValue : undefined }];
      });
      found.push(Object.fromEntries(entries));
    },
  });
  return found;
}

/** The props `component` gets on the page compiled with and without the plugin. */
async function compiled(source, component = 'DocCanvas') {
  return {
    after: props(await compile(source, [remarkExampleCode]), component),
    before: props(await compile(source, []), component),
  };
}

/** The mdxSource each DocCanvas gets on the page compiled with the plugin. */
const mdxSources = async (source) => (await compiled(source)).after.map((p) => p.mdxSource.value);

const sameLine = `<DocCanvas
  mdxSource={{
    webComponent: \`<pds-widget
  size="sm">
  <span>One</span>
</pds-widget>\`,
  }}
>
  <pds-widget size="sm"></pds-widget>
</DocCanvas>`;
const sameLineCode = '<pds-widget\n  size="sm">\n  <span>One</span>\n</pds-widget>';

describe('remarkExampleCode', () => {
  it('keeps the indentation of a snippet that starts on the backtick line', async () => {
    assert.deepEqual(
      await mdxSources(
        page(`<DocCanvas
  mdxSource={{
    webComponent: \`<pds-widget
  size="sm">
  <pds-widget-item>
    <span>One</span>
  </pds-widget-item>
</pds-widget>\`,
    react: \`<PdsWidget size="sm">
  <span>One</span>
</PdsWidget>\`,
  }}
>
  <pds-widget size="sm"></pds-widget>
</DocCanvas>`),
      ),
      [
        {
          webComponent: '<pds-widget\n  size="sm">\n  <pds-widget-item>\n    <span>One</span>\n  </pds-widget-item>\n</pds-widget>',
          react: '<PdsWidget size="sm">\n  <span>One</span>\n</PdsWidget>',
        },
      ],
    );
  });

  it('drops the blank first and last lines and the shared indentation of a snippet that starts on the next line', async () => {
    assert.deepEqual(
      await mdxSources(
        page(`<DocCanvas
  mdxSource={{
    webComponent: \`
      <pds-widget>
        <span>One</span>
      </pds-widget>
    \`,
    react: \`
<PdsWidget>
  <span>One</span>
</PdsWidget>
\`,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>`),
      ),
      [
        {
          webComponent: '<pds-widget>\n  <span>One</span>\n</pds-widget>',
          react: '<PdsWidget>\n  <span>One</span>\n</PdsWidget>',
        },
      ],
    );
  });

  it('dedents a snippet written under its property, with the key at 2 or 4 spaces', async () => {
    assert.deepEqual(
      await mdxSources(
        page(`<DocCanvas
  mdxSource={{
    webComponent: \`<pds-widget
      size="sm">
      <span>One</span>
    </pds-widget>\`,
  }}
>
  <pds-widget size="sm"></pds-widget>
</DocCanvas>

<DocCanvas mdxSource={{
  react: \`<PdsWidget
    size="sm">
    <span>One</span>
  </PdsWidget>\`,
}}>
  <pds-widget size="sm"></pds-widget>
</DocCanvas>`),
      ),
      [{ webComponent: sameLineCode }, { react: '<PdsWidget\n  size="sm">\n  <span>One</span>\n</PdsWidget>' }],
    );
  });

  it('keeps the indentation of a DocCanvas inside a list item', async () => {
    const source = page(`- Install

  <DocCanvas
    mdxSource={{
      webComponent: \`<pds-widget
        size="sm">
        <span>One</span>
      </pds-widget>\`,
    }}
  >
    <pds-widget size="sm"></pds-widget>
  </DocCanvas>`);
    const { before } = await compiled(source);

    assert.equal(before[0].mdxSource.value.webComponent, '<pds-widget\n    size="sm">\n    <span>One</span>\n  </pds-widget>');
    assert.deepEqual(await mdxSources(source), [{ webComponent: sameLineCode }]);
  });

  it('reads a page with CRLF line endings', async () => {
    assert.deepEqual(await mdxSources(page(sameLine).replace(/\n/g, '\r\n')), [{ webComponent: sameLineCode }]);
  });

  it('cooks escaped backticks, backslashes and dollar signs as the compiler does', async () => {
    const source = page(`<DocCanvas
  mdxSource={{
    webComponent: \`<pds-widget
  label="\\\`One\\\`">
  <span>C:\\\\One</span>
  <span>\\\${one}</span>
</pds-widget>\`,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>`);
    const { after, before } = await compiled(source);
    const lines = (canvas) => canvas.mdxSource.value.webComponent.split('\n');

    assert.deepEqual(lines(after[0]), ['<pds-widget', '  label="`One`">', '  <span>C:\\One</span>', '  <span>${one}</span>', '</pds-widget>']);
    assert.deepEqual(lines(after[0]).map((line) => line.trimStart()), lines(before[0]));
  });

  it('keeps quotes, a closing script tag and a line separator as text', async () => {
    const code = `<pds-widget\n  label='One "Two"'>\n  <span>One\u2028Two</span>\n  <span></script></span>\n</pds-widget>`;
    const source = page(`<DocCanvas
  mdxSource={{
    webComponent: \`${code}\`,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>`);

    assert.deepEqual(await mdxSources(source), [{ webComponent: code }]);
  });

  it('leaves a template literal with an expression as the compiler writes it', async () => {
    const { after, before } = await compiled(
      page(`<DocCanvas
  mdxSource={{
    webComponent: \`<pds-widget
  label="\${'One'}">
</pds-widget>\`,
    react: \`<PdsWidget
  size="sm" />\`,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>`),
    );

    assert.deepEqual(after[0].mdxSource.value, {
      webComponent: before[0].mdxSource.value.webComponent,
      react: '<PdsWidget\n  size="sm" />',
    });
    assert.equal(before[0].mdxSource.value.webComponent, '<pds-widget\nlabel="One">\n</pds-widget>');
  });

  it("leaves a template literal whose lines don't match the source as the compiler writes it", async () => {
    const source = page(`> <DocCanvas
>   mdxSource={{
>     webComponent: \`
>       <pds-widget>
>         <span>One</span>
>       </pds-widget>
>     \`,
>   }}
> >
>   <pds-widget></pds-widget>
> </DocCanvas>

<DocCanvas
  mdxSource={{
    webComponent: \`
      <pds-widget \\
        size="sm">
      </pds-widget>
    \`,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>

${sameLine}`);
    const { after, before } = await compiled(source);

    assert.deepEqual(
      after.slice(0, 2).map((canvas) => canvas.mdxSource.text),
      before.slice(0, 2).map((canvas) => canvas.mdxSource.text),
    );
    assert.equal(before[1].mdxSource.value.webComponent, '\n    <pds-widget       size="sm">\n    </pds-widget>\n  ');
    assert.deepEqual(after[2].mdxSource.value, { webComponent: sameLineCode });
  });

  it('finds a DocCanvas inside another element or a paragraph and reads quoted keys', async () => {
    const source = page(`<pds-box>
  <DocCanvas
    mdxSource={{
      'webComponent': \`<pds-widget
  size="sm">
  <span>One</span>
</pds-widget>\`,
    }}
  >
    <pds-widget size="sm"></pds-widget>
  </DocCanvas>
</pds-box>

Inline <DocCanvas mdxSource={{ react: \`<PdsWidget
  size="sm" />\` }}>One</DocCanvas> canvas.`);

    assert.deepEqual(await mdxSources(source), [{ webComponent: sameLineCode }, { react: '<PdsWidget\n  size="sm" />' }]);
  });

  it('leaves shorthand, spread and plain string mdxSource properties alone', async () => {
    const { after, before } = await compiled(
      page(`export const react = '<PdsWidget />';
export const more = {};

<DocCanvas
  mdxSource={{
    webComponent: "<pds-widget>\\n  <span>One</span>\\n</pds-widget>",
    react,
    ...more,
  }}
>
  <pds-widget></pds-widget>
</DocCanvas>

${sameLine}`),
    );

    assert.equal(after[0].mdxSource.text, before[0].mdxSource.text);
    assert.deepEqual(after[1].mdxSource.value, { webComponent: sameLineCode });
  });

  it("leaves other components, other attributes and a DocCanvas's children alone", async () => {
    const source = page(`<CodeSample
  code={\`<pds-widget
  size="sm" />\`}
  mdxSource={{
    webComponent: \`<pds-widget
  size="sm" />\`,
  }}
/>

<DocCanvas
  display={\`block
  inline\`}
  mdxSource={{
    webComponent: \`<pds-widget
  size="sm">
  <span>One</span>
</pds-widget>\`,
    vue: \`<PdsWidget
  size="sm" />\`,
  }}
>
  {\`<pds-widget
  size="sm" />\`}
</DocCanvas>`);
    const samples = await compiled(source, 'CodeSample');
    const canvases = await compiled(source);

    assert.deepEqual(samples.after, samples.before);
    assert.equal(canvases.after[0].display.text, canvases.before[0].display.text);
    assert.equal(canvases.after[0].children.text, canvases.before[0].children.text);
    assert.deepEqual(canvases.after[0].mdxSource.value, {
      webComponent: sameLineCode,
      vue: canvases.before[0].mdxSource.value.vue,
    });
  });

  it('leaves a DocCanvas whose mdxSource is a plain string alone', async () => {
    const { after, before } = await compiled(
      page(`<DocCanvas mdxSource="<pds-widget>
  <span>One</span>
</pds-widget>">
  <pds-widget></pds-widget>
</DocCanvas>

${sameLine}`),
    );

    assert.equal(after[0].mdxSource.text, before[0].mdxSource.text);
    assert.deepEqual(after[1].mdxSource.value, { webComponent: sameLineCode });
  });

  it('compiles a page with no DocCanvas exactly as before', async () => {
    const source = page(`Some \`code\` and a sample:

<CodeSample code={\`<pds-widget
  size="sm" />\`} />

\`\`\`html
<pds-widget
  size="sm"></pds-widget>
\`\`\``);

    assert.equal(await compile(source, [remarkExampleCode]), await compile(source, []));
  });
});
