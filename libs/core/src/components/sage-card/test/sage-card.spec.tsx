import { newSpecPage } from '@stencil/core/testing';
import { SageCard } from '../sage-card';

describe('sage-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card class="sage-card has-border sage-card--padding-md sage-card--shadow-none">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-card>
    `);
  });

  it('renders with set padding when padding prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card padding="sm"></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card padding="sm" class="sage-card has-border sage-card--padding-sm sage-card--shadow-none">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </sage-card>
    `);
  });

  it('renders with no border when border is false', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card border="false"></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card border="false" class="sage-card sage-card--padding-md sage-card--shadow-none">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </sage-card>
    `);
  });

  it('renders with set shadow when shadow prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card shadow="sm"></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card shadow="sm" class="sage-card has-border sage-card--padding-md sage-card--shadow-sm">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </sage-card>
    `);
  });

  it('renders with background color when bg-color prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card bg-color="#CCCCCC" border="false"></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card bg-color="#CCCCCC" border="false" class="sage-card sage-card--padding-md sage-card--shadow-none" style="background-color: #CCCCCC;">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </sage-card>
    `);
  });
});
