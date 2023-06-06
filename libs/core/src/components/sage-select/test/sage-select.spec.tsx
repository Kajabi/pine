import { newSpecPage } from '@stencil/core/testing';
import { SageSelect } from '../sage-select';

describe('sage-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageSelect],
      html: `<sage-select></sage-select>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-select>
    `);
  });
});
