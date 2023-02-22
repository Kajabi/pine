import { newSpecPage } from '@stencil/core/testing';
import { SageTabpanel } from '../sage-tabpanel';

describe('sage-tabpanel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel></sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels">
        <div class="sage-tabpanel" id="undefined-panel" role="tabpanel"></div>
      </sage-tabpanel>
    `);
  });
});
