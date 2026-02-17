import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-table-row></pds-table-row>`);
    const row = await page.find('pds-table-row');
    expect(row).not.toBeNull();
  });

  it('renders with is-selected class when the checkbox is checked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table selectable>
        <pds-table-body>
          <pds-table-row></pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const row = await page.find('pds-table-row');
    const checkbox = await page.find('pds-table-row >>> pds-checkbox >>> input');

    await checkbox.click();
    await page.waitForChanges();

    const classList = await row.getAttribute('class');
    expect(classList).toContain('is-selected');
  });


  it('emits pdsTableRowSelected event when the checkbox is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table selectable="true">
        <pds-table-body>
          <pds-table-row></pds-table-row>
          <pds-table-row></pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const row = await page.find('pds-table-row');
    const checkbox = await page.find('pds-table-row >>> pds-checkbox >>> input');

    const pdsTableSelectSpy = await row.spyOnEvent('pdsTableRowSelected');

    await checkbox.click();
    await page.waitForChanges();

    expect(pdsTableSelectSpy).toHaveReceivedEventDetail({ rowIndex: 0, isSelected: true });
  });
});
