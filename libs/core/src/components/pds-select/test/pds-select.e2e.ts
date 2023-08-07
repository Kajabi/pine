import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  // it('emits the correct event details when an option is selected', async () => {
  //   const page = await newE2EPage({
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //         <pds-select-option component-id="opt2">Option B Slot</pds-select-option>
  //         <pds-select-option component-id="opt3">Option C Slot</pds-select-option>
  //         <pds-select-option component-id="opt4">Option D Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   // const select = await page.find('pds-select');
  //   const selectComponent = await page.find('pds-select');
  //   // await selectComponent.click();
  //   const selectOption = (await page.find('pds-select-option')).shadowRoot.querySelector('.pds-select-option');

  //   // const selectOption = selectComponent.find('')
  //   console.log('selectOption: ', selectOption);

  //   // Listen for the 'pdsSelectChange' event on the 'pds-select' component
  //   const selectChangeEvent = await page.spyOnEvent('pdsSelectChange');

  //   // Click on the 'pds-select-option' to select it
  //   // await selectOption?.click();
  //   selectOption?.dispatchEvent(new Event('pdsSelectOptionSelected'));
  //   await page.waitForChanges();

  //   console.log('selectOption After: ', selectOption);
  //   // Verify that the 'pdsSelectChange' event is emitted with the correct details
  //   // expect(selectChangeEvent).toHaveReceivedEventDetail('Select an option');
  //   // expect(selectChangeEvent).toHaveReceivedEventTimes(1);
  //   // expect(selectOption).toHaveClass('is-selected');
  //   expect(selectChangeEvent).toHaveReceivedEventDetail('Option A Slot');
  // });
  // it('focuses the first option when opened and arrow down key is pressed', async () => {
  //   const page = await newE2EPage({
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const select = await page.find('pds-select >>> .pds-select');
  //   const input = await page.find('pds-select >>> .pds-select__input');

  //   // Open the combobox by clicking on it
  //   await input?.click();
  //   await page.waitForChanges();

  //   // Simulate arrow down key press
  //   // const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  //   // input?.dispatchEvent(arrowDownEvent);
  //   // const inputSpy = await page.spyOnEvent('arrowDownEvent')
  //   // await page.waitForChanges();

  //   const focusedOption = await page.find('pds-select-option >>> .pds-select-option.is--current');
  //   const firstOption = await page.find('pds-select-option >>> .pds-select-option')

  //   let tabindex = await firstOption.getAttribute('tabindex')
  //   let isCurrentClass = await firstOption.classList.contains('is--current')

  //   // expect(focusedOption).toBeFalsy();
  //   expect(tabindex).toMatch('-1');
  //   expect(isCurrentClass).toBeFalsy();

  //   // Simulate arrow down key press
  //   await page.keyboard.press('ArrowDown');
  //   await page.waitForChanges();

  //   // Check if the first option is focused
  //   // expect(focusedOption).toBe(firstOption);

  //   tabindex = await firstOption.getAttribute('tabindex')
  //   isCurrentClass = await firstOption.classList.contains('is--current')

  //   expect(tabindex).toMatch('0');
  //   expect(firstOption.classList.contains('is--current')).toBeTruthy();

  //   // Simulate Enter key press
  //   // TODO FIGURE OUT WHY THE BELOW CODE IS THROWING AN ERROR
  //   await page.keyboard.press('Enter');
  //   await page.waitForChanges();

  //   expect();

  //   // Check select and option for correct values
  // });

  // it('should focus the first option when combobox is opened and arrow down is pressed', async () => {
  //   const page = await newE2EPage({
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0" value="Option 1">Option 1</pds-select-option>
  //         <pds-select-option component-id="opt1" value="Option 2">Option 2</pds-select-option>
  //         <pds-select-option component-id="opt2" value="Option 3">Option 3</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const select = await page.find('pds-select >>> .pds-select');
  //   const input = await page.find('pds-select >>> .pds-select__input');

  //   // Open the combobox by clicking on it
  //   await input.click();
  //   await page.waitForChanges();

  //   // Check if the first option is focused after opening the combobox
  //   const focusedOption = await page.find('pds-select-option >>> .pds-select-option.is--current');
  //   const firstOption = await page.find('pds-select-option >>> .pds-select-option');
  //   console.log('firstOption: ', firstOption);
  //   // expect(focusedOption).toEqual(firstOption);
  //   expect(select.classList.contains('is-open')).toBeTruthy();
  //   expect(firstOption.getAttribute('tabindex')).toBe('0');
  //   expect(firstOption.classList.contains('is--current')).toBeTruthy();
  // });

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
    console.log('select: ', select);

    // Open the combobox by clicking on it
    await input.click();
    await page.waitForChanges();

    // Simulate arrow down key press
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    // Check if the focus moved to the second option
    const focusedOption = await page.find('pds-select-option >>> .pds-select-option.is--current');
    const secondOption = await page.find('pds-select-option >>> .pds-select-option:nth-child(1)');
    // expect(focusedOption).toBe(secondOption);
    expect(secondOption.getAttribute('tabindex')).toBe('0');
    expect(secondOption.classList.contains('is--current')).toBeTruthy();

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(select.textContent).toBe('Option 1');
  });
});
