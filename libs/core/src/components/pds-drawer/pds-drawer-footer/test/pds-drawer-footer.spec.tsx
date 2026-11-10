import { newSpecPage } from '@stencil/core/testing';
import { PdsDrawerFooter } from '../pds-drawer-footer';
import { expectReconnectSafe } from '../../../../utils/test/reconnect-safety';

describe('pds-drawer-footer', () => {
  it('renders the slotted content inside a footer wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsDrawerFooter],
      html: `<pds-drawer-footer>Actions</pds-drawer-footer>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-drawer-footer>
        <footer class="pds-drawer__footer">Actions</footer>
      </pds-drawer-footer>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale footer inside the fresh one.
    it('does not nest a second footer', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerFooter],
        html: `
          <pds-drawer-footer>
            <footer class="pds-drawer__footer">Actions</footer>
          </pds-drawer-footer>
        `,
      });

      expect(page.root?.querySelectorAll('footer').length).toBe(1);
      expect(page.root?.querySelector('footer')?.textContent?.trim()).toBe('Actions');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerFooter],
        html: `<pds-drawer-footer>Actions</pds-drawer-footer>`,
      });

      expect(page.root?.querySelectorAll('footer').length).toBe(1);
      expect(page.root?.querySelector('footer')?.textContent?.trim()).toBe('Actions');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe([PdsDrawerFooter], `<pds-drawer-footer>Actions</pds-drawer-footer>`);
    });
  });
});
