import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../pds-table';
import { PdsTableHead } from '../pds-table-head/pds-table-head';
import { PdsTableHeadCell } from '../pds-table-head-cell/pds-table-head-cell';
import { PdsTableBody } from '../pds-table-body/pds-table-body';
import { PdsTableRow } from '../pds-table-row/pds-table-row';
import { PdsTableCell } from '../pds-table-cell/pds-table-cell';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table></pds-table>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table" role="grid" tabindex="0">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('renders compact when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table compact="true"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table is-compact" compact="true" role="grid" tabindex="0">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('renders responsive when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table responsive="true"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table is-responsive" responsive="true" role="grid" tabindex="0">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('sorts the table when pdsTableSort event is triggered', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableHead, PdsTableHeadCell, PdsTableBody, PdsTableRow, PdsTableCell],
      html: `
        <pds-table component-id="test-table" responsive tabindex="0">
          <pds-table-head>
            <pds-table-head-cell sortable>Column 1</pds-table-head-cell>
            <pds-table-head-cell sortable>Column 2</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Row 1, Column 1</pds-table-cell>
              <pds-table-cell>Row 1, Column 2</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>Row 2, Column 1</pds-table-cell>
              <pds-table-cell>Row 2, Column 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const table = page.body.querySelector('pds-table') as HTMLElement;
    const tableBody = page.body.querySelector('pds-table-body') as HTMLElement;

    // Trigger the pdsTableSort event to simulate user interaction
    table.dispatchEvent(
      new CustomEvent('pdsTableSort', {
        detail: { column: 'Column 1', direction: 'asc' },
      }),
    );

    // Wait for changes to be applied
    await page.waitForChanges();

    // Check if the table rows are sorted correctly
    const rows = Array.from(tableBody.querySelectorAll('pds-table-row')) as any;
    const values = rows.map((row) => row.querySelector('pds-table-cell').textContent?.trim());

    // Assert that the values are sorted in ascending order based on Column 1
    expect(values).toEqual(['Row 1, Column 1', 'Row 2, Column 1']);
  });
});
