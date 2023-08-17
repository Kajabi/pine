import { newSpecPage } from '@stencil/core/testing';
import { PdsSortable } from '../pds-sortable';

describe('pds-sortable', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable">Content</pds-sortable>
    `);
  });

  it('renders with border when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable border>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--bordered" border="">
        Content
      </pds-sortable>
    `);
  });

  it('renders with dividers when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable dividers>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--divided" dividers="">
        Content
      </pds-sortable>
    `);
  });

});
