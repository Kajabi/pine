import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('restores the default placement when the placement attribute is removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover placement="top"></pds-popover>');
    const element = await page.find('pds-popover');

    element.removeAttribute('placement');
    await page.waitForChanges();

    expect(element).toEqualAttribute('placement', 'right');
  });

  it('takes a new placement after the default placement attribute is removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');
    const element = await page.find('pds-popover');

    // The attribute holds Pine's reflected default, the case a Turbo morph hits.
    element.removeAttribute('placement');
    await page.waitForChanges();

    expect(element).toEqualAttribute('placement', 'right');

    element.setProperty('placement', 'top');
    await page.waitForChanges();

    expect(await element.getProperty('placement')).toBe('top');
    expect(element).toEqualAttribute('placement', 'top');
  });

  it('resets a placement set to null, and takes the next value', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover placement="top"></pds-popover>');
    const element = await page.find('pds-popover');

    element.setProperty('placement', null);
    await page.waitForChanges();

    expect(await element.getProperty('placement')).toBe('right');
    expect(element).toEqualAttribute('placement', 'right');

    element.setProperty('placement', 'bottom');
    await page.waitForChanges();

    expect(await element.getProperty('placement')).toBe('bottom');
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

    it('watches a swapped-in trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="swap-popover">
          <button slot="trigger" id="old-trigger">Old</button>
          <p>Content</p>
        </pds-popover>
      `);

      await page.$eval('pds-popover', (popover) => {
        const trigger = document.createElement('button');
        trigger.slot = 'trigger';
        trigger.id = 'new-trigger';
        trigger.textContent = 'New';
        popover.querySelector('#old-trigger').replaceWith(trigger);
      });
      await page.waitForChanges();
      await page.$eval('#new-trigger', (el) => {
        el.removeAttribute('aria-controls');
        el.removeAttribute('aria-expanded');
      });
      await page.waitForChanges();

      const trigger = await page.find('#new-trigger');
      expect(trigger).toEqualAttribute('aria-controls', 'swap-popover-portal');
      expect(trigger).toEqualAttribute('aria-expanded', 'false');
    });

    // The restored host attributes only reach a screen reader once pds-button forwards them.
    it("puts a pds-button trigger's ARIA back on its inner button", async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-popover component-id="button-popover">
          <pds-button slot="trigger">Show popover</pds-button>
          <p>Content</p>
        </pds-popover>
      `);

      await page.$eval('pds-button', (el) => {
        el.removeAttribute('aria-controls');
        el.removeAttribute('aria-expanded');
      });
      await page.waitForChanges();

      expect(await page.find('pds-button')).toEqualAttribute('aria-controls', 'button-popover-portal');
      expect(await page.find('pds-button >>> button')).toEqualAttribute('aria-expanded', 'false');
      const controlsPortal = await page.$eval('pds-button', (el) => {
        const inner = el.shadowRoot.querySelector('button') as HTMLButtonElement & { ariaControlsElements?: Element[] };
        return (inner.ariaControlsElements || []).map((target) => target.id);
      });
      expect(controlsPortal).toEqual(['button-popover-portal']);
    });
  });

  // Moving a popover disconnects and reconnects it (a DOM morph, or a framework reparenting it);
  // it has to work the same afterwards.
  describe('After a move', () => {
    const setUp = async ({
      trigger = '<button slot="trigger" id="trigger">Show popover</button>',
      attrs = 'component-id="moved-popover"',
    } = {}) => {
      const page = await newE2EPage();
      await page.setContent(`
        <div id="first-parent">
          <pds-popover ${attrs}>
            ${trigger}
            <p id="content">Popover content</p>
          </pds-popover>
        </div>
        <div id="second-parent"></div>
      `);
      return page;
    };
    const move = async (page: E2EPage) => {
      await page.$eval('pds-popover', (popover) => document.querySelector('#second-parent').appendChild(popover));
      await page.waitForChanges();
    };
    const portalContent = (page: E2EPage, id = 'moved-popover-portal') =>
      page.evaluate((portalId) => {
        const portal = document.getElementById(portalId);
        return portal ? { shown: getComputedStyle(portal).display !== 'none', text: portal.textContent?.trim() } : null;
      }, id);

    it('opens from its trigger', async () => {
      const page = await setUp();
      await move(page);

      await page.click('#trigger');
      await page.waitForChanges();

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Popover content' });
      expect(await page.find('#trigger')).toEqualAttribute('aria-expanded', 'true');
    });

    // A doubled click listener would open and close it again on one click.
    it('toggles once per click', async () => {
      const page = await setUp({ attrs: 'component-id="moved-popover" popover-target-action="toggle"' });
      await move(page);

      await page.click('#trigger');
      await page.waitForChanges();

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Popover content' });
    });

    it("puts the trigger's ARIA back, pointing at the portal", async () => {
      const page = await setUp();
      await move(page);

      await page.$eval('#trigger', (el) => {
        el.removeAttribute('aria-controls');
        el.removeAttribute('aria-expanded');
      });
      await page.waitForChanges();

      const trigger = await page.find('#trigger');
      expect(trigger).toEqualAttribute('aria-controls', 'moved-popover-portal');
      expect(trigger).toEqualAttribute('aria-expanded', 'false');
    });

    it('opens from a pds-button trigger', async () => {
      const page = await setUp({ trigger: '<pds-button slot="trigger" id="trigger">Show popover</pds-button>' });
      await move(page);

      await page.click('#trigger');
      await page.waitForChanges();

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Popover content' });
    });

    it('stays open, with focus where it was, when moved while open', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div id="first-parent">
          <pds-popover component-id="moved-popover">
            <button slot="trigger" id="trigger">Show popover</button>
            <button id="inside">Inside</button>
          </pds-popover>
        </div>
        <div id="second-parent"></div>
      `);
      await page.click('#trigger');
      await page.waitForChanges();
      await page.focus('#inside');

      await move(page);

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Inside' });
      expect(await page.find('#trigger')).toEqualAttribute('aria-expanded', 'true');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('inside');
    });

    // Removed and put back later, it's a real removal: it closes, keeps its content, and says so.
    it('closes, keeps its content, and fires pdsPopoverClose when removed while open', async () => {
      const page = await setUp();
      await page.click('#trigger');
      await page.waitForChanges();
      const close = await (await page.find('pds-popover')).spyOnEvent('pdsPopoverClose');

      await page.$eval('pds-popover', (popover) => {
        (window as unknown as { detached: Element }).detached = popover;
        popover.remove();
      });
      await page.waitForChanges();

      expect(close).toHaveReceivedEventTimes(1);
      expect(await portalContent(page)).toBeNull();
      expect(
        await page.evaluate(() => {
          const popover = (window as unknown as { detached: Element }).detached;
          return [popover.querySelector('#content') !== null, popover.querySelector('#trigger').getAttribute('aria-expanded')];
        }),
      ).toEqual([true, 'false']);

      await page.evaluate(() =>
        document.querySelector('#second-parent').appendChild((window as unknown as { detached: Element }).detached),
      );
      await page.waitForChanges();
      await page.click('#trigger');
      await page.waitForChanges();

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Popover content' });
    });

    it('keeps its generated portal id when removed and put back', async () => {
      const page = await setUp({ attrs: '' });
      const portalId = await page.$eval('#trigger', (el) => el.getAttribute('aria-controls'));

      // Two operations: the popover is out of the page in between, so it tears down and rebuilds.
      await page.$eval('pds-popover', (popover) => {
        (window as unknown as { detached: Element }).detached = popover;
        popover.remove();
      });
      await page.waitForChanges();
      await page.evaluate(() =>
        document.querySelector('#second-parent').appendChild((window as unknown as { detached: Element }).detached),
      );
      await page.waitForChanges();

      expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-controls'))).toBe(portalId);

      await page.click('#trigger');
      await page.waitForChanges();

      expect(await portalContent(page, portalId)).toEqual({ shown: true, text: 'Popover content' });
      expect(await page.evaluate(() => document.querySelectorAll('.pds-popover').length)).toBe(1);
    });

    // The trigger slot's slotchange still fires while the popover is detached, so the new trigger
    // is wired before the popover reconnects.
    it('takes a trigger swapped in while it was out of the page', async () => {
      const page = await setUp();

      await page.$eval('pds-popover', (popover) => {
        (window as unknown as { detached: Element }).detached = popover;
        popover.remove();
        const newTrigger = document.createElement('button');
        newTrigger.slot = 'trigger';
        newTrigger.id = 'new-trigger';
        newTrigger.textContent = 'New trigger';
        popover.querySelector('#trigger').replaceWith(newTrigger);
      });
      await page.waitForChanges();
      await page.evaluate(() =>
        document.querySelector('#second-parent').appendChild((window as unknown as { detached: Element }).detached),
      );
      await page.waitForChanges();

      const newTrigger = await page.find('#new-trigger');
      expect(newTrigger).toEqualAttribute('aria-controls', 'moved-popover-portal');

      await page.click('#new-trigger');
      await page.waitForChanges();

      expect(await portalContent(page)).toEqual({ shown: true, text: 'Popover content' });
      expect(await page.find('#new-trigger')).toEqualAttribute('aria-expanded', 'true');
    });

    it('leaves one portal and one focus style, with a stable id, after repeated moves', async () => {
      const page = await setUp({ attrs: '' });
      const portalId = await page.$eval('#trigger', (el) => el.getAttribute('aria-controls'));

      await move(page);
      await page.click('#trigger');
      await page.waitForChanges();
      await page.$eval('pds-popover', (popover) => document.querySelector('#first-parent').appendChild(popover));
      await page.waitForChanges();
      await move(page);

      expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-controls'))).toBe(portalId);
      expect(await page.evaluate(() => document.querySelectorAll('.pds-popover').length)).toBe(1);
      expect(await page.evaluate(() => document.querySelectorAll('style[data-pds-popover-focus]').length)).toBe(1);
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

// A script that keeps removing what the popover puts back would keep both running forever in
// microtasks; the popover gives up after a few rounds instead of hanging the page.
describe('pds-popover with a script fighting its trigger ARIA', () => {
  it('gives up, and keeps the page responsive', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="fought">
        <button slot="trigger" id="trigger">Show popover</button>
        <p>Content</p>
      </pds-popover>
    `);
    await page.evaluate(() => {
      const w = window as unknown as { pineWarnings: string[] };
      w.pineWarnings = [];
      const warn = console.warn;
      console.warn = (...args: unknown[]) => {
        w.pineWarnings.push(String(args[0] === '%s' ? args[1] : args[0]));
        warn(...args);
      };
    });

    await page.$eval('#trigger', (el) => {
      new MutationObserver(() => {
        if (el.hasAttribute('aria-controls')) el.removeAttribute('aria-controls');
      }).observe(el, { attributes: true, attributeFilter: ['aria-controls'] });
      el.removeAttribute('aria-controls');
    });
    await page.waitForChanges();

    expect(await page.evaluate(() => 'responsive')).toBe('responsive');
    expect((await page.evaluate(() => (window as unknown as { pineWarnings: string[] }).pineWarnings)).filter((text) => text.startsWith('pds-popover: stopped restoring'))).toHaveLength(1);
    // The other script wins.
    expect(await page.$eval('#trigger', (el) => el.hasAttribute('aria-controls'))).toBe(false);
  });
});
