import { newSpecPage } from '@stencil/core/testing';
import { PdsButton } from '../pds-button';

describe('pds-button', () => {
  it('renders default button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="primary">
        <mock:shadow-root>
          <button class="pds-button" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders accent button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button variant="accent"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="accent">
        <mock:shadow-root>
          <button class="pds-button pds-button--accent" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders unstyled button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button variant="unstyled"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="unstyled">
        <mock:shadow-root>
          <button class="pds-button pds-button--unstyled" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders disabled button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button disabled="true"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button disabled="true" aria-disabled="true" variant="primary">
        <mock:shadow-root>
          <button class="pds-button" type="button" disabled>
            <slot></slot>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders icon button', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button icon="trashIcon"></pds-button>`,
    });
    const icon = root?.shadowRoot?.querySelector('pds-icon');
    expect(icon).not.toBeNull();
  });

  it('runs `handleClick` method when clicked on from inside a form', async () => {
    const root = await newSpecPage({
      components: [PdsButton],
      html: `
        <form id="#test">
          <pds-button type="reset"></pds-button>
        </form>
      `,
    });
    const form = root.doc.querySelector<HTMLFormElement>("form");
    const eventSpy = jest.fn();
    form?.addEventListener("reset", eventSpy());
    const button = document.querySelector<HTMLButtonElement>('pds-button');
    button?.click();
    await root.waitForChanges();
    expect(eventSpy).toHaveBeenCalled();
  });
});
