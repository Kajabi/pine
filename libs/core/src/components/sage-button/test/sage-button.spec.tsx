import { newSpecPage } from '@stencil/core/testing';
import { SageButton } from '../sage-button';

describe('sage-button', () => {
  it('renders default button', async () => {
    const {root} = await newSpecPage({
      components: [SageButton],
      html: `<sage-button></sage-button>`,
    });
    expect(root).toEqualHtml(`
      <sage-button variant="primary">
        <mock:shadow-root>
          <button class="sage-button" type="button">
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
          <button class="sage-button sage-button--accent" type="button">
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
      <sage-button disabled="true" aria-disabled="true" variant="primary">
        <mock:shadow-root>
          <button class="sage-button" type="button" disabled>
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

  it('runs `handleClick` method when clicked on from inside a form', async () => {
    const root = await newSpecPage({
      components: [SageButton],
      html: `
        <form id="#test">
          <sage-button type="reset"></sage-button>
        </form>  
      `,
    });
    const form = root.doc.querySelector<HTMLFormElement>("form");
    const eventSpy = jest.fn(); 
    form?.addEventListener("reset", eventSpy());
    const button = document.querySelector<HTMLSageButtonElement>('sage-button');
    button?.click();
    await root.waitForChanges();
    expect(eventSpy).toHaveBeenCalled();
  });
});
