import { newE2EPage } from '@stencil/core/testing';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should toggle popover visibility when clicking trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover" popover-target-action="toggle">
        <button slot="trigger">Show popover</button>
        <p>Popover content</p>
      </pds-popover>
    `);

    const triggerButton = await page.find('button[slot="trigger"]');

    // Click to open
    await triggerButton.click();
    await page.waitForChanges();

    // Portal should exist in document.body
    const portalEl = await page.find('#my-popover-portal');
    expect(portalEl).toBeTruthy();
    expect(await portalEl.isVisible()).toBe(true);

    // Click to close
    await triggerButton.click();
    await page.waitForChanges();
    expect(await portalEl.isVisible()).toBe(false);
  });

  it('should respect manual mode (no auto-dismiss)', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover" popover-type="manual" popover-target-action="toggle">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const triggerButton = await page.find('button[slot="trigger"]');

    await triggerButton.click();
    await page.waitForChanges();

    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);

    // Click outside should not close in manual mode
    await page.mouse.click(0, 0);
    await page.waitForChanges();

    // Should still be visible
    expect(await portalEl.isVisible()).toBe(true);
  });

  it('should handle default show action', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const triggerButton = await page.find('button[slot="trigger"]');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');

    // First click opens
    await triggerButton.click();
    await page.waitForChanges();

    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Second click does nothing with default "show" action
    await triggerButton.click();
    await page.waitForChanges();
    expect(await portalEl.isVisible()).toBe(true);
    expect(openSpy).toHaveReceivedEventTimes(1); // Should not emit again
  });

  it('should emit events when opening and closing', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover" popover-target-action="toggle">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Open the popover
    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();
    await page.waitForChanges();

    expect(openSpy).toHaveReceivedEvent();
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Close the popover
    await triggerButton.click();
    await page.waitForChanges();

    expect(closeSpy).toHaveReceivedEvent();
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });

  it('should include event details', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="test-popover" popover-type="auto" popover-target-action="toggle">
        <button slot="trigger">Test Popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const openSpy = await page.spyOnEvent('pdsPopoverOpen');

    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();
    await page.waitForChanges();

    expect(openSpy).toHaveReceivedEvent();
    const openEvent = openSpy.firstEvent;
    expect(openEvent.detail.componentId).toBe('test-popover');
    expect(openEvent.detail.popoverType).toBe('auto');
  });

  it('should support programmatic show method', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const popover = await page.find('pds-popover');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');

    // Show programmatically
    await popover.callMethod('show');
    await page.waitForChanges();

    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);
    expect(openSpy).toHaveReceivedEvent();
  });

  it('should support programmatic hide method', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const popover = await page.find('pds-popover');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Open first
    await popover.callMethod('show');
    await page.waitForChanges();

    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);

    // Hide programmatically
    await popover.callMethod('hide');
    await page.waitForChanges();

    expect(await portalEl.isVisible()).toBe(false);
    expect(closeSpy).toHaveReceivedEvent();
  });

  it('should support programmatic toggle method', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover">
        <button slot="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);

    const popover = await page.find('pds-popover');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Toggle to open
    await popover.callMethod('toggle');
    await page.waitForChanges();

    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Toggle to close
    await popover.callMethod('toggle');
    await page.waitForChanges();
    expect(await portalEl.isVisible()).toBe(false);
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });

  describe('Trigger Slot', () => {
    it('should render with slotted trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="popover-1" popover-target-action="toggle">
          <button slot="trigger" id="custom-trigger">Custom Trigger</button>
          <p>Popover content</p>
        </pds-popover>
      `);

      const customTrigger = await page.find('button#custom-trigger');
      expect(customTrigger).toBeTruthy();
      expect(customTrigger.textContent).toBe('Custom Trigger');
    });

    it('should handle click events on slotted trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="test-popover" popover-target-action="toggle">
          <button slot="trigger" id="custom-trigger">Custom Trigger</button>
          <p>Popover content</p>
        </pds-popover>
      `);

      const customTrigger = await page.find('button#custom-trigger');
      await customTrigger.click();
      await page.waitForChanges();

      const portalEl = await page.find('#test-popover-portal');
      expect(await portalEl.isVisible()).toBe(true);
    });

    it('should toggle popover with slotted trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="my-popover" popover-target-action="toggle">
          <button slot="trigger" id="custom-trigger">Custom Trigger</button>
          <p>Popover content</p>
        </pds-popover>
      `);

      const customTrigger = await page.find('button#custom-trigger');

      // Open
      await customTrigger.click();
      await page.waitForChanges();

      const portalEl = await page.find('#my-popover-portal');
      expect(await portalEl.isVisible()).toBe(true);

      // Close
      await customTrigger.click();
      await page.waitForChanges();
      expect(await portalEl.isVisible()).toBe(false);
    });

    it('should emit events when using slotted trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="event-test" popover-target-action="toggle">
          <button slot="trigger" id="custom-trigger">Custom Trigger</button>
          <p>Popover content</p>
        </pds-popover>
      `);

      const openSpy = await page.spyOnEvent('pdsPopoverOpen');
      const closeSpy = await page.spyOnEvent('pdsPopoverClose');
      const customTrigger = await page.find('button#custom-trigger');

      // Open
      await customTrigger.click();
      await page.waitForChanges();
      expect(openSpy).toHaveReceivedEvent();

      // Close
      await customTrigger.click();
      await page.waitForChanges();
      expect(closeSpy).toHaveReceivedEvent();
    });

    it('should work with link trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="link-popover" popover-target-action="toggle">
          <a href="#" slot="trigger" id="link-trigger">Info</a>
          <p>Additional information</p>
        </pds-popover>
      `);

      const linkTrigger = await page.find('a#link-trigger');
      expect(linkTrigger).toBeTruthy();

      // Clicking the link should open the popover
      await linkTrigger.click();
      await page.waitForChanges();

      const portalEl = await page.find('#link-popover-portal');
      expect(await portalEl.isVisible()).toBe(true);
    });
  });
});
