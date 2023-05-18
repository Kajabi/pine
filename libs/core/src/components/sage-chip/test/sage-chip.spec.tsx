import { newSpecPage } from '@stencil/core/testing';
import { SageChip } from '../sage-chip';

describe('sage-chip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip></sage-chip>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-chip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-chip>
    `);
  });
});
