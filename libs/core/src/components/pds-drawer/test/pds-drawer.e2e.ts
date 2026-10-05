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
  });
});
