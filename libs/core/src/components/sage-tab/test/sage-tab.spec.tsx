import { newSpecPage } from '@stencil/core/testing';
import { SageTab } from '../sage-tab';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab></sage-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tab>
        <button aria-controls="undefined-panel" aria-selected="false" class="sage-tabs__tab" role="tab" tabindex="-1"></button>
      </sage-tab>
    `);
  });
});
