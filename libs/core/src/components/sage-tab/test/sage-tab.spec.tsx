import { newSpecPage } from '@stencil/core/testing';
import { SageTab } from '../sage-tab';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab></sage-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tab slot="tabs">
        <button aria-controls="undefined-panel" aria-selected="false" class="sage-tab" role="tab" tabindex="-1">
          <div class="sage-tab__content"></div>
        </button>
      </sage-tab>
    `);
  });
});
