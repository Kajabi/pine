import { newSpecPage } from '@stencil/core/testing';
import { SageIcon } from '../sage-icon';

describe('sage-icon', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: `<sage-icon first="Stencil" last="'Don't call me a framework' JS"></sage-icon>`,
    });
    expect(root).toEqualHtml(`
      <sage-icon first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });
});
