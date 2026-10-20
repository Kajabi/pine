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

  it('caps its width at a custom size, and falls back to md for an invalid one', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.setContent(`
      <pds-modal id="custom" component-id="custom" size="1250px" open="true"><p>Custom</p></pds-modal>
      <pds-modal id="invalid" component-id="invalid" size="xl"><p>Invalid</p></pds-modal>
    `);
    await page.waitForChanges();

    const maxWidth = (id: string) =>
      page.$eval(`#${id} .pds-modal`, (el) => getComputedStyle(el).maxWidth);

    expect(await maxWidth('custom')).toBe('1250px');
    expect(await maxWidth('invalid')).toBe('700px');
  });

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

    // Regression: a sibling pds-modal (not nested inside this one — e.g. a
    // confirm dialog mounted alongside a disableTopLayer drawer) gets the
    // same default z-index token as this modal's own backdrop, so a plain
    // "strictly greater" z-index comparison missed it entirely. A top-layer
    // dialog paints above everything outside the top layer regardless of
    // z-index, which isStackedAboveOverlay now checks for directly.
    //
    // Both DOM orders are covered deliberately: every open pds-modal shares
    // one document-level keydown listener, dispatched in registration order,
    // and the confirm's own hideModal() clears its :modal state the moment
    // it runs — if the confirm is registered first (the typical shape for an
    // app-root confirm dialog mounted ahead of a drawer), it closes itself
    // before the drawer's listener ever gets a chance to check, so reading
    // :modal live there would already see it as closed. The fix snapshots
    // that determination once per keydown, before either instance acts.
    const mountOrders: Array<{ name: string; markup: string }> = [
      {
        name: 'drawer mounted before the confirm',
        markup: `
          <pds-modal component-id="drawer-stub" disable-top-layer="true" open><div>Drawer content</div></pds-modal>
          <pds-modal component-id="confirm-stub" open><button id="confirm-btn">Confirm</button></pds-modal>
        `,
      },
      {
        name: 'confirm mounted before the drawer',
        markup: `
          <pds-modal component-id="confirm-stub" open><button id="confirm-btn">Confirm</button></pds-modal>
          <pds-modal component-id="drawer-stub" disable-top-layer="true" open><div>Drawer content</div></pds-modal>
        `,
      },
    ];

    for (const { name, markup } of mountOrders) {
      it(`leaves Escape to a sibling top-layer modal that shares the same z-index tier (${name})`, async () => {
        const page = await newE2EPage();
        await page.setContent(markup);
        await page.waitForChanges();

        await page.evaluate(() => (document.getElementById('confirm-btn') as HTMLElement)?.focus());
        await page.keyboard.press('Escape');
        await page.waitForChanges();

        const outer = await page.find('pds-modal[component-id="drawer-stub"]');
        const inner = await page.find('pds-modal[component-id="confirm-stub"]');
        expect(await inner.getProperty('open')).toBe(false);
        expect(await outer.getProperty('open')).toBe(true);
      });
    }

    describe('a modal taller than the viewport', () => {
      const tallModal = (attributes: string) => `
        <pds-modal component-id="tall" ${attributes}>
          <pds-modal-content><div style="height: 900px">Tall content</div></pds-modal-content>
          <pds-modal-footer><button id="save" type="button">Save</button></pds-modal-footer>
        </pds-modal>
      `;

      const openAtShortViewport = async (attributes: string) => {
        const page = await newE2EPage();
        await page.setViewport({ width: 1280, height: 300 });
        await page.setContent(tallModal(attributes));
        await (await page.find('pds-modal')).callMethod('showModal');
        await page.waitForChanges();
        return page;
      };

      // Scrolls the backdrop to its end, then reports whether the footer button is on screen
      // and is what a click at its centre would hit.
      const footerReachable = (page) =>
        page.evaluate(() => {
          const backdrop = document.querySelector('pds-modal .pds-modal__backdrop') as HTMLElement;
          backdrop.scrollTop = backdrop.scrollHeight;
          const save = document.getElementById('save') as HTMLElement;
          const rect = save.getBoundingClientRect();
          const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
          const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return { inView, hitsSave: hit === save };
        });

      const backdropOverflows = (page) =>
        page.evaluate(() => {
          const backdrop = document.querySelector('pds-modal .pds-modal__backdrop') as HTMLElement;
          return backdrop.scrollHeight > backdrop.clientHeight;
        });

      it('scrolls to its footer outside the top layer, as it does inside it', async () => {
        const page = await openAtShortViewport('disable-top-layer="true" scrollable="false"');

        expect(await footerReachable(page)).toEqual({ inView: true, hitsSave: true });
      });

      it('still scrolls to its footer in the top layer', async () => {
        const page = await openAtShortViewport('scrollable="false"');

        expect(await footerReachable(page)).toEqual({ inView: true, hitsSave: true });
      });

      it('keeps a nested modal in place while the outer one scrolls outside the top layer', async () => {
        const page = await newE2EPage();
        await page.setViewport({ width: 1280, height: 300 });
        await page.setContent(`
          <pds-modal component-id="outer" disable-top-layer="true" scrollable="false">
            <pds-modal-content>
              <div style="height: 900px">Tall content</div>
              <pds-modal component-id="inner" disable-top-layer="true" size="sm">
                <pds-modal-content><p id="inner-text">Nested</p></pds-modal-content>
              </pds-modal>
            </pds-modal-content>
          </pds-modal>
        `);
        await (await page.find('pds-modal[component-id="outer"]')).callMethod('showModal');
        await page.waitForChanges();
        await (await page.find('pds-modal[component-id="inner"]')).callMethod('showModal');
        await page.waitForChanges();

        const innerTop = () =>
          page.evaluate(() => Math.round(document.getElementById('inner-text')!.getBoundingClientRect().top));
        const before = await innerTop();
        await page.evaluate(() => {
          (document.querySelector('pds-modal[component-id="outer"] > .pds-modal__backdrop, pds-modal[component-id="outer"] .pds-modal__backdrop') as HTMLElement).scrollTop = 400;
        });

        expect(await innerTop()).toBe(before);
      });

      it('keeps a scrollable modal inside the viewport, so the backdrop adds no second scrollbar', async () => {
        const page = await openAtShortViewport('disable-top-layer="true"');

        expect(await backdropOverflows(page)).toBe(false);
        expect(await footerReachable(page)).toEqual({ inView: true, hitsSave: true });
      });
    });
  });

  describe('nested modals', () => {
    const nested = (outerAttrs = '', innerAttrs = '') => `
      <pds-modal component-id="outer" ${outerAttrs}>
        <pds-modal-content>
          <button id="outer-button">Outer</button>
          <pds-modal component-id="inner" ${innerAttrs}>
            <pds-modal-content><button id="inner-button">Inner</button></pds-modal-content>
          </pds-modal>
        </pds-modal-content>
      </pds-modal>
    `;

    const openBoth = async (markup: string) => {
      const page = await newE2EPage();
      await page.setContent(markup);
      const outer = await page.find('pds-modal[component-id="outer"]');
      const inner = await page.find('pds-modal[component-id="inner"]');
      await outer.callMethod('showModal');
      await page.waitForChanges();
      await inner.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(() => (document.getElementById('inner-button') as HTMLElement).focus());
      return { page, outer, inner };
    };

    for (const [name, outerAttrs, innerAttrs] of [
      ['both in the top layer', '', ''],
      ['both with disableTopLayer', 'disable-top-layer="true"', 'disable-top-layer="true"'],
      ['a top-layer outer and a disableTopLayer inner', '', 'disable-top-layer="true"'],
    ]) {
      it(`closes the inner modal on the first Escape and the outer one on the next (${name})`, async () => {
        const { page, outer, inner } = await openBoth(nested(outerAttrs, innerAttrs));

        await page.keyboard.press('Escape');
        await page.waitForChanges();
        expect(await inner.getProperty('open')).toBe(false);
        expect(await outer.getProperty('open')).toBe(true);

        await page.keyboard.press('Escape');
        await page.waitForChanges();
        expect(await outer.getProperty('open')).toBe(false);
      });
    }

    // Passes before the ranking change too: the inner backdrop stops its click. Kept as a guard.
    it('closes only the inner modal on a click on its backdrop', async () => {
      const { page, outer, inner } = await openBoth(nested());
      // The backdrop fills the viewport; its corner is outside the inner panel.
      await page.mouse.click(5, 5);
      await page.waitForChanges();
      expect(await inner.getProperty('open')).toBe(false);
      expect(await outer.getProperty('open')).toBe(true);
    });
  });

  // The "Nested Modals" docs demo opens a second modal that's a sibling in the DOM, not a child.
  describe('sibling modals', () => {
    const openSiblings = async (firstAttrs: string, secondAttrs: string) => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="first" ${firstAttrs}><pds-modal-content><button id="first-button">First</button></pds-modal-content></pds-modal>
        <pds-modal component-id="second" ${secondAttrs}><pds-modal-content><button id="second-button">Second</button></pds-modal-content></pds-modal>
      `);
      const first = await page.find('pds-modal[component-id="first"]');
      const second = await page.find('pds-modal[component-id="second"]');
      await first.callMethod('showModal');
      await page.waitForChanges();
      await second.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(() => (document.getElementById('second-button') as HTMLElement).focus());
      return { page, first, second };
    };

    for (const [name, firstAttrs, secondAttrs] of [
      ['both in the top layer', '', ''],
      ['a top-layer modal opened over a disableTopLayer one', 'disable-top-layer="true"', ''],
    ]) {
      it(`closes the one opened last on the first Escape and the other on the next (${name})`, async () => {
        const { page, first, second } = await openSiblings(firstAttrs, secondAttrs);

        await page.keyboard.press('Escape');
        await page.waitForChanges();
        expect(await second.getProperty('open')).toBe(false);
        expect(await first.getProperty('open')).toBe(true);

        await page.evaluate(() => (document.getElementById('first-button') as HTMLElement).focus());
        await page.keyboard.press('Escape');
        await page.waitForChanges();
        expect(await first.getProperty('open')).toBe(false);
      });
    }

    it('closes only the one opened last on a click on its backdrop', async () => {
      const { page, first, second } = await openSiblings('', '');
      await page.mouse.click(5, 5);
      await page.waitForChanges();
      expect(await second.getProperty('open')).toBe(false);
      expect(await first.getProperty('open')).toBe(true);
    });

    it('keeps its place when an open modal is shown again', async () => {
      const { page, first, second } = await openSiblings('', '');
      await first.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(() => (document.getElementById('second-button') as HTMLElement).focus());

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await second.getProperty('open')).toBe(false);
      expect(await first.getProperty('open')).toBe(true);
    });
  });

  describe('a modal inside a shadow root', () => {
    const defineHost = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        customElements.define(
          'shadow-modal-host',
          class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' }).innerHTML =
                '<pds-modal component-id="in-shadow"><pds-modal-content><button id="in-shadow-button">In shadow</button></pds-modal-content></pds-modal>';
            }
          },
        );
      });

    const shadowModalOpen = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => (document.querySelector('shadow-modal-host')!.shadowRoot!.querySelector('pds-modal') as HTMLElement & { open: boolean }).open);

    it('closes on Escape', async () => {
      const page = await newE2EPage();
      await page.setContent('<div id="root"></div>');
      await defineHost(page);
      await page.evaluate(() => document.getElementById('root')!.appendChild(document.createElement('shadow-modal-host')));
      await page.waitForChanges();
      await page.evaluate(async () => {
        const modal = document.querySelector('shadow-modal-host')!.shadowRoot!.querySelector('pds-modal') as HTMLElement & { showModal(): Promise<void> };
        await modal.showModal();
      });
      await page.waitForChanges();

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await shadowModalOpen(page)).toBe(false);
    });

    it('closes a disableTopLayer modal in a shadow root inside a top-layer modal', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-modal component-id="outer"><pds-modal-content><div id="slot-here"></div></pds-modal-content></pds-modal>');
      await defineHost(page);
      await page.evaluate(() => {
        const host = document.createElement('shadow-modal-host');
        document.getElementById('slot-here')!.appendChild(host);
        host.shadowRoot!.querySelector('pds-modal')!.setAttribute('disable-top-layer', 'true');
      });
      await page.waitForChanges();
      const outer = await page.find('pds-modal[component-id="outer"]');
      await outer.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(async () => {
        const root = document.querySelector('shadow-modal-host')!.shadowRoot!;
        await (root.querySelector('pds-modal') as HTMLElement & { showModal(): Promise<void> }).showModal();
        (root.getElementById('in-shadow-button') as HTMLElement).focus();
      });
      await page.waitForChanges();

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await shadowModalOpen(page)).toBe(false);
      expect(await outer.getProperty('open')).toBe(true);
    });

    it('closes before the light-DOM modal it sits in', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-modal component-id="outer"><pds-modal-content><div id="slot-here"></div></pds-modal-content></pds-modal>');
      await defineHost(page);
      await page.evaluate(() => document.getElementById('slot-here')!.appendChild(document.createElement('shadow-modal-host')));
      await page.waitForChanges();
      const outer = await page.find('pds-modal[component-id="outer"]');
      await outer.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(async () => {
        const modal = document.querySelector('shadow-modal-host')!.shadowRoot!.querySelector('pds-modal') as HTMLElement & { showModal(): Promise<void> };
        await modal.showModal();
      });
      await page.waitForChanges();

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await shadowModalOpen(page)).toBe(false);
      expect(await outer.getProperty('open')).toBe(true);
    });
  });

  describe('Escape handled by a control inside', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email' },
    ];

    const openWithCombobox = async (modalAttrs: string, comboboxAttrs = '') => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="wizard" ${modalAttrs}>
          <pds-modal-content>
            <pds-combobox component-id="actions" label="Action" trigger="button" mode="select-only"
              panel-search dropdown-mount="body" ${comboboxAttrs}></pds-combobox>
          </pds-modal-content>
        </pds-modal>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }, options) => {
        el.options = options;
      }, actions);
      await (await page.find('pds-modal')).callMethod('showModal');
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    const state = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        const portal = document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot;
        return {
          modalOpen: (document.querySelector('pds-modal') as HTMLElement & { open: boolean }).open,
          dropdownOpen: !!portal?.querySelector('.pds-combobox__listbox'),
          drilledIn: !!portal?.querySelector('.pds-combobox__group-back'),
        };
      });

    const pressEscape = async (page: Awaited<ReturnType<typeof newE2EPage>>) => {
      await page.keyboard.press('Escape');
      await page.waitForChanges();
    };

    for (const [name, modalAttrs] of [
      ['in the top layer', ''],
      ['with disableTopLayer', 'disable-top-layer="true"'],
    ]) {
      it(`closes only an open combobox on the first Escape, and the modal on the next (${name})`, async () => {
        const page = await openWithCombobox(modalAttrs);
        expect(await state(page)).toEqual({ modalOpen: true, dropdownOpen: true, drilledIn: false });

        await pressEscape(page);
        expect(await state(page)).toEqual({ modalOpen: true, dropdownOpen: false, drilledIn: false });

        // Focus is back on the closed trigger, which leaves Escape to the modal.
        await pressEscape(page);
        expect((await state(page)).modalOpen).toBe(false);
      });
    }

    it('goes back out of a drill-in group, then closes the dropdown, then the modal', async () => {
      const page = await openWithCombobox('', 'group-display="drill-in"');
      await (await page.find('.pds-combobox-dropdown-portal >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      expect(await state(page)).toEqual({ modalOpen: true, dropdownOpen: true, drilledIn: true });

      await pressEscape(page);
      expect(await state(page)).toEqual({ modalOpen: true, dropdownOpen: true, drilledIn: false });

      await pressEscape(page);
      expect(await state(page)).toEqual({ modalOpen: true, dropdownOpen: false, drilledIn: false });

      await pressEscape(page);
      expect((await state(page)).modalOpen).toBe(false);
    });

    it('closes only an open dropdown menu on the first Escape', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="menu-modal">
          <pds-modal-content>
            <pds-dropdown-menu>
              <button slot="trigger" id="menu-trigger">Options</button>
              <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
            </pds-dropdown-menu>
          </pds-modal-content>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      await (await page.find('#menu-trigger')).click();
      await page.waitForChanges();

      const menuOpen = () =>
        page.evaluate(
          () => !document.querySelector('pds-dropdown-menu')!.shadowRoot!.querySelector('pds-box')!.classList.contains('is-hidden'),
        );
      expect(await menuOpen()).toBe(true);

      await pressEscape(page);
      expect(await menuOpen()).toBe(false);
      expect(await modal.getProperty('open')).toBe(true);
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('menu-trigger');

      await pressEscape(page);
      expect(await modal.getProperty('open')).toBe(false);
    });

    it('closes only an open multiselect on the first Escape', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="tags-modal">
          <pds-modal-content><pds-multiselect component-id="tags" label="Tags"></pds-multiselect></pds-modal-content>
        </pds-modal>
      `);
      await page.$eval('pds-multiselect', (el: HTMLElement & { options?: unknown }) => {
        el.options = [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }];
      });
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      await (await page.find('pds-multiselect >>> .pds-multiselect__trigger')).click();
      await page.waitForFunction(() =>
        document.querySelector('pds-multiselect')?.shadowRoot?.activeElement?.classList.contains('pds-multiselect__search-input'),
      );

      const panelOpen = () =>
        page.evaluate(() => !!document.querySelector('pds-multiselect')!.shadowRoot!.querySelector('.pds-multiselect__panel'));

      await pressEscape(page);
      expect(await panelOpen()).toBe(false);
      expect(await modal.getProperty('open')).toBe(true);
      expect(
        await page.evaluate(() =>
          document.querySelector('pds-multiselect')!.shadowRoot!.activeElement?.classList.contains('pds-multiselect__trigger'),
        ),
      ).toBe(true);

      await pressEscape(page);
      expect(await modal.getProperty('open')).toBe(false);
    });

    it('keeps both nested modals open while a combobox in the inner one closes', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="outer">
          <pds-modal-content>
            <pds-modal component-id="inner">
              <pds-modal-content>
                <pds-combobox component-id="nested-actions" label="Action" trigger="button" mode="select-only"
                  panel-search dropdown-mount="body"></pds-combobox>
              </pds-modal-content>
            </pds-modal>
          </pds-modal-content>
        </pds-modal>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }, options) => {
        el.options = options;
      }, actions);
      const outer = await page.find('pds-modal[component-id="outer"]');
      const inner = await page.find('pds-modal[component-id="inner"]');
      await outer.callMethod('showModal');
      await page.waitForChanges();
      await inner.callMethod('showModal');
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();

      await pressEscape(page);
      expect(await inner.getProperty('open')).toBe(true);
      expect(await outer.getProperty('open')).toBe(true);

      await pressEscape(page);
      expect(await inner.getProperty('open')).toBe(false);
      expect(await outer.getProperty('open')).toBe(true);
    });

    it('still closes on Escape from a focused control that leaves it alone', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="plain">
          <pds-modal-content><button id="inside">Inside</button></pds-modal-content>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      await page.evaluate(() => (document.getElementById('inside') as HTMLElement).focus());

      await pressEscape(page);
      expect(await modal.getProperty('open')).toBe(false);
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

  describe('focus trap', () => {
    const activeId = (page) => page.evaluate(() => document.activeElement?.id);
    // showModal() lists the focusable elements and moves focus 100ms after opening.
    const settle = () => new Promise((resolve) => setTimeout(resolve, 150));

    it('skips elements inside a hidden ancestor', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <span hidden><pds-button id="back">Back</pds-button></span>
          <input id="first" aria-label="Search">
          <a id="last" href="#last">Last</a>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();
      expect(await activeId(page)).toBe('first');

      await page.evaluate(() => (document.getElementById('last') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('first');

      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
      expect(await activeId(page)).toBe('last');
    });

    it('wraps around elements added after opening', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <button id="original-last">Original last</button>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => {
        const late = document.createElement('button');
        late.id = 'late';
        late.textContent = 'Late';
        document.getElementById('original-last').after(late);
        (document.getElementById('original-last') as HTMLElement).focus();
      });
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('late');

      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('first');
    });

    const shiftTab = async (page) => {
      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
    };

    it('wraps from and to controls inside shadow roots', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <pds-combobox id="tags" component-id="tags" label="Tags"><option value="a">A</option></pds-combobox>
          <button id="middle">Middle</button>
          <pds-textarea id="notes" component-id="notes" label="Notes"></pds-textarea>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();
      expect(await activeId(page)).toBe('tags');

      await page.evaluate(() => (document.getElementById('notes') as HTMLPdsTextareaElement).setFocus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('tags');

      await shiftTab(page);
      expect(await activeId(page)).toBe('notes');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('wraps from and to a contenteditable region', async () => {
      const page = await newE2EPage();
      // An editing host reports tabIndex -1 but is still a Tab stop.
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <div id="notes" contenteditable aria-label="Notes"><p contenteditable="true">Draft</p></div>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();
      expect(await activeId(page)).toBe('first');

      await shiftTab(page);
      expect(await activeId(page)).toBe('notes');

      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('first');
    });

    it('finds controls in any open shadow root, in slot order', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <x-pair><button id="slotted">Slotted</button></x-pair>
        </pds-modal>
      `);
      await page.evaluate(() => {
        customElements.define('x-pair', class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot><button id="inner">Inner</button>';
          }
        });
      });
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();
      const deepId = () =>
        page.evaluate(() => {
          let active = document.activeElement;
          while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
          return active?.id;
        });
      expect(await deepId()).toBe('slotted');

      await page.keyboard.press('Tab');
      expect(await deepId()).toBe('inner');

      await page.keyboard.press('Tab');
      expect(await deepId()).toBe('slotted');

      await shiftTab(page);
      expect(await deepId()).toBe('inner');
    });

    it('treats a radio group as one stop, at its checked radio', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <input type="radio" name="size" id="small" value="s" aria-label="Small" checked>
          <input type="radio" name="size" id="medium" value="m" aria-label="Medium">
          <input type="radio" name="size" id="large" value="l" aria-label="Large">
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('small') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('first');

      await shiftTab(page);
      expect(await activeId(page)).toBe('small');
    });

    it('skips controls inside inert content and disabled fieldsets', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <button id="last">Last</button>
          <div inert><button>Inert</button></div>
          <fieldset disabled><button>Disabled</button></fieldset>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('last') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('first');

      await shiftTab(page);
      expect(await activeId(page)).toBe('last');
    });

    it('leaves Tab to a modal opened above it', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="parent">
          <button id="parent-first">Parent first</button>
        </pds-modal>
      `);
      // Added after the parent, so the parent's document keydown listener runs first.
      await page.evaluate(() => {
        const child = document.createElement('pds-modal');
        child.componentId = 'child';
        child.innerHTML = '<button id="child-first">Child first</button><button id="child-last">Child last</button>';
        document.getElementById('parent-first').after(child);
      });
      await page.waitForChanges();
      const [parent, child] = await page.findAll('pds-modal');
      await parent.callMethod('showModal');
      await settle();
      await child.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('child-last') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('child-first');

      await shiftTab(page);
      expect(await activeId(page)).toBe('child-last');
    });

    const deepActiveId = (page) =>
      page.evaluate(() => {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
        return active?.id;
      });

    const defineShadow = (page, tag: string, html: string) =>
      page.evaluate(
        (name, markup) => {
          customElements.define(
            name,
            class extends HTMLElement {
              constructor() {
                super();
                this.attachShadow({ mode: 'open' }).innerHTML = markup;
              }
            },
          );
        },
        tag,
        html,
      );

    it('wraps from a focused node inside a listed host', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <x-box tabindex="0" aria-label="Box"></x-box>
        </pds-modal>
      `);
      await defineShadow(page, 'x-box', '<div id="inner" tabindex="-1">Inner</div>');
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.querySelector('x-box').shadowRoot.getElementById('inner') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await deepActiveId(page)).toBe('first');
    });

    it('keeps same-named radios in separate shadow roots as separate groups', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <x-radios id="one"></x-radios>
          <x-radios id="two"></x-radios>
        </pds-modal>
      `);
      await defineShadow(
        page,
        'x-radios',
        '<input type="radio" name="choice" aria-label="A" checked><input type="radio" name="choice" aria-label="B">',
      );
      await page.evaluate(() => {
        document.getElementById('one').shadowRoot.querySelector('input').id = 'one-a';
        document.getElementById('two').shadowRoot.querySelector('input').id = 'two-a';
      });
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('two').shadowRoot.getElementById('two-a') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await deepActiveId(page)).toBe('first');

      await shiftTab(page);
      expect(await deepActiveId(page)).toBe('two-a');
    });

    it('still traps Tab when focus is in a non-modal dialog inside it', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="outer">
          <button id="outer-first">Outer first</button>
          <pds-modal component-id="inner" disable-top-layer="true">
            <button id="inner-last">Inner last</button>
          </pds-modal>
        </pds-modal>
      `);
      const [outer, inner] = await page.findAll('pds-modal');
      await outer.callMethod('showModal');
      await settle();
      await inner.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('inner-last') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('outer-first');
    });

    it('lets Shift+Tab move from a control inside a listed host back to that host', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <x-wrap id="wrap" tabindex="0" aria-label="Wrap"></x-wrap>
          <button id="last">Last</button>
        </pds-modal>
      `);
      await defineShadow(page, 'x-wrap', '<button id="inner">Inner</button>');
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => (document.getElementById('wrap').shadowRoot.getElementById('inner') as HTMLElement).focus());
      await shiftTab(page);
      expect(await deepActiveId(page)).toBe('wrap');
    });

    it('leaves Tab to a modal above it when focus is in a non-modal dialog inside that modal', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="outer">
          <button id="outer-first">Outer first</button>
        </pds-modal>
      `);
      // Added after the outer modal, so its document keydown listener runs first.
      await page.evaluate(() => {
        const middle = document.createElement('pds-modal');
        middle.componentId = 'middle';
        middle.innerHTML =
          '<button id="middle-first">Middle first</button>' +
          '<pds-modal component-id="inner" disable-top-layer="true"><button id="inner-last">Inner last</button></pds-modal>';
        document.getElementById('outer-first').after(middle);
      });
      await page.waitForChanges();
      const [outer, middle, inner] = await page.findAll('pds-modal');
      for (const modal of [outer, middle, inner]) {
        await modal.callMethod('showModal');
        await settle();
      }

      await page.evaluate(() => (document.getElementById('inner-last') as HTMLElement).focus());
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('middle-first');
    });

    it('leaves Tab to a control inside that already moved focus', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-modal component-id="test">
          <button id="first">First</button>
          <button id="last">Last</button>
        </pds-modal>
      `);
      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await settle();

      await page.evaluate(() => {
        const last = document.getElementById('last');
        last.addEventListener('keydown', (event) => event.key === 'Tab' && event.preventDefault());
        last.focus();
      });
      await page.keyboard.press('Tab');
      expect(await activeId(page)).toBe('last');
    });
  });

  describe('disableInitialFocus', () => {
    it('restores focus to the previously focused element', async () => {
      const page = await newE2EPage();
      // disable-top-layer: a true modal dialog makes the rest of the page
      // inert, which would itself block focus from moving back outside it —
      // not what this test is after.
      await page.setContent(`
        <button id="trigger">Trigger</button>
        <pds-modal component-id="test" disable-top-layer="true" disable-initial-focus="true"><button id="first">First</button></pds-modal>
      `);
      await page.waitForChanges();
      const modal = await page.find('pds-modal');

      await page.evaluate(() => (document.getElementById('trigger') as HTMLElement)?.focus());

      await modal.setProperty('open', true);
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      const activeId = await page.evaluate(() => document.activeElement?.id);
      expect(activeId).toBe('trigger');
    });

    // Regression: when nothing was focused before opening, previousActiveElement
    // is <body>. body.focus() is a no-op, so the old code left focus wherever
    // the native dialog focusing steps had already put it — inside the dialog,
    // defeating disableInitialFocus. It should end up nowhere (body) instead.
    it('blurs focus when nothing was focused before opening', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-modal component-id="test" disable-initial-focus="true"><button id="first">First</button></pds-modal>`);
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

      const modal = await page.find('pds-modal');
      await modal.callMethod('showModal');
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      const activeTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeTag).toBe('BODY');
    });

    // Regression: disableInitialFocus exists for a drawer that can open in
    // the background while the user is mid-task elsewhere on the page — if
    // they focus something of their own before the deferred correction above
    // runs, it must not steal that focus back.
    it('does not steal focus from somewhere the user moved to during the deferred window', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <button id="trigger">Trigger</button>
        <input id="elsewhere" />
        <pds-modal component-id="test" disable-top-layer="true" disable-initial-focus="true"><button id="first">First</button></pds-modal>
      `);
      await page.waitForChanges();
      const modal = await page.find('pds-modal');

      await page.evaluate(() => (document.getElementById('trigger') as HTMLElement)?.focus());

      await modal.setProperty('open', true);
      await page.waitForChanges();

      // Simulate the user clicking into something of their own, elsewhere on
      // the page, before the component's own 100ms deferred correction fires.
      await page.evaluate(() => (document.getElementById('elsewhere') as HTMLElement)?.focus());

      await new Promise((resolve) => setTimeout(resolve, 150));

      const activeId = await page.evaluate(() => document.activeElement?.id);
      expect(activeId).toBe('elsewhere');
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
