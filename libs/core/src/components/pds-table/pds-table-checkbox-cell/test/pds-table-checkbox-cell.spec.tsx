import { newSpecPage } from '@stencil/core/testing';
import { PdsTableCheckboxCell } from '../pds-table-checkbox-cell';

describe('pds-table-checkbox-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableCheckboxCell],
      html: `<pds-table-checkbox-cell></pds-table-checkbox-cell>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-checkbox-cell role="gridcell">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-checkbox-cell>
    `);
  });
});
