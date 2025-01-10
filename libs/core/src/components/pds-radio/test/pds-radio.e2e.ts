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

    const radio = await page.find('pds-radio input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(true);
  });

  it('does not emit "pdsRadioChange" event when radio is clicked and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" disabled />');

    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');

    await radio.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });

  it('should set the form value and emit pdsRadioChange event when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form id="myForm">
        <pds-radio component-id="myRadio" name="radioGroup" value="radioValue" />
      </form>
    `);

    const radio = await page.find('pds-radio >>> input');

    await radio.click();
    await page.waitForChanges();

    // Check form value using evaluate
    const formValue = await page.evaluate(() => {
      const form = document.querySelector('#myForm') as HTMLFormElement;
      const formData = new FormData(form as HTMLFormElement);
      return formData.get('radioGroup');
    });

    expect(formValue).toBe('radioValue');
  });
});
