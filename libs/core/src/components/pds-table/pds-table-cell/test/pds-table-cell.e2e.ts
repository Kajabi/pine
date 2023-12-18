import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-cell></pds-table-cell>');

    const element = await page.find('pds-table-cell');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with compact styles', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table compact>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Row 1, Column 1</pds-table-cell>
            <pds-table-cell>Row 1, Column 2</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const tableCell = await page.find('pds-table-cell');
    expect(tableCell).toHaveClass('is-compact');
  });

  it('renders with truncated content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell truncate>Very long content that should be truncated</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const tableCell = await page.find('pds-table-cell');
    expect(tableCell).toHaveClass('is-truncated');
  });
});
