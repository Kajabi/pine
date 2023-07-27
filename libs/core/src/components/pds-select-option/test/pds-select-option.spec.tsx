import { newSpecPage } from '@stencil/core/testing';
import { PdsSelectOption } from '../pds-select-option';

describe('pds-select-option', () => {
  it('displays correctly when value is present without textcontent  ', async () => {
    const optionValue = 'option-value';
    const page = await newSpecPage({
      components: [PdsSelectOption],
      html: `<pds-select-option component-id="opt1" value="${optionValue}"></pds-select-option>`,
    });

    const optionElement = page.root?.shadowRoot?.querySelector('.pds-select-option');
    expect(optionElement?.textContent).toEqual(optionValue);
  });

  it('displays correctly when textcontent is present without value', async () => {
    const optionText = 'Option text';
    const page = await newSpecPage({
      components: [PdsSelectOption],
      html: `<pds-select-option component-id="opt1">${optionText}</pds-select-option>`,
    });

    const optionElement = page.root?.shadowRoot?.querySelector('.pds-select-option');
    expect(optionElement?.textContent).toEqual(optionText);
  });

  it('displays correctly when both the textcontent and value are present', async () => {
    const optionText = 'Option text';
    const optionValue = 'option-value';
    const page = await newSpecPage({
      components: [PdsSelectOption],
      html: `<pds-select-option component-id="opt1" value="${optionValue}">${optionText}</pds-select-option>`,
    });

    const optionElement = page.root?.shadowRoot?.querySelector('.pds-select-option');
    expect(optionElement?.textContent).toEqual(optionText);
  });
});
