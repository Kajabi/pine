import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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
        height: rect?.height,
      };
    }, '#trigger');

    // Check if boundingBox or its properties are undefined
    if (boundingBox.x === undefined || boundingBox.y === undefined || boundingBox.width === undefined || boundingBox.height === undefined) {
      throw new Error('Trigger element not found or dimensions are undefined');
    }

    // Move mouse to center of trigger
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.waitForChanges();

    // Wait for the tooltip to be visible
    const isVisible = await page.waitForFunction(
      () => {
        const tooltipPortal = document.querySelector('.pds-tooltip');
        const contentOverlay = tooltipPortal?.querySelector('.pds-tooltip__content');
        return tooltipPortal?.classList.contains('pds-tooltip--is-open') && contentOverlay?.getAttribute('aria-hidden') === 'false';
      },
      { timeout: 2000 },
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
      { timeout: 2000 },
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

  it('shows slotted content that changes while the tooltip is open', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tooltip html-content="true" opened="true">
        <button>Trigger</button>
        <div slot="content"><div><p class="status">Loading</p></div></div>
      </pds-tooltip>`);
    await page.waitForChanges();

    expect(await page.evaluate(() => document.querySelector('.pds-tooltip__content')?.textContent?.trim())).toBe('Loading');

    await page.evaluate(() => {
      const status = document.querySelector('pds-tooltip .status') as HTMLElement;
      status.replaceWith(Object.assign(document.createElement('p'), { className: 'status', textContent: 'Loaded' }));
    });
    await page.waitForFunction(() => document.querySelector('.pds-tooltip__content')?.textContent?.trim() === 'Loaded');

    expect(await page.evaluate(() => document.querySelectorAll('.pds-tooltip__content p').length)).toBe(1);
  });
});

describe('pds-tooltip accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tooltip content="More information" opened="true">
        <button>Help</button>
      </pds-tooltip>
    `);
    await page.waitForChanges();
    await page.waitForFunction(
      () => {
        const tooltipPortal = document.querySelector('.pds-tooltip.pds-tooltip--is-open');
        const content = tooltipPortal?.querySelector('.pds-tooltip__content');
        return tooltipPortal !== null && content?.getAttribute('aria-hidden') === 'false';
      },
      { timeout: 2000 },
    );
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-tooltip inside an open pds-modal', () => {
  // The modal moves focus to its first control after a short delay; waiting it out keeps it from
  // moving focus mid-test.
  const openModal = async (page: E2EPage, html: string) => {
    await page.setContent(html);
    await (await page.find('pds-modal')).callMethod('showModal');
    await new Promise((resolve) => setTimeout(resolve, 200));
    await page.waitForChanges();
  };

  const openTooltip = (page: E2EPage) =>
    page.evaluate(async () => {
      for (let i = 0; i < 40 && !document.querySelector('.pds-tooltip.pds-tooltip--is-open'); i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      const portal = document.querySelector('.pds-tooltip.pds-tooltip--is-open') as HTMLElement;
      const content = portal.querySelector('.pds-tooltip__content') as HTMLElement;
      const box = content.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const style = getComputedStyle(content);
      return {
        parent: portal.parentElement === document.body ? 'body' : portal.parentElement?.localName,
        hitsTooltip: portal.contains(hit),
        textAlign: style.textAlign,
        whiteSpace: style.whiteSpace,
      };
    });

  it('shows above the modal', async () => {
    const page = await newE2EPage();
    await openModal(page, `
      <pds-modal component-id="review">
        <button id="first">First</button>
        <pds-tooltip content="Why this is disabled" placement="top"><button id="review">Review</button></pds-tooltip>
      </pds-modal>`);

    await page.hover('#review');

    expect(await openTooltip(page)).toMatchObject({ parent: 'dialog', hitsTooltip: true });
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('keeps the text styles it has in the body rather than those around the modal', async () => {
    const page = await newE2EPage();
    await openModal(page, `
      <div style="text-align: center; white-space: nowrap">
        <pds-modal component-id="review">
          <button id="first">First</button>
          <pds-tooltip content="A tooltip long enough to wrap onto a second line at its maximum width" placement="top">
            <button id="review">Review</button>
          </pds-tooltip>
        </pds-modal>
      </div>`);

    await page.hover('#review');

    expect(await openTooltip(page)).toEqual({ parent: 'dialog', hitsTooltip: true, textAlign: 'start', whiteSpace: 'normal' });
  });

  it('stays in the body outside any dialog or popover', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tooltip content="More information"><button id="help">Help</button></pds-tooltip>');
    await page.waitForChanges();

    await page.hover('#help');

    expect(await openTooltip(page)).toMatchObject({ parent: 'body', hitsTooltip: true });
  });

  it('stays in the body inside a modal kept out of the top layer, which it already shows above', async () => {
    const page = await newE2EPage();
    await openModal(page, `
      <pds-modal component-id="review" disable-top-layer>
        <button id="first">First</button>
        <pds-tooltip content="Why this is disabled" placement="top"><button id="review">Review</button></pds-tooltip>
      </pds-modal>`);

    await page.hover('#review');

    expect(await openTooltip(page)).toMatchObject({ parent: 'body', hitsTooltip: true });
  });

  it("keeps Tab in the modal when the tooltip's content holds a link", async () => {
    const page = await newE2EPage();
    await openModal(page, `
      <pds-modal component-id="review">
        <button id="first">First</button>
        <pds-tooltip html-content="true" placement="top">
          <button id="last">Last</button>
          <div slot="content">See <a href="#docs">the docs</a></div>
        </pds-tooltip>
      </pds-modal>`);

    await page.focus('#last');
    expect(await openTooltip(page)).toMatchObject({ parent: 'dialog' });

    await page.keyboard.press('Tab');

    expect(await page.evaluate(() => document.activeElement?.id)).toBe('first');
  });
});
