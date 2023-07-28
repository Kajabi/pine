import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  it('emits the correct event details when an option is selected', async () => {
    const page = await newE2EPage({
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
          <pds-select-option component-id="opt2">Option B Slot</pds-select-option>
          <pds-select-option component-id="opt3">Option C Slot</pds-select-option>
          <pds-select-option component-id="opt4">Option D Slot</pds-select-option>
        </pds-select>
      `,
    });

    // const select = await page.find('pds-select');
    const selectComponent = await page.find('pds-select');
    await selectComponent.click();
    const selectOption = (await page.find('pds-select-option')).shadowRoot.querySelector('.pds-select-option');

    // const selectOption = selectComponent.find('')
    console.log('selectOption: ', selectOption);

    // Listen for the 'pdsSelectChange' event on the 'pds-select' component
    const selectChangeEvent = await page.spyOnEvent('pdsSelectOptionSelected');

    // Click on the 'pds-select-option' to select it
    // await selectOption?.click();
    selectOption?.dispatchEvent(new Event('pdsSelectOptionSelected'));
    await page.waitForChanges();

    console.log('selectOption After: ', selectOption);
    // Verify that the 'pdsSelectChange' event is emitted with the correct details
    // expect(selectChangeEvent).toHaveReceivedEventDetail('Select an option');
    // expect(selectChangeEvent).toHaveReceivedEventTimes(1);
    expect(selectOption).toHaveClass('is-selected');
  });
});
