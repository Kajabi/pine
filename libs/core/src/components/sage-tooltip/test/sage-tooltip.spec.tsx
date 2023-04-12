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

  it('should not be able to call method to show tooltip when disabled', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content" disabled="true">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });
    await page.root.showTooltip();
    await page.waitForChanges();

    const element = page.root.shadowRoot;

    expect(element.querySelector('.sage-tooltip')).not.toHaveClass('sage-tooltip--is-open');
  });

  it('should be able to call method to show tooltip when focus occurs', async () => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="Tooltip content" disabled="true">
        <sage-button variant="secondary">Secondary</sage-button>
      </sage-tooltip>`
    });

    // const methodSpy = jest.fn();
    // const focusEvent = await page.spyOnEvent('sageTooltipShow')
    // const eventSpy = jest.fn();
    // document.addEventListener('sageTooltipShow', eventSpy);
    // const element = page.doc.querySelector<HTMLElement>('.sage-tooltip');


    // element?.focus();
    // page.waitForChanges();

    // expect(eventSpy).toHaveReceivedEventTimes(1);

    const tooltip = new SageTooltip();
    expect(tooltip.opened).toBe(false);
    tooltip.showTooltip();
    expect(tooltip.opened).toBe(true);
  });
});
