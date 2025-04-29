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
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
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
          <button class="pds-button pds-button--accent" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
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
          <button class="pds-button pds-button--unstyled" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
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
          <button class="pds-button pds-button--primary" part="button" type="button" disabled>
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button component-id="test"></pds-button>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-button component-id="test" id="test" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders a leading icon', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button><pds-icon aria-hidden="true" slot="start" name="add-image"></pds-icon></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
        <pds-icon slot="start" aria-hidden="true" name="add-image"></pds-icon>
      </pds-button>
    `);
  });

  it('renders a trailing icon', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button><pds-icon aria-hidden="true" slot="end" name="add-image"></pds-icon></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
        <pds-icon slot="end" aria-hidden="true" name="add-image"></pds-icon>
      </pds-button>
    `);
  });

  it('prioritizes icon prop over start slot when both are set', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button icon="trash" variant="primary"><pds-icon aria-hidden="true" slot="start" name="add-image"></pds-icon></pds-button>`,
    });

    expect(root).toEqualHtml(`
      <pds-button icon="trash" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <pds-icon aria-hidden="true" name="trash" part="icon"></pds-icon>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
        <pds-icon aria-hidden="true" name="add-image" slot="start"></pds-icon>
      </pds-button>
    `);
  });

  it('renders loading button', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button loading="true"></pds-button>`,
    });

    expect(root).toEqualHtml(`
      <pds-button loading="true" variant="primary">
        <mock:shadow-root>
          <button aria-busy="true" aria-live="polite" class="pds-button pds-button--primary pds-button--loading" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text pds-button__text--hidden" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__loader">
                <pds-loader is-loading size="var(--pine-font-size-body-2xl)" variant="spinner">Loading...</pds-loader>
              </span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);

    const loader = root?.shadowRoot?.querySelector('pds-loader');
    expect(loader).not.toBeNull();
  });

  it('prevents click when loading', async () => {
    const page = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button loading="true"></pds-button>`,
    });

    const button = page.root;
    const clickSpy = jest.fn();
    button?.addEventListener('pdsClick', clickSpy);

    button?.click();
    await page.waitForChanges();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('renders full width button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button full-width="true"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button full-width="true" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
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

  it('renders an icon-only button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button icon-only="true"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button icon-only="true" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary pds-button--icon-only" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon"><slot name="start"></slot></span>
              <span class="pds-button__text pds-button__text--hidden" part="button-text">
                <slot></slot>
              </span>
            </div>
          </button>
        </mock:shadow-root>
        <pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon>
      </pds-button>
    `);
  });

  it('renders as a link when using an href', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button href="https://example.com" target="_blank"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button href="https://example.com" target="_blank" variant="primary">
        <mock:shadow-root>
          <a class="pds-button pds-button--primary" part="button" href="https://example.com" target="_blank">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
            </div>
          </a>
        </mock:shadow-root>
      </pds-button>
    `);
  });
});
