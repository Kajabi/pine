import { newSpecPage } from '@stencil/core/testing';
import { PdsTableHead } from '../pds-table-head';

describe('pds-table-head', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead],
      html: `<pds-table-head></pds-table-head>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-head role="row">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-head>
    `);
  });
});
