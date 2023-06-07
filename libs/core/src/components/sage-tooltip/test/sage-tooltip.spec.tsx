import { newSpecPage } from '@stencil/core/testing';
import { SageTooltip } from '../sage-tooltip';

describe('sage-tooltip', () => {
  it('renders the trigger', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
       <sage-tooltip placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </sage-tooltip>`
    });
    expect(root).toEqualHtml(`
      <sage-tooltip placement="right">
        <mock:shadow-root>
        <div class="sage-tooltip sage-tooltip--right">
          <span class="sage-tooltip__trigger">
            <slot></slot>
          </span>
          <div class="sage-tooltip__content" aria-hidden="true" aria-live="off" role="tooltip" style="top: 50%; left: calc(0px + 8px); transform: translateY(-50%);">
            <slot name="content"></slot>
          </div>
        </div>
        </mock:shadow-root>
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-link>
    `);
  });

  it('should be able to call method to show tooltip', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });
    await page.root?.showTooltip();
    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  });

  it('should be able to call method to hide tooltip', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });
    await page.root?.showTooltip();
    await page.waitForChanges();
    await page.root?.hideTooltip();
    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  });

  it('should update the placement', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip placement="right" content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.sage-tooltip--right')).not.toBeNull();
  });

  it('should hide arrow when has-arrow is false', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip has-arrow="false" content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.sage-tooltip--no-arrow')).not.toBeNull();
  });

  it('opened', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content" opened="true">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  });

  it('should show the tooltip on focus', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  })

  it('should hide the tooltip on blur', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');

    element?.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  })

  it('should show the tooltip on mouseenter', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  })

  it('should show the tooltip on mouseleave', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </sage-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');

    element?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  })
});
