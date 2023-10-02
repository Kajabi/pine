import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';
import { PdsSelectOption } from '../pds-select-option/pds-select-option';

describe('pds-select', () => {
  // it('renders correctly with no selected option', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label" placement="bottom-start">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   expect(page.root).toEqualHtml(`
  //     <pds-select component-id="combobox" label="Label" placement="bottom-start">
  //       <mock:shadow-root>
  //         <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
  //         <div class="pds-select">
  //           <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
  //             Select an option
  //             <pds-icon name="caret-down" size="small"></pds-icon>
  //           </div>
  //           <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1" style="top: calc(0px + 4px); left: 0; transform: translateX(0);">
  //             <slot></slot>
  //           </div>
  //         </div>
  //       </mock:shadow-root>
  //       <pds-select-option component-id="opt0">
  //         <mock:shadow-root>
  //           <div aria-selected="false" class="pds-select-option" id="opt0" role="option" tabindex="-1">
  //             Select an option
  //           </div>
  //         </mock:shadow-root>
  //         Select an option
  //       </pds-select-option>
  //       <pds-select-option component-id="opt1">
  //         <mock:shadow-root>
  //           <div aria-selected="false" class="pds-select-option" id="opt1" role="option" tabindex="-1">
  //             Option A Slot
  //           </div>
  //         </mock:shadow-root>
  //         Option A Slot
  //       </pds-select-option>
  //     </pds-select>
  //   `);
  // });

  // it('renders correctly with selected option', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label" placement="bottom-start">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1" selected="true">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   expect(page.root).toEqualHtml(`
  //     <pds-select component-id="combobox" label="Label" placement="bottom-start">
  //       <mock:shadow-root>
  //         <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
  //         <div class="pds-select">
  //           <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
  //             Option A Slot
  //             <pds-icon name="caret-down" size="small"></pds-icon>
  //           </div>
  //           <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1" style="top: calc(0px + 4px); left: 0; transform: translateX(0);">
  //             <slot></slot>
  //           </div>
  //         </div>
  //       </mock:shadow-root>
  //       <pds-select-option component-id="opt0">
  //         <mock:shadow-root>
  //           <div aria-selected="false" class="pds-select-option" id="opt0" role="option" tabindex="-1">
  //             Select an option
  //           </div>
  //         </mock:shadow-root>
  //         Select an option
  //       </pds-select-option>
  //       <pds-select-option component-id="opt1" selected="">
  //         <mock:shadow-root>
  //           <div aria-selected="true" class="is-selected pds-select-option" id="opt1" role="option" tabindex="0">
  //             Option A Slot
  //             <pds-icon name="check"></pds-icon>
  //           </div>
  //         </mock:shadow-root>
  //         Option A Slot
  //       </pds-select-option>
  //     </pds-select>
  //   `);
  // });

  // it('renders correctly when invalid text', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label" invalid="true">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root?.shadowRoot;

  //   expect(element?.querySelector('.pds-select__input')).not.toBeNull();
  // });

  // it('renders a helperMessage', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label" helper-message="Use the correct syntax">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root?.shadowRoot;

  //   expect(element?.querySelector('.pds-select__helper-message')).not.toBeNull();
  // });

  // it('renders a errorMessage', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label" error-message="Use the correct syntax">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root?.shadowRoot;

  //   expect(element?.querySelector('.pds-select__error-message')).not.toBeNull();
  // });

  // it('focuses the first option when opened and arrow down key is pressed', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const select = page.root?.shadowRoot?.querySelector('.pds-select');
  //   const input = page.root?.shadowRoot?.querySelector<HTMLInputElement>('.pds-select__input');

  //   // Open the combobox by clicking on it
  //   input?.click();
  //   await page.waitForChanges();

  //   // Simulate arrow down key press
  //   const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  //   input?.dispatchEvent(arrowDownEvent);
  //   await page.waitForChanges();

  //   // Check if the first option is focused
  //   const focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
  //   const firstOption = page.root?.shadowRoot?.querySelector('.pds-select-option');

  //   expect(focusedOption).toBe(firstOption);
  // });

  it('should focus the previous option when the UP key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select>
          <pds-select-option>Option A</pds-select-option>
          <pds-select-option>Option B</pds-select-option>
        </pds-select>
      `,
    });

    const element = page.body.querySelector('pds-select') as HTMLElement;
    
    element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

    // expect(element).toEqualHtml('asdfaf');

    // Simulate pressing the End key. 1st
    const downKey = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    element.dispatchEvent(downKey);
    await page.waitForChanges();

    let firstOption = page.root?.querySelector('pds-select-option:first-child');

    expect(firstOption).toEqualHtml(`
      <pds-select-option>
        <mock:shadow-root>
          <div aria-selected="false" class="is--current pds-select-option" role="option" tabindex="0">
            Option A
          </div>
        </mock:shadow-root>
        Option A
      </pds-select-option>
    `);

    // Simulate pressing the Down key. 2nd
    element.dispatchEvent(downKey);
    await page.waitForChanges();

    firstOption = page.root?.querySelector('pds-select-option:first-child');
    
    expect(firstOption).toEqualHtml(`
      <pds-select-option>
        <mock:shadow-root>
          <div aria-selected="false" class="pds-select-option" role="option" tabindex="-1">
            Option A
          </div>
        </mock:shadow-root>
        Option A
      </pds-select-option>
    `);
    let lastOption = page.root?.querySelector('pds-select-option:last-child');

    expect(lastOption).toEqualHtml(`
    <pds-select-option>
       <mock:shadow-root>
         <div aria-selected="false" class="is--current pds-select-option" role="option" tabindex="0">
           Option B
         </div>
       </mock:shadow-root>
       Option B
     </pds-select-option>
    `);
    // expect(options[1]).toEqualHtml('asfasdf');
    expect(firstOption?.shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
    expect(lastOption?.shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();

    // const upKey = new KeyboardEvent('keydown', { key: 'Up' });
    // element.dispatchEvent(upKey);   

    // await page.waitForChanges();
    
    // // options = page.root?.querySelectorAll('pds-select-option') as NodeListOf<PdsSelectOption>;

    // // Assert that the dropdown is closed.
    // expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();
    // expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
  });

  // it('should not move focus up when arrow up is pressed on the first list item', async () => {
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

  //   let firstOption = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');

  //   // Simulate arrow down
  //   page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   // Verify current and tabindex
  //   expect(firstOption?.classList.contains('is--current')).toBe(true);
  //   expect(firstOption?.getAttribute('tabindex')).toEqual('0');

  //   page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  //   await page.waitForChanges();

  //   firstOption = page.body.querySelector('pds-select-option')?.shadowRoot?.querySelector('.pds-select-option');
  //   expect(firstOption?.getAttribute('tabindex')).toEqual('0');
  //   expect(firstOption?.classList.contains('is--current')).toBe(true);
  // });

  // it('should open the comboxbox and move focus to the first item when the up arrow is pressed on the combobox trigger', async () => {
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
  //   const select = page.root?.shadowRoot?.querySelector<HTMLElement>('.pds-select');

  //   // Open the combobox by clicking on it
  //   input?.focus();
  //   page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  //   await page.waitForChanges();

  //   // Verify current and tabindex
  //   expect(select?.classList.contains('is-open')).toBe(true);
  //   expect(input?.getAttribute('aria-expanded')).toEqual('true');
  // });

  // it('should open the comboxbox and move focus to the first item when the down arrow is pressed on the combobox trigger', async () => {
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
  //   const select = page.root?.shadowRoot?.querySelector<HTMLElement>('.pds-select');

  //   // Open the combobox by clicking on it
  //   input?.focus();
  //   page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  //   await page.waitForChanges();

  //   // spy event here

  //   // Verify current and tabindex
  //   expect(select?.classList.contains('is-open')).toBe(true);
  //   expect(input?.getAttribute('aria-expanded')).toEqual('true');
  // });

  // it('should close the combobox when the Escape key is pressed', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `
  //       <pds-select>
  //         <pds-select-option>Option A</pds-select-option>
  //         <pds-select-option>Option B</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root as HTMLElement;

  //   element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

  //   // Simulate pressing the ESC key.
  //   const escKey = new KeyboardEvent('keydown', { key: 'Escape' });
  //   element.dispatchEvent(escKey);

  //   // Assert that the dropdown is closed.
  //   expect(element.shadowRoot?.querySelector('.pds-select')?.classList.contains('is-open')).toBeFalsy();
  // });

  // it('should focus the first option when the Home key is pressed', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `
  //       <pds-select>
  //         <pds-select-option>Option A</pds-select-option>
  //         <pds-select-option>Option B</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root as HTMLElement;
  //   const options = page.root?.querySelectorAll('pds-select-option') as NodeListOf<HTMLElement>;

  //   console.log('options', options);
  //   console.log('opt 1', options[0]);
  //   console.log('opt 1 innerhtml', options[0].innerHTML);
  //   console.log('opt 1 shadowroot', options[0].shadowRoot);
  //   console.log('opt 1 classlist', options[0].classList);
  //   console.log('opt 1 dom', options[0].shadowRoot?.querySelector('.pds-select-option'))

  //   element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

  //   // Simulate pressing the ESC key.
  //   const homeKey = new KeyboardEvent('keydown', { key: 'Home' });
  //   element.dispatchEvent(homeKey);

  //   // Assert that the dropdown is closed.
  //   expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();
  //   expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
  // });

  // // it('should focus the last option when the End key is pressed', async () => {
  // //   const page = await newSpecPage({
  // //     components: [PdsSelect],
  // //     html: `
  // //       <pds-select>
  // //         <pds-select-option>Option A</pds-select-option>
  // //         <pds-select-option>Option B</pds-select-option>
  // //       </pds-select>
  // //     `,
  // //   });

  // //   const element = page.root as HTMLElement;
  // //   const options = page.root?.querySelectorAll('pds-select-option') as NodeListOf<HTMLElement>;

  // //   element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

  // //   // Simulate pressing the ESC key.
  // //   const homeKey = new KeyboardEvent('keydown', { key: 'End' });
  // //   element.dispatchEvent(homeKey);

  // //   // Assert that the dropdown is closed.
  // //   expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeFalsy();
  // //   expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is--current')).toBeTruthy();
  // // });

  // it('should open the combobox when the SPACE key is pressed', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `
  //       <pds-select></pds-select>
  //     `,
  //   });

  //   const element = page.root as HTMLElement;

  //   // Simulate pressing the SPACE key.
  //   const spaceKey = new KeyboardEvent('keydown', { key: ' ' });
  //   element.dispatchEvent(spaceKey);

  //   expect(element.shadowRoot?.querySelector('.pds-select')?.classList.contains('is-open')).toBeTruthy();
  // });

  // it('should select an option in an open combobox when the SPACE key is pressed', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: `
  //       <pds-select>
  //         <pds-select-option>Option A</pds-select-option>
  //         <pds-select-option>Option B</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const element = page.root as HTMLElement;
  //   const options = page.root?.querySelectorAll('pds-select-option');

  //   // open the combobox
  //   element.shadowRoot?.querySelector<HTMLElement>('.pds-select__input')?.click();

  //   // select the second item 

  //   // Simulate pressing the SPACE key.
  //   const spaceKey = new KeyboardEvent('keydown', { key: ' ' });
  //   element.dispatchEvent(spaceKey);

  //   // verify selected option
  //   expect(options[1].selected).toBeTruthy();
  //   expect(option[1].tabIndex).toBe("0");
  //   expect(element.shadowRoot?.querySelector('.pds-select')?.classList.contains('is-open')).toBeTruthy();
  // });

  // // it('should select the option when the SPACE key is pressed', async () => {
  // //   const page = await newSpecPage({
  // //     components: [PdsSelect],
  // //     html: `
  // //       <pds-select>
  // //         <pds-select-option>Option A</pds-select-option>
  // //         <pds-select-option>Option B</pds-select-option>
  // //       </pds-select>
  // //     `,
  // //   });

  // //   const element = page.root as HTMLElement;
  // //   const options = page.root?.querySelectorAll('pds-select-option');

  // //   const spaceKey = new KeyboardEvent('keydown', { key: ' ' });

  // //   // open the combobox
  // //   element.dispatchEvent(spaceKey);
  // //   await page.waitForChanges();

  // //   // Go to last option
  // //   const endKey = new KeyboardEvent('keydown', { key: 'End' });
  // //   element.dispatchEvent(endKey);
  // //   await page.waitForChanges();

  // //   // Select last option
  // //   element.dispatchEvent(spaceKey);
  // //   await page.waitForChanges();

  // //   // Assert
  // //   // component.selectFocusedOption();
  // //   expect(options[0].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is-selected')).toBeFalsy();
  // //   expect(options[1].shadowRoot?.querySelector('.pds-select-option')?.classList.contains('is-selected')).toBeTruthy();
  // // });

  // it('should handle pdsSelectOptionSelected event', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect],
  //     html: '<pds-select></pds-select>',
  //   });

  //   // Simulate the pdsSelectOptionSelected event
  //   const eventDetail = { id: 'option1', text: 'Option 1', value: 'value1' };
  //   page.root?.dispatchEvent(new CustomEvent('pdsSelectOptionSelected', { detail: eventDetail }));

  //   await page.waitForChanges();

  //   // Assert that the component's properties have been updated
  //   expect(page.root?.selectedOptionValue).toBe('value1');
  //   expect(page.root?.selectedOptionText).toBe('Option 1');
  //   expect(page.root?.selectedOptionId).toBe('option1');

  //   // Assert that the pdsSelectChange event has been emitted
  //   const emittedEvent = page.root?.spyOnEvent('pdsSelectChange');
  //   expect(emittedEvent).toHaveReceivedEvent();
  //   expect(emittedEvent.detail).toBe('value1');

  //   // Assert that handleComboboxToggle has been called
  //   expect(page.root?.handleComboboxToggle).toHaveBeenCalled();
  // });
});

