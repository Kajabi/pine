import { newSpecPage } from '@stencil/core/testing';
import { PdsCard } from '../pds-card';

describe('pds-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCard],
      html: `<pds-card></pds-card>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-card class="pds-card has-border pds-card--padding-md">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-card>
    `);
  });

  it('renders with set padding when padding prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCard],
      html: `<pds-card padding="sm"></pds-card>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-card padding="sm" class="pds-card has-border pds-card--padding-sm">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </pds-card>
    `);
  });

  it('renders with no border when border is false', async () => {
    const page = await newSpecPage({
      components: [PdsCard],
      html: `<pds-card border="false"></pds-card>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-card border="false" class="pds-card pds-card--padding-md">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </pds-card>
    `);
  });

  it('renders with set shadow when shadow prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCard],
      html: `<pds-card shadow="sm"></pds-card>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-card shadow="sm" class="pds-card has-border pds-card--padding-md pds-card--shadow-sm">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </pds-card>
    `);
  });

  it('renders with background color when bg-color prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCard],
      html: `<pds-card bg-color="#CCCCCC" border="false"></pds-card>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-card bg-color="#CCCCCC" border="false" class="pds-card pds-card--padding-md" style="--background-custom: #CCCCCC;">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </pds-card>
    `);
  });
});
