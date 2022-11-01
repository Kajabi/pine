import { newSpecPage } from '@stencil/core/testing';
import { SageButton } from '../sage-button';

describe('sage-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageButton],
      html: `<sage-button></sage-button>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-button>
        <mock:shadow-root>
          <button class="sage-button sage-button--primary">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-button>
    `);
  });
});
