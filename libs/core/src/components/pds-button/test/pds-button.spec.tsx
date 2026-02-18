import { newSpecPage } from '@stencil/core/testing';
import { PdsButton } from '../pds-button';
import { caretDown, addCircle } from '@pine-ds/icons/icons';

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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders tertiary button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button variant="tertiary"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button variant="tertiary">
        <mock:shadow-root>
          <button class="pds-button pds-button--tertiary" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders small button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button size="small"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button size="small" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary pds-button--small" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders micro button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button size="micro"></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button size="micro" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary pds-button--micro" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  it('renders small icon-only button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button size="small" icon-only="true"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button size="small" icon-only="true" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary pds-button--small pds-button--icon-only" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
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

  it('renders micro icon-only button', async () => {
    const {root} = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button size="micro" icon-only="true"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon></pds-button>`,
    });
    expect(root).toEqualHtml(`
      <pds-button size="micro" icon-only="true" variant="primary">
        <mock:shadow-root>
          <button class="pds-button pds-button--primary pds-button--micro pds-button--icon-only" part="button" type="button">
            <div class="pds-button__content" part="button-content">
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  // Note: Snapshot still shows --empty on slot wrappers because newSpecPage does not
  // fire slotchange events. The "slot empty class" suite below covers that behavior.
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
        <pds-icon slot="start" aria-hidden="true" name="add-image"></pds-icon>
      </pds-button>
    `);
  });

  // Note: See above — newSpecPage doesn't fire slotchange, so --empty persists in snapshot.
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <pds-icon aria-hidden="true" name="trash"></pds-icon>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty pds-button__icon--hidden"><slot name="start"></slot></span>
              <span class="pds-button__text pds-button__text--hidden" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__loader">
                <pds-loader is-loading size="var(--pine-font-size-body-2xl)" variant="spinner" exportparts="loader-svg">Loading...</pds-loader>
              </span>
              <span class="pds-button__icon pds-button__icon--empty pds-button__icon--hidden"><slot name="end"></slot></span>
            </div>
          </button>
        </mock:shadow-root>
      </pds-button>
    `);

    const loader = root?.shadowRoot?.querySelector('pds-loader');
    expect(loader).not.toBeNull();
  });

  it('exports loader-svg part when loading', async () => {
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button loading="true"></pds-button>`,
    });

    const loader = root?.shadowRoot?.querySelector('pds-loader');
    expect(loader?.getAttribute('exportparts')).toBe('loader-svg');
  });

  it('includes loader-svg part in JSDoc comments', async () => {
    // This test verifies that the component properly documents the exported parts
    const { root } = await newSpecPage({
      components: [PdsButton],
      html: `<pds-button loading="true"></pds-button>`,
    });

    expect(root).toBeTruthy();
    // The actual JSDoc validation is done at build time,
    // but we can verify the loader element has the exportparts attribute
    const loader = root?.shadowRoot?.querySelector('pds-loader[exportparts]');
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
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
              <span class="pds-button__icon pds-button__icon--empty"><slot name="start"></slot></span>
              <span class="pds-button__text" part="button-text">
                <slot></slot>
              </span>
              <span class="pds-button__icon pds-button__icon--empty"><slot name="end"></slot></span>
            </div>
          </a>
        </mock:shadow-root>
      </pds-button>
    `);
  });

  describe('Enter key form submission', () => {
    it('renders submit button that can be used for form submission', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `
          <form>
            <pds-button type="submit">Submit</pds-button>
          </form>
        `,
      });

      const button = page.root?.shadowRoot?.querySelector('button');
      expect(button?.type).toBe('submit');

      // Verify the button is in a form context
      const form = page.doc.querySelector('form');
      expect(form).toBeTruthy();
      expect(form?.contains(page.root as Node)).toBe(true);
    });

    it('renders regular button that should not handle form submission', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `
          <form>
            <pds-button type="button">Regular Button</pds-button>
          </form>
        `,
      });

      const button = page.root?.shadowRoot?.querySelector('button');
      expect(button?.type).toBe('button');
    });

    it('renders link button that should not handle form submission', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `
          <form>
            <pds-button type="submit" href="/test">Link Button</pds-button>
          </form>
        `,
      });

      const anchor = page.root?.shadowRoot?.querySelector('a');
      const button = page.root?.shadowRoot?.querySelector('button');

      expect(anchor).toBeTruthy();
      expect(button).toBeFalsy();
      expect(anchor?.href).toContain('/test');
    });
  });

  describe('disclosure variant coverage', () => {
    it('renders caret-down icon when variant is disclosure', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="disclosure"></pds-button>`,
      });

      const caretIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(caretIcon).toBeTruthy();
      expect(caretIcon?.getAttribute('icon')).toBe(caretDown);
    });

    it('renders disclosure variant with loading state (covers hidden caret)', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="disclosure" loading="true"></pds-button>`,
      });

      const caretIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(caretIcon).toBeTruthy();
      expect(caretIcon?.classList.contains('pds-button__icon--hidden')).toBe(true);
    });

    it('does not render caret for disclosure variant when iconOnly is true', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="disclosure" icon-only="true"></pds-button>`,
      });

      const caretIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(caretIcon).toBeFalsy();
    });

    it('renders disabled submit button correctly', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button type="submit" disabled="true">Disabled Submit</pds-button>`,
      });

      const button = page.root?.shadowRoot?.querySelector('button');
      expect(button?.type).toBe('submit');
      expect(button?.hasAttribute('disabled')).toBe(true);
      expect(page.root?.getAttribute('aria-disabled')).toBe('true');
    });

    it('renders enabled submit button correctly', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button type="submit">Enabled Submit</pds-button>`,
      });

      const button = page.root?.shadowRoot?.querySelector('button');
      expect(button?.type).toBe('submit');
      expect(button?.hasAttribute('disabled')).toBe(false);
      expect(page.root?.getAttribute('aria-disabled')).toBe(null);
    });
  });

  describe('filter variant coverage', () => {
    it('renders add-circle icon when variant is filter', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter">Filter option</pds-button>`,
      });

      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.getAttribute('icon')).toBe(addCircle);
    });

    it('ignores icon prop when variant is filter', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter" icon="favorite">Filter option</pds-button>`,
      });

      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.getAttribute('icon')).toBe(addCircle);
      expect(filterIcon?.getAttribute('name')).toBe(null);
    });

    it('renders filter variant with loading state (covers hidden icon)', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter" loading="true">Filter option</pds-button>`,
      });

      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.classList.contains('pds-button__icon--hidden')).toBe(true);
    });

    it('renders filter variant with disabled state', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter" disabled="true">Filter option</pds-button>`,
      });

      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');
      const button = root?.shadowRoot?.querySelector('button');

      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.getAttribute('icon')).toBe(addCircle);
      expect(button?.hasAttribute('disabled')).toBe(true);
      expect(root?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not render start slot content when variant is filter', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter"><pds-icon slot="start" name="favorite"></pds-icon>Filter option</pds-button>`,
      });

      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');
      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.getAttribute('icon')).toBe(addCircle);

      // Should not render start slot (filter variant overrides with its own icon)
      const startSlot = root?.shadowRoot?.querySelector('slot[name="start"]');
      expect(startSlot).toBeFalsy();
    });

    it('renders filter variant as anchor when href is provided', async () => {
      const {root} = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button variant="filter" href="/test">Filter option</pds-button>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      const filterIcon = root?.shadowRoot?.querySelector('pds-icon');

      expect(anchor).toBeTruthy();
      expect(filterIcon).toBeTruthy();
      expect(filterIcon?.getAttribute('icon')).toBe(addCircle);
      expect(anchor?.href).toContain('/test');
    });
  });

  describe('slot empty class', () => {
    it('applies --empty class to start and end slot wrappers when no content is slotted', async () => {
      const { root } = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button>Click me</pds-button>`,
      });

      const iconSpans = root?.shadowRoot?.querySelectorAll('.pds-button__icon');
      iconSpans?.forEach((span) => {
        expect(span.classList.contains('pds-button__icon--empty')).toBe(true);
      });
    });

    it('does not apply --empty class to start slot wrapper when start content is slotted', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button><pds-icon slot="start" name="favorite"></pds-icon>Click me</pds-button>`,
      });

      const startSlot = page.root?.shadowRoot?.querySelector('slot[name="start"]');
      const startWrapper = startSlot?.parentElement;

      // Simulate slotchange since newSpecPage doesn't fire it automatically
      const slotchangeEvent = new Event('slotchange');
      Object.defineProperty(slotchangeEvent, 'target', {
        value: { assignedElements: () => [document.createElement('pds-icon')] },
      });
      startSlot?.dispatchEvent(slotchangeEvent);
      await page.waitForChanges();

      expect(startWrapper?.classList.contains('pds-button__icon--empty')).toBe(false);
    });

    it('does not apply --empty class to end slot wrapper when end content is slotted', async () => {
      const page = await newSpecPage({
        components: [PdsButton],
        html: `<pds-button>Click me<pds-icon slot="end" name="favorite"></pds-icon></pds-button>`,
      });

      const endSlot = page.root?.shadowRoot?.querySelector('slot[name="end"]');
      const endWrapper = endSlot?.parentElement;

      // Simulate slotchange since newSpecPage doesn't fire it automatically
      const slotchangeEvent = new Event('slotchange');
      Object.defineProperty(slotchangeEvent, 'target', {
        value: { assignedElements: () => [document.createElement('pds-icon')] },
      });
      endSlot?.dispatchEvent(slotchangeEvent);
      await page.waitForChanges();

      expect(endWrapper?.classList.contains('pds-button__icon--empty')).toBe(false);
    });
  });
});
