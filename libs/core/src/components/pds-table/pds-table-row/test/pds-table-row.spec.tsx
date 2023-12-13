import { newSpecPage } from '@stencil/core/testing';
import { PdsTableRow } from '../pds-table-row';

describe('pds-table-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableRow],
      html: `<pds-table-row></pds-table-row>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-row role="row">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-row>
    `);
  });
});
