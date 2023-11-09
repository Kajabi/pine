import { newSpecPage } from '@stencil/core/testing';
import { MyComponent } from './doc-source';

describe('doc-source', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<doc-source></doc-source>',
    });
    expect(root).toEqualHtml(`
      <doc-source>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </doc-source>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<doc-source first="Stencil" last="'Don't call me a framework' JS"></doc-source>`,
    });
    expect(root).toEqualHtml(`
      <doc-source first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </doc-source>
    `);
  });
});
