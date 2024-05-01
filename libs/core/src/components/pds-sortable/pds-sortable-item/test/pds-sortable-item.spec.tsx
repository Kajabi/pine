import { newSpecPage } from '@stencil/core/testing';
import { PdsSortableItem } from '../pds-sortable-item';

import { handle } from '@pine-ds/icons/icons';

describe('pds-sortable-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `<pds-sortable-item>Content</pds-sortable-item>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-sortable-item class="pds-sortable-item">Content</pds-sortable-item>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `
        <pds-sortable-item component-id="default">Content</pds-sortable-item>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable-item class="pds-sortable-item" component-id="default" id="default">Content</pds-sortable-item>
    `);
  });

  it('renders with handle when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `
        <pds-sortable-item handle="true">
        </pds-sortable-item>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable-item class="pds-sortable-item" handle="true">
        <div class="pds-sortable-item__handle">
          <pds-icon icon="${handle}"></pds-icon>
        </div>
      </pds-sortable-item>
    `);
  });

  it('renders with actions when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `
        <pds-sortable-item enable-actions="true">
          <div slot="sortable-item-actions">Actions content</div>
        </pds-sortable-item>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable-item class="pds-sortable-item" enable-actions="true">
        <div class="pds-sortable-item__actions">
          <div slot="sortable-item-actions">Actions content</div>
        </div>
      </pds-sortable-item>
    `);
  });
});
