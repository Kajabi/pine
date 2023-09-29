import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../pds-table';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table></pds-table>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });
});
