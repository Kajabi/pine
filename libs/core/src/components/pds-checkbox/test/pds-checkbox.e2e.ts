import { newE2EPage } from '@stencil/core/testing';

describe('pds-checkbox', () => {
  it('toggles checked and unchecked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');

    const component = await page.find('pds-checkbox');
    expect(component).toHaveClass('hydrated');

    const checkbox = await page.find('pds-checkbox >>> input');
    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeTruthy();

    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeFalsy();
  });

  it('toggles input disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');
    const component = await page.find('pds-checkbox');
    expect(component).toHaveClass('hydrated');

    let checkbox = await page.find('pds-checkbox >>> input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(true);
  });

  it('emits "pdsCheckboxChange" event when checkbox is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');

    const checkbox = await page.find('pds-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('pdsCheckboxChange');
    await checkbox.press('Space');

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('does not emit "pdsCheckboxChange" event when checkbox is changed and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" disabled />');

    const checkbox = await page.find('pds-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('pdsCheckboxChange');

    await checkbox.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });
});
