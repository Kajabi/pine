import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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

  it('renders with its default border when the attribute is removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');
    await page.waitForChanges();
    const element = await page.find('pds-copytext');

    // Removing the attribute is what a DOM morph does when the author relied
    // on the default, so the server's HTML never carried it.
    element.removeAttribute('border');
    await page.waitForChanges();

    expect(element).toHaveClass('pds-copytext--bordered');
    expect(element).toHaveAttribute('border');
  });

  it('turns the border off after the default border attribute is removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');
    await page.waitForChanges();
    const element = await page.find('pds-copytext');

    element.removeAttribute('border');
    await page.waitForChanges();

    element.setProperty('border', false);
    await page.waitForChanges();

    expect(await element.getProperty('border')).toBe(false);
    expect(element).not.toHaveClass('pds-copytext--bordered');
    expect(element).not.toHaveAttribute('border');
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
});

describe('pds-copytext accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext value="Copy me"></pds-copytext>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  // valueSpanEl sits inside `<pds-button>`, which is already focusable. Giving
  // the clipped span its own tabindex too would nest a second tab stop inside
  // the button — invalid HTML and an axe nested-interactive violation.
  it('never gives the truncated value its own tab stop, even while clipped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="max-width: 100px;">
        <pds-copytext value="This is a very long value that will definitely overflow the container" truncate="true"></pds-copytext>
      </div>
    `);

    const valueTabindex = await page.$eval('pds-copytext', (el) =>
      el.shadowRoot.querySelector('span').getAttribute('tabindex'),
    );

    expect(valueTabindex).toBeNull();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  // Without a tab stop of its own, the clipped value still needs to be
  // reachable by keyboard: hostEl's focusin listener catches focus bubbling
  // up from the wrapping pds-button's own native button.
  it('shows the tooltip when the wrapping button itself is focused', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="max-width: 100px;">
        <pds-copytext value="This is a very long value that will definitely overflow the container" truncate="true"></pds-copytext>
      </div>
    `);

    const button = await page.find('pds-copytext >>> pds-button >>> button');
    await button.focus();
    await page.waitForChanges();

    const tooltipText = await page.evaluate(() => {
      const portal = document.querySelector('.pds-truncation-tooltip');
      return portal ? portal.textContent.trim() : null;
    });

    expect(tooltipText).toContain('This is a very long value that will definitely overflow the container');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-copytext wrote, including the ones its CSS selects on.
describe('pds-copytext after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext class="consumer" value="copy me" border full-width></pds-copytext>');

    await expectStylingSurvivesStrip(page, 'pds-copytext');
  });
});
