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

  it('applies has-border class when hasBorder prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('has-border');
  });

  it('does not apply has-border class when hasBorder prop is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).not.toHaveClass('has-border');
  });

  it('toggles has-border class when hasBorder property is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).not.toHaveClass('has-border');

    component.setProperty('hasBorder', true);
    await page.waitForChanges();
    expect(component).toHaveClass('has-border');

    component.setProperty('hasBorder', false);
    await page.waitForChanges();
    expect(component).not.toHaveClass('has-border');
  });

  it('maintains functionality when hasBorder is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border />');

    const component = await page.find('pds-radio');
    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');

    expect(component).toHaveClass('has-border');

    await radio.click();
    expect(await radio.getProperty('checked')).toBeTruthy();
    expect(eventSpy).toHaveReceivedEvent();
  });

  it('combines has-border with other state classes', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border invalid disabled />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('has-border');
    expect(component).toHaveClass('is-invalid');
    expect(component).toHaveClass('is-disabled');
  });
});
