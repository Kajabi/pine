import { newSpecPage } from '@stencil/core/testing';
import { PdsTableHeadCell } from '../pds-table-head-cell';

describe('pds-table-head-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell></pds-table-head-cell>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-head-cell role="columnheader">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-head-cell>
    `);
  });
});
