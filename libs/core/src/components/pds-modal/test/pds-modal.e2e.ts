import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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

    it('leaves Escape to an overlay above it and closes normally when focus is inside', async () => {
      const page = await newE2EPage();
      await page.setContent(
        `<pds-modal component-id="tl-esc" disable-top-layer="true"><div>Content</div></pds-modal>`,
      );

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(true);

      // An overlay mounted on the body owns focus — Escape should not dismiss the modal.
      await page.evaluate(() => {
        const o = document.createElement('button');
        o.id = 'probe-overlay';
        o.textContent = 'Overlay';
        document.body.appendChild(o);
        o.focus();
      });
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await modal.getProperty('open')).toBe(true);

      // Remove the overlay so focus is no longer held outside the modal — Escape
      // now dismisses the modal as usual.
      await page.evaluate(() => {
        (document.getElementById('probe-overlay') as HTMLElement)?.remove();
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
