import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-head-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-head-cell></pds-table-head-cell>');

    const element = await page.find('pds-table-head-cell');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with fixed styles when part attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table fixed-column>
        <pds-table-head>
          <pds-table-head-cell part="fixed-cell">Column 1</pds-table-head-cell>
          <pds-table-head-cell>Column 2</pds-table-head-cell>
        </pds-table-head>
      </pds-table>
    `);

    const headCell = await page.find('pds-table-head-cell');
    expect(headCell).toHaveClass('is-fixed');
  });

  it('toggles is-active class when sortable and clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-head>
          <pds-table-head-cell sortable>Column 1</pds-table-head-cell>
        </pds-table-head>
      </pds-table>
    `);

    const headCell = await page.find('pds-table-head-cell');

    await headCell.click();
    await page.waitForChanges();

    const classList = await headCell.getAttribute('class');
    expect(classList).toContain('is-active');
  });
});
