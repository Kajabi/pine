import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-drawer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-drawer component-id="test"><div>Content</div></pds-drawer>`);

    const drawer = await page.find('pds-drawer');
    expect(drawer).toHaveClass('hydrated');
  });

  it('opens the inner dialog when open is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-drawer component-id="test"><div>Content</div></pds-drawer>`);

    const drawer = await page.find('pds-drawer');
    drawer.setProperty('open', true);
    await page.waitForChanges();

    const dialog = await page.find('pds-drawer pds-modal dialog');
    expect(await dialog.getProperty('open')).toBe(true);
  });

  it('opens the inner dialog when open is already set on initial render', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-drawer component-id="test" open><div>Content</div></pds-drawer>`);
    await page.waitForChanges();

    const dialog = await page.find('pds-drawer pds-modal dialog');
    expect(await dialog.getProperty('open')).toBe(true);
  });

  it('opens as non-modal — not in the top layer, aria-modal false', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-drawer component-id="test"><div>Content</div></pds-drawer>`);

    const drawer = await page.find('pds-drawer');
    drawer.setProperty('open', true);
    await page.waitForChanges();

    const state = await page.evaluate(() => {
      const dialog = document.querySelector('pds-drawer pds-modal dialog') as HTMLDialogElement;
      return { isModal: dialog.matches(':modal'), ariaModal: dialog.getAttribute('aria-modal') };
    });
    expect(state.isModal).toBe(false);
    expect(state.ariaModal).toBe('false');
  });

  describe('side', () => {
    it('docks to the inline-end edge by default', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" open><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const justifyContent = await page.evaluate(() => {
        const backdrop = document.querySelector('pds-drawer pds-modal .pds-modal__backdrop') as HTMLElement;
        return getComputedStyle(backdrop).justifyContent;
      });
      expect(justifyContent).toBe('flex-end');
    });

    it('docks to the inline-start edge when side is start', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" side="start" open><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const justifyContent = await page.evaluate(() => {
        const backdrop = document.querySelector('pds-drawer pds-modal .pds-modal__backdrop') as HTMLElement;
        return getComputedStyle(backdrop).justifyContent;
      });
      expect(justifyContent).toBe('flex-start');
    });
  });

  describe('size', () => {
    it('uses the sm width', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" size="sm" open><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const width = await page.evaluate(() => {
        const panel = document.querySelector('pds-drawer pds-modal .pds-modal') as HTMLElement;
        return getComputedStyle(panel).width;
      });
      expect(width).toBe('360px');
    });

    it('uses the md width by default', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" open><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const width = await page.evaluate(() => {
        const panel = document.querySelector('pds-drawer pds-modal .pds-modal') as HTMLElement;
        return getComputedStyle(panel).width;
      });
      expect(width).toBe('500px');
    });
  });

  it('leaves the page interactive — the backdrop does not intercept clicks outside the panel', async () => {
    // Mirrors pds-modal's own "lets a higher z-index overlay paint above the
    // non-modal dialog" check: a non-blocking area is proven by hit-testing,
    // not by a click actually landing (jsdom/Puppeteer click() dispatches a
    // trusted click regardless of what visually overlaps it).
    const page = await newE2EPage();
    await page.setContent(`
      <button id="page-button" style="position:fixed;top:0;left:0;width:50px;height:50px;">Page button</button>
      <pds-drawer component-id="test" open><div>Content</div></pds-drawer>
    `);
    await page.waitForChanges();

    const hitsPageButton = await page.evaluate(() => {
      const button = document.getElementById('page-button');
      return document.elementFromPoint(10, 10) === button;
    });
    expect(hitsPageButton).toBe(true);
  });

  describe('lightDismiss', () => {
    it('does not steal focus from a page field the user just clicked', async () => {
      // Regression: hideModal() runs on the next frame under Stencil's async
      // task queue, by which point the browser has already focused whatever
      // the user's click landed on. Restoring previousActiveElement there
      // would pull focus back to the (now closed) drawer's opener instead of
      // leaving it on the field the user actually clicked.
      const page = await newE2EPage();
      await page.setContent(`
        <button id="trigger">Open</button>
        <input id="page-input" />
        <pds-drawer component-id="test"><button id="inside">Inside</button></pds-drawer>
      `);

      await page.evaluate(() => (document.getElementById('trigger') as HTMLElement)?.focus());
      const drawer = await page.find('pds-drawer');
      drawer.setProperty('open', true);
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pageInput = await page.find('#page-input');
      await pageInput.click();
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(await drawer.getProperty('open')).toBe(false);
      const activeId = await page.evaluate(() => document.activeElement?.id);
      expect(activeId).toBe('page-input');
    });

    it('closes on a pointerdown outside the drawer by default', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <button id="page-button">Page button</button>
        <pds-drawer component-id="test" open><div>Content</div></pds-drawer>
      `);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      expect(await drawer.getProperty('open')).toBe(true);

      const pageButton = await page.find('#page-button');
      await pageButton.click();
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(false);
    });

    it('does not close on an outside pointerdown when lightDismiss is false', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <button id="page-button">Page button</button>
        <pds-drawer component-id="test" open light-dismiss="false"><div>Content</div></pds-drawer>
      `);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      const pageButton = await page.find('#page-button');
      await pageButton.click();
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
    });

    it('does not close on a pointerdown inside the drawer', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="test" open><button id="inside">Inside</button></pds-drawer>
      `);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      const inside = await page.find('#inside');
      await inside.click();
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
    });

    it('does not close on a pointerdown inside a popover opened from within the drawer', async () => {
      // Regression: pds-popover portals its content to document.body, so a
      // plain `this.el.contains()` check sees it as "outside" even though it
      // belongs to an overlay the drawer's own content opened.
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="test" open>
          <pds-popover component-id="inner-popover">
            <button slot="trigger">Open popover</button>
            <p id="popover-text">Popover content</p>
          </pds-popover>
        </pds-drawer>
      `);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      const trigger = await page.find('pds-drawer button[slot="trigger"]');
      await trigger.click();
      await page.waitForChanges();

      const portaledText = await page.find('#inner-popover-portal #popover-text');
      await portaledText.click();
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
    });
  });

  describe('nested pds-modal', () => {
    it('does not close when a nested pds-modal (e.g. a confirm dialog) opens and closes', async () => {
      // Regression: pdsModalOpen/pdsModalClose bubble, so a confirm dialog
      // rendered inside the drawer's own content would otherwise trigger the
      // drawer's own open/close handlers too.
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="test" open>
          <pds-modal component-id="confirm">
            <button id="confirm-trigger">Open confirm</button>
          </pds-modal>
        </pds-drawer>
      `);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      const closeSpy = await drawer.spyOnEvent('pdsDrawerClose');
      const openSpy = await drawer.spyOnEvent('pdsDrawerOpen');

      const confirm = await page.find('pds-modal[component-id="confirm"]');
      await confirm.callMethod('showModal');
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(await drawer.getProperty('open')).toBe(true);
      expect(closeSpy).toHaveReceivedEventTimes(0);
      expect(openSpy).toHaveReceivedEventTimes(0);

      await confirm.callMethod('hideModal');
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
      expect(closeSpy).toHaveReceivedEventTimes(0);
    });
  });

  describe('Escape', () => {
    it('closes the drawer by default', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" open><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(false);
    });

    it('does not close the drawer when lightDismiss is false', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" open light-dismiss="false"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
    });
  });

  describe('initialFocus', () => {
    it('moves focus into the drawer by default', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="test"><button id="first">First</button></pds-drawer>
      `);
      const drawer = await page.find('pds-drawer');
      drawer.setProperty('open', true);
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      const activeId = await page.evaluate(() => document.activeElement?.id);
      expect(activeId).toBe('first');
    });

    it('does not move focus when set to none', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <button id="trigger">Trigger</button>
        <pds-drawer component-id="test" initial-focus="none"><button id="first">First</button></pds-drawer>
      `);
      await page.evaluate(() => (document.getElementById('trigger') as HTMLElement)?.focus());

      const drawer = await page.find('pds-drawer');
      drawer.setProperty('open', true);
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));

      const activeId = await page.evaluate(() => document.activeElement?.id);
      expect(activeId).toBe('trigger');
    });
  });

  describe('events', () => {
    it('emits pdsDrawerOpen and pdsDrawerClose', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test"><div>Content</div></pds-drawer>`);

      const drawer = await page.find('pds-drawer');
      const openSpy = await drawer.spyOnEvent('pdsDrawerOpen');
      const closeSpy = await drawer.spyOnEvent('pdsDrawerClose');

      drawer.setProperty('open', true);
      await page.waitForChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(openSpy).toHaveReceivedEvent();

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(closeSpy).toHaveReceivedEvent();
    });
  });

  describe('layout', () => {
    // Regression: .pds-drawer__header/__footer and .pds-drawer-content all
    // combine width:100% with padding — without box-sizing:border-box, the
    // padding adds on top of 100%, overflowing the panel's own edge instead
    // of being measured inside it.
    it('keeps header, content and footer within the panel width — no padding overflow', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="layout-drawer" open>
          <pds-drawer-header><pds-text tag="h2">Drawer heading</pds-text></pds-drawer-header>
          <pds-drawer-content><p>Drawer body content.</p></pds-drawer-content>
          <pds-drawer-footer><pds-button variant="primary">Save</pds-button></pds-drawer-footer>
        </pds-drawer>
      `);
      await page.waitForChanges();

      const widths = await page.evaluate(() => {
        const panel = document.querySelector('pds-drawer pds-modal .pds-modal') as HTMLElement;
        const header = document.querySelector('pds-drawer .pds-drawer__header') as HTMLElement;
        const content = document.querySelector('pds-drawer .pds-drawer-content') as HTMLElement;
        const footer = document.querySelector('pds-drawer .pds-drawer__footer') as HTMLElement;
        return {
          panel: panel.getBoundingClientRect().width,
          header: header.getBoundingClientRect().width,
          content: content.getBoundingClientRect().width,
          footer: footer.getBoundingClientRect().width,
        };
      });

      expect(widths.header).toBeLessThanOrEqual(widths.panel);
      expect(widths.content).toBeLessThanOrEqual(widths.panel);
      expect(widths.footer).toBeLessThanOrEqual(widths.panel);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations when open with header, content and footer', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-drawer component-id="a11y-drawer" open>
          <pds-drawer-header><pds-text tag="h2">Drawer heading</pds-text></pds-drawer-header>
          <pds-drawer-content><p>Drawer body content.</p></pds-drawer-content>
          <pds-drawer-footer><pds-button variant="primary">Save</pds-button></pds-drawer-footer>
        </pds-drawer>
      `);
      await page.waitForChanges();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('has no axe violations with the resize handle present', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-drawer component-id="a11y-resizable-drawer" open resizable>
          <pds-drawer-content><p>Drawer body content.</p></pds-drawer-content>
        </pds-drawer>
      `);
      await page.waitForChanges();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('resizable', () => {
    async function getPanelWidth(page) {
      return page.evaluate(() => {
        const panel = document.querySelector('pds-drawer pds-modal .pds-modal') as HTMLElement;
        return getComputedStyle(panel).width;
      });
    }

    async function getHandleCenter(page) {
      return page.evaluate(() => {
        const handle = document.querySelector('pds-drawer .pds-drawer__handle') as HTMLElement;
        const rect = handle.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    }

    async function dragHandleBy(page, deltaX: number) {
      const { x, y } = await getHandleCenter(page);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + deltaX, y, { steps: 10 });
      await page.mouse.up();
    }

    it('renders no handle and leaves the width unchanged when resizable is false', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-drawer component-id="test" open size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const handle = await page.find('pds-drawer .pds-drawer__handle');
      expect(handle).toBeNull();
      expect(await getPanelWidth(page)).toBe('500px');
    });

    it('widens the panel when the handle is dragged toward the page (side=end)', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('500px');
      // side="end" docks the panel to the physical right edge in LTR; the
      // handle sits on its left (page-facing) edge, so dragging left widens it.
      await dragHandleBy(page, -80);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('580px');
    });

    it('widens the panel when the handle is dragged toward the page (side=start)', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="start" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      // side="start" docks the panel to the physical left edge in LTR; the
      // handle sits on its right (page-facing) edge, so dragging right widens it.
      await dragHandleBy(page, 80);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('580px');
    });

    describe('RTL', () => {
      it('widens the panel when dragged toward the page (side=end, dir=rtl)', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`
          <div dir="rtl">
            <pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>
          </div>
        `);
        await page.waitForChanges();

        expect(await getPanelWidth(page)).toBe('500px');
        // side="end" is the inline-end edge, which is physically LEFT under
        // RTL — the handle sits on the panel's right (page-facing) edge, so
        // dragging right widens it (the mirror image of the LTR case above).
        await dragHandleBy(page, 80);
        await page.waitForChanges();

        expect(await getPanelWidth(page)).toBe('580px');
      });

      it('widens the panel when dragged toward the page (side=start, dir=rtl)', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`
          <div dir="rtl">
            <pds-drawer component-id="test" open resizable side="start" size="md"><div>Content</div></pds-drawer>
          </div>
        `);
        await page.waitForChanges();

        // side="start" is the inline-start edge, physically RIGHT under RTL
        // — the handle sits on the panel's left (page-facing) edge, so
        // dragging left widens it.
        await dragHandleBy(page, -80);
        await page.waitForChanges();

        expect(await getPanelWidth(page)).toBe('580px');
      });
    });

    it('clamps a drag past maxWidth', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(
        `<pds-drawer component-id="test" open resizable side="end" size="md" max-width="550"><div>Content</div></pds-drawer>`,
      );
      await page.waitForChanges();

      await dragHandleBy(page, -400);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('550px');
    });

    // Regression: the rendered CSS clamp() falls back to 280/720 for any
    // bound not reflected as a custom property. A maxWidth inside that range
    // (550, above) wouldn't have caught the bug — this one (900) is outside
    // it, so it only passes once --pds-drawer-max-width is actually set.
    it('honors a maxWidth outside the clamp()s hardcoded 280/720 fallback range', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(
        `<pds-drawer component-id="test" open resizable side="end" size="md" max-width="900"><div>Content</div></pds-drawer>`,
      );
      await page.waitForChanges();

      await dragHandleBy(page, -1000);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('900px');
    });

    it('honors a minWidth outside the clamp()s hardcoded 280/720 fallback range', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(
        `<pds-drawer component-id="test" open resizable side="end" size="md" min-width="150"><div>Content</div></pds-drawer>`,
      );
      await page.waitForChanges();

      await dragHandleBy(page, 1000);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('150px');
    });

    it('Escape cancels an in-progress drag and reverts to the pre-drag width', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const { x, y } = await getHandleCenter(page);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x - 80, y, { steps: 10 });
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('580px');

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('500px');

      // Pointer capture was released by the cancel — releasing the mouse now
      // shouldn't commit anything (no further pointermove/pointerup effect).
      await page.mouse.up();
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('500px');
    });

    it('does not let Escape also close the drawer while cancelling a drag', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const { x, y } = await getHandleCenter(page);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x - 80, y, { steps: 10 });
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await drawer.getProperty('open')).toBe(true);
      await page.mouse.up();
    });

    it('reverts to the pre-drag width on pointercancel', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const { x, y } = await getHandleCenter(page);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x - 80, y, { steps: 10 });
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('580px');

      await page.evaluate(() => {
        const handle = document.querySelector('pds-drawer .pds-drawer__handle') as HTMLElement;
        handle.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1, bubbles: true }));
      });
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('500px');
      await page.mouse.up();
    });

    it('clamps a drag past minWidth', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(
        `<pds-drawer component-id="test" open resizable side="end" size="md" min-width="420"><div>Content</div></pds-drawer>`,
      );
      await page.waitForChanges();

      await dragHandleBy(page, 400);
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('420px');
    });

    it('emits pdsDrawerResize during the drag and pdsDrawerResizeEnd once on release', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable side="end" size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      const resizeSpy = await drawer.spyOnEvent('pdsDrawerResize');
      const resizeEndSpy = await drawer.spyOnEvent('pdsDrawerResizeEnd');

      await dragHandleBy(page, -60);
      await page.waitForChanges();

      expect(resizeSpy.length).toBeGreaterThan(0);
      expect(resizeEndSpy).toHaveReceivedEventTimes(1);
      expect(resizeEndSpy.firstEvent.detail).toEqual({ width: 560 });
    });

    describe('keyboard (Window Splitter pattern)', () => {
      it('ArrowRight widens by a step and ArrowLeft narrows by a step', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
        await page.waitForChanges();

        const handle = await page.find('pds-drawer .pds-drawer__handle');
        await handle.focus();
        await page.keyboard.press('ArrowRight');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('516px');

        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('484px');
      });

      it('Shift+ArrowRight widens by the larger step', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
        await page.waitForChanges();

        const handle = await page.find('pds-drawer .pds-drawer__handle');
        await handle.focus();
        await page.keyboard.down('Shift');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.up('Shift');
        await page.waitForChanges();

        expect(await getPanelWidth(page)).toBe('564px');
      });

      it('Home jumps to minWidth and End jumps to maxWidth', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
        await page.waitForChanges();

        const handle = await page.find('pds-drawer .pds-drawer__handle');
        await handle.focus();

        await page.keyboard.press('Home');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('360px');

        await page.keyboard.press('End');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('720px');
      });

      it('Enter toggles between minWidth and the last committed width', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
        await page.waitForChanges();

        const handle = await page.find('pds-drawer .pds-drawer__handle');
        await handle.focus();
        await page.keyboard.press('ArrowRight');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('516px');

        await page.keyboard.press('Enter');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('360px');

        await page.keyboard.press('Enter');
        await page.waitForChanges();
        expect(await getPanelWidth(page)).toBe('516px');
      });

      it('keeps aria-valuenow in sync with the current width', async () => {
        const page = await newE2EPage();
        page.setViewport({ width: 1200, height: 800 });
        await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
        await page.waitForChanges();

        const handle = await page.find('pds-drawer .pds-drawer__handle');
        await handle.focus();
        await page.keyboard.press('End');
        await page.waitForChanges();

        expect(handle.getAttribute('aria-valuenow')).toBe('720');
      });
    });

    it('resets to the size scale width on size change until manually resized', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const drawer = await page.find('pds-drawer');
      drawer.setProperty('size', 'sm');
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('360px');

      // Once the user has resized, further `size` prop changes don't reset
      // the width back to the new size's default. Drag to 480 — the top of
      // sm's own bounds, but also inside md's (360-720) — so switching back
      // to md exercises only "size doesn't fight a manual resize," not the
      // separate, correct behavior of bounds re-clamping a width that falls
      // outside the new size's range (covered below).
      await dragHandleBy(page, -120);
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('480px');

      drawer.setProperty('size', 'md');
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('480px');
    });

    // Bounds track the current size when minWidth/maxWidth aren't pinned
    // (per the ticket: "Drag bounds, defaulted from the size scale") — that
    // applies even to a manually-set width, so switching to a size whose
    // bounds no longer contain it re-clamps the rendered width AND the
    // component's own state (aria-valuenow), not just the CSS clamp().
    it('re-clamps a manually-resized width that falls outside the new size default bounds', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable size="sm"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      // sm's bounds are 280-480; drag to 310, valid under sm but below md's
      // min of 360.
      await dragHandleBy(page, 50);
      await page.waitForChanges();
      expect(await getPanelWidth(page)).toBe('310px');

      const drawer = await page.find('pds-drawer');
      const handle = await page.find('pds-drawer .pds-drawer__handle');
      drawer.setProperty('size', 'md');
      await page.waitForChanges();

      expect(await getPanelWidth(page)).toBe('360px');
      expect(handle.getAttribute('aria-valuenow')).toBe('360');
    });

    it('hides the handle below the mobile (md, 768px) breakpoint', async () => {
      const page = await newE2EPage();
      page.setViewport({ width: 500, height: 800 });
      await page.setContent(`<pds-drawer component-id="test" open resizable size="md"><div>Content</div></pds-drawer>`);
      await page.waitForChanges();

      const display = await page.evaluate(() => {
        const handle = document.querySelector('pds-drawer .pds-drawer__handle') as HTMLElement;
        return getComputedStyle(handle).display;
      });
      expect(display).toBe('none');
    });
  });
});
