import { newSpecPage } from '@stencil/core/testing';
import { PdsSortable } from '../pds-sortable';

describe('pds-sortable', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable></pds-sortable>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-sortable>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-sortable>
    `);
  });
});
