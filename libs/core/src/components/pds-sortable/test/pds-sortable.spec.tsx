import { newSpecPage } from '@stencil/core/testing';
import { PdsSortable } from '../pds-sortable';
import { PdsSortableItem } from '../pds-sortable-item/pds-sortable-item';
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

  describe('keyboard reordering', () => {
    const list = (attrs = '') => `
      <pds-sortable component-id="list" ${attrs}>
        <pds-sortable-item>Alpha</pds-sortable-item>
        <pds-sortable-item>Bravo</pds-sortable-item>
        <pds-sortable-item>Charlie</pds-sortable-item>
      </pds-sortable>`;

    const setup = async (attrs = '') => {
      const page = await newSpecPage({ components: [PdsSortable, PdsSortableItem], html: list(attrs) });
      const sortable = page.root as HTMLPdsSortableElement;
      const moved = jest.fn();
      sortable.addEventListener('pdsSortableItemMoved', moved);
      const order = () =>
        Array.from(sortable.querySelectorAll('pds-sortable-item')).map((item) => item.textContent?.trim());
      const itemAt = (index: number) => sortable.querySelectorAll('pds-sortable-item')[index] as HTMLElement;
      const handleOf = (item: HTMLElement) =>
        (item.querySelector('.pds-sortable-item__handle') as HTMLElement | null) ?? item;
      // Keys go to an item's handle, the button the keyboard reorders with.
      const press = async (item: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
        const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
        handleOf(item).dispatchEvent(ev);
        await page.waitForChanges();
        return ev;
      };
      const announcement = () => sortable.querySelector('.pds-sortable__live-region')?.textContent?.trim();
      return { page, sortable, moved, order, itemAt, handleOf, press, announcement };
    };

    it('gives each row a hidden handle button, labelled with the item, to reorder with', async () => {
      const { itemAt, handleOf } = await setup();
      const handle = handleOf(itemAt(1));

      expect(itemAt(1).hasAttribute('tabindex')).toBe(false);
      expect(handle).toHaveClass('pds-sortable-item__handle--hidden');
      expect(handle.getAttribute('role')).toBe('button');
      expect(handle.getAttribute('tabindex')).toBe('0');
      expect(handle.getAttribute('aria-label')).toBe('Reorder Bravo');
      expect(handle.getAttribute('aria-pressed')).toBe('false');
    });

    it('shows the handle button with handle-type="handle"', async () => {
      const { itemAt, handleOf } = await setup('handle-type="handle"');
      const handle = handleOf(itemAt(1));

      expect(handle).not.toHaveClass('pds-sortable-item__handle--hidden');
      expect(handle.getAttribute('role')).toBe('button');
      expect(handle.getAttribute('aria-label')).toBe('Reorder Bravo');
    });

    it('has no reorder buttons when disabled', async () => {
      const { itemAt } = await setup('disabled');
      expect(itemAt(0).querySelector('.pds-sortable-item__handle')).toBeNull();
      expect(itemAt(0).hasAttribute('tabindex')).toBe(false);
    });

    it('picks up with Space, moves with the arrow keys and drops with Enter', async () => {
      const { moved, order, itemAt, press, announcement } = await setup();
      const alpha = itemAt(0);

      expect((await press(alpha, ' ')).defaultPrevented).toBe(true);
      expect(alpha).toHaveClass('pds-sortable-item--grabbed');
      expect(alpha.querySelector('.pds-sortable-item__handle')?.getAttribute('aria-pressed')).toBe('true');
      expect(announcement()).toBe(
        'Alpha, picked up. Position 1 of 3. Press the arrow keys to move, Space or Enter to drop, Escape to cancel.',
      );

      await press(alpha, 'ArrowDown');
      expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
      expect(announcement()).toBe('Alpha, moved to position 2 of 3');

      await press(alpha, 'ArrowDown');
      expect(order()).toEqual(['Bravo', 'Charlie', 'Alpha']);
      await press(alpha, 'ArrowUp');
      expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
      expect(moved).not.toHaveBeenCalled();

      await press(alpha, 'Enter');
      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');
      expect(alpha.querySelector('.pds-sortable-item__handle')?.getAttribute('aria-pressed')).toBe('false');
      expect(announcement()).toBe('Alpha, dropped at position 2 of 3');
      expect(moved).toHaveBeenCalledTimes(1);
    });

    it('emits the same detail fields as a drag', async () => {
      const { sortable, moved, itemAt, press } = await setup();
      const bravo = itemAt(1);

      await press(bravo, 'Enter');
      await press(bravo, 'ArrowUp');
      await press(bravo, ' ');

      const detail = moved.mock.calls[0][0].detail;
      expect(detail.item).toBe(bravo);
      expect(detail.from).toBe(sortable);
      expect(detail.to).toBe(sortable);
      expect(detail.oldIndex).toBe(1);
      expect(detail.newIndex).toBe(0);
      expect(detail.oldDraggableIndex).toBe(1);
      expect(detail.newDraggableIndex).toBe(0);
      expect(detail.originalEvent.key).toBe(' ');
    });

    it('stops at the first and last positions', async () => {
      const { order, itemAt, press } = await setup();
      const alpha = itemAt(0);

      await press(alpha, ' ');
      await press(alpha, 'ArrowUp');
      expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie']);

      await press(alpha, 'End');
      expect(order()).toEqual(['Bravo', 'Charlie', 'Alpha']);
      await press(alpha, 'ArrowDown');
      expect(order()).toEqual(['Bravo', 'Charlie', 'Alpha']);

      await press(alpha, 'Home');
      expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie']);
    });

    it('puts the item back and emits nothing on Escape', async () => {
      const { moved, order, itemAt, press, announcement } = await setup();
      const alpha = itemAt(0);

      await press(alpha, ' ');
      await press(alpha, 'ArrowDown');
      await press(alpha, 'ArrowDown');
      const escape = await press(alpha, 'Escape');

      expect(escape.defaultPrevented).toBe(true);
      expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie']);
      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');
      expect(announcement()).toBe('Reorder canceled. Alpha returned to position 1 of 3');
      expect(moved).not.toHaveBeenCalled();
    });

    it('only reacts to keys on the handle, not the row', async () => {
      const { page, order, itemAt, press } = await setup('handle-type="handle"');
      const alpha = itemAt(0);

      alpha.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await page.waitForChanges();
      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');

      await press(alpha, ' ');
      await press(alpha, 'ArrowDown');
      expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
    });

    it('picks up and drops on a click that is not from a pointer, as screen readers send', async () => {
      const { page, moved, order, itemAt, handleOf, press } = await setup();
      const alpha = itemAt(0);
      const click = async (detail: number) => {
        handleOf(alpha).dispatchEvent(new MouseEvent('click', { bubbles: true, detail }));
        await page.waitForChanges();
      };

      await click(1);
      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');

      await click(0);
      expect(alpha).toHaveClass('pds-sortable-item--grabbed');
      await press(alpha, 'ArrowDown');
      await click(0);

      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');
      expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
      expect(moved).toHaveBeenCalledTimes(1);
    });

    it('drops a picked-up item when a pointer drag starts', async () => {
      const { sortable, moved, itemAt, press } = await setup();
      const alpha = itemAt(0);
      await press(alpha, ' ');
      await press(alpha, 'ArrowDown');

      itemAt(2).dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));

      expect(sortable.querySelector('.pds-sortable-item--grabbed')).toBeNull();
      expect(moved).toHaveBeenCalledTimes(1);
    });

    it('ignores keys from controls inside the row', async () => {
      const page = await newSpecPage({
        components: [PdsSortable, PdsSortableItem],
        html: `<pds-sortable><pds-sortable-item>Alpha<button>Edit</button></pds-sortable-item><pds-sortable-item>Bravo</pds-sortable-item></pds-sortable>`,
      });
      const button = page.root?.querySelector('button') as HTMLElement;
      const ev = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      button.dispatchEvent(ev);
      await page.waitForChanges();

      expect(ev.defaultPrevented).toBe(false);
      expect(page.root?.querySelector('.pds-sortable-item--grabbed')).toBeNull();
    });

    it('does nothing when disabled', async () => {
      const { itemAt, press } = await setup('disabled');
      const ev = await press(itemAt(0), ' ');
      expect(ev.defaultPrevented).toBe(false);
      expect(itemAt(0)).not.toHaveClass('pds-sortable-item--grabbed');
    });

    it('puts a picked-up item back when the list becomes disabled', async () => {
      const { page, sortable, order, itemAt, press } = await setup();
      const alpha = itemAt(0);
      await press(alpha, ' ');
      await press(alpha, 'ArrowDown');

      sortable.disabled = true;
      await page.waitForChanges();

      expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie']);
      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');
    });

    it('ignores key repeats and modified keys', async () => {
      const { itemAt, press } = await setup();
      await press(itemAt(0), ' ', { repeat: true });
      await press(itemAt(0), 'Enter', { ctrlKey: true });
      expect(itemAt(0)).not.toHaveClass('pds-sortable-item--grabbed');
    });

    it('takes translated announcements and labels', async () => {
      const page = await newSpecPage({
        components: [PdsSortable, PdsSortableItem],
        html: `
          <pds-sortable handle-type="handle" handle-label="Réorganiser {item}" item-moved-label="{item} : position {position} sur {total}" reorder-canceled-label="Annulé : {item}">
            <pds-sortable-item item-label="Premier">Alpha <small>description</small></pds-sortable-item>
            <pds-sortable-item>Bravo</pds-sortable-item>
          </pds-sortable>`,
      });
      const handle = page.root?.querySelector('.pds-sortable-item__handle') as HTMLElement;
      expect(handle.getAttribute('aria-label')).toBe('Réorganiser Premier');

      handle.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await page.waitForChanges();

      expect(page.root?.querySelector('.pds-sortable__live-region')?.textContent).toBe('Premier : position 2 sur 2');

      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await page.waitForChanges();
      expect(page.root?.querySelector('.pds-sortable__live-region')?.textContent).toBe('Annulé : Premier');
    });

    it('keeps the live region after the items', async () => {
      const { sortable, itemAt, press } = await setup();
      await press(itemAt(0), ' ');
      const region = sortable.querySelector('.pds-sortable__live-region');

      expect(region?.getAttribute('role')).toBe('status');
      expect(region?.getAttribute('aria-live')).toBe('polite');
      expect(sortable.lastElementChild).toBe(region);
    });

    it('drops the item where it is when focus leaves it', async () => {
      const { moved, itemAt, press } = await setup();
      const alpha = itemAt(0);
      await press(alpha, ' ');
      await press(alpha, 'ArrowDown');

      alpha.querySelector('.pds-sortable-item__handle')?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

      expect(alpha).not.toHaveClass('pds-sortable-item--grabbed');
      expect(moved).toHaveBeenCalledTimes(1);
      expect(moved.mock.calls[0][0].detail.newIndex).toBe(1);
    });
  });
});
