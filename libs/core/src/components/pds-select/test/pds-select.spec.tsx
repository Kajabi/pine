import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';
import { PdsSelectOption } from '../../pds-select-option/pds-select-option';

describe('pds-select', () => {
  // it('throws an error if componentId prop is not provided', async () => {
  //   expect(() => {
  //     newSpecPage({
  //       components: [PdsSelect],
  //       html: `<pds-select label="Label"></pds-select>`,
  //     });
  //   }).toThrowError('propMissing: componentId');
  // });

  // it('throws an error if label prop is not provided', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `<pds-select component-id="myId"></pds-select>`,
  //   });

  //   await expect(page.root).rejects.toThrow();
  // });

  it('renders correctly with no selected option', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-select component-id="combobox" label="Label">
        <mock:shadow-root>
          <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
          <div class="pds-select">
            <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
              Select an option
              <pds-icon name="caret-down" size="small"></pds-icon>
            </div>
            <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1">
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
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0">Select an option</pds-select-option>
          <pds-select-option component-id="opt1" selected="true">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-select component-id="combobox" label="Label">
        <mock:shadow-root>
          <label htmlfor="combobox" id="combobox-label" class="pds-select__label">Label</label>
          <div class="pds-select">
            <div aria-controls="combobox-listbox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combobox-label" class="pds-select__input" id="combobox" role="combobox" tabindex="0">
              Option A Slot
              <pds-icon name="caret-down" size="small"></pds-icon>
            </div>
            <div aria-labelledby="combobox-label" class="pds-select__menu" id="combobox-listbox" role="listbox" tabindex="-1">
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


  // it('emits the correct event details when an option is selected', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0" value="1">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1" value="2">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const select = page.root?.querySelector('pds-select');
  //   const option = page.root?.querySelector('pds-select-option');

  //   const pdsSelectChange = jest.fn();

  //   select?.addEventListener('pdsSelectChange', pdsSelectChange);

  //   // option?.click(); // Simulate selecting an option
  //   option?.dispatchEvent(new Event('pdsSelectOptionSelected'));

  //   await page.waitForChanges();

  //   // expect(pdsSelectChange).toHaveBeenCalled();
  //   // expect(pdsSelectChange.mock.calls[0][0].detail).toEqual('1'); // Verify the emitted value matches the selected option value

  //   expect(pdsSelectChange).toHaveBeenCalled();
  // });

  // it('emits the correct event details when an option is selected', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsSelect, PdsSelectOption],
  //     html: `
  //       <pds-select component-id="combobox" label="Label">
  //         <pds-select-option component-id="opt0" value="1">Select an option</pds-select-option>
  //         <pds-select-option component-id="opt1" value="2">Option A Slot</pds-select-option>
  //       </pds-select>
  //     `,
  //   });

  //   const select = page.root?.querySelector('pds-select');
  //   const option = page.root?.querySelector('pds-select-option[value="1"]'); // Select the first option

  //   const pdsSelectChange = jest.fn();

  //   select?.addEventListener('pdsSelectChange', pdsSelectChange);

  //   console.log('option: ', option);
  //   // Simulate user interaction by clicking on the option
  //   option?.click();

  //   await page.waitForChanges();

  //   expect(pdsSelectChange).toHaveBeenCalled();
  //   expect(pdsSelectChange.mock.calls[0][0].detail).toEqual('1'); // Verify the emitted value matches the selected option value
  // });


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

  it('should move focus down when arrow down is pressed twice', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
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

    // Simulate arrow down key press twice
    page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();

    page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();

    // Check if the focus moved to the second option
    // const focusedOption = page.body.querySelector('pds-select-option.is--current');
    let focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
    let secondOption = page.root?.shadowRoot?.querySelector('pds-select-option:nth-child(2)');
    expect(focusedOption).toEqual(secondOption);

    page.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();

    focusedOption = page.root?.shadowRoot?.querySelector('.pds-select-option.is--current');
    secondOption = page.root?.shadowRoot?.querySelector('pds-select-option:nth-child(2)');
    expect(focusedOption).toEqual(secondOption);
  });
});
