import { newSpecPage } from '@stencil/core/testing';
import { SageLink } from './sage-link';

describe('sage-link', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: '<sage-link></sage-link>',
    });
    expect(root).toEqualHtml(`
      <sage-link>
        <mock:shadow-root>
          <a>
          </a>
        </mock:shadow-root>
      </sage-link>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: `<sage-link href="#" text="'Don't call me a framework' JS"></sage-link>`,
    });
    expect(root).toEqualHtml(`
      <sage-link href="#" text="'Don't call me a framework' JS">
        <mock:shadow-root>
          <a href="#">
            'Don't call me a framework' JS
          </a>
        </mock:shadow-root>
      </sage-link>
    `);
  });
});
