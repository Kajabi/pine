import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  it('emits the correct event details', async () => {
    const page = await newE2EPage({
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt1" value="option-value">Option 1</pds-select-option>
        </pds-select>
      `,
    });

    const select = await page.find('pds-select');
    const selectOption = await page.find('pds-select-option');

    // Listen for the 'pdsSelectChange' event on the 'pds-select' component
    const selectChangeEvent = select.spyOnEvent('pdsSelectChange');

    // Click on the 'pds-select-option' to select it
    await selectOption.click();
    await page.waitForChanges();

    // Verify that the 'pdsSelectChange' event is emitted with the correct details
    expect(selectChangeEvent).toHaveReceivedEventDetail('option-value');
  });
});
