import { newE2EPage } from '@stencil/core/testing';

describe('pds-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo"></pds-textarea>');
    await page.waitForChanges();
    const element = await page.find('pds-textarea');

    expect(element).toHaveClass('hydrated');
  });

  it('renders a value and updates', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo" required="true"></pds-textarea> <button>test</button>');
    const textarea = await page.find('pds-textarea >>> textarea');
    const button = await page.find('button');

    let value = await textarea.getProperty('value');
    expect(value).toBe('');

    await textarea.focus();
    await page.waitForChanges();

    const event = await page.spyOnEvent('pdsTextareaChange');
    await page.keyboard.type('Hello');
    await page.waitForChanges();
    await button.focus();
    await page.waitForChanges();

    value = await textarea.getProperty('value');

    expect(value).toBe('Hello');
    expect(event).toHaveReceivedEvent();
  });
});
