import { newE2EPage } from '@stencil/core/testing';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table></pds-table>');

    const element = await page.find('pds-table');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with compact and responsive configurations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table compact responsive component-id="test-table"></pds-table>
    `);
    const table = await page.find('pds-table');
    expect(table).toHaveClass('pds-table-responsive-host');
    // For responsive tables, the inner div has the table classes
    const tableDiv = await page.find('pds-table >>> .pds-table');
    expect(tableDiv).toHaveClass('is-compact');
    expect(tableDiv).toHaveClass('is-responsive');
  });

  it('sorts the table when pdsTableSort event is triggered', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
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
    `);

    const columnHeader1 = await page.find('pds-table-head-cell:nth-child(1)');

    await columnHeader1.click(); // Simulate clicking on the sortable column
    await page.waitForChanges();

    // Check if the values are rearranged after sorting
    const rows = await page.findAll('pds-table-row');
    const values = await Promise.all(rows.map(async (row) => (await row.find('pds-table-cell')).textContent.trim()));

    // Assert that the values are different after sorting
    expect(values).not.toEqual(['Row 1, Column 1', 'Row 2, Column 1']);
  });
});
