import { newE2EPage } from '@stencil/core/testing';

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
    await page.keyboard.type('Hello');
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

  it('renders action slot content when provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-input label="Email">
          <a slot="action" href="#">Forgot password?</a>
        </pds-input>
      `);

    const actionSlot = await page.find('pds-input >>> .pds-input__action');
    expect(actionSlot).not.toBeNull();

    const slotContent = await page.find('pds-input a[slot="action"]');
    expect(await slotContent.innerText).toBe('Forgot password?');
  });

  it('does not render action wrapper when no action content is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-input label="Email"></pds-input>');

    const actionSlot = await page.find('pds-input >>> .pds-input__action');
    expect(actionSlot).toBeNull();
  });

  it('sets has-action attribute when action slot has content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-input label="Username">
          <button slot="action">Help</button>
        </pds-input>
      `);

    const component = await page.find('pds-input');
    expect(component).toHaveAttribute('has-action');
    expect(await component.getAttribute('has-action')).toBe('true');
  });
});
