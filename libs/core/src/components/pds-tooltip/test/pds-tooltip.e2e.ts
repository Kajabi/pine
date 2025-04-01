import { newE2EPage } from "@stencil/core/testing";

describe('pds-tooltip', () => {
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

    // Move mouse to center of trigger
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2
    );
    await page.waitForChanges();

    // Wait for the tooltip to be visible
    const isVisible = await page.waitForFunction(
      () => {
        const tooltip = document.querySelector('pds-tooltip')?.shadowRoot?.querySelector('.pds-tooltip');
        const overlay = document.querySelector('pds-tooltip')?.shadowRoot?.querySelector('.pds-tooltip__content');
        return tooltip?.classList.contains('pds-tooltip--is-open') &&
               overlay?.getAttribute('aria-hidden') === 'false';
      },
      { timeout: 2000 }
    );

    expect(isVisible).toBeTruthy();

    // Verify the tooltip state
    const component = await page.find('pds-tooltip >>> .pds-tooltip');
    const overlay = await page.find('pds-tooltip >>> .pds-tooltip__content');

    expect(await component.classList.contains('pds-tooltip--is-open')).toBe(true);
    expect(await overlay.getAttribute('aria-hidden')).toBe('false');

    // Move mouse away to verify it closes
    await page.mouse.move(0, 0);
    await page.waitForChanges();

    // Wait for tooltip to close
    const isClosed = await page.waitForFunction(
      () => {
        const tooltip = document.querySelector('pds-tooltip')?.shadowRoot?.querySelector('.pds-tooltip');
        return !tooltip?.classList.contains('pds-tooltip--is-open');
      },
      { timeout: 2000 }
    );

    expect(isClosed).toBeTruthy();
    expect(await component.classList.contains('pds-tooltip--is-open')).toBe(false);
  });
});
