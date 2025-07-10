import { newSpecPage } from '@stencil/core/testing';
import { PdsProperty } from '../pds-property';

describe('pds-property', () => {
  it('renders with slot content', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property>Property text</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property class="pds-property">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-box align-items="center" class="pds-property__text">
              <slot></slot>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Property text
      </pds-property>
    `);
  });

  it('renders with icon and slot content', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property icon="check-circle">Property text</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property class="pds-property" icon="check-circle">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-box align-items="center" class="pds-property__icon" flex-shrink="0" justify-content="center">
              <pds-icon icon="check-circle" size="16px" aria-hidden="true"></pds-icon>
            </pds-box>
            <pds-box align-items="center" class="pds-property__text">
              <slot></slot>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Property text
      </pds-property>
    `);
  });

  it('renders with complex slot content', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property icon="info-circle">
        <span>Complex slot content</span>
      </pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property class="pds-property" icon="info-circle">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-box align-items="center" class="pds-property__icon" flex-shrink="0" justify-content="center">
              <pds-icon icon="info-circle" size="16px" aria-hidden="true"></pds-icon>
            </pds-box>
            <pds-box align-items="center" class="pds-property__text">
              <slot></slot>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        <span>Complex slot content</span>
      </pds-property>
    `);
  });

  it('renders without icon', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property>Property text without icon</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property class="pds-property">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-box align-items="center" class="pds-property__text">
              <slot></slot>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Property text without icon
      </pds-property>
    `);
  });

  it('renders with componentId', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property component-id="test-property">Property text</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property class="pds-property" component-id="test-property" id="test-property">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-box align-items="center" class="pds-property__text">
              <slot></slot>
            </pds-box>
          </pds-box>
        </mock:shadow-root>
        Property text
      </pds-property>
    `);
  });
});