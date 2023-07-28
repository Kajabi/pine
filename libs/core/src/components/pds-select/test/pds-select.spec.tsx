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

  it('renders correctly with default selected option', async () => {
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
});
