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

  it('gives the inner pds-modal an id for the resize handle to control', async () => {
    const page = await newSpecPage({
      components: [PdsDrawer, PdsModal],
      html: `<pds-drawer component-id="forward-test"></pds-drawer>`,
    });

    const modal = page.root?.querySelector('pds-modal') as HTMLPdsModalElement;
    expect(modal.id).toBe('forward-test-panel');
  });

  describe('resizable', () => {
    it('defaults to false and renders no handle', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test"></pds-drawer>`,
      });

      expect(page.rootInstance.resizable).toBe(false);
      expect(page.root?.querySelector('.pds-drawer__handle')).toBeNull();
      expect(page.root).not.toHaveClass('pds-drawer--resizable');
    });

    it('renders a Window Splitter handle when true, defaulted from the size scale', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md"></pds-drawer>`,
      });

      expect(page.root).toHaveClass('pds-drawer--resizable');
      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle).not.toBeNull();
      expect(handle?.getAttribute('role')).toBe('separator');
      expect(handle?.getAttribute('aria-orientation')).toBe('vertical');
      expect(handle?.getAttribute('aria-valuenow')).toBe('500');
      expect(handle?.getAttribute('aria-valuemin')).toBe('360');
      expect(handle?.getAttribute('aria-valuemax')).toBe('720');
      expect(handle?.getAttribute('aria-controls')).toBe('test-panel');
      expect(handle?.getAttribute('aria-label')).toBe('Resize drawer');
      expect(handle?.getAttribute('tabindex')).toBe('0');
    });

    it('uses the sm size scale for its initial width and default bounds', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="sm"></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-valuenow')).toBe('360');
      expect(handle?.getAttribute('aria-valuemin')).toBe('280');
      expect(handle?.getAttribute('aria-valuemax')).toBe('480');
    });

    it('honors explicit minWidth/maxWidth over the size scale defaults', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md" min-width="320" max-width="640"></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-valuemin')).toBe('320');
      expect(handle?.getAttribute('aria-valuemax')).toBe('640');
    });

    // Regression: Stencil coerces a number prop's attribute string via
    // Number(), so a non-numeric min-width/max-width attribute yields NaN
    // rather than undefined — falls back to the size scale instead of
    // poisoning the CSS custom property / aria-valuemin / aria-valuemax.
    it('falls back to the size scale when minWidth/maxWidth are non-numeric', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md" min-width="abc" max-width="xyz"></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-valuemin')).toBe('360');
      expect(handle?.getAttribute('aria-valuemax')).toBe('720');
      expect((page.root as HTMLElement).style.getPropertyValue('--pds-drawer-min-width')).toBe('360px');
      expect((page.root as HTMLElement).style.getPropertyValue('--pds-drawer-max-width')).toBe('720px');
    });

    it('uses a custom resizeHandleLabel when provided', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable resize-handle-label="Resize panel"></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-label')).toBe('Resize panel');
    });

    // Regression: the CSS clamp() driving the rendered width reads
    // --pds-drawer-min-width/-max-width — a prior version only ever set
    // --pds-drawer-width, so minWidth/maxWidth drove the JS-side clamp and
    // aria-valuemin/-valuemax but never the actual visible width.
    it('reflects effective minWidth/maxWidth as CSS custom properties on the host', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md" min-width="320" max-width="640"></pds-drawer>`,
      });

      const style = (page.root as HTMLElement).style;
      expect(style.getPropertyValue('--pds-drawer-min-width')).toBe('320px');
      expect(style.getPropertyValue('--pds-drawer-max-width')).toBe('640px');
    });

    it('reflects the size-scale default bounds as CSS custom properties when minWidth/maxWidth are unset', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md"></pds-drawer>`,
      });

      const style = (page.root as HTMLElement).style;
      expect(style.getPropertyValue('--pds-drawer-min-width')).toBe('360px');
      expect(style.getPropertyValue('--pds-drawer-max-width')).toBe('720px');
    });

    // Regression: the initial width came straight from the size scale with
    // no clamp, so a maxWidth narrower than the size default produced an
    // invalid ARIA state (aria-valuenow > aria-valuemax) until the first
    // interaction.
    it('clamps the initial width against an explicit maxWidth narrower than the size default', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="md" max-width="400"></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-valuenow')).toBe('400');
    });

    it('clamps the width after a size change against an explicit maxWidth narrower than the new default', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable size="sm" max-width="400"></pds-drawer>`,
      });

      page.rootInstance.size = 'md';
      await page.waitForChanges();

      const handle = page.root?.querySelector('.pds-drawer__handle');
      expect(handle?.getAttribute('aria-valuenow')).toBe('400');
    });

    it('describes the Enter-to-collapse/restore behavior via aria-describedby', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable></pds-drawer>`,
      });

      const handle = page.root?.querySelector('.pds-drawer__handle');
      const describedById = handle?.getAttribute('aria-describedby');
      expect(describedById).toBe('test-panel-resize-description');

      const description = page.root?.querySelector(`#${describedById}`);
      expect(description).not.toBeNull();
      expect(description).toHaveClass('visually-hidden');
      expect(description?.textContent).toContain('Enter');
    });

    it('uses a custom resizeHandleDescription when provided', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer],
        html: `<pds-drawer component-id="test" resizable resize-handle-description="Custom description"></pds-drawer>`,
      });

      const describedById = page.root?.querySelector('.pds-drawer__handle')?.getAttribute('aria-describedby');
      expect(page.root?.querySelector(`#${describedById}`)?.textContent).toBe('Custom description');
    });
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM — render() always wraps slotted content
    // in a fresh pds-modal, so a stale one from a prior render ends up nested inside it.
    // A stale copy carries `id="test-panel"` — the exact id pds-drawer always
    // assigns the one pds-modal it creates — because that's what a real
    // reconnect snapshot preserves verbatim from the prior render's output.
    // That id is also the signal the unwrap keys on to avoid mistaking a
    // legitimate nested pds-modal (e.g. a confirm dialog) for stale debris —
    // see the "nested pds-modal" describe block in the e2e spec.
    it('does not nest a second pds-modal', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer, PdsModal],
        html: `
          <pds-drawer component-id="test">
            <pds-modal id="test-panel">
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
        components: [PdsDrawer, PdsModal],
        html: `
          <pds-drawer component-id="test">
            <pds-modal id="test-panel">
              <pds-modal id="test-panel">
                <div>Body</div>
              </pds-modal>
            </pds-modal>
          </pds-drawer>
        `,
      });

      expect(page.root?.querySelectorAll('pds-modal').length).toBe(1);
      expect(page.root?.querySelector('pds-modal')?.textContent?.trim()).toBe('Body');
    });

    it('leaves a legitimately nested pds-modal (e.g. a confirm dialog) alone — it does not share our id', async () => {
      const page = await newSpecPage({
        components: [PdsDrawer, PdsModal],
        html: `
          <pds-drawer component-id="test">
            <pds-modal component-id="confirm">
              <div>Confirm body</div>
            </pds-modal>
          </pds-drawer>
        `,
      });

      expect(page.root?.querySelectorAll('pds-modal').length).toBe(2);
      expect(page.root?.querySelector('pds-modal[component-id="confirm"]')?.textContent?.trim()).toBe('Confirm body');
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
