import { newSpecPage } from '@stencil/core/testing';
import { PdsLink } from '../pds-link';

describe('pds-link', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: '<pds-link></pds-link>',
    });
    expect(root).toEqualHtml(`
      <pds-link>
        <mock:shadow-root>
          <a class="pds-link pds-link--inline pds-link--lg" part="link">
            <slot></slot>
          </a>
        </mock:shadow-root>
      </pds-link>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link component-id="test"></pds-link>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-link component-id="test">
        <mock:shadow-root>
          <a class="pds-link pds-link--inline pds-link--lg" id="test" part="link">
            <slot></slot>
          </a>
        </mock:shadow-root>
      </pds-link>
    `);
  });

  it('renders with color', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link color="accent"></pds-link>`,
    });
    expect(root).toEqualHtml(`
      <pds-link color="accent">
        <mock:shadow-root>
          <a class="pds-link pds-link--inline pds-link--lg" part="link" style="--color: var(--pine-color-accent);">
            <slot></slot>
          </a>
        </mock:shadow-root>
      </pds-link>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="#"></pds-link>`,
    });
    expect(root).toEqualHtml(`
      <pds-link href="#">
        <mock:shadow-root>
          <a class="pds-link pds-link--inline pds-link--lg" href="#" part="link">
            <slot>
              #
            </slot>
          </a>
        </mock:shadow-root>
      </pds-link>
    `);
  });

  it('renders the external icon when external is true', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="#" external="true"></pds-link>`,
    });

    const externalIcon = root?.shadowRoot?.querySelectorAll('pds-icon');
    expect(externalIcon?.length).toBe(1)
  });

  it('renders class name when size is assigned', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="#" font-size="md" external="true" />`,
    });

    const linkTag = root?.shadowRoot?.querySelector('a.pds-link--md');
    expect(linkTag).not.toBeNull();
  });

  it('renders "variant" class name when variant property is assigned', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="#" variant="plain" />`,
    });

    const linkTag = root?.shadowRoot?.querySelector('a.pds-link--plain');
    expect(linkTag).not.toBeNull();
  });
});
