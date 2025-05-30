import { newE2EPage } from '@stencil/core/testing';

describe('pds-toast', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-toast></pds-toast>');

    const element = await page.find('pds-toast');
    expect(element).toHaveClass('hydrated');
  });

  it('should render with message content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast">
        <span>This is a test message</span>
      </pds-toast>
    `);

    const element = await page.find('pds-toast');
    expect(element).toHaveClass('hydrated');

    // Use page.evaluate to access shadow DOM directly
    const hasMessageContent = await page.evaluate(() => {
      const toast = document.querySelector('pds-toast');
      const shadowRoot = toast?.shadowRoot;
      const messageElement = shadowRoot?.querySelector('.pds-toast__message');
      return !!messageElement;
    });

    expect(hasMessageContent).toBe(true);

    const textContent = await page.evaluate(() => {
      const toast = document.querySelector('pds-toast');
      return toast?.textContent?.trim();
    });
    expect(textContent).toContain('This is a test message');
  });

  it('should render dismiss button by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast">
        Test message
      </pds-toast>
    `);

    const dismissButton = await page.find('pds-toast >>> .pds-toast__button');
    expect(dismissButton).toBeTruthy();

    const ariaLabel = await dismissButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Dismiss message');
  });

  it('should not render dismiss button when dismissible is false', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" dismissible="false">
        Test message
      </pds-toast>
    `);

    const dismissButton = await page.find('pds-toast >>> .pds-toast__button');
    expect(dismissButton).toBeNull();
  });

  it('should dismiss when dismiss button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Test message
      </pds-toast>
    `);

    // Wait for component to be ready
    await page.waitForChanges();

    const element = await page.find('pds-toast');
    const dismissButton = await page.find('pds-toast >>> .pds-toast__button');

    // Verify toast is initially visible
    expect(await element.isVisible()).toBe(true);

    // Click dismiss button
    await dismissButton.click();
    await page.waitForChanges();

    // Wait for animation to complete (component uses 300ms + some processing time)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify toast is hidden - check visibility
    expect(await element.isVisible()).toBe(false);
  });

  it('should emit dismiss event when dismissed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Test message
      </pds-toast>
    `);

    const element = await page.find('pds-toast');
    const dismissButton = await page.find('pds-toast >>> .pds-toast__button');

    // Listen for the dismiss event
    const dismissEvent = await element.spyOnEvent('pdsToastDismissed');

    // Click dismiss button
    await dismissButton.click();
    await page.waitForChanges();

    // Wait for dismiss to complete
    await new Promise(resolve => setTimeout(resolve, 400));

    // Verify event was emitted
    expect(dismissEvent).toHaveReceivedEventTimes(1);
    expect(dismissEvent).toHaveReceivedEventDetail({ componentId: 'test-toast' });
  });

  it('should auto-dismiss after specified duration', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="500">
        Test message
      </pds-toast>
    `);

    const element = await page.find('pds-toast');

    // Listen for the dismiss event
    const dismissEvent = await element.spyOnEvent('pdsToastDismissed');

    // Verify toast is initially visible
    expect(await element.isVisible()).toBe(true);

    // Wait for auto-dismiss (shorter duration for faster test)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify toast was dismissed by checking the event first
    expect(dismissEvent).toHaveReceivedEventTimes(1);
  });

  it('should not auto-dismiss when duration is 0', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Test message
      </pds-toast>
    `);

    const element = await page.find('pds-toast');

    // Listen for the dismiss event
    const dismissEvent = await element.spyOnEvent('pdsToastDismissed');

    // Verify toast is initially visible
    expect(await element.isVisible()).toBe(true);

    // Wait longer than a typical auto-dismiss duration
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify toast was NOT auto-dismissed
    expect(dismissEvent).toHaveReceivedEventTimes(0);
    expect(await element.isVisible()).toBe(true);
  });

  it('should render with icon when provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" icon="info">
        Test message with icon
      </pds-toast>
    `);

    const iconElement = await page.find('pds-toast >>> .pds-toast__icon');
    expect(iconElement).toBeTruthy();

    const iconName = await iconElement.getAttribute('name');
    expect(iconName).toBe('info');
  });

  it('should render loading type with spinner', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" type="loading">
        Loading message
      </pds-toast>
    `);

    const toastElement = await page.find('pds-toast >>> .pds-toast');
    const loaderElement = await page.find('pds-toast >>> .pds-toast__loader');
    const spinnerElement = await page.find('pds-toast >>> .pds-toast__loader-spinner');

    expect(toastElement).toHaveClass('pds-toast--loading');
    expect(loaderElement).toBeTruthy();
    expect(spinnerElement).toBeTruthy();
  });

  it('should render danger type with correct styling', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" type="danger">
        Error message
      </pds-toast>
    `);

    const toastElement = await page.find('pds-toast >>> .pds-toast');
    expect(toastElement).toHaveClass('pds-toast--danger');
  });

  it('should have proper ARIA attributes for accessibility', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast">
        Accessible message
      </pds-toast>
    `);

    const toastElement = await page.find('pds-toast >>> .pds-toast');

    const role = await toastElement.getAttribute('role');
    const ariaLive = await toastElement.getAttribute('aria-live');

    expect(role).toBe('alert');
    expect(ariaLive).toBe('polite');
  });

  it('should handle links within message content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Message with <a href="#test">link</a>
      </pds-toast>
    `);

    const linkElement = await page.find('pds-toast a');
    expect(linkElement).toBeTruthy();

    const href = await linkElement.getAttribute('href');
    expect(href).toBe('#test');

    // Test that link is clickable
    await linkElement.click();
    // In a real scenario, you'd test navigation or event handling
  });

  it('should update when duration property changes', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Test message
      </pds-toast>
    `);

    const element = await page.find('pds-toast');

    // Change duration property
    element.setProperty('duration', 500);
    await page.waitForChanges();

    const duration = await element.getProperty('duration');
    expect(duration).toBe(500);
  });

  it('should maintain visibility state correctly', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-toast component-id="test-toast" duration="0">
        Test message
      </pds-toast>
    `);

    const element = await page.find('pds-toast');

    // Check initial visibility through DOM
    expect(await element.isVisible()).toBe(true);

    // Check that component has no hidden attribute initially
    const hiddenAttribute = await element.getAttribute('hidden');
    expect(hiddenAttribute).toBeNull();

    // Trigger dismiss
    const dismissButton = await page.find('pds-toast >>> .pds-toast__button');
    await dismissButton.click();
    await page.waitForChanges();

    // Wait for animation and state update (component uses 300ms + processing time)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check final state - should not be visible
    expect(await element.isVisible()).toBe(false);
  });
});
