import { newSpecPage } from '@stencil/core/testing';
import { SageTextarea } from '../sage-textarea';

describe('sage-textarea', () => {
  it('renders default button', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea></sage-textarea>`,
    });
    expect(root).toEqualHtml(`
      <sage-textarea variant="primary">
        <mock:shadow-root>
          <button class="sage-textarea" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders accent button', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea variant="accent"></sage-textarea>`,
    });
    expect(root).toEqualHtml(`
      <sage-textarea variant="accent">
        <mock:shadow-root>
          <button class="sage-textarea sage-textarea--accent" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders disabled button', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea disabled="true"></sage-textarea>`,
    });
    expect(root).toEqualHtml(`
      <sage-textarea disabled="true" aria-disabled="true" variant="primary">
        <mock:shadow-root>
          <button class="sage-textarea" type="button" disabled>
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders icon button', async () => {
    const { root } = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea icon="trashIcon"></sage-textarea>`,
    });
    const svg = root.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('runs `handleClick` method when clicked on from inside a form', async () => {
    const root = await newSpecPage({
      components: [SageTextarea],
      html: `
        <form id="#test">
          <sage-textarea type="reset"></sage-textarea>
        </form>
      `,
    });
    const form = root.doc.querySelector<HTMLFormElement>("form");
    const eventSpy = jest.fn();
    form?.addEventListener("reset", eventSpy());
    const button = document.querySelector<HTMLSageTextareaElement>('sage-textarea');
    button?.click();
    await root.waitForChanges();
    expect(eventSpy).toHaveBeenCalled();
  });
});
