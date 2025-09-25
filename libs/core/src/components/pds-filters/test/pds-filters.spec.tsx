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

  it('renders with component-id', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters component-id="test-filters"></pds-filters>`,
    });

    expect(page.root.id).toBe('test-filters');
  });

  it('has correct CSS classes for layout', async () => {
    const page = await newSpecPage({
      components: [PdsFilters],
      html: `<pds-filters></pds-filters>`,
    });

    const container = page.root.shadowRoot.querySelector('.pds-filters');
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

    const slot = page.root.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });
});
