import { newSpecPage } from '@stencil/core/testing';
import { SageCheckbox } from '../sage-checkbox';

describe('sage-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox></sage-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
});
