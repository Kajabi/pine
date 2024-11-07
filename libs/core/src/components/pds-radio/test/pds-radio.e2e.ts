import { newE2EPage } from '@stencil/core/testing';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio />');

    const element = await page.find('pds-radio');
    expect(element).toHaveClass('hydrated');
  });

  it('is checked when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('hydrated');

    const radio = await page.find('pds-radio input');
    await radio.click();
    expect(await radio.getProperty('checked')).toBeTruthy();
  });

  it('toggles input disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');
    const component = await page.find('pds-radio');
    expect(component).toHaveClass('hydrated');

    let radio = await page.find('pds-radio input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(true);
  });

  it('emits "pdsRadioChange" event when radio is checked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');
    await radio.press('Space');

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('does not emit "pdsRadioChange" event when radio is clicked and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" disabled />');

    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');

    await radio.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });

  // it('should submit the form with the correct value', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent(`
  //     <form id="myForm">
  //       <pds-radio component-id="default" label="Label text" />
  //       <button type="submit">Submit</button>
  //     </form>
  //   `);

  //   const form = await page.find('#myForm');
  //   const submitButton = await form.find('button');

  //   await submitButton.click();

  //   // Assert that the form data is sent correctly, e.g., by intercepting network requests
  //   // or by checking the browser's console logs.
  // });
  it('should set the form value and emit pdsRadioChange event when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form id="myForm">
        <pds-radio component-id="myRadio" name="radioGroup" value="radioValue" />
      </form>
    `);

    const radio = await page.find('pds-radio input');
    const form = await page.find('#myForm');
    const pdsRadioChangeSpy = await page.spyOnEvent('pdsRadioChange');

    await radio.click();
    await page.waitForChanges();

    // Assert form value change (adjust based on your testing framework)
    const formData = new FormData(form as unknown as HTMLFormElement);
    expect(formData.get('radioGroup')).toBe('radioValue');

    // Assert pdsRadioChange event
    expect(pdsRadioChangeSpy).toHaveReceivedEvent();
    expect(pdsRadioChangeSpy.firstEvent.detail).toBeTruthy();
  });
});
