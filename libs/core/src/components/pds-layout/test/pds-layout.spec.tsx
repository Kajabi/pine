import { newSpecPage } from '@stencil/core/testing';
import { PdsLayout } from '../pds-layout';

describe('pds-layout', () => {
  it('renders with default tag', async () => {
    const page = await newSpecPage({
      components: [PdsLayout],
      html: `<pds-layout></pds-layout>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-layout>
        <mock:shadow-root>
          <div part="container"><slot></slot></div>
        </mock:shadow-root>
      </pds-layout>
    `);
  });

  describe('size prop', () => {
    it.each(['sm', 'md', 'lg', 'xl', 'full'])('applies named size class for "%s"', async (size) => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout size="${size}"></pds-layout>`,
      });
      expect(page.root.classList.contains(`pds-layout--${size}`)).toBe(true);
    });

    it('does not apply a size class for named sizes', async () => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout size="md"></pds-layout>`,
      });
      expect(page.root.style.getPropertyValue('--pine-layout-max-width')).toBe('');
    });

    it('applies CSS custom property for an arbitrary length value', async () => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout size="640px"></pds-layout>`,
      });
      expect(page.root.style.getPropertyValue('--pine-layout-max-width')).toBe('640px');
      expect(page.root.classList.contains('pds-layout--640px')).toBe(false);
    });

    it('does not set max-width when size is omitted', async () => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout></pds-layout>`,
      });
      expect(page.root.style.getPropertyValue('--pine-layout-max-width')).toBe('');
      expect(page.root.className).toBe('');
    });
  });

  describe('tag prop', () => {
    it.each(['div', 'main', 'section', 'article'])('renders <%s> as inner container', async (tag) => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout tag="${tag}"></pds-layout>`,
      });
      expect(page.root.shadowRoot.querySelector(tag)).not.toBeNull();
    });
  });

  describe('centered prop', () => {
    it('does not set margin-inline when centered is true (default)', async () => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout></pds-layout>`,
      });
      expect(page.root.style.marginInline).toBe('');
    });

    it('sets margin-inline: 0 when centered is false', async () => {
      const page = await newSpecPage({
        components: [PdsLayout],
        html: `<pds-layout centered="false"></pds-layout>`,
      });
      expect(page.root.style.marginInline).toBe('0');
    });
  });
});
