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

  describe('active (nav tab)', () => {
    it('sets aria-current and reflects active to the host when active is set', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page" active="true">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('aria-current')).toBe('page');
      // Reflected to the host so the `:host([active])` styles outrank the color
      // presets — that reflected attribute is the styling contract, not a class.
      expect(root?.hasAttribute('active')).toBe(true);
    });

    it('omits aria-current and the reflected active attribute by default', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="/page">Page</pds-link>`,
      });

      const anchor = root?.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('aria-current')).toBe(false);
      expect(root?.hasAttribute('active')).toBe(false);
    });
  });

  describe('external label', () => {
    it('labels the external icon "(opens in a new tab)" by default', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="#" external="true">Docs</pds-link>`,
      });
      expect(root?.shadowRoot?.querySelector('pds-icon')?.getAttribute('aria-label')).toBe('(opens in a new tab)');
    });

    it('uses a custom external-label in place of the default', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="#" external="true" external-label="s'ouvre dans un nouvel onglet">Docs</pds-link>`,
      });
      expect(root?.shadowRoot?.querySelector('pds-icon')?.getAttribute('aria-label')).toBe("s'ouvre dans un nouvel onglet");
    });

    it('makes the icon decorative when external-label is empty', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="#" external="true" external-label="">Docs</pds-link>`,
      });
      const icon = root?.shadowRoot?.querySelector('pds-icon');
      expect(icon?.hasAttribute('aria-label')).toBe(false);
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('falls back to the default label when externalLabel is cleared to undefined or null', async () => {
      for (const value of [undefined, null]) {
        const page = await newSpecPage({
          components: [PdsLink],
          html: `<pds-link href="#" external="true" external-label="Custom">Docs</pds-link>`,
        });
        (page.root as HTMLPdsLinkElement).externalLabel = value as unknown as string;
        await page.waitForChanges();
        const icon = page.root?.shadowRoot?.querySelector('pds-icon');
        expect(icon?.getAttribute('aria-label')).toBe('(opens in a new tab)');
        expect(icon?.hasAttribute('aria-hidden')).toBe(false);
      }
    });

    it('hides the icon when target keeps the link in the same tab', async () => {
      const { root } = await newSpecPage({
        components: [PdsLink],
        html: `<pds-link href="#" external="true" target="_self">Docs</pds-link>`,
      });
      const icon = root?.shadowRoot?.querySelector('pds-icon');
      expect(icon?.hasAttribute('aria-label')).toBe(false);
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
