import { newSpecPage } from '@stencil/core/testing';
import { PdsSortableItem } from '../pds-sortable-item';

describe('pds-sortable-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `<pds-sortable-item></pds-sortable-item>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-sortable-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-sortable-item>
    `);
  });
});
