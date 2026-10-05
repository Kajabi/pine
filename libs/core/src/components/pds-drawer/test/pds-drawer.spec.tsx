import { newSpecPage } from '@stencil/core/testing';
import { PdsDrawer } from '../pds-drawer';
import { PdsModal } from '../../pds-modal/pds-modal';

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
});
