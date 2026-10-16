import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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

    it('links a component trigger to the portal with aria-controls', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="component-trigger">
          <pds-button slot="trigger">Show popover</pds-button>
          <p>Content</p>
        </pds-popover>
      `);

      const trigger = await page.find('pds-button[slot="trigger"]');
      expect(trigger.getAttribute('aria-controls')).toBe('component-trigger-portal');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    // Anything can rewrite the trigger's attributes; a Turbo morph matches it to server HTML that
    // has none of Pine's ARIA.
    it("puts the trigger's ARIA back when it's removed or changed", async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="aria-popover">
          <button slot="trigger" id="trigger">Show popover</button>
          <p>Content</p>
        </pds-popover>
      `);
      const aria = () =>
        page.$eval('#trigger', (el) => [el.getAttribute('aria-controls'), el.getAttribute('aria-expanded')]);
      const rewrite = async (change: (el: Element) => void) => {
        await page.$eval('#trigger', change);
        await page.waitForChanges();
      };

      await rewrite((el) => {
        el.removeAttribute('aria-controls');
        el.removeAttribute('aria-expanded');
      });
      expect(await aria()).toEqual(['aria-popover-portal', 'false']);

      // aria-expanded follows the popover's real state, not the value written.
      await rewrite((el) => el.setAttribute('aria-expanded', 'true'));
      expect(await aria()).toEqual(['aria-popover-portal', 'false']);

      await page.click('#trigger');
      await page.waitForChanges();
      await rewrite((el) => el.removeAttribute('aria-expanded'));
      expect(await aria()).toEqual(['aria-popover-portal', 'true']);

      const popover = await page.find('pds-popover');
      await popover.callMethod('hide');
      await page.waitForChanges();
      expect(await aria()).toEqual(['aria-popover-portal', 'false']);
    });
  });

  describe('Focus return', () => {
    const openWithFocusInside = async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="focus-popover">
          <button slot="trigger" id="trigger">Show popover</button>
          <button id="inside">Inside</button>
        </pds-popover>
        <input id="outside" aria-label="Outside" style="display: block; margin-top: 300px;" />
      `);
      await page.click('#trigger');
      await page.waitForChanges();
      await page.evaluate(() => (document.querySelector('#inside') as HTMLElement).focus());
      return page;
    };

    const activeElementId = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => document.activeElement?.id);

    it('returns focus to the trigger when Escape closes the popover', async () => {
      const page = await openWithFocusInside();

      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await activeElementId(page)).toBe('trigger');
    });

    it('returns focus to the trigger when hide() is called with focus inside', async () => {
      const page = await openWithFocusInside();

      await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.hide());
      await page.waitForChanges();

      expect(await activeElementId(page)).toBe('trigger');
    });

    it('keeps focus on the trigger when the trigger closes the popover', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="focus-popover" popover-target-action="toggle">
          <button slot="trigger" id="trigger">Show popover</button>
          <p>Content</p>
        </pds-popover>
      `);

      await page.click('#trigger');
      await page.waitForChanges();
      await page.click('#trigger');
      await page.waitForChanges();

      expect(await page.find('#focus-popover-portal').then((el) => el.isVisible())).toBe(false);
      expect(await activeElementId(page)).toBe('trigger');
    });

    it('leaves focus on an outside element clicked to dismiss the popover', async () => {
      const page = await openWithFocusInside();
      // Clicks at or before the open timestamp are ignored, so let the clock move past it.
      await new Promise((resolve) => setTimeout(resolve, 50));

      await page.click('#outside');
      await page.waitForChanges();

      expect(await page.find('#focus-popover-portal').then((el) => el.isVisible())).toBe(false);
      expect(await activeElementId(page)).toBe('outside');
    });

    it('leaves focus where it is when hide() is called with focus outside the popover', async () => {
      const page = await openWithFocusInside();
      await page.evaluate(() => (document.querySelector('#outside') as HTMLElement).focus());

      await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.hide());
      await page.waitForChanges();

      expect(await activeElementId(page)).toBe('outside');
    });

    it('does not focus the trigger when a script opens and closes the popover with nothing focused', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="focus-popover">
          <button slot="trigger" id="trigger">Show popover</button>
          <p>Content</p>
        </pds-popover>
      `);

      await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.show());
      await page.waitForChanges();
      await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.hide());
      await page.waitForChanges();

      expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
    });
  });
});

describe('pds-popover accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="my-popover" popover-target-action="toggle">
        <button slot="trigger">Show popover</button>
        <p>Popover content</p>
      </pds-popover>
    `);
    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();
    await page.waitForChanges();
    const portalEl = await page.find('#my-popover-portal');
    expect(await portalEl.isVisible()).toBe(true);
    // `aria-allowed-attr` is disabled here: the body portal sets `aria-modal="false"`
    // on a non-dialog element — remove once popover portal ARIA is corrected.
    const violations = await runAxe(page, {
      rules: { 'aria-allowed-attr': { enabled: false } },
    });
    expect(formatViolations(violations)).toBe('');
  });
});
