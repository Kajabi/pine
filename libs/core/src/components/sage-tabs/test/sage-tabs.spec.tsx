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
          <div aria-label="tablist label" role="tablist">
            <sage-tab tab="one">
              Test
            </sage-tab>
            <sage-tab tab="two">
              Test
            </sage-tab>
          </div>
          <sage-tab-panel tab="one">
            <b>
              testing 1
            </b>
            <p>
              testing string
            </p>
          </sage-tab-panel>
          <sage-tab-panel tab="two">
            Content 2
          </sage-tab-panel>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });
});
