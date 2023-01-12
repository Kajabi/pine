import { newE2EPage } from '@stencil/core/testing';

describe('sage-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const element = await page.find('sage-button');
    expect(element).toHaveClass('hydrated');
  });

  it('submits form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <sage-button type="submit"></sage-button>
        </form>
      `
    });
    
    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('submit');
    await page.evaluate(() => document.querySelector('sage-button').click());
    await page.waitForChanges();

    // Confirm onClick has been called
    expect(elementFormEvent).toHaveReceivedEvent();
  });


  it('resets form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <input></input>
          <sage-button type="reset"></sage-button>
        </form>
      `
    });
    
    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('reset');
    page.evaluate(() => document.querySelector('input').value = 'test');
    await page.evaluate(() => document.querySelector('sage-button').click());    
    await page.waitForChanges();

    // Confirm form received reset event
    expect(elementFormEvent).toHaveReceivedEvent();

    // Confirm input value was reset
    const updatedFormInputValue = await page.evaluate(() => document.querySelector('input').value);
    expect(updatedFormInputValue).toBe('');
  });

  it('renders when slot is used', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button>Test Content</sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button');
    expect(element.textContent).toMatch('Test Content');
  });

  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button >>> button');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders toggle of icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button >>> button');
    let icon = await element.find('svg');
    expect(icon).toBeNull();

    component.setProperty('icon', 'trashIcon');
    await page.waitForChanges();
    icon = await element.find('svg');
    expect(icon).toEqualHtml(`
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.333 0a.667.667 0 0 0-.666.667v2h-4A.667.667 0 1 0 .667 4h14.666a.667.667 0 1 0 0-1.333h-4v-2A.667.667 0 0 0 10.667 0H5.333ZM10 2.667V1.333H6v1.334h4Z"></path>
        <path d="M2.667 5.333c.368 0 .666.299.666.667v8a.667.667 0 0 0 .667.667h8a.667.667 0 0 0 .667-.667V6A.667.667 0 1 1 14 6v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-.368.298-.667.667-.667Z"></path>
        <path d="M10.471 7.519c.26.26.26.682 0 .942L8.943 9.99l1.528 1.529a.667.667 0 1 1-.942.942L8 10.933 6.471 12.46a.667.667 0 0 1-.942-.942L7.057 9.99 5.53 8.461a.667.667 0 1 1 .942-.942L8 9.047 9.529 7.52c.26-.26.682-.26.942 0Z"></path>
      </svg>
    `);
  });
});
