import { newSpecPage } from '@stencil/core/testing';
import { SageTabs } from '../sage-tabs';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });
});
