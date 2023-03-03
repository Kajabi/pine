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
        <slot aria-describedby="tooltip"></slot>
        <div class="sage-tooltip__content" part="content">
          <slot name="content" aria-live="off"></slot>
        </div>
      </div>
      </mock:shadow-root>
    </sage-tooltip>
    `);
  });

  it('renders the target', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="this is the tooltip content">
        <a href="#"> Target</a>
      </sage-tooltip>`
    });
    expect(root).toEqualHtml(`
    <sage-tooltip content="this is the tooltip content">
      <mock:shadow-root>
      <div class="sage-tooltip">
        <slot aria-describedby="tooltip"></slot>
        <div class="sage-tooltip__content" part="content">
          <slot name="content" aria-live="off">this is the tooltip content</slot>
        </div>
      </div>
      </mock:shadow-root>
      <a href="#">Target</a>
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
        <slot aria-describedby="tooltip"></slot>
        <div class="sage-tooltip__content" part="content">
          <slot name="content" aria-live="off"></slot>
        </div>
      </div>
      </mock:shadow-root>
      <p slot="content">this is the slotted tooltip content</p>
    </sage-tooltip>
    `);
  });

  it('renders only the slot content if both slot and property exist', async () => {
    const { root } = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip content="this is content property tooltip content">
        <p slot="content">this is the slotted tooltip content</p>
      </sage-tooltip>`
    });
    expect(root).toEqualHtml(`
    <sage-tooltip content="this is content property tooltip content">
      <mock:shadow-root>
      <div class="sage-tooltip">
        <slot aria-describedby="tooltip"></slot>
        <div class="sage-tooltip__content" part="content">
          <slot name="content" aria-live="off">this is content property tooltip content</slot>
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
