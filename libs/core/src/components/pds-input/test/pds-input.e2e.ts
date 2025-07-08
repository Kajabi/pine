import { newE2EPage } from "@stencil/core/testing";

describe('pds-input', () => {
  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-input></pds-input>');
    const component = await page.find('pds-input');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-input >>> input');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('toggles an error state', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-input error-message="This is error message"></pds-input>');
    const component = await page.find('pds-input');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-input >>> .pds-input__error-message');
    expect(element.textContent).toEqual(`This is error message`);
  });

  it('renders a value pdsInput', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-input></pds-input>');
    const input = await page.find('pds-input >>> input');

    let value = await input.getProperty('value');
    expect(value).toBe('');

    await input.focus();
    await page.waitForChanges();

    const inputSpy = await page.spyOnEvent('pdsInput');

    // Use direct input typing instead of keyboard events (fixes timeout issues)
    await input.type('Hello');
    await page.waitForChanges();

    value = await input.getProperty('value');
    expect(inputSpy).toHaveReceivedEvent();
  });

  it('emits the pdsfocus on the input element', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-input></pds-input>');

    const pdsInput = await page.find('pds-input');

    const inputSpy = await page.spyOnEvent('pdsFocus');
    await pdsInput.callMethod('setFocus');
    await page.waitForChanges();

    expect(inputSpy).toHaveReceivedEvent();
  });

  it('emits the pdsBlur on the input element', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-input></pds-input>');

    const pdsInput = await page.find('pds-input');

    const inputSpy = await page.spyOnEvent('pdsBlur');
    await pdsInput.callMethod('setFocus');
    await page.waitForChanges();
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(inputSpy).toHaveReceivedEvent();
  });

  it('emits the pdsChange event when the input value changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-input />');

    const input = await page.find('pds-input >>> input');
    let value = await input.getProperty('value');
    expect(value).toBe('');

    const pdsInput = await page.find('pds-input');
    const inputSpy = await page.spyOnEvent('pdsChange');

    // Focus and set value directly on the input element
    await pdsInput.callMethod('setFocus');
    await page.waitForChanges();

    // Type the value directly into the input instead of using keyboard.type
    await input.type('yoda-yoda');
    await page.waitForChanges();

    value = await input.getProperty('value');
    expect(value).toBe('yoda-yoda');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy.events[0].detail.value).toBe('yoda-yoda');
  });
});
