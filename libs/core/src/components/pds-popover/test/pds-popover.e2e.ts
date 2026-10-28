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

  describe('Focus style escaping', () => {
    it('escapes a componentId with CSS-special characters so the focus style still applies and nothing extra leaks onto the page', async () => {
      const page = await newE2EPage();
      const trickyId = 'weird.id:part"quoted}end';
      await page.setContent(`
        <pds-popover component-id='${trickyId}'>
          <button slot="trigger" id="trigger">Show popover</button>
          <p>Popover content</p>
        </pds-popover>
      `);

      await page.click('#trigger');
      await page.waitForChanges();

      const portalId = `${trickyId}-portal`;

      expect(await page.evaluate(() => document.querySelectorAll('style[data-pds-popover-focus]').length)).toBe(1);
      expect(await page.evaluate((id) => document.getElementById(id) !== null, portalId)).toBe(true);

      // Unescaped, the id's `}` would close the rule early and scatter the rest of the id as new,
      // unrelated global rules. Exactly three well-formed rules means nothing leaked onto the page.
      expect(
        await page.evaluate(
          () => (document.querySelector('style[data-pds-popover-focus]') as HTMLStyleElement).sheet?.cssRules.length,
        ),
      ).toBe(3);

      // The rule matches the real portal element and applies its outline on focus.
      expect(
        await page.evaluate((id) => {
          const portal = document.getElementById(id) as HTMLElement;
          portal.tabIndex = -1;
          portal.focus();
          return getComputedStyle(portal).outlineStyle;
        }, portalId),
      ).not.toBe('none');

      // Cleanup on hide, then disconnect, removes the style without throwing.
      await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.hide());
      await page.waitForChanges();
      await page.$eval('pds-popover', (popover) => popover.remove());
      await page.waitForChanges();

      expect(await page.evaluate(() => document.querySelectorAll('style[data-pds-popover-focus]').length)).toBe(0);
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

describe('pds-popover padding', () => {
  const openPopover = async (attributes = '', css = '') => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>${css}</style>
      <pds-popover component-id="padding-popover" ${attributes}>
        <button slot="trigger">Show popover</button>
        <p>Popover content</p>
      </pds-popover>
    `);
    await page.click('button[slot="trigger"]');
    await page.waitForChanges();
    return page;
  };

  const computedPadding = (page: E2EPage) =>
    page.$eval('#padding-popover-portal', (portal: HTMLElement) => {
      const style = getComputedStyle(portal);
      return [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft];
    });

  it('has 24px padding on all sides when padding is not set', async () => {
    const page = await openPopover();

    expect(await computedPadding(page)).toEqual(['24px', '24px', '24px', '24px']);
  });

  it('sets the default padding inline, with no !important', async () => {
    const page = await openPopover();

    const portal = await page.$eval('#padding-popover-portal', (portal: HTMLElement) => ({
      padding: portal.style.padding,
      priority: portal.style.getPropertyPriority('padding'),
    }));

    expect(portal).toEqual({ padding: 'var(--pine-dimension-md)', priority: '' });
  });

  it('adds no attribute to the panel for any padding value', async () => {
    const attributesWith = async (attributes: string) =>
      (await openPopover(attributes)).$eval('#padding-popover-portal', (portal: HTMLElement) => portal.getAttributeNames().sort());
    const unset = await attributesWith('');

    expect(unset.filter(name => name.includes('padding'))).toEqual([]);
    for (const padding of ['none', 'xs', 'sm', 'md']) {
      expect(await attributesWith(`padding="${padding}"`)).toEqual(unset);
    }
  });

  it.each([
    ['none', '0px'],
    ['xs', '8px'],
    ['sm', '16px'],
    ['md', '24px'],
  ])('has %s padding of %s on all sides', async (padding, expected) => {
    const page = await openPopover(`padding="${padding}"`);

    expect(await computedPadding(page)).toEqual([expected, expected, expected, expected]);
  });

  it('updates the padding of an open popover', async () => {
    const page = await openPopover();

    await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => {
      el.padding = 'xs';
    });
    await page.waitForChanges();

    expect(await computedPadding(page)).toEqual(['8px', '8px', '8px', '8px']);
  });

  it('lets a stylesheet !important rule win, since the inline padding is not !important', async () => {
    const page = await openPopover('padding="sm"', '.pds-popover { padding: 0 !important; }');

    expect(await computedPadding(page)).toEqual(['0px', '0px', '0px', '0px']);
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
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// The panel sits at the end of the body, but Tab reaches it as if it came right after the trigger.
describe('pds-popover Tab order', () => {
  type Page = Awaited<ReturnType<typeof newE2EPage>>;

  const BUTTONS = '<button id="first">First</button><button id="last">Last</button>';

  const setUp = async ({ content = BUTTONS, after = '<button id="after">After</button>', trigger = '' } = {}) => {
    const page = await newE2EPage();
    await page.setContent(`
      <button id="before">Before</button>
      <pds-popover component-id="pop">
        ${trigger || '<button slot="trigger" id="trigger">Open</button>'}
        <div>${content}</div>
      </pds-popover>
      ${after}
    `);
    return page;
  };

  const open = async (page: Page) => {
    await page.focus('#trigger');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
  };

  const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id || document.activeElement?.localName);

  const press = async (page: Page, keys: Array<'Tab' | 'Shift+Tab'>) => {
    const order: string[] = [];
    for (const key of keys) {
      if (key === 'Shift+Tab') await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      if (key === 'Shift+Tab') await page.keyboard.up('Shift');
      order.push(await focusedId(page));
    }
    return order;
  };

  it('goes from the trigger through the open panel to what follows the popover', async () => {
    const page = await setUp();
    await open(page);
    expect(await press(page, ['Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'after']);
  });

  it('goes back through the open panel to the trigger on Shift+Tab', async () => {
    const page = await setUp();
    await open(page);
    await page.focus('#after');
    expect(await press(page, ['Shift+Tab', 'Shift+Tab', 'Shift+Tab'])).toEqual(['last', 'first', 'trigger']);
  });

  it('skips the panel once it closes', async () => {
    const page = await setUp();
    await open(page);
    expect(await press(page, ['Tab'])).toEqual(['first']);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'none');
    expect(await focusedId(page)).toBe('trigger');
    expect(await press(page, ['Tab'])).toEqual(['after']);
  });

  it('skips an open panel with nothing to focus', async () => {
    const page = await setUp({ content: '<p>Details</p>' });
    await open(page);
    expect(await press(page, ['Tab', 'Shift+Tab'])).toEqual(['after', 'trigger']);
  });

  it('reaches content added to the panel after it opens', async () => {
    const page = await setUp({ content: '<p id="loading">Loading</p>' });
    await open(page);
    await page.evaluate(() => {
      const late = document.createElement('button');
      late.id = 'late';
      document.getElementById('loading')!.replaceWith(late);
    });
    expect(await press(page, ['Tab', 'Tab'])).toEqual(['late', 'after']);
  });

  it("doesn't come back to the panel when nothing focusable follows the popover", async () => {
    const page = await setUp({ after: '<p>Nothing to focus</p>' });
    await open(page);
    expect(await press(page, ['Tab', 'Tab'])).toEqual(['first', 'last']);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.getElementById('pop-portal')!.contains(document.activeElement))).toBe(false);
  });

  it('goes into the panel from a pds-button trigger and back to it', async () => {
    const page = await setUp({ trigger: '<pds-button slot="trigger" id="trigger">Open</pds-button>' });
    await open(page);
    expect(await press(page, ['Tab', 'Shift+Tab'])).toEqual(['first', 'trigger']);
  });

  it('goes through a panel placed at the end of a dialog', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dialog id="dialog">
        <form>
          <pds-popover component-id="pop">
            <button type="button" slot="trigger" id="trigger">Open</button>
            <div>${BUTTONS}</div>
          </pds-popover>
          <button type="button" id="after">After</button>
        </form>
      </dialog>
    `);
    await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).showModal());
    await open(page);
    expect(await page.evaluate(() => document.getElementById('pop-portal')!.parentElement?.id)).toBe('dialog');

    expect(await press(page, ['Tab', 'Tab', 'Tab', 'Shift+Tab'])).toEqual(['first', 'last', 'after', 'last']);
  });

  it('keeps Tab inside a pds-modal when the popover is its last control', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="modal">
        <div slot="header">Header</div>
        <div>
          <button type="button" id="modal-first">First in modal</button>
          <form>
            <pds-popover component-id="pop">
              <button type="button" slot="trigger" id="trigger">Open</button>
              <div>${BUTTONS}</div>
            </pds-popover>
          </form>
        </div>
      </pds-modal>
    `);
    await (await page.find('pds-modal')).callMethod('showModal');
    await page.waitForChanges();
    await open(page);
    expect(await page.evaluate(() => document.getElementById('pop-portal')!.parentElement?.localName)).toBe('dialog');

    expect(await press(page, ['Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'modal-first']);
    expect(await press(page, ['Shift+Tab', 'Shift+Tab', 'Shift+Tab'])).toEqual(['last', 'first', 'trigger']);
  });

  it("doesn't reach the panel again past the popover", async () => {
    const page = await setUp();
    await open(page);
    expect(await press(page, ['Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'after']);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.getElementById('pop-portal')!.contains(document.activeElement))).toBe(false);
  });

  it('wraps a pds-modal past the popover without going through the panel again', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="modal">
        <div slot="header">Header</div>
        <div>
          <button type="button" id="modal-first">First in modal</button>
          <form>
            <pds-popover component-id="pop">
              <button type="button" slot="trigger" id="trigger">Open</button>
              <div>${BUTTONS}</div>
            </pds-popover>
            <button type="button" id="after">After</button>
          </form>
        </div>
      </pds-modal>
    `);
    await (await page.find('pds-modal')).callMethod('showModal');
    await page.waitForChanges();
    await open(page);

    expect(await press(page, ['Tab', 'Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'after', 'modal-first']);
  });

  it('goes into the panel from the start when Tab comes from before a trigger that takes no focus', async () => {
    const page = await setUp({ trigger: '<span slot="trigger" id="trigger">Open</span>' });
    await page.$eval('pds-popover', (el: HTMLPdsPopoverElement) => el.show());
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    await page.focus('#before');
    expect(await press(page, ['Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'after']);
  });

  it('sends focus to the trigger when it reaches the guard with nothing in the panel to focus', async () => {
    const page = await setUp();
    await open(page);
    await page.evaluate(() => {
      document.getElementById('first')!.closest('div')!.replaceChildren('Nothing to focus');
      const guard = document.querySelector('pds-popover')!.shadowRoot!.querySelector<HTMLElement>('.pds-popover__tab-guard')!;
      guard.tabIndex = 0;
      guard.focus();
    });
    expect(await focusedId(page)).toBe('trigger');
  });

  it('moves focus out of the panel before making it inert', async () => {
    const page = await setUp();
    await open(page);
    await page.evaluate(() => {
      document.getElementById('last')!.addEventListener('blur', () => {
        (window as unknown as { inertOnBlur: boolean }).inertOnBlur = document.getElementById('pop-portal')!.inert;
      });
    });
    expect(await press(page, ['Tab', 'Tab', 'Tab'])).toEqual(['first', 'last', 'after']);
    expect(await page.evaluate(() => (window as unknown as { inertOnBlur: boolean }).inertOnBlur)).toBe(false);
  });

  it('has no axe violations with focus in the panel', async () => {
    const page = await setUp();
    await open(page);
    await page.keyboard.press('Tab');
    expect(formatViolations(await runAxe(page))).toBe('');
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

describe('pds-popover inside a dialog', () => {
  const setUp = async (popoverAttrs = '') => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1000, height: 800 });
    await page.setContent(`
      <dialog id="dialog">
        <pds-popover component-id="pop" ${popoverAttrs}>
          <button slot="trigger" id="pop-trigger">Open</button>
          <div><button id="pop-inside">Inside</button></div>
        </pds-popover>
        <button id="after">After</button>
      </dialog>
    `);
    await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).showModal());
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    return page;
  };

  const portalState = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
    page.evaluate(() => {
      const portal = document.getElementById('pop-portal')!;
      return {
        afterPopover: document.querySelector('pds-popover')!.nextElementSibling === portal,
        inBody: portal.parentElement === document.body,
        marked: portal.hasAttribute('data-pds-popover-open'),
        shown: portal.style.display === 'block',
      };
    });

  it('opens its panel right after the popover, marked open, and unmarks it on close', async () => {
    const page = await setUp();
    expect(await portalState(page)).toEqual({ afterPopover: true, inBody: false, marked: true, shown: true });

    await (await page.find('pds-popover')).callMethod('hide');
    await page.waitForChanges();
    expect((await portalState(page)).marked).toBe(false);
  });

  it("doesn't mark a manual popover, which leaves Escape to the dialog", async () => {
    const page = await setUp('popover-type="manual"');
    expect((await portalState(page)).marked).toBe(false);
  });

  it('opens in the body again once it is outside the dialog', async () => {
    const page = await setUp();
    await (await page.find('pds-popover')).callMethod('hide');
    await page.evaluate(() => {
      (document.getElementById('dialog') as HTMLDialogElement).close();
      document.body.appendChild(document.querySelector('pds-popover')!);
    });
    await page.waitForChanges();
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    expect((await portalState(page)).inBody).toBe(true);
  });

  it('has no axe violations open inside the dialog', async () => {
    const page = await setUp();
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  // Beside the popover, the panel would be an unslotted child of pds-input, which renders nothing.
  it("opens at the end of the dialog when the popover sits in another component's slot, and shows", async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1000, height: 800 });
    await page.setContent(`
      <dialog id="dialog">
        <pds-input component-id="field" label="Field">
          <pds-popover component-id="pop" slot="action"><button slot="trigger" id="pop-trigger">Open</button><div>Panel</div></pds-popover>
        </pds-input>
      </dialog>
    `);
    await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).showModal());
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    const state = await page.evaluate(() => {
      const portal = document.getElementById('pop-portal')!;
      return { inDialog: portal.parentElement?.id, height: portal.getBoundingClientRect().height > 0 };
    });
    expect(state).toEqual({ inDialog: 'dialog', height: true });
  });

  it("opens outside a form in the dialog, so its buttons don't submit it", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dialog id="dialog">
        <form id="form">
          <pds-popover component-id="pop"><button slot="trigger" type="button" id="pop-trigger">Open</button><div><button id="pop-inside">Inside</button></div></pds-popover>
        </form>
      </dialog>
    `);
    await page.evaluate(() => {
      (document.getElementById('dialog') as HTMLDialogElement).showModal();
      (window as unknown as { submitted: boolean }).submitted = false;
      document.getElementById('form')!.addEventListener('submit', e => {
        e.preventDefault();
        (window as unknown as { submitted: boolean }).submitted = true;
      });
    });
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    expect(await page.evaluate(() => document.getElementById('form')!.contains(document.getElementById('pop-portal')))).toBe(false);

    await (await page.find('#pop-inside')).click();
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { submitted: boolean }).submitted)).toBe(false);
  });

  it("doesn't submit a form that wraps the dialog, from a button or Enter in the panel", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form id="form">
        <dialog id="dialog">
          <pds-popover component-id="pop">
            <button slot="trigger" type="button" id="pop-trigger">Open</button>
            <div><input id="pop-field" /><button id="pop-inside">Inside</button></div>
          </pds-popover>
          <button id="real-submit">Submit</button>
        </dialog>
      </form>
    `);
    await page.evaluate(() => {
      (document.getElementById('dialog') as HTMLDialogElement).showModal();
      (window as unknown as { submits: number }).submits = 0;
      document.getElementById('form')!.addEventListener('submit', e => {
        e.preventDefault();
        (window as unknown as { submits: number }).submits++;
      });
    });
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    const submits = () => page.evaluate(() => (window as unknown as { submits: number }).submits);

    await (await page.find('#pop-inside')).click();
    await page.waitForChanges();
    expect(await submits()).toBe(0);

    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('pop-portal')?.style.display === 'block');
    await page.focus('#pop-field');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await submits()).toBe(0);

    // The form's own submit button still works.
    await page.evaluate(() => (document.getElementById('real-submit') as HTMLElement).click());
    await page.waitForChanges();
    expect(await submits()).toBe(1);
  });

  it('takes its panel along when moved while open into another dialog, and closes with that one', async () => {
    const page = await setUp();
    await page.evaluate(() => {
      const other = document.createElement('dialog');
      other.id = 'other';
      document.body.appendChild(other);
      other.show();
      other.appendChild(document.querySelector('pds-popover')!);
    });
    await page.waitForChanges();
    expect(await page.evaluate(() => document.getElementById('pop-portal')!.parentElement?.id)).toBe('other');

    await page.evaluate(() => (document.getElementById('other') as HTMLDialogElement).close());
    await page.waitForChanges();
    expect((await portalState(page)).shown).toBe(false);
  });

  it('stays open on a click inside its panel', async () => {
    const page = await setUp();
    await (await page.find('#pop-inside')).click();
    await page.waitForChanges();
    expect((await portalState(page)).shown).toBe(true);
  });

  it('goes from the trigger to the panel on Tab', async () => {
    const page = await setUp();
    await page.evaluate(() => (document.getElementById('pop-trigger') as HTMLElement).focus());
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('pop-inside');
  });

  it('closes when the dialog closes', async () => {
    const page = await setUp();
    await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).close());
    await page.waitForChanges();
    expect((await portalState(page)).shown).toBe(false);
  });

  it('sits beside its trigger in a scrolled dialog with a backdrop filter', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1000, height: 600 });
    await page.setContent(`
      <dialog id="dialog" style="backdrop-filter: blur(3px); max-height: none; height: 100vh; overflow: auto; margin: 0; width: 100vw; max-width: none; padding: 0;">
        <div style="height: 1200px"></div>
        <pds-popover component-id="pop" placement="bottom-start">
          <button slot="trigger" id="pop-trigger">Open</button>
          <div>Body</div>
        </pds-popover>
        <div style="height: 1200px"></div>
      </dialog>
    `);
    await page.evaluate(() => {
      const dialog = document.getElementById('dialog') as HTMLDialogElement;
      dialog.showModal();
      dialog.scrollTop = 1000;
    });
    await (await page.find('#pop-trigger')).click();
    await page.waitForChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const gap = await page.evaluate(() => {
      const trigger = document.getElementById('pop-trigger')!.getBoundingClientRect();
      const panel = document.getElementById('pop-portal')!.getBoundingClientRect();
      return { top: Math.round(panel.top - trigger.bottom), left: Math.round(panel.left - trigger.left) };
    });
    expect(gap).toEqual({ top: 8, left: 0 });
  });
});

describe('pds-popover in a dialog inside a shadow root', () => {
  it('carries its focus style into the shadow root, and takes it away with the popover', async () => {
    const page = await newE2EPage();
    await page.setContent('<div id="host-here"></div>');
    await page.evaluate(() => {
      customElements.define(
        'dialog-host',
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' }).innerHTML =
              '<dialog id="dialog"><pds-popover component-id="shadow-pop"><button slot="trigger" id="trigger">Open</button><div><button>Inside</button></div></pds-popover></dialog>';
          }
        },
      );
      const host = document.createElement('dialog-host');
      document.getElementById('host-here')!.appendChild(host);
      (host.shadowRoot!.getElementById('dialog') as HTMLDialogElement).showModal();
    });
    await page.waitForChanges();
    await page.evaluate(() => (document.querySelector('dialog-host')!.shadowRoot!.getElementById('trigger') as HTMLElement).click());
    await page.waitForChanges();

    const styleInShadow = () =>
      page.evaluate(() => !!document.querySelector('dialog-host')!.shadowRoot!.querySelector('style[data-pds-popover-focus="shadow-pop-portal"]'));
    expect(await styleInShadow()).toBe(true);
    expect(formatViolations(await runAxe(page))).toBe('');
    // The copied rule matches the portal and applies its outline on focus. A script focus also
    // matches :focus-visible, whose browser outline is `auto`, so `solid` shows the copied rule.
    expect(
      await page.evaluate(() => {
        const portal = document.querySelector('dialog-host')!.shadowRoot!.getElementById('shadow-pop-portal') as HTMLElement;
        portal.tabIndex = -1;
        portal.focus();
        return getComputedStyle(portal).outlineStyle;
      }),
    ).toBe('solid');

    await page.evaluate(() => document.querySelector('dialog-host')!.shadowRoot!.querySelector('pds-popover')!.remove());
    await page.waitForChanges();
    expect(await styleInShadow()).toBe(false);
  });

  it('takes its copied focus style out of the shadow root when moved out while open', async () => {
    const page = await newE2EPage();
    await page.setContent('<div id="host-here"></div><dialog id="light-dialog"></dialog>');
    await page.evaluate(() => {
      customElements.define(
        'dialog-host-moved',
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' }).innerHTML =
              '<dialog id="dialog"><pds-popover component-id="shadow-pop"><button slot="trigger" id="trigger">Open</button><div><button>Inside</button></div></pds-popover></dialog>';
          }
        },
      );
      const host = document.createElement('dialog-host-moved');
      document.getElementById('host-here')!.appendChild(host);
      (host.shadowRoot!.getElementById('dialog') as HTMLDialogElement).show();
    });
    await page.waitForChanges();
    await page.evaluate(() => (document.querySelector('dialog-host-moved')!.shadowRoot!.getElementById('trigger') as HTMLElement).click());
    await page.waitForChanges();
    const styleInShadow = () =>
      page.evaluate(() => !!document.querySelector('dialog-host-moved')!.shadowRoot!.querySelector('style[data-pds-popover-focus]'));
    expect(await styleInShadow()).toBe(true);

    // Moved, still open, into a light-DOM dialog: the panel follows, and the copy is dropped.
    await page.evaluate(() => {
      const light = document.getElementById('light-dialog') as HTMLDialogElement;
      light.show();
      light.appendChild(document.querySelector('dialog-host-moved')!.shadowRoot!.querySelector('pds-popover')!);
    });
    await page.waitForChanges();
    expect(await page.evaluate(() => document.getElementById('shadow-pop-portal')?.parentElement?.id)).toBe('light-dialog');
    expect(await styleInShadow()).toBe(false);
  });

  it('keeps its dark-mode border when the page is dark', async () => {
    const page = await newE2EPage();
    await page.setContent('<div id="host-here"></div>');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      customElements.define(
        'dialog-host',
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' }).innerHTML =
              '<dialog id="dialog"><pds-popover component-id="shadow-pop"><button slot="trigger" id="trigger">Open</button><div>Inside</div></pds-popover></dialog>';
          }
        },
      );
      const host = document.createElement('dialog-host');
      document.getElementById('host-here')!.appendChild(host);
      (host.shadowRoot!.getElementById('dialog') as HTMLDialogElement).showModal();
    });
    await page.waitForChanges();
    await page.evaluate(() => (document.querySelector('dialog-host')!.shadowRoot!.getElementById('trigger') as HTMLElement).click());
    await page.waitForChanges();

    const borderStyle = await page.evaluate(
      () => getComputedStyle(document.querySelector('dialog-host')!.shadowRoot!.getElementById('shadow-pop-portal')!).borderTopStyle,
    );
    expect(borderStyle).not.toBe('none');

    // Closing clears it, so a panel that next opens in the body doesn't keep it.
    await page.evaluate(() => (document.querySelector('dialog-host')!.shadowRoot!.querySelector('pds-popover') as HTMLElement & { hide(): Promise<void> }).hide());
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('dialog-host')!.shadowRoot!.getElementById('shadow-pop-portal')!.style.border)).toBe('');
  });
});

describe('nested pds-popovers', () => {
  it('closes only the inner one on Escape, then the outer one', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-popover component-id="outer">
        <button slot="trigger" id="outer-trigger">Outer</button>
        <div>
          <pds-popover component-id="inner">
            <button slot="trigger" id="inner-trigger">Inner</button>
            <div><button id="inner-inside">Inside</button></div>
          </pds-popover>
        </div>
      </pds-popover>
    `);
    await (await page.find('#outer-trigger')).click();
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('outer-portal')?.style.display === 'block');
    await page.evaluate(() => (document.getElementById('inner-trigger') as HTMLElement).click());
    await page.waitForChanges();
    await page.waitForFunction(() => document.getElementById('inner-portal')?.style.display === 'block');
    const shown = () =>
      page.evaluate(() => ['outer', 'inner'].map(id => document.getElementById(`${id}-portal`)?.style.display === 'block'));
    await page.evaluate(() => (document.getElementById('inner-inside') as HTMLElement).focus());

    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await shown()).toEqual([true, false]);

    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await shown()).toEqual([false, false]);
  });
});

// Puppeteer's mouse sends mouse pointer events even where the browser reports (hover: none), as
// CI's headless Chrome does, so these drive the real hover path.
describe('pds-popover open-on hover', () => {
  type Page = Awaited<ReturnType<typeof newE2EPage>>;

  const setUp = async (popoverAttrs = '') => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1000, height: 800 });
    await page.setContent(`
      <pds-popover component-id="hover-pop" open-on="hover" placement="bottom-start" ${popoverAttrs}>
        <button slot="trigger" id="hover-trigger">Preview</button>
        <div><button id="hover-inside">Inside</button></div>
      </pds-popover>
      <button id="elsewhere" style="position: absolute; top: 600px; left: 600px;">Elsewhere</button>
    `);
    return page;
  };

  const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const isShown = (page: Page) =>
    page.evaluate(() => document.getElementById('hover-pop-portal')?.style.display === 'block');

  const waitUntilShown = (page: Page, shown: boolean) =>
    page.waitForFunction((want: boolean) => (document.getElementById('hover-pop-portal')?.style.display === 'block') === want, {}, shown);

  const centerOf = (page: Page, id: string) =>
    page.$eval(`#${id}`, (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });

  const moveTo = async (page: Page, id: string) => {
    const { x, y } = await centerOf(page, id);
    await page.mouse.move(x, y, { steps: 4 });
  };

  const hoverOpen = async (page: Page) => {
    await moveTo(page, 'hover-trigger');
    await waitUntilShown(page, true);
  };

  const recordTimes = (page: Page) =>
    page.evaluate(() => {
      const times = ((window as unknown as { times: Record<string, number> }).times = {});
      document.getElementById('hover-trigger')!.addEventListener('pointerenter', () => (times.entered = performance.now()));
      document.querySelector('pds-popover')!.addEventListener('pdsPopoverOpen', () => (times.opened = performance.now()));
      document.querySelector('pds-popover')!.addEventListener('pdsPopoverClose', () => (times.closed = performance.now()));
      document.getElementById('hover-pop-portal')!.addEventListener('pointerleave', () => (times.left = performance.now()));
    });

  const times = (page: Page) => page.evaluate(() => (window as unknown as { times: Record<string, number> }).times);

  it('stays closed on hover in the default click mode', async () => {
    const page = await setUp();
    await page.$eval('pds-popover', (el) => el.removeAttribute('open-on'));
    await page.waitForChanges();

    await moveTo(page, 'hover-trigger');
    await pause(300);

    expect(await isShown(page)).toBe(false);
  });

  it('opens once the pointer has rested on the trigger for the delay', async () => {
    const page = await setUp();
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    await recordTimes(page);

    await hoverOpen(page);

    const { entered, opened } = await times(page);
    expect(opened - entered).toBeGreaterThanOrEqual(110);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(openSpy.firstEvent.detail).toEqual({ componentId: 'hover-pop', popoverType: 'auto' });
  });

  it('stays open as the pointer moves from the trigger into the panel, and closes after it leaves both', async () => {
    const page = await setUp();
    await hoverOpen(page);
    await recordTimes(page);

    await moveTo(page, 'hover-inside');
    await pause(300);
    expect(await isShown(page)).toBe(true);

    await moveTo(page, 'elsewhere');
    await waitUntilShown(page, false);

    const { left, closed } = await times(page);
    expect(closed - left).toBeGreaterThanOrEqual(190);
  });

  it('stays open after a click on the trigger, and closes on the next click when it toggles', async () => {
    const page = await setUp('popover-target-action="toggle"');
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    await hoverOpen(page);

    await page.click('#hover-trigger');
    await moveTo(page, 'elsewhere');
    await pause(400);
    expect(await isShown(page)).toBe(true);

    await page.click('#hover-trigger');
    await waitUntilShown(page, false);
    await pause(300);
    expect(await isShown(page)).toBe(false);
    expect(openSpy).toHaveReceivedEventTimes(1);
  });

  it('opens once on a touch tap, not while the finger rests on the trigger', async () => {
    const page = await setUp('popover-target-action="toggle"');
    await page.setViewport({ width: 1000, height: 800, hasTouch: true });
    const openSpy = await page.spyOnEvent('pdsPopoverOpen');
    const { x, y } = await centerOf(page, 'hover-trigger');

    await page.touchscreen.touchStart(x, y);
    await pause(250);
    expect(await isShown(page)).toBe(false);

    await page.touchscreen.touchEnd();
    await waitUntilShown(page, true);
    await pause(400);

    expect(await isShown(page)).toBe(true);
    expect(openSpy).toHaveReceivedEventTimes(1);
  });

  for (const popoverType of ['auto', 'manual']) {
    it(`closes on Escape once hover opened it (${popoverType})`, async () => {
      const page = await setUp(`popover-type="${popoverType}"`);
      await hoverOpen(page);
      expect(await page.$eval('#hover-pop-portal', (el) => el.hasAttribute('data-pds-popover-open'))).toBe(true);

      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await isShown(page)).toBe(false);
    });
  }

  it('ignores Escape, like a clicked-open manual popover, once a click keeps a manual one open', async () => {
    const page = await setUp('popover-type="manual"');
    await hoverOpen(page);
    await page.click('#hover-trigger');

    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(await isShown(page)).toBe(true);
    expect(await page.$eval('#hover-pop-portal', (el) => el.hasAttribute('data-pds-popover-open'))).toBe(false);
  });

  it('stays open after the pointer leaves while focus is inside the panel, and closes once focus leaves', async () => {
    const page = await setUp('popover-type="manual"');
    await hoverOpen(page);
    await moveTo(page, 'hover-inside');
    await page.focus('#hover-inside');

    await moveTo(page, 'elsewhere');
    await pause(400);
    expect(await isShown(page)).toBe(true);

    await page.focus('#elsewhere');
    await waitUntilShown(page, false);
  });

  it("doesn't open on focus, and opens to stay on Enter", async () => {
    const page = await setUp();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('hover-trigger');
    await pause(300);
    expect(await isShown(page)).toBe(false);

    await page.keyboard.press('Enter');
    await waitUntilShown(page, true);
    await moveTo(page, 'elsewhere');
    await pause(400);

    expect(await isShown(page)).toBe(true);
  });

  it('closes only a hover-opened manual popover on the first Escape in a modal', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1000, height: 800 });
    await page.setContent(`
      <pds-modal component-id="modal">
        <pds-modal-content>
          <pds-popover component-id="hover-pop" open-on="hover" popover-type="manual">
            <button slot="trigger" id="hover-trigger">Preview</button>
            <div>Panel</div>
          </pds-popover>
        </pds-modal-content>
      </pds-modal>
    `);
    const modal = await page.find('pds-modal');
    await modal.callMethod('showModal');
    await page.waitForChanges();
    await hoverOpen(page);

    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(await isShown(page)).toBe(false);
    expect(await modal.getProperty('open')).toBe(true);
  });

  it('has no axe violations when hover opened it', async () => {
    const page = await setUp();
    await hoverOpen(page);

    expect(formatViolations(await runAxe(page))).toBe('');
  });

  describe('beside a tall trigger', () => {
    type Point = { x: number; y: number };

    const setUpBeside = async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1000, height: 800 });
      await page.setContent(`
        <div style="position: absolute; left: 200px; top: 200px;">
          <pds-popover component-id="hover-pop" open-on="hover" placement="right-start">
            <button slot="trigger" id="hover-trigger" style="display: block; width: 140px; height: 120px;">Preview</button>
            <div style="width: 272px; height: 16px;"></div>
          </pds-popover>
        </div>
      `);
      await page.evaluate(() => {
        const times = ((window as unknown as { times: Record<string, number> }).times = {});
        document.getElementById('hover-trigger')!.addEventListener('pointerleave', () => (times.left ??= performance.now()));
        document.querySelector('pds-popover')!.addEventListener('pdsPopoverClose', () => (times.closed ??= performance.now()));
      });
      return page;
    };

    const rectOf = (page: Page, id: string) => page.$eval(`#${id}`, (el) => el.getBoundingClientRect().toJSON() as DOMRect);

    // About 0.2px/ms, a slow hand on the mouse.
    const slowMove = async (page: Page, from: Point, to: Point) => {
      const steps = Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 3);
      for (let i = 1; i <= steps; i++) {
        await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
        await pause(10);
      }
    };

    const hoverOpenFrom = async (page: Page, corner: 'bottom-left' | 'middle-left') => {
      const trigger = await rectOf(page, 'hover-trigger');
      const from = { x: trigger.left + 3, y: corner === 'bottom-left' ? trigger.bottom - 3 : trigger.top + trigger.height / 2 };
      await page.mouse.move(from.x, from.y);
      await waitUntilShown(page, true);
      return from;
    };

    it('stays open on a slow diagonal from the trigger to a panel shorter than it', async () => {
      const page = await setUpBeside();
      const from = await hoverOpenFrom(page, 'bottom-left');
      const panel = await rectOf(page, 'hover-pop-portal');

      await slowMove(page, from, { x: panel.right - 3, y: panel.top + 3 });
      await pause(300);

      expect(await isShown(page)).toBe(true);
    });

    it('still closes after the delay when the pointer leaves the trigger heading away from the panel', async () => {
      const page = await setUpBeside();
      const from = await hoverOpenFrom(page, 'middle-left');

      await slowMove(page, from, { x: from.x - 150, y: from.y });

      expect(await isShown(page)).toBe(false);
      const { left, closed } = await times(page);
      expect(closed - left).toBeGreaterThanOrEqual(190);
      expect(closed - left).toBeLessThan(400);
    });
  });

  // Like a clicked-open panel, a hover-opened one sits at the end of the body outside a dialog,
  // and right after the popover inside one. Either way, Tab reaches it right after the trigger.
  describe('Tab from the trigger', () => {
    const tabOrder = async (page: Page, open: () => Promise<void>) => {
      await page.focus('#hover-trigger');
      await open();
      const order: string[] = [];
      for (let i = 0; i < 2; i++) {
        await page.keyboard.press('Tab');
        order.push(await page.evaluate(() => document.activeElement?.id ?? ''));
      }
      return { order, shown: await isShown(page) };
    };

    it('reaches a hover-opened panel at the same point as a clicked-open one', async () => {
      const hoverPage = await setUp();
      const hovered = await tabOrder(hoverPage, () => hoverOpen(hoverPage));

      const clickPage = await setUp();
      await clickPage.$eval('pds-popover', (el) => el.removeAttribute('open-on'));
      await clickPage.waitForChanges();
      const clicked = await tabOrder(clickPage, async () => {
        await clickPage.keyboard.press('Enter');
        await waitUntilShown(clickPage, true);
      });

      expect(hovered).toEqual({ order: ['hover-inside', 'elsewhere'], shown: true });
      expect(clicked).toEqual(hovered);
    });

    it('goes into a hover-opened panel inside a dialog', async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1000, height: 800 });
      await page.setContent(`
        <dialog id="dialog">
          <pds-popover component-id="hover-pop" open-on="hover" placement="bottom-start">
            <button slot="trigger" id="hover-trigger">Preview</button>
            <div><button id="hover-inside">Inside</button></div>
          </pds-popover>
          <button id="elsewhere">Elsewhere</button>
        </dialog>
      `);
      await page.evaluate(() => (document.getElementById('dialog') as HTMLDialogElement).showModal());

      expect(await tabOrder(page, () => hoverOpen(page))).toEqual({ order: ['hover-inside', 'elsewhere'], shown: true });
    });

    it('closes once Tab leaves the panel after the pointer has', async () => {
      const page = await setUp();
      await page.focus('#hover-trigger');
      await hoverOpen(page);
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('hover-inside');

      await moveTo(page, 'elsewhere');
      await pause(400);
      expect(await isShown(page)).toBe(true);

      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('elsewhere');
      await waitUntilShown(page, false);
    });
  });
});
