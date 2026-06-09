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

  it('renders with download attribute when download prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="/file.pdf" download="">Download</pds-link>`,
    });

    const anchor = root?.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('download')).toBe('');
  });

  it('renders with download attribute with a custom filename', async () => {
    const { root } = await newSpecPage({
      components: [PdsLink],
      html: `<pds-link href="/file.pdf" download="my-file.pdf">Download</pds-link>`,
    });

    const anchor = root?.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('download')).toBe('my-file.pdf');
  });

  describe('turbo props', () => {
    it('renders data-turbo on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo="true">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo')).toBe('true');
    });

    it('renders data-turbo-frame on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-frame="admin-content">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-frame')).toBe('admin-content');
    });

    it('renders data-turbo-action on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-action="replace">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-action')).toBe('replace');
    });

    it('renders data-turbo-method on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-method="delete">Delete</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-method')).toBe('delete');
    });

    it('renders data-turbo-confirm on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-confirm="Are you sure?">Delete</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-confirm')).toBe('Are you sure?');
    });

    it('renders data-turbo-stream on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-stream="true">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-stream')).toBe('true');
    });

    it('renders data-turbo-prefetch on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-prefetch="false">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-prefetch')).toBe('false');
    });

    it('renders data-turbo-preload on the inner anchor', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo-preload="true">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo-preload')).toBe('true');
    });

    it('omits turbo data attributes when props are not set', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('data-turbo')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-frame')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-action')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-method')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-confirm')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-stream')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-prefetch')).toBe(false);
      expect(anchor?.hasAttribute('data-turbo-preload')).toBe(false);
    });

    it('renders multiple turbo attributes together', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" turbo="true" turbo-frame="content" turbo-action="advance">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('data-turbo')).toBe('true');
      expect(anchor?.getAttribute('data-turbo-frame')).toBe('content');
      expect(anchor?.getAttribute('data-turbo-action')).toBe('advance');
    });
  });
});
