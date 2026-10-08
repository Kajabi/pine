import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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

    const checkbox = await page.find('pds-checkbox >>> input');
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

describe('pds-checkbox checkmark color', () => {
  const markColor = (page, selector: string) =>
    page.$eval(selector, (el) => {
      const input = (el.shadowRoot || el).querySelector('input');
      return getComputedStyle(input, '::after').borderRightColor;
    });

  it('flips the checkmark with the theme on the accent fill', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox id="light" component-id="light" label="Light" checked></pds-checkbox>
      <div data-theme="dark">
        <pds-checkbox id="dark" component-id="dark" label="Dark" checked></pds-checkbox>
      </div>
    `);

    expect(await markColor(page, '#light')).toBe('rgb(255, 255, 255)');
    expect(await markColor(page, '#dark')).toBe('rgb(0, 0, 0)');
  });

  it('keeps the checkmark white on the invalid fill in dark mode', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div data-theme="dark">
        <pds-checkbox component-id="invalid" label="Invalid" checked invalid></pds-checkbox>
      </div>
    `);

    expect(await markColor(page, 'pds-checkbox')).toBe('rgb(255, 255, 255)');
  });
});

describe('pds-checkbox accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="terms" label="Accept the terms"></pds-checkbox>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
