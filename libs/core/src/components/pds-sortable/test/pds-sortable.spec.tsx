import { newSpecPage } from '@stencil/core/testing';
import { PdsSortable } from '../pds-sortable';
import { expectReconnectSafe } from '../../../utils/test/reconnect-safety';

describe('pds-sortable', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--handle-type-row">Content</pds-sortable>
    `);
  });

  it('does not write component-id onto the host id', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable component-id="test">Content</pds-sortable>`,
    });

    expect(page.root?.id).toBe('');
  });

  it('keeps an author-set id even when component-id is also set', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable id="author-id" component-id="test">Content</pds-sortable>`,
    });

    expect(page.root?.id).toBe('author-id');
  });

  it('renders with border when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable border>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--bordered pds-sortable--handle-type-row" border="">
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
      <pds-sortable class="pds-sortable pds-sortable--divided pds-sortable--handle-type-row" dividers="">
        Content
      </pds-sortable>
    `);
  });

  it('renders with handle type set to "handle"', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable handle-type="handle">Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--handle-type-handle" handle-type="handle">Content</pds-sortable>
    `);
  });

  it('renders with disabled class when disabled prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable disabled>Content</pds-sortable>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-sortable class="pds-sortable pds-sortable--disabled pds-sortable--handle-type-row" disabled="">
        Content
      </pds-sortable>
    `);
  });

  // Unlike pds-tab/pds-tabpanel/pds-modal*/pds-tooltip/pds-radio*/pds-sortable-item,
  // this component renders a bare `<slot>` with no wrapper element — there is nothing
  // for a page-cache (Turbo, bfcache) reconnect to nest a stale copy inside, and the
  // Host's own class list is entirely prop-driven, not slotted. Locks in that this
  // stays true.
  it('has no wrapper for a reconnect to nest a stale copy inside', async () => {
    const page = await newSpecPage({
      components: [PdsSortable],
      html: `<pds-sortable>Content</pds-sortable>`,
    });

    expect(page.root?.children.length).toBe(0);
    expect(page.root?.textContent?.trim()).toBe('Content');
  });

  it('is reconnect-safe (generic guard)', async () => {
    await expectReconnectSafe([PdsSortable], `<pds-sortable>Content</pds-sortable>`);
  });
});
