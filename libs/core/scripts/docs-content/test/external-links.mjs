import mdxLoader from '@storybook/addon-docs/mdx-loader';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import rehypeExternalLinks from 'rehype-external-links';
import { babelParse, traverse } from 'storybook/internal/babel';
import config from '../../../.storybook/main.js';

const NEW_TAB_LABEL = ' (opens in a new tab)';

/** The rehype plugins main.js gives Storybook's MDX compiler. */
function configuredRehypePlugins() {
  const docs = config.addons.find((addon) => addon.name?.includes('addon-docs'));
  const plugins = docs?.options?.mdxPluginOptions?.mdxCompileOptions?.rehypePlugins ?? [];
  assert.ok(
    plugins.some((plugin) => [plugin].flat()[0] === rehypeExternalLinks),
    'main.js passes rehype-external-links to the MDX compiler',
  );
  return plugins;
}

/** Storybook runs its own copy of rehype-external-links, with its defaults, after the configured plugins. */
const storybookExternalLinks = (options) => rehypeExternalLinks(options);

/** Compiles a page with the MDX loader Storybook ships, which runs the same compiler as its Vite plugin. */
const compile = (source, rehypePlugins) =>
  new Promise((resolve, reject) => {
    mdxLoader.call(
      {
        async: () => (error, code) => (error ? reject(error) : resolve(code)),
        getOptions: () => ({ mdxCompileOptions: { rehypePlugins: [...rehypePlugins, storybookExternalLinks] } }),
        resourcePath: 'page.mdx',
      },
      source,
    );
  });

const isMember = (node, object, property) =>
  node?.type === 'MemberExpression' && node.object.name === object && node.property.name === property;

const stringProp = (properties, key) => properties.find((p) => p.key.name === key)?.value.value;

/** Each markdown link on the compiled page: its href, its target and the visually hidden label it ends with. */
function links(code) {
  const found = [];
  traverse(babelParse(code), {
    CallExpression(path) {
      const [type, props] = path.node.arguments;
      if (!isMember(type, '_components', 'a') || props?.type !== 'ObjectExpression') return;
      const children = props.properties.find((p) => p.key.name === 'children')?.value;
      const label = (children?.type === 'ArrayExpression' ? children.elements : [])
        .filter((child) => child.type === 'CallExpression' && isMember(child.arguments[0], '_components', 'span'))
        .map((span) => span.arguments[1].properties)
        .find((properties) => stringProp(properties, 'className') === 'sb-sr-only');
      found.push({
        href: stringProp(props.properties, 'href'),
        target: stringProp(props.properties, 'target'),
        label: label && stringProp(label, 'children'),
      });
    },
  });
  return found;
}

const linksOn = async (source) => links(await compile(source, configuredRehypePlugins()));

const offsite = (href) => ({ href, target: '_blank', label: NEW_TAB_LABEL });
const onsite = (href) => ({ href, target: undefined, label: undefined });

describe('Storybook docs links', () => {
  it('opens http and https links in a new tab and says so to screen readers', async () => {
    assert.deepEqual(await linksOn('See [MDN](https://developer.mozilla.org/) and [an old site](http://example.com/).'), [
      offsite('https://developer.mozilla.org/'),
      offsite('http://example.com/'),
    ]);
  });

  it('keeps in-page and Storybook page links in the same tab', async () => {
    assert.deepEqual(
      await linksOn('See [Keyboard](#keyboard), [Box](/docs/components-layout-box--docs), [Row](?path=/docs/components-layout-row--docs#columns).'),
      [onsite('#keyboard'), onsite('/docs/components-layout-box--docs'), onsite('?path=/docs/components-layout-row--docs#columns')],
    );
  });

  it('treats a reference-style link like an inline one', async () => {
    assert.deepEqual(await linksOn('See [MDN][mdn] and [Box][box].\n\n[mdn]: https://developer.mozilla.org/\n[box]: /docs/components-layout-box--docs'), [
      offsite('https://developer.mozilla.org/'),
      onsite('/docs/components-layout-box--docs'),
    ]);
  });

  it('handles links in a list item and inside JSX', async () => {
    assert.deepEqual(
      await linksOn(`- [GitHub](https://github.com/Kajabi/pine) for the source

<pds-table>
  <pds-table-row>
    <pds-table-cell>See [Option Icons](#option-icons) or [MDN](https://developer.mozilla.org/).</pds-table-cell>
  </pds-table-row>
</pds-table>`),
      [offsite('https://github.com/Kajabi/pine'), onsite('#option-icons'), offsite('https://developer.mozilla.org/')],
    );
  });

  it('leaves the links in a DocCanvas preview and its example code alone', async () => {
    const source = `<DocCanvas
  mdxSource={{
    webComponent: \`<pds-link href="https://example.com" external>Docs</pds-link>
<a href="https://example.com">Docs</a>\`,
  }}
>
  <pds-link href="https://example.com" external>Docs</pds-link>
  <a href="https://example.com">Docs</a>
</DocCanvas>`;
    assert.equal(await compile(source, configuredRehypePlugins()), await compile(source, []));
  });

  it('leaves a page with no links as it was', async () => {
    const source = '# Widget\n\nA widget with `code`, **strong** text and a list:\n\n- one\n- two';
    assert.equal(await compile(source, configuredRehypePlugins()), await compile(source, []));
  });
});
