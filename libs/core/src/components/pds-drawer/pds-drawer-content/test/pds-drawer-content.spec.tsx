import { newSpecPage } from '@stencil/core/testing';
import { PdsDrawerContent } from '../pds-drawer-content';
import { expectReconnectSafe } from '../../../../utils/test/reconnect-safety';

describe('pds-drawer-content', () => {
  it('renders the slotted content inside a .pds-drawer-content wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsDrawerContent],
      html: `<pds-drawer-content>Body</pds-drawer-content>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-drawer-content>
        <div class="pds-drawer-content">Body</div>
      </pds-drawer-content>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale .pds-drawer-content inside
    // the fresh one.
    it('does not nest a second .pds-drawer-content', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerContent],
        html: `
          <pds-drawer-content>
            <div class="pds-drawer-content">Body</div>
          </pds-drawer-content>
        `,
      });

      expect(page.root?.querySelectorAll('.pds-drawer-content').length).toBe(1);
      expect(page.root?.querySelector('.pds-drawer-content')?.textContent?.trim()).toBe('Body');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerContent],
        html: `<pds-drawer-content>Body</pds-drawer-content>`,
      });

      expect(page.root?.querySelectorAll('.pds-drawer-content').length).toBe(1);
      expect(page.root?.querySelector('.pds-drawer-content')?.textContent?.trim()).toBe('Body');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe([PdsDrawerContent], `<pds-drawer-content>Body</pds-drawer-content>`);
    });
  });
});
