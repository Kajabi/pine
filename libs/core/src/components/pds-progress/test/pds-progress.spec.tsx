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
          <progress></progress>
        </mock:shadow-root>
      </pds-progress>
    `);
  });
});
