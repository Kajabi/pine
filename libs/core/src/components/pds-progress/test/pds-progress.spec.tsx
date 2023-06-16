import { newSpecPage } from '@stencil/core/testing';
import { PdsProgress } from '../pds-progress';

describe('pds-progress', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress></pds-progress>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-progress>
        <mock:shadow-root>
          <div class="pds-progress-bar">
            <label class="pds-progress__label"></label>
            <progress max="100" value="0"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });
});
