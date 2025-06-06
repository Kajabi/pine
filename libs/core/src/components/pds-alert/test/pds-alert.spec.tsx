import { newSpecPage } from '@stencil/core/testing';
import { PdsAlert } from '../pds-alert';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" variant="default">
        <mock:shadow-root>
          <pds-box class="pds-alert__container pds-alert__container--default" background-color="var(--pds-alert-background)" border="" border-color="var(--pds-alert-border-color)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-color-icon)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-color-text)" tag="p">
                    <slot></slot>
                  </pds-text>
                </div>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-alert>
    `);
  });

  it('renders heading when provided', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert heading="Test Alert Heading"></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" heading="Test Alert Heading" variant="default">
        <mock:shadow-root>
          <pds-box class="pds-alert__container pds-alert__container--default" background-color="var(--pds-alert-background)" border="" border-color="var(--pds-alert-border-color)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-color-icon)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <pds-text class="pds-alert__heading" color="var(--pds-alert-color-text)" size="h5" tag="h3" weight="medium">Test Alert Heading</pds-text>
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-color-text)" tag="p">
                    <slot></slot>
                  </pds-text>
                </div>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-alert>
    `);
  });

  it('renders description when provided', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert>Test alert description text</pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" variant="default">
        <mock:shadow-root>
          <pds-box class="pds-alert__container pds-alert__container--default" background-color="var(--pds-alert-background)" border="" border-color="var(--pds-alert-border-color)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-color-icon)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-color-text)" tag="p">
                    <slot></slot>
                  </pds-text>
                </div>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Test alert description text
      </pds-alert>
    `);
  });

  it('renders small variant when small prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert small="true" heading="This heading should not show">Small alert description</pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" heading="This heading should not show" small="true" variant="default">
        <mock:shadow-root>
          <pds-box class="pds-alert__container pds-alert__container--default" background-color="var(--pds-alert-background)" border="" border-color="var(--pds-alert-border-color)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon pds-alert__icon--small" color="var(--pds-alert-color-icon)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <pds-box align-items="center" display="flex" gap="md">
                  <pds-text class="pds-alert__description--small" color="var(--pds-alert-color-text)" tag="p" truncate="">
                    <slot></slot>
                  </pds-text>
                </pds-box>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Small alert description
      </pds-alert>
    `);
  });

  it('renders dismiss button when dismissible prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert dismissible="true">Alert with dismiss button</pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" dismissible="true" variant="default">
        <mock:shadow-root>
          <pds-box class="pds-alert__container pds-alert__container--default" background-color="var(--pds-alert-background)" border="" border-color="var(--pds-alert-border-color)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-color-icon)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-color-text)" tag="p">
                    <slot></slot>
                  </pds-text>
                </div>
              </pds-box>
              <button aria-label="Dismiss alert" class="pds-alert__dismiss" type="button">
                <pds-icon aria-hidden="true" color="var(--pds-alert-color-dismiss)" icon="remove" size="var(--pds-alert-icon-size)"></pds-icon>
              </button>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Alert with dismiss button
      </pds-alert>
    `);
  });

  it('emits pdsAlertDismissClick event when dismiss button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert dismissible="true"></pds-alert>`,
    });

    // Create a spy for the event
    const eventSpy = jest.fn();

    // Add event listener to the component
    if (page.root) {
      page.root.addEventListener('pdsAlertDismissClick', eventSpy);

      // Find and click the dismiss button
      if (page.root.shadowRoot) {
        const dismissButton = page.root.shadowRoot.querySelector('.pds-alert__dismiss') as HTMLButtonElement;
        if (dismissButton) {
          dismissButton.click();

          // Verify the event was fired
          expect(eventSpy).toHaveBeenCalled();
        }
      }
    }
  });

  it('renders action slot content correctly', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `
        <pds-alert>Alert with action buttons
          <button slot="actions">Action Button</button>
          <a slot="actions" href="#">Action Link</a>
        </pds-alert>
      `,
    });

    // Check if the slotted content is correctly rendered
    if (page.root) {
      // Verify slotted elements are present in the light DOM
      const slottedButton = page.root.querySelector('button[slot="actions"]');
      const slottedLink = page.root.querySelector('a[slot="actions"]');

      expect(slottedButton).not.toBeNull();
      expect(slottedButton?.textContent).toBe('Action Button');

      expect(slottedLink).not.toBeNull();
      expect(slottedLink?.textContent).toBe('Action Link');

      // Verify the shadowDOM has a slot for the actions
      if (page.root.shadowRoot) {
        const actionsSlot = page.root.shadowRoot.querySelector('.pds-alert__actions slot[name="actions"]');
        expect(actionsSlot).not.toBeNull();
      }
    }
  });

  it('renders different variants correctly', async () => {
    const variants = ['success', 'danger', 'warning', 'info'];

    for (const variant of variants) {
      const page = await newSpecPage({
        components: [PdsAlert],
        html: `<pds-alert variant="${variant}">Variant test</pds-alert>`,
      });

      if (page.root) {
        expect(page.root.getAttribute('variant')).toBe(variant);

        // Check if the correct variant class is applied to the container
        if (page.root.shadowRoot) {
          const container = page.root.shadowRoot.querySelector(`.pds-alert__container--${variant}`);
          expect(container).not.toBeNull();
        }
      }
    }
  });

  it('renders small variant with actions', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `
        <pds-alert small="true">Small alert with action
          <a slot="actions" href="#">Action Link</a>
        </pds-alert>
      `,
    });

    if (page.root && page.root.shadowRoot) {
      // Verify small classes are applied
      const icon = page.root.shadowRoot.querySelector('.pds-alert__icon--small');
      expect(icon).not.toBeNull();

      // Verify actions container for small variant
      const actionsContainer = page.root.shadowRoot.querySelector('.pds-alert__actions--small');
      expect(actionsContainer).not.toBeNull();

      // Verify slot exists in the small container
      const slot = actionsContainer?.querySelector('slot[name="actions"]');
      expect(slot).not.toBeNull();
    }
  });

  it('falls back to default icon when invalid variant is provided', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert variant="invalid-variant">Testing fallback</pds-alert>`,
    });

    if (page.root && page.root.shadowRoot) {
      // It should use the default icon (info-circle-filled)
      const icon = page.root.shadowRoot.querySelector('pds-icon');
      expect(icon?.getAttribute('icon')).toBe('info-circle-filled');
    }
  });

  it('applies correct description class when small is false', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert small="false">Testing description class</pds-alert>`,
    });

    if (page.root && page.root.shadowRoot) {
      // Verify the non-small description class is applied
      const descriptionText = page.root.shadowRoot.querySelector('.pds-alert__description');
      expect(descriptionText).not.toBeNull();

      // Make sure the small class is not applied
      const smallDescriptionText = page.root.shadowRoot.querySelector('.pds-alert__description--small');
      expect(smallDescriptionText).toBeNull();
    }
  });
});
