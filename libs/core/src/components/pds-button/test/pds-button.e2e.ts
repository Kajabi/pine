import { newE2EPage } from '@stencil/core/testing';
import { caretDown } from '@pine-ds/icons/icons';

describe('pds-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button></pds-button>');
    const element = await page.find('pds-button');
    expect(element).toHaveClass('hydrated');
  });

  it('submits form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <pds-button type="submit"></pds-button>
        </form>
      `
    });

    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('submit');
    await page.evaluate(() => document.querySelector('pds-button').click());
    await page.waitForChanges();

    // Confirm onClick has been called
    expect(elementFormEvent).toHaveReceivedEvent();
  });


  it('resets form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <input></input>
          <pds-button type="reset"></pds-button>
        </form>
      `
    });

    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('reset');
    page.evaluate(() => document.querySelector('input').value = 'test');
    await page.evaluate(() => document.querySelector('pds-button').click());
    await page.waitForChanges();

    // Confirm form received reset event
    expect(elementFormEvent).toHaveReceivedEvent();

    // Confirm input value was reset
    const updatedFormInputValue = await page.evaluate(() => document.querySelector('input').value);
    expect(updatedFormInputValue).toBe('');
  });

  it('renders when slot is used', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button>Test Content</pds-button>');
    const component = await page.find('pds-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-button');
    expect(element.textContent).toMatch('Test Content');
  });

  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button></pds-button>');
    const component = await page.find('pds-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-button >>> button');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders caret-down icon when variant is disclosure', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-button variant="disclosure"></pds-button>');

    const element = await page.find('pds-button >>> button');
    const icon = await element.find('pds-icon');
    const iconName = await icon.getProperty('icon');

    expect(icon).toBeTruthy();
    expect(iconName).toBe(caretDown);
  });
});
