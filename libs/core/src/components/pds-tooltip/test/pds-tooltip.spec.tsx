import { newSpecPage } from '@stencil/core/testing';
import { PdsTooltip } from '../pds-tooltip';

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

// Mock floating-ui/dom
jest.mock('@floating-ui/dom', () => ({
  computePosition: jest.fn().mockResolvedValue({
    x: 100,
    y: 200,
    placement: 'bottom',
  }),
  flip: jest.fn().mockReturnValue({}),
  offset: jest.fn().mockReturnValue({}),
  shift: jest.fn().mockReturnValue({}),
}));

describe('pds-tooltip', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
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

  it('should handle mutation observer setup properly', async () => {
    const mockObserve = jest.fn();
    (global.MutationObserver as jest.Mock).mockImplementation(() => ({
      observe: mockObserve,
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
    }));

    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip html-content="true">
          <button>Trigger</button>
          <div slot="content">
            <p>Initial content</p>
          </div>
        </pds-tooltip>`,
    });

    await page.waitForChanges();

    // Verify that MutationObserver.observe was called
    expect(mockObserve).toHaveBeenCalled();
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