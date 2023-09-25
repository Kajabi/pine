import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';
import { PdsSelectOption } from '../pds-select-option/pds-select-option';

describe('pds-select', () => {
  it('renders correctly with no selected option', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label" placement="bottom-start">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-select component-id="combobox" label="Label" placement="bottom-start">
        <mock:shadow-root>
          <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
          <div class="pds-select">
            <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
              Select an option
              <pds-icon name="caret-down" size="small"></pds-icon>
            </div>
            <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1" style="top: calc(0px + 4px); left: 0; transform: translateX(0);">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
        <pds-select-option component-id="opt0">
          <mock:shadow-root>
            <div aria-selected="false" class="pds-select-option" id="opt0" role="option" tabindex="-1">
              Select an option
            </div>
          </mock:shadow-root>
          Select an option
        </pds-select-option>
        <pds-select-option component-id="opt1">
          <mock:shadow-root>
            <div aria-selected="false" class="pds-select-option" id="opt1" role="option" tabindex="-1">
              Option A Slot
            </div>
          </mock:shadow-root>
          Option A Slot
        </pds-select-option>
      </pds-select>
    `);
  });

  it('renders correctly with selected option', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label" placement="bottom-start">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1" selected="true">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-select component-id="combobox" label="Label" placement="bottom-start">
        <mock:shadow-root>
          <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
          <div class="pds-select">
            <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
              Option A Slot
              <pds-icon name="caret-down" size="small"></pds-icon>
            </div>
            <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1" style="top: calc(0px + 4px); left: 0; transform: translateX(0);">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
        <pds-select-option component-id="opt0">
          <mock:shadow-root>
            <div aria-selected="false" class="pds-select-option" id="opt0" role="option" tabindex="-1">
              Select an option
            </div>
          </mock:shadow-root>
          Select an option
        </pds-select-option>
        <pds-select-option component-id="opt1" selected="">
          <mock:shadow-root>
            <div aria-selected="true" class="is-selected pds-select-option" id="opt1" role="option" tabindex="0">
              Option A Slot
              <pds-icon name="check"></pds-icon>
            </div>
          </mock:shadow-root>
          Option A Slot
        </pds-select-option>
      </pds-select>
    `);
  });

  it('renders correctly when invalid text', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label" invalid="true">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-select__input')).not.toBeNull();
  });

  it('renders a helperMessage', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label" helper-message="Use the correct syntax">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-select__helper-message')).not.toBeNull();
  });

  it('renders a errorMessage', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label" error-message="Use the correct syntax">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-select__error-message')).not.toBeNull();
  });

  it('focuses the first option when opened and arrow down key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const select = page.root?.shadowRoot?.querySelector('.pds-select');
    const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');

    // Open the combobox by clicking on it
    input?.click();
    await page.waitForChanges();

    // Simulate arrow down key press
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    input?.dispatchEvent(arrowDownEvent);
    await page.waitForChanges();

    // Check if the first option is focused
    const focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
    const firstOption = page.root?.shadowRoot?.querySelector('.pds-select-option');

    expect(focusedOption).toBe(firstOption);
  });

  // it('should move focus down when arrow down is pressed twice', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');

  //   // Open the combobox by clicking on itstensadfasdfasdfasdfasfdasdfasdfasdfasdf
  //   input?.click();
  //   await page.waitForChanges();

  //   // Simulate arrow down key press twice
  //   page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   // Check if the focus moved to the second option
  //   let focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
  //   let secondOption = page.root?.shadowRoot?.querySelector('pds-select-option:nth-child(2)');
  //   expect(focusedOption).toEqual(secondOption);

  //   page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
  //   secondOption = page.root?.shadowRoot?.querySelector('pds-select-option:nth-child(2)');
  //   expect(focusedOption).toEqual(secondOption);
  // });

  it('should not move focus up when arrow up is pressed on the first list item', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');

    // Open the combobox by clicking on it
    input?.click();
    await page.waitForChanges();

    let firstOption = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');

    // Simulate arrow down
    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();

    // Verify current and tabindex
    expect(firstOption?.classList.contains('is--current')).toBe(true);
    expect(firstOption?.getAttribute('tabindex')).toEqual('0');

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await page.waitForChanges();

    firstOption = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');
    expect(firstOption?.getAttribute('tabindex')).toEqual('0');
    expect(firstOption?.classList.contains('is--current')).toBe(true);
  });

  it('should open the comboxbox and move focus to the first item when the up arrow is pressed on the combobox trigger', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');
    const select = page.root?.shadowRoot?.querySelector<HTMLElement>('.pds-select');

    // Open the combobox by clicking on it
    input?.focus();
    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await page.waitForChanges();

    // Verify current and tabindex
    expect(select?.classList.contains('is-open')).toBe(true);
    expect(input?.getAttribute('aria-expanded')).toEqual('true');
  });

  it('should open the comboxbox and move focus to the first item when the down arrow is pressed on the combobox trigger', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');
    const select = page.root?.shadowRoot?.querySelector<HTMLElement>('.pds-select');

    // Open the combobox by clicking on it
    input?.focus();
    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();

    // spy event here

    // Verify current and tabindex
    expect(select?.classList.contains('is-open')).toBe(true);
    expect(input?.getAttribute('aria-expanded')).toEqual('true');
  });

  // it('should select the focused option when the enter key is press on an open combobox', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   // const component = new PdsSelect();

  //   // expect(component.focusIndex).toBe(-1);
  //   // component.focusIndex = 1;

  //   // component.selectFocusedOption();

  //   // expect(component.focusIndex).toBe(1);


  //   const select = page.root?.querySelector('pds-select') as PdsSelect;
  //   // const options = page.root?.querySelectorAll<PdsSelectOption>('pds-select-option');
  //   const options = page.root?.querySelectorAll('pds-select-option') as unknown as NodeListOf<PdsSelectOption>;

  //   console.log('enter key test - select', select);
  //   // console.log('select.focusIndex', select.focusIndex);
  //   // TODO TEST FIX - focusIndex is returning null

  //   // Set the focus index to select the second option
  //   select.focusIndex = 1;
  //   select.selectFocusedOption();

  //   expect(options[0].selected).toBeFalsy();
  //   expect(options[1].selected).toBeTruthy();
  // });

  // it('should update the selected option and emit an event when pdsSelectOptionSelected event is triggered', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `<pds-select></pds-select>`,
  //   });

  //   const select = page.root as unknown as PdsSelect;

  //   const eventData = {
  //     id: 'option-1',
  //     text: 'Option 1',
  //     value: 'value-1',
  //   };

  //   page.body.dispatchEvent(new CustomEvent('pdsSelectOptionSelected', {
  //     detail: eventData,
  //   }));

  //   await page.waitForChanges();

  //   // TODO TEST FIX: select props are showing as undefined
  //   console.log('select after dispatch', select);
  //   console.log('selectOptionValue after dispatch', select.selectedOptionValue);
  //   console.log('selctOptionText after dispatch', select.selectedOptionText);

  //   expect(select.selectedOptionValue).toBe(eventData.value);
  //   expect(select.selectedOptionText).toBe(eventData.text);
  //   expect(select.selectedOptionId).toBe(`option-1`); // Replace with your specific expected ID

  //   expect(select.pdsSelectChange).toHaveReceivedEventDetail(eventData.value);
  // });

  // // TODO: test returning opposite results
  // it('should not move focus down when arrow down is pressed on the last list item', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');

  //   // Open the combobox by clicking on it
  //   input?.click();
  //   await page.waitForChanges();

  //   let testingFirst = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');
  //   let testingLast = page.body.querySelector('pds-select-option:last-child')?.shadowRoot?.querySelector('.pds-select-option');

  //   let lastOption = page.body.querySelector('pds-select-option:last-child')?.shadowRoot?.querySelector('.pds-select-option');

  //   // Simulate arrow down (Option 1 has focus)
  //   page.root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   testingFirst = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');
  //   testingLast = page.body.querySelector('pds-select-option:last-child')?.shadowRoot?.querySelector('.pds-select-option');

  //   expect(lastOption?.classList.contains('is--current')).toBe(false);
  //   expect(lastOption?.getAttribute('tabindex')).toEqual('-1');

  //   // Simulate arrow down (Option 2 has focus)
  //   page.root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   expect(lastOption?.classList.contains('is--current')).toBe(true);
  //   expect(lastOption?.getAttribute('tabindex')).toEqual('0');

  //   // Simulate arrow down
  //   page.root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   lastOption = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');
  //   expect(lastOption?.getAttribute('tabindex')).toEqual('0');
  //   expect(lastOption?.classList.contains('is--current')).toBe(true);
  // });

  it('should close the combobox when the Escape key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select>
          <pds-select-option>Option A</pds-select-option>
          <pds-select-option>Option B</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root as HTMLElement;

    element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

    // Simulate pressing the ESC key.
    const escKey = new KeyboardEvent('keydown', { key: 'Escape' });
    element.dispatchEvent(escKey);

    // Assert that the dropdown is closed.
    expect(element.shadowRoot?.querySelector('.pds-select')?.classList.contains('is-open')).toBeFalsy();
  });

  it('should focus the first option when the Home key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select>
          <pds-select-option>Option A</pds-select-option>
          <pds-select-option>Option B</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root as HTMLElement;
    const options = page.root?.querySelectorAll('pds-select-option') as NodeListOf<HTMLElement>;

    console.log('options', options);
    console.log('opt 1', options[0]);
    console.log('opt 1 innerhtml', options[0].innerHTML);
    console.log('opt 1 shadowroot', options[0].shadowRoot);
    console.log('opt 1 classlist', options[0].classList);
    console.log('opt 1 dom', options[0].shadowRoot?.querySelector('.pds-select-option'))

    element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

    // Simulate pressing the ESC key.
    const homeKey = new KeyboardEvent('keydown', { key: 'Home' });
    element.dispatchEvent(homeKey);

    // Assert that the dropdown is closed.
    expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();
    expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
  });

  it('should focus the last option when the End key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select>
          <pds-select-option>Option A</pds-select-option>
          <pds-select-option>Option B</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root as HTMLElement;
    const options = page.root?.querySelectorAll('pds-select-option') as NodeListOf<HTMLElement>;

    element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

    // Simulate pressing the ESC key.
    const homeKey = new KeyboardEvent('keydown', { key: 'End' });
    element.dispatchEvent(homeKey);

    // Assert that the dropdown is closed.
    expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
    expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();
  });

  it('should open the combobox when the SPACE key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select></pds-select>
      `,
    });

    const element = page.root as HTMLElement;

    // Simulate pressing the SPACE key.
    const spaceKey = new KeyboardEvent('keydown', { key: ' ' });
    element.dispatchEvent(spaceKey);

    expect(element.shadowRoot?.querySelector('.pds-select')?.classList.contains('is-open')).toBeTruthy();
  });

  it('should select the option when the SPACE key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select>
          <pds-select-option>Option A</pds-select-option>
          <pds-select-option>Option B</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.root as HTMLElement;
    const options = page.root?.querySelectorAll('pds-select-option');

    const spaceKey = new KeyboardEvent('keydown', { key: ' ' });

    // open the combobox
    element.dispatchEvent(spaceKey);
    await page.waitForChanges();

    // Go to last option
    const endKey = new KeyboardEvent('keydown', { key: 'End' });
    element.dispatchEvent(endKey);
    await page.waitForChanges();

    // Select last option
    element.dispatchEvent(spaceKey);
    await page.waitForChanges();

    // Assert
    // component.selectFocusedOption();
    expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is-selected')).toBeFalsy();
    expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is-selected')).toBeTruthy();
  });
});