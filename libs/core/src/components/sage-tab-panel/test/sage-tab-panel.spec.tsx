import { newSpecPage } from '@stencil/core/testing';
import { SageTabPanel } from '../sage-tab-panel';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabPanel],
      html: `<sage-tab-panel></sage-tab-panel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tab-panel>
        <div aria-selected="false" class="sage-tabs__tabpanel" id="undefined-panel" role="tabpanel"></div>
      </sage-tab-panel>
    `);
  });
});
