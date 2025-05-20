import { newSpecPage } from '@stencil/core/testing';
import { PdsBanner } from '../pds-banner';

describe('pds-banner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsBanner],
      html: `<pds-banner></pds-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-banner class="pds-banner" variant="default">
        <mock:shadow-root>
          <pds-box
            background-color="var(--banner-background-color)"
            fit
            padding-block-start="sm"
            padding-block-end="sm"
            padding-inline-start="md"
            padding-inline-end="md"
          >
            <pds-box display="flex" justify-content="space-between">
              <pds-box display="flex" align-items="center" gap="xs">
                <pds-icon color="var(--banner-icon-color)" name="info-circle-filled"></pds-icon>
                <pds-text color="var(--banner-text-color)" tag="p">
                  <slot name="text"></slot>
                </pds-text>
              </pds-box>
              <pds-box display="flex" align-items="center" gap="sm" justify-content="end">
                <slot name="actions"></slot>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-banner>
    `);
  });

  it('renders a variant when the variant prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBanner],
      html: `<pds-banner variant="warning"></pds-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-banner class="pds-banner" variant="warning">
        <mock:shadow-root>
          <pds-box
            background-color="var(--banner-background-color)"
            fit
            padding-block-start="sm"
            padding-block-end="sm"
            padding-inline-start="md"
            padding-inline-end="md"
          >
            <pds-box display="flex" justify-content="space-between">
              <pds-box display="flex" align-items="center" gap="xs">
                <pds-icon color="var(--banner-icon-color)" name="info-circle-filled"></pds-icon>
                <pds-text color="var(--banner-text-color)" tag="p">
                  <slot name="text"></slot>
                </pds-text>
              </pds-box>
              <pds-box display="flex" align-items="center" gap="sm" justify-content="end">
                <slot name="actions"></slot>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-banner>
    `);
  });

  it('renders a dismissable banner when the dismissable prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBanner],
      html: `<pds-banner dismissable></pds-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-banner class="pds-banner" variant="default" dismissable>
        <mock:shadow-root>
          <pds-box
            background-color="var(--banner-background-color)"
            fit
            padding-block-start="sm"
            padding-block-end="sm"
            padding-inline-start="md"
            padding-inline-end="md"
          >
            <pds-box display="flex" justify-content="space-between">
              <pds-box display="flex" align-items="center" gap="xs">
                <pds-icon color="var(--banner-icon-color)" name="info-circle-filled"></pds-icon>
                <pds-text color="var(--banner-text-color)" tag="p">
                  <slot name="text"></slot>
                </pds-text>
              </pds-box>
              <pds-box display="flex" align-items="center" gap="sm" justify-content="end">
                <slot name="actions"></slot>
                <button class="pds-banner__close" aria-label="Dismiss banner">
                  <pds-icon color="var(--banner-icon-color)" name="remove" aria-hidden="true"></pds-icon>
                </button>
              </pds-box>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
      </pds-banner>
    `);
  });
});
