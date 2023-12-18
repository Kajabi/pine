import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-checkbox-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-body>
          <pds-table-row>
            <pds-table-checkbox-cell>
              <pds-checkbox componentId="checkbox-1" label="Select Row" labelHidden="true"></pds-checkbox>
            </pds-table-checkbox-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const checkboxCell = await page.find('pds-table-checkbox-cell');
    expect(checkboxCell).not.toBeNull();

    const checkbox = await page.find('pds-checkbox');
    expect(checkbox).not.toBeNull();
  });

});
