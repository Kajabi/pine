import { newSpecPage } from '@stencil/core/testing';
import { PdsFilters } from '../pds-filters';

describe('pds-filters', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters></pds-filters>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-filters>
        <mock:shadow-root>
          <div class="pds-filters">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pds-filters>
    `);
  });

  it('does not write component-id onto the host id', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters component-id="test-filters"></pds-filters>`,
    });

    expect(page.root?.id).toBe('');
  });

  it('keeps an author-set id even when component-id is also set', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters id="author-id" component-id="test-filters"></pds-filters>`,
    });

    expect(page.root?.id).toBe('author-id');
  });

  it('has correct CSS classes for layout', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters></pds-filters>`,
    });

    const container = page.root?.shadowRoot?.querySelector('.pds-filters');
    expect(container).toBeTruthy();
  });

  it('renders slotted content', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `
        <pds-filters>
          <div id="test-content">Filter content</div>
        </pds-filters>
      `,
    });

    const slot = page.root?.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });
});
