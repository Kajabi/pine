import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';
import { expectRespectsReducedMotion } from '../../../utils/test/reduced-motion';

describe('pds-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal></pds-modal>');

    const element = await page.find('pds-modal');
    expect(element).toHaveClass('hydrated');
  });

  it('should open and close the modal', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="test-modal">
        <div slot="header">Modal Header</div>
        <div>Modal Content</div>
        <div slot="footer">Modal Footer</div>
      </pds-modal>
    `);

    const modal = await page.find('pds-modal');

    // Initially modal should be closed
    let isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(false);

    // Open the modal
    await modal.callMethod('showModal');
    await page.waitForChanges();

    // Check if modal is open
    isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(true);

    // Close the modal programmatically
    await modal.callMethod('hideModal');
    await page.waitForChanges();

    // Check if modal is closed
    isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(false);
  });

  it('should emit events when opening and closing', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="test-modal">
        <div slot="header">Modal Header</div>
        <div>Modal Content</div>
        <div slot="footer">Modal Footer</div>
      </pds-modal>
    `);

    const modal = await page.find('pds-modal');

    // Listen for events
    const openSpy = await page.spyOnEvent('pdsModalOpen');
    const closeSpy = await page.spyOnEvent('pdsModalClose');

    // Open the modal
    await modal.callMethod('showModal');
    await page.waitForChanges();
    expect(openSpy).toHaveReceivedEvent();

    // Close the modal
    await modal.callMethod('hideModal');
    await page.waitForChanges();
    expect(closeSpy).toHaveReceivedEvent();
  });

  it('should handle different size props', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal size="lg"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('size')).toBe('lg');

    // Update the size property
    await modal.setProperty('size', 'sm');
    await page.waitForChanges();
    expect(await modal.getProperty('size')).toBe('sm');
  });

  // Modal is always scrollable by default, no need to test scrollable property

  it('should handle backdropDismiss prop', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal backdrop-dismiss="false"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('backdropDismiss')).toBe(false);
  });

  describe('disableTopLayer', () => {
    // The top-layer contract is only observable in a real browser: showModal()
    // promotes the dialog to the top layer (:modal true), show() does not.
    const dialogState = (page) =>
      page.evaluate(() => {
        const dialog = document.querySelector('pds-modal dialog') as HTMLDialogElement | null;
        return {
          isModal: dialog ? dialog.matches(':modal') : null,
          isOpen: dialog ? dialog.hasAttribute('open') : null,
          ariaModal: dialog ? dialog.getAttribute('aria-modal') : null,
        };
      });

    it('opens in the top layer by default (:modal)', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-modal component-id="tl-default"><div>Content</div></pds-modal>`);

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();

      const state = await dialogState(page);
      expect(state.isOpen).toBe(true);
      expect(state.isModal).toBe(true);
      expect(state.ariaModal).toBe('true');
    });

    it('opens outside the top layer as a non-modal dialog when disableTopLayer is set', async () => {
      const page = await newE2EPage();
      await page.setContent(
        `<pds-modal component-id="tl-off" disable-top-layer="true"><div>Content</div></pds-modal>`,
      );

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();

      const state = await dialogState(page);
      // Open, but NOT in the top layer — so a higher-z overlay can paint above it.
      expect(state.isOpen).toBe(true);
      expect(state.isModal).toBe(false);
      expect(state.ariaModal).toBe('false');
    });

    it('leaves Escape to an overlay stacked above it and closes normally once focus leaves', async () => {
      const page = await newE2EPage();
      await page.setContent(
        `<pds-modal component-id="tl-esc" disable-top-layer="true"><div>Content</div></pds-modal>`,
      );

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(true);

      // A real overlay actually stacked above this modal — positioned, with a
      // higher z-index than the modal's own backdrop — owns focus. Escape
      // should not dismiss the modal out from under it.
      await page.evaluate(() => {
        const backdrop = document.querySelector('pds-modal dialog') as HTMLElement;
        const backdropZIndex = parseInt(getComputedStyle(backdrop).zIndex, 10);
        const o = document.createElement('button');
        o.id = 'probe-overlay';
        o.textContent = 'Overlay';
        o.style.position = 'fixed';
        o.style.zIndex = String(backdropZIndex + 1);
        document.body.appendChild(o);
        o.focus();
      });
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(true);

      // Remove the overlay so focus is no longer held inside a stacked surface —
      // Escape now dismisses the modal as usual.
      await page.evaluate(() => {
        (document.getElementById('probe-overlay') as HTMLElement)?.remove();
      });
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(false);
    });

    it('still closes on Escape when focus is simply back in the page, not inside a stacked overlay', async () => {
      // This is the non-modal-drawer scenario disableTopLayer exists for: the
      // page stays interactive, so the user will routinely have focus on
      // ordinary page content while the modal is open. That must not be
      // mistaken for "an overlay owns Escape" — only a focused element inside
      // a surface actually stacked above this modal should suppress it.
      const page = await newE2EPage();
      await page.setContent(`
        <button id="page-button">Page button</button>
        <pds-modal component-id="tl-esc-page" disable-top-layer="true"><div>Content</div></pds-modal>
      `);

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(true);

      await page.evaluate(() => {
        (document.getElementById('page-button') as HTMLElement)?.focus();
      });
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(false);
    });

    it('lets a higher z-index overlay paint above the non-modal dialog', async () => {
      const page = await newE2EPage();
      await page.setContent(
        `<pds-modal component-id="tl-stack" disable-top-layer="true"><div>Content</div></pds-modal>`,
      );

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();

      // A fixed, higher-z element appended to the body should sit on top of the
      // (non-top-layer) dialog — impossible when the dialog is in the top layer.
      const overlayOnTop = await page.evaluate(() => {
        const o = document.createElement('div');
        o.id = 'probe-overlay';
        o.setAttribute(
          'style',
          'position:fixed;top:0;left:0;width:100px;height:100px;z-index:2147483647',
        );
        document.body.appendChild(o);
        return document.elementFromPoint(10, 10) === o;
      });
      expect(overlayOnTop).toBe(true);
    });

    it('leaves Escape to a sibling top-layer modal that shares the same z-index tier', async () => {
      // Regression: a sibling pds-modal (not nested inside this one — e.g. a
      // confirm dialog mounted alongside a disableTopLayer drawer) gets the
      // same default z-index token as this modal's own backdrop, so a plain
      // "strictly greater" z-index comparison missed it entirely. A top-layer
      // dialog paints above everything outside the top layer regardless of
      // z-index, which isStackedAboveOverlay now checks for directly.
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="drawer-stub" disable-top-layer="true" open><div>Drawer content</div></pds-modal>
        <pds-modal component-id="confirm-stub" open><button id="confirm-btn">Confirm</button></pds-modal>
      `);
      await page.waitForChanges();

      await page.evaluate(() => (document.getElementById('confirm-btn') as HTMLElement)?.focus());
      await page.keyboard.press('Escape');
      await page.waitForChanges();

      const outer = await page.find('pds-modal[component-id="drawer-stub"]');
      const inner = await page.find('pds-modal[component-id="confirm-stub"]');
      expect(await inner.getProperty('open')).toBe(false);
      expect(await outer.getProperty('open')).toBe(true);
    });
  });

  describe('initial open state', () => {
    it('opens the native dialog automatically when open is set from the start', async () => {
      // Regression: @Watch('open') only fires on a later change, not the
      // prop's initial value, so a modal mounted with `open` already true
      // never called show()/showModal() — the panel still appeared (driven
      // by the `open` CSS class), but the native <dialog> itself stayed
      // closed: no top-layer promotion, no dialog focusing steps.
      const page = await newE2EPage();
      await page.setContent(`<pds-modal component-id="initially-open" open><div>Content</div></pds-modal>`);
      await page.waitForChanges();

      const dialogOpen = await page.evaluate(() => {
        const dialog = document.querySelector('pds-modal dialog') as HTMLDialogElement | null;
        return dialog ? dialog.open : null;
      });
      expect(dialogOpen).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations when closed', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test-modal">
          <div slot="header">Modal Header</div>
          <div>Modal content</div>
          <div slot="footer">Modal Footer</div>
        </pds-modal>
      `);
      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('has no axe violations when open with header, content, and footer', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test-modal">
          <h2 slot="header">Confirm action</h2>
          <p>Are you sure you want to continue?</p>
          <div slot="footer">
            <pds-button variant="secondary">Cancel</pds-button>
            <pds-button>Confirm</pds-button>
          </div>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      const openSpy = await page.spyOnEvent('pdsModalOpen');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      expect(openSpy).toHaveReceivedEvent();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });
});

describe('pds-modal reduced motion', () => {
  it('zeroes out the backdrop transition under prefers-reduced-motion', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal></pds-modal>');
    await expectRespectsReducedMotion(page, 'pds-modal', '.pds-modal__backdrop');
  });
});
