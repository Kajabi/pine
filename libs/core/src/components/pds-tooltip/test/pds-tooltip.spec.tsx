import { newSpecPage } from '@stencil/core/testing';
import { PdsTooltip } from '../pds-tooltip';

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
        <mock:shadow-root>
        <div class="pds-tooltip pds-tooltip--right">
          <span class="pds-tooltip__trigger">
            <slot></slot>
          </span>
          <div class="pds-tooltip__content" aria-hidden="true" aria-live="off" role="tooltip" style="top: 50%; left: calc(0px + 8px); transform: translateY(-50%);">
            <slot name="content"></slot>
          </div>
        </div>
        </mock:shadow-root>
        <pds-button variant="secondary">Secondary</pds-button>
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

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');
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
    await page.root?.hideTooltip();
    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-tooltip')).not.toHaveClass('pds-tooltip--is-open');
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

    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');
  });

  it('should show the tooltip on focus', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');
  })

  it('should hide the tooltip on blur', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');

    element?.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).not.toHaveClass('pds-tooltip--is-open');
  })

  it('should show the tooltip on mouseenter', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');
  })

  it('should show the tooltip on mouseleave', async () => {
    const page = await newSpecPage({
      components: [PdsTooltip],
      html: `
      <pds-tooltip content="Tooltip content">
        <pds-button variant="secondary">Secondary</pds-button>
      </pds-tooltip>`
    });

    const element = page.root;
    element?.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();
    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).toHaveClass('pds-tooltip--is-open');

    element?.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    expect(element?.shadowRoot?.querySelector('.pds-tooltip')).not.toHaveClass('pds-tooltip--is-open');
  })
});
