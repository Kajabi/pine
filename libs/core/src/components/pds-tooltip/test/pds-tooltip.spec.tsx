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

describe('pds-tooltip', () => {
  it('renders the trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsTooltip],
      html: `
       <pds-tooltip placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-tooltip>`
    });
    expect(root).toEqualHtml(`
      <pds-tooltip placement="right">
        <span class="pds-tooltip__trigger">
          <pds-button variant="secondary">Secondary</pds-button>
        </span>
        <div class="pds-tooltip__content-slot-wrapper" style="display: none;"></div>
      </pds-tooltip>
    `);
  });

  it('should be able to call method to show tooltip', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
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
      </pds-tooltip>`
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

  it('should update the placement', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip placement="right" content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-tooltip--right')).not.toBeNull();
  });

  it('should hide arrow when has-arrow is false', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip has-arrow="false" content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-tooltip--no-arrow')).not.toBeNull();
  });

  it('opened', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content" opened="true">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    await page.waitForChanges(); // Ensure portal is created

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  });

  it('should show the tooltip on focus', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  })

  it('should hide the tooltip on blur', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    let tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');

    triggerElement?.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();

    tooltipPortal = page.body.querySelector('.pds-tooltip');
    if (tooltipPortal) {
      expect(tooltipPortal).not.toHaveClass('pds-tooltip--is-open');
    } else {
      expect(tooltipPortal).toBeNull();
    }
  })

  it('should show the tooltip on mouseenter', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const triggerElement = page.root?.querySelector('.pds-tooltip__trigger');
    triggerElement?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    const tooltipPortal = page.body.querySelector('.pds-tooltip');
    expect(tooltipPortal).not.toBeNull();
    expect(tooltipPortal).toHaveClass('pds-tooltip--is-open');
  })

  it('should hide tooltip on mouseleave after mouseenter', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
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
  })

  it('should apply maxWidth to tooltip content', async () => {
    const maxWidthValue = '400px';
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
        <pds-tooltip max-width="${maxWidthValue}" content="Tooltip content" opened="true">
          <pds-button variant="secondary">Secondary</pds-button>
        </pds-tooltip>`
    });

    await page.waitForChanges(); // Ensure component renders and portal is created

    const contentElement = page.body.querySelector('.pds-tooltip .pds-tooltip__content') as HTMLElement;

    expect(contentElement).not.toBeNull(); // Add a check that element is found
    if (contentElement !== null) { // Type guard, changed from if(contentElement)
      expect(contentElement.style.maxWidth).toBe(maxWidthValue);
    }
  });
});
