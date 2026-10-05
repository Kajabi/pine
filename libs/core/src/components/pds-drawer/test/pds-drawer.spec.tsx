import { newSpecPage } from '@stencil/core/testing';
import { PdsDrawer } from '../pds-drawer';
import { PdsModal } from '../../pds-modal/pds-modal';
import { expectReconnectSafe } from '../../../utils/test/reconnect-safety';

describe('pds-drawer', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer],
      html: `<pds-drawer component-id="test"><div>Content</div></pds-drawer>`,
    });

    expect(page.root).not.toBeNull();
    expect(page.rootInstance.side).toBe('end');
    expect(page.rootInstance.size).toBe('md');
    expect(page.rootInstance.lightDismiss).toBe(true);
    expect(page.rootInstance.initialFocus).toBe('auto');
    expect(page.rootInstance.open).toBe(false);
  });

  it('reflects side and size as host classes', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer],
      html: `<pds-drawer component-id="test" side="start" size="sm"></pds-drawer>`,
    });

    expect(page.root).toHaveClass('pds-drawer');
    expect(page.root).toHaveClass('pds-drawer--start');
    expect(page.root).toHaveClass('pds-drawer--sm');
    expect(page.root).not.toHaveClass('pds-drawer--end');
  });

  it('forwards componentId, open, scrollable and disableTopLayer to the inner pds-modal', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer, PdsModal],
      html: `<pds-drawer component-id="forward-test" open scrollable="false"></pds-drawer>`,
    });

    const modal = page.root?.querySelector('pds-modal') as HTMLPdsModalElement;
    expect(modal.componentId).toBe('forward-test');
    expect(modal.open).toBe(true);
    expect(modal.scrollable).toBe(false);
    expect(modal.disableTopLayer).toBe(true);
  });

  it('maps lightDismiss onto the inner pds-modal backdropDismiss', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer, PdsModal],
      html: `<pds-drawer component-id="test" light-dismiss="false"></pds-drawer>`,
    });

    const modal = page.root?.querySelector('pds-modal') as HTMLPdsModalElement;
    expect(modal.backdropDismiss).toBe(false);
  });

  it('maps initialFocus="none" onto the inner pds-modal disableInitialFocus', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer, PdsModal],
      html: `<pds-drawer component-id="test" initial-focus="none"></pds-drawer>`,
    });

    const modal = page.root?.querySelector('pds-modal') as HTMLPdsModalElement;
    expect(modal.disableInitialFocus).toBe(true);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM — render() always wraps slotted content
    // in a fresh pds-modal, so a stale one from a prior render ends up nested inside it.
    it('does not nest a second pds-modal', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `
          <pds-drawer component-id="test">
            <pds-modal>
              <div>Body</div>
            </pds-modal>
          </pds-drawer>
        `,
      });

      expect(page.root?.querySelectorAll('pds-modal').length).toBe(1);
      expect(page.root?.querySelector('pds-modal')?.textContent?.trim()).toBe('Body');
    });

    it('drains a doubly-nested pds-modal to a single one with content intact', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `
          <pds-drawer component-id="test">
            <pds-modal>
              <pds-modal>
                <div>Body</div>
              </pds-modal>
            </pds-modal>
          </pds-drawer>
        `,
      });

      expect(page.root?.querySelectorAll('pds-modal').length).toBe(1);
      expect(page.root?.querySelector('pds-modal')?.textContent?.trim()).toBe('Body');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test"><div>Body</div></pds-drawer>`,
      });

      expect(page.root?.querySelectorAll('pds-modal').length).toBe(1);
      expect(page.root?.querySelector('pds-modal')?.textContent?.trim()).toBe('Body');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe(
        [PdsDrawer, PdsModal],
        `<pds-drawer component-id="test"><div>Body</div></pds-drawer>`,
      );
    });
  });
});
