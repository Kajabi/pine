import { newSpecPage } from '@stencil/core/testing';
import { PdsTableBody } from '../pds-table-body';

describe('pds-table-body', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableBody],
      html: `<pds-table-body></pds-table-body>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-body role="rowgroup" part="body">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-body>
    `);
  });
});
