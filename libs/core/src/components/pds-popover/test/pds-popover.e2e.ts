import { newE2EPage } from '@stencil/core/testing';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should handle trigger click interactions with toggle action', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" popover-target-action="toggle" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');
  });

  it('should update position on scroll when active', async () => {
    const page = await newE2EPage();
    await page.setContent('<div style="height: 200vh"><pds-popover component-id="my-popover" text="Show popover"></pds-popover></div>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();

    const initialTop = await popoverContent.getComputedStyle('top');

    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForChanges();

    const newTop = await popoverContent.getComputedStyle('top');
    expect(newTop).not.toBe(initialTop);
  });

  it('should respect manual mode', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" popover-type="manual" popover-target-action="toggle" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');

    // Click outside should not close in manual mode
    await page.mouse.click(0, 0);
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
  });

  it('should handle default show action (does not close on second click)', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');

    // First click opens
    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Second click does nothing with default "show" action
    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
    expect(openSpy).toHaveReceivedEventTimes(1); // Should not emit again
  });

  it('should emit events when opening and closing with toggle action', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" popover-target-action="toggle" text="Show popover"></pds-popover>');

    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Open the popover by clicking trigger
    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    await triggerButton.click();
    await page.waitForChanges();

    expect(openSpy).toHaveReceivedEvent();
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Close the popover by clicking trigger again
    await triggerButton.click();
    await page.waitForChanges();

    expect(closeSpy).toHaveReceivedEvent();
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });

  it('should include event details in emitted events', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="test-popover" popover-type="auto" popover-target-action="toggle" text="Test Popover"></pds-popover>');

    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Open the popover
    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    await triggerButton.click();
    await page.waitForChanges();

    expect(openSpy).toHaveReceivedEvent();
    const openEvent = openSpy.firstEvent;
    expect(openEvent.detail.componentId).toBe('test-popover');
    expect(openEvent.detail.popoverType).toBe('auto');
    expect(openEvent.detail.text).toBe('Test Popover');

    // Close the popover
    await triggerButton.click();
    await page.waitForChanges();

    expect(closeSpy).toHaveReceivedEvent();
    const closeEvent = closeSpy.firstEvent;
    expect(closeEvent.detail.componentId).toBe('test-popover');
    expect(closeEvent.detail.popoverType).toBe('auto');
    expect(closeEvent.detail.text).toBe('Test Popover');
  });

  it('should support programmatic show method', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const popover = await page.find('pds-popover');
    const popoverContent = await page.find('pds-popover >>> div[popover]');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');

    // Initially closed
    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');

    // Show programmatically
    await popover.callMethod('show');
    await page.waitForChanges();

    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
    expect(openSpy).toHaveReceivedEvent();
    expect(openSpy).toHaveReceivedEventTimes(1);
  });

  it('should support programmatic hide method', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const popover = await page.find('pds-popover');
    const popoverContent = await page.find('pds-popover >>> div[popover]');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Open first
    await popover.callMethod('show');
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');

    // Hide programmatically
    await popover.callMethod('hide');
    await page.waitForChanges();

    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');
    expect(closeSpy).toHaveReceivedEvent();
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });

  it('should support programmatic toggle method', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const popover = await page.find('pds-popover');
    const popoverContent = await page.find('pds-popover >>> div[popover]');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const closeSpy = await page.spyOnEvent('pdsPopoverClose');

    // Initially closed
    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');

    // Toggle to open
    await popover.callMethod('toggle');
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
    expect(openSpy).toHaveReceivedEventTimes(1);

    // Toggle to close
    await popover.callMethod('toggle');
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});
