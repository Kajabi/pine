import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  it('should move focus down when arrow down is pressed', async () => {
    const page = await newE2EPage({
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0" value="Option 1">Option 1</pds-select-option>
          <pds-select-option component-id="opt1" value="Option 2">Option 2</pds-select-option>
          <pds-select-option component-id="opt2" value="Option 3">Option 3</pds-select-option>
        </pds-select>
      `,
    });

    const select = await page.find('pds-select >>> .pds-select');
    const input = await page.find('pds-select >>> .pds-select__input');

    // Open the combobox by clicking on it
    await input.click();
    await page.waitForChanges();

    // Simulate arrow down key press
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    // Check if the focus moved to the second option
    const secondOption = await page.find('pds-select-option >>> .pds-select-option:nth-child(1)');
    expect(secondOption.getAttribute('tabindex')).toBe('0');
    expect(secondOption.classList.contains('is--current')).toBeTruthy();

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(select.textContent).toBe('Option 1');
  });
});
