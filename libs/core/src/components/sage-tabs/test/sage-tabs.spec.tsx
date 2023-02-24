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

it('renders variant prop', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs active-tab="two" component-id="test" variant="availability"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab="two" class="sage-tabs sage-tabs--availability" component-id="test" variant="availability">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });

  it('renders tablist-label props', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs active-tab="two" tablist-label="test label" component-id="test"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab="two" class="sage-tabs" component-id="test" tablist-label="test label">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist" aria-label="test label">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });
});
