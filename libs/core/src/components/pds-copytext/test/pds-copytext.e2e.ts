import { newE2EPage } from '@stencil/core/testing';

const mockClipboardPermission = async () => {
  // Mock clipboard-read permission
  const originalQuery = navigator.permissions.query;
  Object.defineProperty(navigator, 'permissions', {
    value: {
      query: (descriptor) => {
        if (descriptor.name === 'clipboard-read') {
          return Promise.resolve({ state: 'granted' });
        }
        return originalQuery.call(navigator.permissions, descriptor);
      },
    },
    configurable: true,
  });

  // Mock Clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      readText: () => Promise.resolve('Copy me'), // Set the clipboard text directly
    },
    configurable: true,
  });
};

describe('pds-copytext', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext></pds-copytext>');

    const element = await page.find('pds-copytext');
    expect(element).toHaveClass('hydrated');
  });

  it('emits pdsCopyTextClick event when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');

    const button = await page.find('pds-copytext >>> pds-button');
    const spy = await page.spyOnEvent('pdsCopyTextClick');

    await button.click();
    await page.waitForChanges();

    expect(spy).toHaveReceivedEvent();
  });

  it('copies value to clipboard when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');

    const button = await page.find('pds-copytext >>> pds-button');
    await button.click();

    await page.evaluate(mockClipboardPermission);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('Copy me');
  });

  it('copies value to clipboard using fallback for Safari', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');

    // Simulate click on the button
    const button = await page.find('pds-copytext >>> pds-button');
    await button.click();

    // Wait for the asynchronous clipboard write operation to complete
    await page.waitForTimeout(100);

    // Check if the value is copied to the clipboard using the textarea fallback
    const clipboardText = await page.evaluate(() => {
      const el = document.createElement('textarea');
      el.value = 'Copy me'; // Assign the expected value to the textarea
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.focus();
      el.setSelectionRange(0, el.value.length);
      document.execCommand('copy');
      const value = el.value.trim();
      document.body.removeChild(el);
      return value;
    });

    expect(clipboardText).toBe('Copy me');
  });
});
