
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
    await page.keyboard.type('Hello');
    await page.waitForChanges();
    value = await input.getProperty('value');
    expect(inputSpy).toHaveReceivedEvent();
  });
});
