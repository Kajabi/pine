import { newSpecPage } from '@stencil/core/testing';
import { SageTabs } from '../sage-tabs';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs class="sage-tabs">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });
});
