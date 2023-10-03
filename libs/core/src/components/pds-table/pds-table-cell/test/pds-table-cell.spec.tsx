import { newSpecPage } from '@stencil/core/testing';
import { PdsTableCell } from '../pds-table-cell';

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell></pds-table-cell>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-cell role="gridcell">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-cell>
    `);
  });
});
