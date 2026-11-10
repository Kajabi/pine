import { newSpecPage } from '@stencil/core/testing';
import { PdsDrawerHeader } from '../pds-drawer-header';
import { expectReconnectSafe } from '../../../../utils/test/reconnect-safety';

describe('pds-drawer-header', () => {
  it('renders the slotted content inside a header wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsDrawerHeader],
      html: `<pds-drawer-header>Title</pds-drawer-header>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-drawer-header>
        <header class="pds-drawer__header">Title</header>
      </pds-drawer-header>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale header inside the fresh one.
    it('does not nest a second header', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerHeader],
        html: `
          <pds-drawer-header>
            <header class="pds-drawer__header">Title</header>
          </pds-drawer-header>
        `,
      });

      expect(page.root?.querySelectorAll('header').length).toBe(1);
      expect(page.root?.querySelector('header')?.textContent?.trim()).toBe('Title');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsDrawerHeader],
        html: `<pds-drawer-header>Title</pds-drawer-header>`,
      });

      expect(page.root?.querySelectorAll('header').length).toBe(1);
      expect(page.root?.querySelector('header')?.textContent?.trim()).toBe('Title');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe([PdsDrawerHeader], `<pds-drawer-header>Title</pds-drawer-header>`);
    });
  });
});
