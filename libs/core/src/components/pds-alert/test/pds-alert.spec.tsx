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
          <pds-box background-color="var(--pds-alert-current-bg)" border="" border-color="var(--pds-alert-current-border)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-current-icon-color)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-current-text-color)" tag="p"></pds-text>
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
          <pds-box background-color="var(--pds-alert-current-bg)" border="" border-color="var(--pds-alert-current-border)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-current-icon-color)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <pds-text class="pds-alert__heading" color="var(--pds-alert-current-text-color)" size="h5" tag="h3" weight="medium">Test Alert Heading</pds-text>
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-current-text-color)" tag="p"></pds-text>
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
      html: `<pds-alert description="Test alert description text"></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" description="Test alert description text" variant="default">
        <mock:shadow-root>
          <pds-box background-color="var(--pds-alert-current-bg)" border="" border-color="var(--pds-alert-current-border)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-current-icon-color)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-current-text-color)" tag="p">Test alert description text</pds-text>
                </div>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-alert>
    `);
  });

  it('renders small variant when small prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert small="true" heading="This heading should not show" description="Small alert description"></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" description="Small alert description" heading="This heading should not show" small="true" variant="default">
        <mock:shadow-root>
          <pds-box background-color="var(--pds-alert-current-bg)" border="" border-color="var(--pds-alert-current-border)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon pds-alert__icon--small" color="var(--pds-alert-current-icon-color)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <pds-box align-items="center" display="flex" gap="md">
                  <pds-text class="pds-alert__description--small" color="var(--pds-alert-current-text-color)" tag="p" truncate="">Small alert description</pds-text>
                </pds-box>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-alert>
    `);
  });

  it('renders dismiss button when dismissible prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert dismissible="true" description="Alert with dismiss button"></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert class="pds-alert" description="Alert with dismiss button" dismissible="true" variant="default">
        <mock:shadow-root>
          <pds-box background-color="var(--pds-alert-current-bg)" border="" border-color="var(--pds-alert-current-border)" border-radius="md" display="block" padding="md">
            <pds-box display="flex" gap="sm">
              <pds-icon class="pds-alert__icon" color="var(--pds-alert-current-icon-color)" icon="info-circle-filled" size="var(--pds-alert-icon-size)"></pds-icon>
              <pds-box class="pds-alert__content-wrapper" direction="column" flex="grow" gap="xs">
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-current-text-color)" tag="p">Alert with dismiss button</pds-text>
                </div>
              </pds-box>
              <button aria-label="Dismiss alert" class="pds-alert__close" type="button">
                <pds-icon aria-hidden="true" color="var(--pds-alert-close-color)" icon="remove" size="var(--pds-alert-icon-size)"></pds-icon>
              </button>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-alert>
    `);
  });

  it('emits pdsAlertCloseClick event when dismiss button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert dismissible="true"></pds-alert>`,
    });

    // Create a spy for the event
    const eventSpy = jest.fn();

    // Add event listener to the component
    if (page.root) {
      page.root.addEventListener('pdsAlertCloseClick', eventSpy);

      // Find and click the dismiss button
      if (page.root.shadowRoot) {
        const dismissButton = page.root.shadowRoot.querySelector('.pds-alert__close') as HTMLButtonElement;
        if (dismissButton) {
          dismissButton.click();

          // Verify the event was fired
          expect(eventSpy).toHaveBeenCalled();
        }
      }
    }
  });
});
