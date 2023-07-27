import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';
import { PdsSelectOption } from '../../pds-select-option/pds-select-option';

describe('pds-select', () => {
  it('renders correctly with default selected option', async () => {
    const page = await newSpecPage({
      components: [PdsSelect, PdsSelectOption],
      html: `
        <pds-select component-id="combobox" label="Label">
          <pds-select-option component-id="opt0" selected>Select an option</pds-select-option>
          <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
        </pds-select>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-select component-id="combobox" label="Label">
        <mock:shadow-root>
          <div class="pds-select is-open">
            <div class="pds-select__input combo-input" tabindex="0">Select an option<pds-icon name="caret-down" size="small"></pds-icon></div>
            <div class="pds-select__menu combo-menu" tabindex="-1">
              <pds-select-option class="pds-select-option is-selected" tabindex="0" component-id="opt0">Select an option</pds-select-option>
              <pds-select-option class="pds-select-option" tabindex="-1" component-id="opt1">Option A Slot</pds-select-option>
            </div>
          </div>
        </mock:shadow-root>
        <pds-select-option component-id="opt0" selected>Select an option</pds-select-option>
        <pds-select-option component-id="opt1">Option A Slot</pds-select-option>
      </pds-select>
    `);
  });
});
