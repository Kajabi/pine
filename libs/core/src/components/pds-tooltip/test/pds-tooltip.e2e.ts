import { newE2EPage } from "@stencil/core/testing";

describe('pds-tooltip', () => {
  // Mock MutationObserver
  const mutationObserverMock = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
  global.MutationObserver = mutationObserverMock;

  it('opens tooltip on hover', async () => {
    const page = await newE2EPage();

    // Set content and wait for initial render
    await page.setContent('<pds-tooltip content="tooltip content"><button id="trigger">Secondary</button></pds-tooltip>');
    await page.waitForChanges();

    // Get elements and verify they exist
    const tooltipElement = await page.find('pds-tooltip');
    const trigger = await page.find('#trigger');

    expect(tooltipElement).not.toBeNull();
    expect(trigger).not.toBeNull();

    // Get the position of the trigger element
    const boundingBox = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      const rect = element?.getBoundingClientRect();
      return {
        x: rect?.left,
        y: rect?.top,
        width: rect?.width,
        height: rect?.height
      };
    }, '#trigger');

    // Check if boundingBox or its properties are undefined
    if (
      boundingBox.x === undefined ||
      boundingBox.y === undefined ||
      boundingBox.width === undefined ||
      boundingBox.height === undefined
    ) {
      throw new Error('Trigger element not found or dimensions are undefined');
    }

    // Move mouse to center of trigger
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2
    );
    await page.waitForChanges();

    // Wait for the tooltip to be visible
    const isVisible = await page.waitForFunction(
      () => {
        const tooltipPortal = document.querySelector('.pds-tooltip');
        const contentOverlay = tooltipPortal?.querySelector('.pds-tooltip__content');
        return tooltipPortal?.classList.contains('pds-tooltip--is-open') &&
               contentOverlay?.getAttribute('aria-hidden') === 'false';
      },
      { timeout: 2000 }
    );

    expect(isVisible).toBeTruthy();

    // Verify the tooltip state
    const isOpen = await page.evaluate(() => {
      const tooltipPortal = document.querySelector('.pds-tooltip');
      return tooltipPortal?.classList.contains('pds-tooltip--is-open');
    });
    const overlayIsHidden = await page.evaluate(() => {
      const contentOverlay = document.querySelector('.pds-tooltip .pds-tooltip__content');
      return contentOverlay?.getAttribute('aria-hidden');
    });

    expect(isOpen).toBe(true);
    expect(overlayIsHidden).toBe('false');

    // Move mouse away to verify it closes
    await page.mouse.move(0, 0);
    await page.waitForChanges();

    // Wait for tooltip to close
    const isClosed = await page.waitForFunction(
      () => {
        const tooltipPortal = document.querySelector('.pds-tooltip');
        // Check if the portal element is gone OR if it's marked as not open
        return !tooltipPortal || !tooltipPortal.classList.contains('pds-tooltip--is-open');
      },
      { timeout: 2000 }
    );

    expect(isClosed).toBeTruthy();
    const isStillOpenAfterMouseOut = await page.evaluate(() => {
      const tooltipPortal = document.querySelector('.pds-tooltip');
      if (!tooltipPortal) {
        return false; // Portal is removed, so it's not open
      }
      return tooltipPortal.classList.contains('pds-tooltip--is-open');
    });
    expect(isStillOpenAfterMouseOut).toBe(false);
  });
});
