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

  // The tab stop is there to reach the tooltip, and the tooltip only appears
  // when there is hidden content — so a cell whose content fits stays out of
  // the tab order even though it opted into truncate. In a wide table that is
  // the difference between one dead stop per cell and none.
  it('is focusable only while the content is actually clipped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell truncate style="width: 60px;">Very long content that cannot fit</pds-table-cell>
            <pds-table-cell truncate style="width: 600px;">Short</pds-table-cell>
            <pds-table-cell style="width: 60px;">Very long content that cannot fit</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const [clipped, fits, plain] = await page.$$eval('pds-table-cell', (els) =>
      els.map((el) => el.getAttribute('tabindex')),
    );

    expect(clipped).toBe('0');
    expect(fits).toBeNull();
    expect(plain).toBeNull();
  });
});
