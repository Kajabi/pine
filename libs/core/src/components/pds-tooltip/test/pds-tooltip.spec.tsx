import { newSpecPage } from '@stencil/core/testing';
import { PdsTooltip } from '../pds-tooltip';
import { expectReconnectSafe } from '../../../utils/test/reconnect-safety';

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// floating-ui/dom resolves to a CommonJS module whose exports are configurable,
// so we spy on the required module — the same object the component reads
// `computePosition` from at call time. A jest.mock() factory is not used here:
// the spec runtime does not hoist jest.mock() above imports, so a factory mock
// never intercepts (and the `import *` namespace copy is non-configurable).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const floatingUI = require('@floating-ui/dom');

describe('pds-tooltip', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Force computePosition to resolve a placement that differs from the
    // requested one, so tests can verify the component applies the *resolved*
    // placement returned by floating-ui.
    jest.spyOn(floatingUI, 'computePosition').mockResolvedValue({
      x: 100,
      y: 200,
      placement: 'bottom',
    });
  });

  it('renders the trigger with hidden content slot wrapper', async () => {
    const { root } = await newSpecPage({
      components: [PdsTooltip],
      html: `
       <pds-tooltip placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-tooltip>`,
    });
    expect(root).toEqualHtml(`
      <pds-tooltip placement="right">
        <span class="pds-tooltip__trigger">
          <pds-button variant="secondary">Secondary</pds-button>
        </span>
        <div class="pds-tooltip__content-slot-wrapper" hidden></div>
      </pds-tooltip>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM. Both stale wrappers land as siblings
    // inside the fresh trigger (neither carries its own `slot` attribute) — content
    // meant for the content slot must be rerouted there, not just flattened in place.
    it('separates default and content-slot content back into their own wrappers', async () => {
      const { root } = await newSpecPage({
        components: [PdsTooltip],
        html: `
         <pds-tooltip placement="right">
          <span class="pds-tooltip__trigger">
            <pds-button variant="secondary">Secondary</pds-button>
          </span>
          <div class="pds-tooltip__content-slot-wrapper" hidden>
            <div slot="content">Rich content</div>
          </div>
         </pds-tooltip>`,
      });

      expect(root?.querySelectorAll('.pds-tooltip__trigger').length).toBe(1);
      expect(root?.querySelectorAll('.pds-tooltip__content-slot-wrapper').length).toBe(1);
      expect(root?.querySelector('.pds-tooltip__trigger pds-button')).not.toBeNull();
      expect(
        root?.querySelector('.pds-tooltip__content-slot-wrapper')?.textContent?.trim()
      ).toBe('Rich content');
      // The content-slot content must not also leak into the trigger.
      expect(root?.querySelector('.pds-tooltip__trigger [slot="content"]')).toBeNull();
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const { root } = await newSpecPage({
        components: [PdsTooltip],
        html: `
         <pds-tooltip placement="right">
          <pds-button variant="secondary">Secondary</pds-button>
         </pds-tooltip>`,
      });

      expect(root?.querySelectorAll('.pds-tooltip__trigger').length).toBe(1);
      expect(root?.querySelector('.pds-tooltip__trigger pds-button')).not.toBeNull();
    });

    // A reconnect stacking on top of an earlier reconnect that never got a cleanup
    // pass buries a second stale pair inside the content wrapper — content rerouted
    // there must itself be drained, not just moved and left nested.
    it('drains a stale trigger/content-wrapper pair nested inside the content wrapper', async () => {
      const { root } = await newSpecPage({
        components: [PdsTooltip],
        html: `
         <pds-tooltip placement="right">
          <span class="pds-tooltip__trigger">
            <pds-button variant="secondary">Secondary</pds-button>
          </span>
          <div class="pds-tooltip__content-slot-wrapper" hidden>
            <span class="pds-tooltip__trigger"></span>
            <div class="pds-tooltip__content-slot-wrapper" hidden>
              <div slot="content">Rich content</div>
            </div>
          </div>
         </pds-tooltip>`,
      });

      expect(root?.querySelectorAll('.pds-tooltip__trigger').length).toBe(1);
      expect(root?.querySelectorAll('.pds-tooltip__content-slot-wrapper').length).toBe(1);
      expect(root?.querySelector('.pds-tooltip__trigger pds-button')).not.toBeNull();
      expect(
        root?.querySelector('.pds-tooltip__content-slot-wrapper')?.textContent?.trim()
      ).toBe('Rich content');
    });

    it('only unwraps once per connect, not on every re-render', async () => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `
         <pds-tooltip placement="right">
          <span class="pds-tooltip__trigger">
            <span class="pds-tooltip__trigger">
              <pds-button variant="secondary">Secondary</pds-button>
            </span>
          </span>
          <div class="pds-tooltip__content-slot-wrapper" hidden></div>
         </pds-tooltip>`,
      });
      const spy = jest.spyOn(
        page.rootInstance as unknown as { unwrapReconnectedSlots: () => void },
        'unwrapReconnectedSlots' as never
      );

      // A later re-render (e.g. a hover-driven prop change) should not re-invoke
      // the reconnect-cleanup scan.
      page.rootInstance.placement = 'left';
      await page.waitForChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    // unwrapReconnectedSlots is the one adopter that reroutes nodes into a
    // DIFFERENT Stencil-rendered element (contentWrapper.appendChild), unlike
    // pds-tab which only ever moves nodes within a single container — this
    // cross-container reroute needs its own re-render guard.
    it('keeps content in the right wrapper after a genuine re-render post-cleanup', async () => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `
         <pds-tooltip placement="right">
          <span class="pds-tooltip__trigger">
            <pds-button variant="secondary">Secondary</pds-button>
          </span>
          <div class="pds-tooltip__content-slot-wrapper" hidden>
            <div slot="content">Rich content</div>
          </div>
         </pds-tooltip>`,
      });

      page.rootInstance.placement = 'left';
      await page.waitForChanges();

      expect(page.root?.querySelectorAll('.pds-tooltip__trigger').length).toBe(1);
      expect(page.root?.querySelectorAll('.pds-tooltip__content-slot-wrapper').length).toBe(1);
      expect(page.root?.querySelector('.pds-tooltip__trigger pds-button')).not.toBeNull();
      expect(
        page.root?.querySelector('.pds-tooltip__content-slot-wrapper')?.textContent?.trim()
      ).toBe('Rich content');
      expect(page.root?.querySelector('.pds-tooltip__trigger [slot="content"]')).toBeNull();
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe(
        [PdsTooltip],
        `<pds-tooltip placement="right"><pds-button variant="secondary">Secondary</pds-button></pds-tooltip>`,
      );
    });
  });

  it('should be able to call method to show tooltip', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });
    await page.root?.showTooltip();
    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  it('should be able to call method to hide tooltip', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });
    await page.root?.showTooltip();
    await page.waitForChanges();

    // Ensure it was opened first
    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    await page.root?.hideTooltip();
    await page.waitForChanges();

    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    } else {
      // If hiding removes the portal entirely, this is also valid
      expect(tooltipPortal).toBeNull();
    }
  });

  it('should show tooltip when opened prop is true', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content" opened="true">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  it('should show the tooltip on focusin', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  it('should hide the tooltip on focusout', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await page.waitForChanges();

    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    triggerElement?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await page.waitForChanges();

    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    } else {
      expect(tooltipPortal).toBeNull();
    }
  });

  it('should show the tooltip on mouseenter', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  it('should hide tooltip on mouseleave after mouseenter', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    triggerElement?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    } else {
      expect(tooltipPortal).toBeNull();
    }
  });

  it('should apply maxWidth to tooltip portal', async () => {
    const maxWidthValue = '400px';
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip max-width="${maxWidthValue}" content="Tooltip content" opened="true">
          <pds-button variant="secondary">Secondary</pds-button>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    const portalElement = page.body.querySelector('.pds-tooltip') as HTMLElement;
    expect(portalElement).not.toBeNull();

    if (portalElement !== null) {
      expect(portalElement.style.maxWidth).toBe(maxWidthValue);
    }
  });

  it('should handle repositioning with floating UI', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip placement="bottom" content="Repositioning Test" opened="true">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    // Wait for portal to be created and positioned
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the portal element
    const portalElement = page.body.querySelector('.pds-tooltip') as HTMLElement;
    expect(portalElement).not.toBeNull();

    // Verify the portal has fixed positioning (set by floating UI)
    expect(portalElement.style.position).toBe('fixed');

    // Since we're mocking floating UI, just verify that positioning styles are applied
    // The exact values might be NaN in the test environment due to mocking
    expect(portalElement.style.left).toBeDefined();
    expect(portalElement.style.top).toBeDefined();
  });

  it('should test placement classes', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip placement="top" content="Test" opened="true">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    const tooltip = page.body.querySelector('.pds-tooltip');
    // With floating UI, the resolved placement will be 'bottom' from our mock
    // The tooltip should exist and have the resolved placement class
    expect(tooltip).toBeTruthy();
    expect(tooltip).toHaveClass('pds-tooltip--bottom');
  });

  it('should hide arrow when has-arrow is false', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip has-arrow="false" content="Tooltip content" opened="true">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`,
    });

    await page.waitForChanges();

    const tooltip = page.body.querySelector('.pds-tooltip');
    expect(tooltip).toHaveClass('pds-tooltip--no-arrow');
  });

  it('should handle html content in tooltip', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip html-content="true" opened="true">
          <button>Trigger</button>
          <div slot="content">
            <p>HTML Content</p>
          </div>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    const tooltipContent = page.body.querySelector('.pds-tooltip__content');
    expect(tooltipContent?.textContent?.trim()).toBe('HTML Content');

    const tooltip = page.body.querySelector('.pds-tooltip');
    expect(tooltip).toHaveClass('pds-tooltip--has-html-content');
  });

  it('should handle conditional returns in handleShow and handleHide', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip content="Conditional Test">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    // First open the tooltip programmatically
    page.rootInstance.opened = true;
    await page.waitForChanges();

    // Verify it's open
    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    // Now try to show it again via handleShow when it's already open
    // This should hit the conditional return in handleShow
    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Verify it's still open
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    // Close the tooltip programmatically
    page.rootInstance.opened = false;
    await page.waitForChanges();

    // Verify it's closed
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    }

    // Now try to hide it again via handleHide when it's already closed
    // This should hit the conditional return in handleHide
    triggerElement?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    // Verify it's still closed
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    }
  });


  it('should handle interactive vs programmatic opening', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip content="Interactive Test">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    // Open tooltip interactively
    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Verify tooltip is open
    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    // Close tooltip
    triggerElement?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    // Now open programmatically
    page.rootInstance.opened = true;
    await page.waitForChanges();

    // Verify tooltip is open
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    // Try to close with mouse leave (should NOT close since it was opened programmatically)
    triggerElement?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    // Verify tooltip is still open
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  describe('keeping the open tooltip in step with its slotted content', () => {
    let observerCallback: ((mutations: Partial<MutationRecord>[]) => void) | null;
    let mockObserve: jest.Mock;
    let mockDisconnect: jest.Mock;
    let defaultObserver: ReturnType<jest.Mock['getMockImplementation']>;
    let frames: Map<number, FrameRequestCallback>;
    let nextFrame: number;
    let originalRequestAnimationFrame: typeof globalThis.requestAnimationFrame;
    let originalCancelAnimationFrame: typeof globalThis.cancelAnimationFrame;

    // Queues animation frames so a test decides when a sync runs.
    const requestFrame = ((callback: FrameRequestCallback) => {
      nextFrame += 1;
      frames.set(nextFrame, callback);
      return nextFrame;
    }) as typeof globalThis.requestAnimationFrame;
    const cancelFrame = ((id: number) => {
      frames.delete(id);
    }) as typeof globalThis.cancelAnimationFrame;
    const runFrames = () => {
      const queued = Array.from(frames.values());
      frames.clear();
      queued.forEach((callback) => callback(0));
    };

    beforeEach(() => {
      observerCallback = null;
      mockObserve = jest.fn();
      mockDisconnect = jest.fn();
      defaultObserver = (global.MutationObserver as jest.Mock).getMockImplementation();
      (global.MutationObserver as jest.Mock).mockImplementation((callback) => {
        observerCallback = callback;
        return { observe: mockObserve, disconnect: mockDisconnect, takeRecords: jest.fn() };
      });
      frames = new Map();
      nextFrame = 0;
      originalRequestAnimationFrame = globalThis.requestAnimationFrame;
      originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
    });

    afterEach(() => {
      (global.MutationObserver as jest.Mock).mockImplementation(defaultObserver);
      globalThis.requestAnimationFrame = originalRequestAnimationFrame;
      globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
    });

    // Only the global the component reads: the page's window also schedules Stencil's own renders.
    const queueFrames = () => {
      globalThis.requestAnimationFrame = requestFrame;
      globalThis.cancelAnimationFrame = cancelFrame;
    };

    const openTooltip = async () => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `
          <pds-tooltip html-content="true">
            <button>Trigger</button>
            <div slot="content"><p class="status">Loading</p></div>
          </pds-tooltip>`,
      });
      page.root?.querySelector('.pds-tooltip__trigger')?.dispatchEvent(new MouseEvent('mouseenter'));
      await page.waitForChanges();
      queueFrames();
      return page;
    };

    const slottedStatus = (page: { root?: HTMLElement }) =>
      page.root?.querySelector('[slot="content"] .status') as HTMLElement;
    const portalStatus = (page: { body: HTMLElement }) => page.body.querySelector('.pds-tooltip__content .status');

    const loaded = (page: { root?: HTMLElement }) => {
      const status = slottedStatus(page);
      status.textContent = 'Loaded';
      return { type: 'characterData', target: status } as Partial<MutationRecord>;
    };

    it('only watches the content while the tooltip is open, at any depth', async () => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `
          <pds-tooltip html-content="true">
            <button>Trigger</button>
            <div slot="content"><p>Initial content</p></div>
          </pds-tooltip>`,
      });
      await page.waitForChanges();
      expect(mockObserve).not.toHaveBeenCalled();

      page.root?.querySelector('.pds-tooltip__trigger')?.dispatchEvent(new MouseEvent('mouseenter'));
      await page.waitForChanges();

      const ownWrapper = Array.from(page.root?.children ?? []).find((child) =>
        child.matches('.pds-tooltip__content-slot-wrapper'),
      );
      expect(mockObserve).toHaveBeenCalledWith(
        ownWrapper,
        expect.objectContaining({ childList: true, subtree: true, attributes: true, characterData: true }),
      );
    });

    it('shows content that changes after the tooltip opens', async () => {
      const page = await openTooltip();
      expect(portalStatus(page)?.textContent).toBe('Loading');

      observerCallback?.([loaded(page)]);
      runFrames();
      await page.waitForChanges();

      expect(page.body.querySelectorAll('.pds-tooltip__content .status')).toHaveLength(1);
      expect(portalStatus(page)?.textContent).toBe('Loaded');
    });

    it('re-copies once for changes that arrive before the next frame', async () => {
      const page = await openTooltip();

      observerCallback?.([loaded(page)]);
      observerCallback?.([{ type: 'characterData', target: slottedStatus(page) }]);

      expect(frames.size).toBe(1);
      runFrames();
      await page.waitForChanges();
      expect(portalStatus(page)?.textContent).toBe('Loaded');
    });

    it('keeps the same portal, id and trigger description through a re-copy', async () => {
      const page = await openTooltip();
      const portal = page.body.querySelector('.pds-tooltip');
      const portalId = portal?.id;

      observerCallback?.([loaded(page)]);
      runFrames();
      await page.waitForChanges();

      expect(page.body.querySelector('.pds-tooltip')).toBe(portal);
      expect(portal?.id).toBe(portalId);
      expect(page.root?.querySelector('.pds-tooltip__trigger')?.getAttribute('aria-describedby')).toBe(portalId);
    });

    it('leaves the portal alone when a change leaves the content as it was', async () => {
      const page = await openTooltip();
      const copied = portalStatus(page);
      const positions = (floatingUI.computePosition as jest.Mock).mock.calls.length;

      observerCallback?.([{ type: 'characterData', target: slottedStatus(page) }]);
      runFrames();
      await page.waitForChanges();

      expect(portalStatus(page)).toBe(copied);
      expect((floatingUI.computePosition as jest.Mock).mock.calls.length).toBe(positions);
    });

    it('leaves the portal alone when a pds-* descendant only gains its Stencil hydrated class', async () => {
      // Stencil only ever marks a custom-element host hydrated, never a plain tag — a pds-* element
      // here is what a real hydration event looks like, not the `<p>` openTooltip() uses elsewhere.
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `
          <pds-tooltip html-content="true">
            <button>Trigger</button>
            <div slot="content"><pds-box class="status">Loading</pds-box></div>
          </pds-tooltip>`,
      });
      page.root?.querySelector('.pds-tooltip__trigger')?.dispatchEvent(new MouseEvent('mouseenter'));
      await page.waitForChanges();
      queueFrames();

      const copied = portalStatus(page);
      const positions = (floatingUI.computePosition as jest.Mock).mock.calls.length;

      slottedStatus(page).classList.add('hydrated');
      observerCallback?.([{ type: 'attributes', target: slottedStatus(page) }]);
      runFrames();
      await page.waitForChanges();

      // Same node, not a clone with the hydrated class carried over: a reload-prone replace never happened.
      expect(portalStatus(page)).toBe(copied);
      expect(portalStatus(page)?.classList.contains('hydrated')).toBe(false);
      expect((floatingUI.computePosition as jest.Mock).mock.calls.length).toBe(positions);
    });

    it('still recopies when a plain (non-pds-*) descendant gains a real class change', async () => {
      // isStencilClass is host-scoped, so stripping is scoped to pds-* elements too — a plain
      // element's own classes, hydrated-named or not, are never Stencil bookkeeping and must still
      // count as a real change.
      const page = await openTooltip();
      const positions = (floatingUI.computePosition as jest.Mock).mock.calls.length;

      slottedStatus(page).classList.add('is-active');
      observerCallback?.([{ type: 'attributes', target: slottedStatus(page) }]);
      runFrames();
      await page.waitForChanges();

      expect(portalStatus(page)?.classList.contains('is-active')).toBe(true);
      expect((floatingUI.computePosition as jest.Mock).mock.calls.length).toBeGreaterThan(positions);
    });

    it("doesn't drift into a permanent recopy loop when the portal copy changes after it connects", async () => {
      const page = await openTooltip();
      const copied = portalStatus(page);
      const positions = (floatingUI.computePosition as jest.Mock).mock.calls.length;

      // Something unrelated to this sync — a nested light-DOM component's own connected-lifecycle
      // bookkeeping, say — mutates the portal's live copy. The comparison must not use that live
      // state as its baseline, or every later sync, even one with no real content change, would see
      // a permanent difference and recopy forever.
      page.body.querySelector('.pds-tooltip__content')?.appendChild(copied!.ownerDocument.createComment('x'));

      observerCallback?.([{ type: 'characterData', target: slottedStatus(page) }]);
      runFrames();
      await page.waitForChanges();

      expect(portalStatus(page)).toBe(copied);
      expect((floatingUI.computePosition as jest.Mock).mock.calls.length).toBe(positions);
    });

    it('stops watching when the tooltip closes', async () => {
      const page = await openTooltip();

      page.root?.querySelector('.pds-tooltip__trigger')?.dispatchEvent(new MouseEvent('mouseleave'));
      await page.waitForChanges();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(page.body.querySelector('.pds-tooltip__content')).toBeNull();
    });

    it('drops a pending re-copy when the tooltip closes', async () => {
      const page = await openTooltip();

      observerCallback?.([loaded(page)]);
      const pending = nextFrame;
      page.root?.querySelector('.pds-tooltip__trigger')?.dispatchEvent(new MouseEvent('mouseleave'));
      await page.waitForChanges();

      expect(frames.has(pending)).toBe(false);
      expect(() => runFrames()).not.toThrow();
      expect(page.body.querySelector('.pds-tooltip')).toBeNull();
    });

    it('drops a pending re-copy when the tooltip is removed', async () => {
      const page = await openTooltip();

      observerCallback?.([loaded(page)]);
      const pending = nextFrame;
      page.root?.remove();
      await page.waitForChanges();

      // Stencil may queue its own frames on removal; the re-copy's is the one that must be gone.
      expect(frames.has(pending)).toBe(false);
      expect(page.body.querySelector('.pds-tooltip')).toBeNull();
    });
  });

  it('should handle SPA navigation pathname changes', async () => {
    // Mock window.location.pathname
    const originalPathname = window.location.pathname;

    // Mock setInterval and clearInterval for this test
    const mockSetInterval = jest.fn();
    const mockClearInterval = jest.fn();
    const originalSetInterval = global.setInterval;
    const originalClearInterval = global.clearInterval;

    (global as any).setInterval = mockSetInterval;
    (global as any).clearInterval = mockClearInterval;

    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip content="Navigation Test">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    // Open tooltip interactively to trigger pathname monitoring
    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Verify tooltip is open and polling was started
    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
    expect(mockSetInterval).toHaveBeenCalled();

    // Get the pathname check callback from the setInterval call
    const pathnameCheckCallback = mockSetInterval.mock.calls[0][0];

    // Mock pathname change
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: '/new-page'
      },
      writable: true
    });

    // Call the pathname check callback to simulate the interval firing
    pathnameCheckCallback();
    await page.waitForChanges();

    // Verify tooltip was closed due to pathname change
    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    } else {
      expect(tooltipPortal).toBeNull();
    }

    // Verify interval cleanup was called
    expect(mockClearInterval).toHaveBeenCalled();

    // Restore original implementations
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: originalPathname
      },
      writable: true
    });
  });

  describe('where the open tooltip mounts', () => {
    // The spec DOM can't evaluate :modal, so the dialog states whether it's modal.
    const openIn = async (modal: boolean) => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `<dialog open><pds-tooltip content="Why this is disabled"><button>Review</button></pds-tooltip></dialog>`,
      });
      const dialog = page.body.querySelector('dialog') as HTMLDialogElement;
      jest.spyOn(dialog, 'matches').mockImplementation((selector) => modal && selector === ':modal');
      (page.body.querySelector('pds-tooltip') as HTMLPdsTooltipElement).opened = true;
      await page.waitForChanges();
      return { page, dialog, portal: page.body.querySelector('.pds-tooltip') as HTMLElement };
    };

    it('mounts in the body outside any dialog or popover', async () => {
      const page = await newSpecPage({
        components: [PdsTooltip],
        html: `<pds-tooltip content="Help" opened="true"><button>Trigger</button></pds-tooltip>`,
      });
      await page.waitForChanges();

      expect(page.body.querySelector('.pds-tooltip')?.parentElement).toBe(page.body);
    });

    it('mounts in the modal dialog around it, which paints above the body', async () => {
      const { dialog, portal } = await openIn(true);

      expect(portal.parentElement).toBe(dialog);
      expect(portal).toHaveClass('pds-tooltip--is-open');
    });

    it('stays in the body inside a dialog that is open but not modal', async () => {
      const { page, portal } = await openIn(false);

      expect(portal.parentElement).toBe(page.body);
    });

    it('is removed from the dialog when it closes', async () => {
      const { page, dialog } = await openIn(true);

      (page.body.querySelector('pds-tooltip') as HTMLPdsTooltipElement).opened = false;
      await page.waitForChanges();

      expect(dialog.querySelector('.pds-tooltip')).toBeNull();
    });
  });

  it('should handle tooltip creation and removal properly', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip content="Cleanup Test" opened="true">
          <button>Trigger</button>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    // Verify tooltip is in the DOM
    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    // Remove the tooltip from the DOM
    page.setContent('');
    await page.waitForChanges();

    // Verify tooltip is removed
    const tooltipAfterRemoval = page.body.querySelector('.pds-tooltip');
    expect(tooltipAfterRemoval).toBeNull();
  });
});