import { newE2EPage } from '@stencil/core/testing';

describe('sage-checkbox', () => {
  it('toggles checked and unchecked', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" label="Label text" />');
    const component = await page.find('sage-checkbox');
    expect(component).toHaveClass('hydrated');
    const checkbox = await page.find('sage-checkbox >>> input');
    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeTruthy();
    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeFalsy();
  });
  it('toggles input disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" label="Label text" />');
    const component = await page.find('sage-checkbox');
    expect(component).toHaveClass('hydrated');
    let checkbox = await page.find('sage-checkbox >>> input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(false);
    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(true);
  });
  it('emits "sageCheckboxChange" event when checkbox is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" label="Label text" />');
    const checkbox = await page.find('sage-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('sageCheckboxChange');
    await checkbox.press('Space');
    expect(eventSpy).toHaveReceivedEvent();
  });
  it('does not emit "sageCheckboxChange" event when checkbox is changed and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" label="Label text" disabled />');
    const checkbox = await page.find('sage-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('sageCheckboxChange');
    await checkbox.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });
});
