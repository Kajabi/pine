import { newSpecPage } from '@stencil/core/testing';
import { SageTooltip } from '../sage-tooltip';

describe('sage-tooltip', () => {
  it('renders the trigger', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
       <sage-tooltip>
        <sage-button variant="secondary">Secondary</sage-button>
       </sage-tooltip>`
    });
    // TODO: update test to not use toEqualHtml, maybe toBeTruthy()
    expect(root).toEqualHtml(`
      <sage-tooltip>
        <mock:shadow-root>
        <div class="sage-tooltip">
          <span part="trigger" class="sage-tooltip__trigger">
            <slot></slot>
          </span>
          <div class="sage-tooltip__content" aria-hidden="true" aria-live="off" part="content" role="tooltip">
            <slot name="content"></slot>
          </div>
        </div>
        </mock:shadow-root>
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-link>
    `);
  });

  it('should be able to call method to show tooltip', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });
    await page.root.showTooltip();
    await page.waitForChanges();

    const element = page.root.shadowRoot;

    expect(element.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  });

  it('should be able to call method to hide tooltip', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });
    await page.root.showTooltip();
    await page.waitForChanges();
    await page.root.hideTooltip();
    await page.waitForChanges();

    const element = page.root.shadowRoot;

    expect(element.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  });

  it('should show arrow when hasArrow is true', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip hasArrow="true" content="Tooltip content">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });

    const element = page.root.shadowRoot;

    expect(element.querySelector('.sage-tooltip__arrow')).toBeTruthy();

  it('disabled', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content" disabled="true">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });

    const tooltip = new SageTooltip();

    const element = page.root;
    element?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    expect(tooltip).not.toHaveBeenCalled();

    // const element = page.root.shadowRoot;

    // expect(element.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  });

  it('opened', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content" opened="true">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });

    await page.waitForChanges();

    const element = page.root.shadowRoot;

    expect(element.querySelector('.sage-tooltip')).toHaveClass('sage-tooltip--is-open');
  });

  it('should show the tooltip on focus', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content">
        <sage-button variant="secondary">Secondary</sage-button>
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
        <sage-button variant="secondary">Secondary</sage-button>
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
        <sage-button variant="secondary">Secondary</sage-button>
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
        <sage-button variant="secondary">Secondary</sage-button>
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
