import { newSpecPage } from '@stencil/core/testing';
import { SageButton } from '../sage-button';

describe('sage-button', () => {
  it('renders default button', async () => {
    const {root} = await newSpecPage({
      components: [SageButton],
      html: `<sage-button></sage-button>`,
    });
    expect(root).toEqualHtml(`
      <sage-button>
        <mock:shadow-root>
          <button class="sage-button sage-button--primary">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-button>
    `);
  });

  it('renders accent button', async () => {
    const {root} = await newSpecPage({
      components: [SageButton],
      html: `<sage-button variant="accent"></sage-button>`,
    });
    expect(root).toEqualHtml(`
      <sage-button variant="accent">
        <mock:shadow-root>
          <button class="sage-button sage-button--accent">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-button>
    `);
  });

  it('renders disabled button', async () => {
    const {root} = await newSpecPage({
      components: [SageButton],
      html: `<sage-button disabled="true"></sage-button>`,
    });
    expect(root).toEqualHtml(`
      <sage-button disabled="true" aria-disabled="true">
        <mock:shadow-root>
          <button class="sage-button sage-button--primary" disabled>
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-button>
    `);
  });

  it('renders icon button', async () => {
    const { root } = await newSpecPage({
      components: [SageButton],
      html: `<sage-button icon="trashIcon"></sage-button>`,
    });
    const svg = root.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
  });
});



