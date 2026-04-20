import { newSpecPage } from '@stencil/core/testing';
import { PdsContainer } from '../pds-container';

describe('pds-container', () => {
  it('renders with default tag', async () => {
    const page = await newSpecPage({
      components: [PdsContainer],
      html: `<pds-container></pds-container>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-container>
        <mock:shadow-root>
          <div part="container"><slot></slot></div>
        </mock:shadow-root>
      </pds-container>
    `);
  });

  describe('size prop', () => {
    it.each(['sm', 'md', 'lg', 'xl', 'full'])('applies named size class for "%s"', async (size) => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container size="${size}"></pds-container>`,
      });
      expect(page.root.classList.contains(`pds-container--${size}`)).toBe(true);
    });

    it('does not set a CSS custom property for named sizes', async () => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container size="md"></pds-container>`,
      });
      expect(page.root.style.getPropertyValue('--pine-container-max-width')).toBe('');
    });

    it('applies CSS custom property for an arbitrary length value', async () => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container size="640px"></pds-container>`,
      });
      expect(page.root.style.getPropertyValue('--pine-container-max-width')).toBe('640px');
      expect(page.root.classList.contains('pds-container--640px')).toBe(false);
    });

    it('does not set max-width when size is omitted', async () => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container></pds-container>`,
      });
      expect(page.root.style.getPropertyValue('--pine-container-max-width')).toBe('');
      expect(page.root.className).toBe('');
    });
  });

  describe('tag prop', () => {
    it.each(['div', 'main', 'section', 'article'])('renders <%s> as inner container', async (tag) => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container tag="${tag}"></pds-container>`,
      });
      expect(page.root.shadowRoot.querySelector(tag)).not.toBeNull();
    });
  });

  describe('centered prop', () => {
    it('does not set margin-inline when centered is true (default)', async () => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container></pds-container>`,
      });
      expect(page.root.style.marginInline).toBe('');
    });

    it('sets margin-inline: 0 when centered is false', async () => {
      const page = await newSpecPage({
        components: [PdsContainer],
        html: `<pds-container centered="false"></pds-container>`,
      });
      expect(page.root.style.marginInline).toBe('0');
    });
  });
});
