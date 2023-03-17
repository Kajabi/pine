import { newSpecPage } from '@stencil/core/testing';
import { SageTooltip } from '../sage-tooltip';

describe('sage-tooltip', () => {
  it('is rendered', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `<sage-tooltip></sage-tooltip>`
    });
    expect(root).toEqualHtml(`
    <sage-tooltip>
      <mock:shadow-root>
      <div class="sage-tooltip">
        <span part="trigger">
          <slot></slot>
        </span>
        <div class="sage-tooltip__content" aria-hidden="true" part="content" role="tooltip">
          <slot name="content" aria-live="off"></slot>
        </div>
      </div>
      </mock:shadow-root>
    </sage-tooltip>
    `);
  });

  it('renders the trigger', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip>
        <a href="#">Trigger</a>
      </sage-tooltip>`
    });
    expect(root).toEqualHtml(`
    <sage-tooltip>
      <mock:shadow-root>
      <div class="sage-tooltip">
        <span part="trigger">
          <slot></slot>
        </span>
        <div class="sage-tooltip__content" aria-hidden="true" part="content" role="tooltip">
          <slot name="content" aria-live="off"></slot>
        </div>
      </div>
      </mock:shadow-root>
      <a href="#">Trigger</a>
    </sage-tooltip>
    `);
  });

  it('renders the slot content', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip>
        <p slot="content">this is the slotted tooltip content</p>
      </sage-tooltip>`
    });
    expect(root).toEqualHtml(`
    <sage-tooltip>
      <mock:shadow-root>
      <div class="sage-tooltip">
        <span part="trigger">
          <slot></slot>
        </span>
        <div class="sage-tooltip__content" aria-hidden="true" part="content" role="tooltip">
          <slot name="content" aria-live="off"></slot>
        </div>
      </div>
      </mock:shadow-root>
      <p slot="content">this is the slotted tooltip content</p>
    </sage-tooltip>
    `);
  });

  it('renders arrow', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `<sage-tooltip has-arrow="true"></sage-tooltip>`
    });

    const arrow = root.shadowRoot.querySelector('.sage-tooltip__arrow');
    expect(arrow).not.toBeNull();
  });
});
