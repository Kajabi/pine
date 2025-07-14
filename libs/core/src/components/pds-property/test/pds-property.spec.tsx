import { newSpecPage } from '@stencil/core/testing';
import { PdsProperty } from '../pds-property';

describe('pds-property', () => {
  it('renders with slot content', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property>Property text</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property>
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-icon icon="star" size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
            <slot></slot>
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
      <pds-property icon="check-circle">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-icon icon="check-circle" size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
            <slot></slot>
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
      <pds-property icon="info-circle">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-icon icon="info-circle" size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
            <slot></slot>
          </pds-box>
        </mock:shadow-root>
        <span>Complex slot content</span>
      </pds-property>
    `);
  });

  it('renders without icon (uses default star)', async () => {
    const page = await newSpecPage({
      components: [PdsProperty],
      html: `<pds-property>Property text without icon</pds-property>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-property>
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-icon icon="star" size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
            <slot></slot>
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
      <pds-property component-id="test-property" id="test-property">
        <mock:shadow-root>
          <pds-box align-items="center" gap="xs">
            <pds-icon icon="star" size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
            <slot></slot>
          </pds-box>
        </mock:shadow-root>
        Property text
      </pds-property>
    `);
  });
});
