import { newSpecPage } from '@stencil/core/testing';
import { PdsRadioGroup } from '../pds-radio-group';
import { PdsRadio } from '../../pds-radio/pds-radio';

describe('pds-radio-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group></pds-radio-group>`,
    });

    expect(page.root).toBeTruthy();
  });

  it('renders with child radios', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    const radios = page.root?.querySelectorAll('pds-radio');
    expect(radios?.length).toBe(2);
  });

  it('applies name attribute to all child radios', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    radios?.forEach((radio) => {
      expect(radio.getAttribute('name')).toBe('test-group');
    });
  });

  it('applies invalid state to all child radios when invalid prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group" invalid>
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    radios?.forEach((radio) => {
      expect(radio.getAttribute('invalid')).toBe('true');
    });
  });

  it('applies required attribute to all child radios when required prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group" required>
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    radios?.forEach((radio) => {
      expect(radio.getAttribute('required')).toBe('true');
    });
  });

  it('applies disabled attribute to all child radios when disabled prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group" disabled>
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    radios?.forEach((radio) => {
      expect(radio.getAttribute('disabled')).toBe('true');
    });
  });

  it('removes disabled attribute from all child radios when disabled prop is false', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group" disabled>
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const component = page.rootInstance as PdsRadioGroup;
    component.disabled = false;
    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    radios?.forEach((radio) => {
      expect(radio.getAttribute('disabled')).toBeNull();
    });
  });

  it('renders group label when group-label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group group-label="Comments"></pds-radio-group>`,
    });

    const label = page.root?.querySelector('.pds-radio-group__label');
    expect(label?.textContent).toBe('Comments');
  });

  it('renders helper message when helperMessage prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group component-id="test-group" helper-message="This is a helper message"></pds-radio-group>`,
    });

    const message = page.root?.querySelector('.pds-radio-group__message');
    expect(message?.textContent).toBe('This is a helper message');
    expect(message?.classList.contains('pds-radio-group__message--error')).toBe(false);
  });

  it('renders error message when errorMessage prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group component-id="test-group" invalid error-message="Please select an option"></pds-radio-group>`,
    });

    const message = page.root?.querySelector('.pds-radio-group__message--error');
    expect(message).toBeTruthy();
    expect(message?.textContent?.trim()).toBe('Please select an option');
    expect(message?.querySelector('pds-icon')).toBeTruthy();
  });

  it('applies is-invalid class when invalid prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group invalid></pds-radio-group>`,
    });

    expect(page.root).toHaveClass('is-invalid');
  });

  it('applies column direction class to radios container by default', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group></pds-radio-group>`,
    });

    const radiosContainer = page.root?.querySelector('.pds-radio-group__radios');
    expect(radiosContainer).toHaveClass('pds-radio-group__radios--column');
  });

  it('applies row direction class to radios container when direction is row', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group direction="row"></pds-radio-group>`,
    });

    const radiosContainer = page.root?.querySelector('.pds-radio-group__radios');
    expect(radiosContainer).toHaveClass('pds-radio-group__radios--row');
    expect(radiosContainer).not.toHaveClass('pds-radio-group__radios--column');
  });

  it('updates child radios when name prop changes', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="group1">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const component = page.rootInstance as PdsRadioGroup;
    component.name = 'group2';
    await page.waitForChanges();

    const radio = page.root?.querySelector('pds-radio');
    expect(radio?.getAttribute('name')).toBe('group2');
  });

  it('removes name attribute from child radios when name prop becomes empty', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="group1">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    // Verify name is initially set
    const radio = page.root?.querySelector('pds-radio');
    expect(radio?.getAttribute('name')).toBe('group1');

    // Clear the name prop
    const component = page.rootInstance as PdsRadioGroup;
    component.name = '';
    await page.waitForChanges();

    // Verify name attribute is removed
    expect(radio?.getAttribute('name')).toBeNull();
  });

  it('updates child radios when invalid prop changes', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const component = page.rootInstance as PdsRadioGroup;
    component.invalid = true;
    await page.waitForChanges();

    const radio = page.root?.querySelector('pds-radio');
    expect(radio?.getAttribute('invalid')).toBe('true');
  });

  it('handles slot changes and updates new radios', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    // Get the component instance to manually trigger updateChildRadios
    const component = page.rootInstance as PdsRadioGroup;

    // Add a new radio dynamically by appending to the host element
    const newRadio = document.createElement('pds-radio');
    newRadio.setAttribute('component-id', 'radio2');
    newRadio.setAttribute('label', 'Option 2');
    newRadio.setAttribute('value', '2');
    page.root?.appendChild(newRadio);

    // Wait for the slot change to process
    await page.waitForChanges();

    // NOTE: Manually calling private method due to test harness limitations.
    // The slotchange event may not fire reliably in the test environment.
    // If the test harness ever supports reliably triggering slotchange events,
    // this test should be refactored to use black-box interactions instead.
    (component as any).updateChildRadios();

    await page.waitForChanges();

    const radios = page.root?.querySelectorAll('pds-radio');
    expect(radios?.length).toBe(2);
    radios?.forEach((radio) => {
      expect(radio.getAttribute('name')).toBe('test-group');
    });
  });

  it('emits pdsRadioGroupChange event when a child radio is selected', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="option1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="option2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const component = page.rootInstance as PdsRadioGroup;
    const eventSpy = jest.spyOn(component.pdsRadioGroupChange, 'emit');

    // NOTE: Manually calling private handler method due to test harness limitations.
    // Native change events may not bubble reliably in test environment.
    // If the test harness ever supports reliably triggering native change events end-to-end,
    // this test should be refactored to dispatch events on the input and let them bubble naturally.
    // Simulate a native change event on the input
    const radio1 = page.root?.querySelector('pds-radio[component-id="radio1"]') as HTMLPdsRadioElement;
    expect(radio1).toBeTruthy();

    const input = radio1?.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();

    input.checked = true;

    // Create a native change event
    const changeEvent = new Event('change', {
      bubbles: true,
      composed: true,
    });

    // Set the target to the input element
    Object.defineProperty(changeEvent, 'target', {
      value: input,
      writable: false,
    });

    // Manually call the handler
    component.handleRadioChange(changeEvent as any);

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        checked: true,
        value: 'option1',
        componentId: 'radio1',
      })
    );
  });

  it('only emits event when radio is checked (not unchecked)', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup, PdsRadio],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="option1" checked></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="option2"></pds-radio>
        </pds-radio-group>
      `,
    });

    await page.waitForChanges();

    const component = page.rootInstance as PdsRadioGroup;
    const eventSpy = jest.spyOn(component.pdsRadioGroupChange, 'emit');

    // NOTE: Manually calling private handler method due to test harness limitations.
    // Native change events may not bubble reliably in test environment.
    // If the test harness ever supports reliably triggering native change events end-to-end,
    // this test should be refactored to dispatch events on the input and let them bubble naturally.
    // Simulate unchecking the first radio (should not emit)
    const radio1 = page.root?.querySelector('pds-radio[component-id="radio1"]') as HTMLPdsRadioElement;
    expect(radio1).toBeTruthy();

    const input1 = radio1?.querySelector('input') as HTMLInputElement;
    expect(input1).toBeTruthy();

    input1.checked = false;

    const changeEvent1 = new Event('change', {
      bubbles: true,
      composed: true,
    });

    Object.defineProperty(changeEvent1, 'target', {
      value: input1,
      writable: false,
    });

    component.handleRadioChange(changeEvent1 as any);

    await page.waitForChanges();

    // Should not emit when unchecked
    expect(eventSpy).not.toHaveBeenCalled();

    // Now check the second radio (should emit)
    const radio2 = page.root?.querySelector('pds-radio[component-id="radio2"]') as HTMLPdsRadioElement;
    expect(radio2).toBeTruthy();

    const input2 = radio2?.querySelector('input') as HTMLInputElement;
    expect(input2).toBeTruthy();

    input2.checked = true;

    const changeEvent2 = new Event('change', {
      bubbles: true,
      composed: true,
    });

    Object.defineProperty(changeEvent2, 'target', {
      value: input2,
      writable: false,
    });

    component.handleRadioChange(changeEvent2 as any);

    await page.waitForChanges();

    // Should emit when checked
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        checked: true,
        value: 'option2',
        componentId: 'radio2',
      })
    );
  });

  it('applies correct gap CSS variable when gap prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group gap="lg"></pds-radio-group>`,
    });

    const style = page.root?.style.getPropertyValue('--pds-radio-group-gap');
    expect(style).toBe('var(--pine-dimension-lg)');
  });

  it('handles numeric gap values as dimension tokens', async () => {
    const page = await newSpecPage({
      components: [PdsRadioGroup],
      html: `<pds-radio-group gap="100"></pds-radio-group>`,
    });

    const style = page.root?.style.getPropertyValue('--pds-radio-group-gap');
    expect(style).toBe('var(--pine-dimension-100)');
  });
});

