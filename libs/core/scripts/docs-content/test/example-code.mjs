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

/** Each `component` element's props on the compiled page, as the source text of their values. */
function props(code, component) {
  const found = [];
  traverse(babelParse(code), {
    CallExpression({ node }) {
      const [type, elementProps] = node.arguments;
      if (type?.type !== 'Identifier' || type.name !== component || elementProps?.type !== 'ObjectExpression') return;
      found.push(Object.fromEntries(elementProps.properties.map((p) => [p.key.name ?? p.key.value, code.slice(p.value.start, p.value.end)])));
    },
  });
  return found;
}

const evaluate = (expression) => new Function(`return (${expression});`)();

/** The props `component` gets on the page compiled with and without the plugin. */
async function compiled(source, component = 'DocCanvas') {
  return {
    after: props(await compile(source, [remarkExampleCode]), component),
    before: props(await compile(source, []), component),
  };
}

/** The mdxSource each DocCanvas gets on the page compiled with the plugin. */
const mdxSources = async (source) => (await compiled(source)).after.map((p) => evaluate(p.mdxSource));

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

    assert.equal(evaluate(before[0].mdxSource).webComponent, '<pds-widget\n    size="sm">\n    <span>One</span>\n  </pds-widget>');
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
    const lines = (expression) => evaluate(expression.mdxSource).webComponent.split('\n');

    assert.deepEqual(lines(after[0]), ['<pds-widget', '  label="`One`">', '  <span>C:\\One</span>', '  <span>${one}</span>', '</pds-widget>']);
    assert.deepEqual(lines(after[0]).map((line) => line.trimStart()), lines(before[0]));
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

    assert.deepEqual(evaluate(after[0].mdxSource), {
      webComponent: evaluate(before[0].mdxSource).webComponent,
      react: '<PdsWidget\n  size="sm" />',
    });
    assert.equal(evaluate(before[0].mdxSource).webComponent, '<pds-widget\nlabel="One">\n</pds-widget>');
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
    assert.equal(canvases.after[0].display, canvases.before[0].display);
    assert.equal(canvases.after[0].children, canvases.before[0].children);
    assert.deepEqual(evaluate(canvases.after[0].mdxSource), {
      webComponent: sameLineCode,
      vue: evaluate(canvases.before[0].mdxSource).vue,
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

    assert.equal(after[0].mdxSource, before[0].mdxSource);
    assert.deepEqual(evaluate(after[1].mdxSource), { webComponent: sameLineCode });
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
