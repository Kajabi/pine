import { newE2EPage } from '@stencil/core/testing';

describe('sage-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-textarea name="foo"></sage-textarea>');
    await page.waitForChanges();
    const element = await page.find('sage-textarea');

    expect(element).toHaveClass('hydrated');
  });

  it('renders a value and updates', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-textarea name="foo" required="true"></sage-textarea> <button>test</button>');
    const textarea = await page.find('sage-textarea >>> textarea');
    const button = await page.find('button');

    let value = await textarea.getProperty('value');
    expect(value).toBe('');

    await textarea.focus();
    await page.waitForChanges();

    const event = await page.spyOnEvent('sageTextareaChange');
    await page.keyboard.type('Hello');
    await page.waitForChanges();
    await button.focus();
    await page.waitForChanges();

    value = await textarea.getProperty('value');

    expect(value).toBe('Hello');
    expect(event).toHaveReceivedEvent();
  });
});
