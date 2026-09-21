import { newSpecPage } from '@stencil/core/testing';
import { PdsSortableItem } from '../pds-sortable-item';

import { handle as handleIcon } from '@pine-ds/icons/icons';
import { expectReconnectSafe } from '../../../../utils/test/reconnect-safety';

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

  it('renders with handle icon when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortableItem],
      html: `
        <pds-sortable-item show-handle="true">
        </pds-sortable-item>
      `,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable-item class="pds-sortable-item" show-handle="true">
        <div class="pds-sortable-item__handle">
          <pds-icon aria-hidden="true" icon="${handleIcon}"></pds-icon>
        </div>
      </pds-sortable-item>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM. There's no wrapper around the default
    // slot to relocate stale content into, so stale handle/actions siblings are just
    // left in place: the fresh handle lands first (JSX declares it first) and the
    // fresh actions wrapper lands last (JSX declares it last).
    it('discards the duplicate handle and rescues actions content into the fresh wrapper', async () => {
      const page = await newSpecPage({
        components: [PdsSortableItem],
        html: `
          <pds-sortable-item show-handle="true" enable-actions="true" class="pds-sortable-item">
            <div class="pds-sortable-item__handle"><pds-icon aria-hidden="true" icon="handle"></pds-icon></div>
            Content
            <div class="pds-sortable-item__actions"><button slot="sortable-item-actions">Delete</button></div>
          </pds-sortable-item>
        `,
      });

      expect(page.root?.querySelectorAll('.pds-sortable-item__handle').length).toBe(1);
      expect(page.root?.querySelectorAll('.pds-sortable-item__actions').length).toBe(1);
      expect(page.root?.textContent?.trim()).toContain('Content');
      expect(page.root?.querySelector('.pds-sortable-item__actions button')).not.toBeNull();
      expect(page.root?.querySelector('.pds-sortable-item__actions button')?.textContent?.trim()).toBe('Delete');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsSortableItem],
        html: `<pds-sortable-item show-handle="true">Content</pds-sortable-item>`,
      });

      expect(page.root?.querySelectorAll('.pds-sortable-item__handle').length).toBe(1);
      expect(page.root?.textContent?.trim()).toContain('Content');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe(
        [PdsSortableItem],
        `<pds-sortable-item show-handle="true" enable-actions="true">Content<button slot="sortable-item-actions">Delete</button></pds-sortable-item>`,
      );
    });
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
