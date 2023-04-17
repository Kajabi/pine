import { newSpecPage } from '@stencil/core/testing';
import { SageSwitch } from '../sage-switch';

describe('sage-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-switch>
    `);
  });
});
