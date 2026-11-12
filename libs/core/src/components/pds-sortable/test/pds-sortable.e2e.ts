import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-sortable', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable></pds-sortable>');

    const element = await page.find('pds-sortable');
    expect(element).toHaveClass('hydrated');
  });

  // A DOM morph makes the host match the server's HTML: its attributes stay, but its classes don't,
  // including the scope class its CSS matches on.
  it('puts its layout back after its classes are stripped', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable class="consumer" border dividers></pds-sortable>');
    const layout = (el: HTMLElement) => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
        borderStyle: style.borderTopStyle,
        visibility: style.visibility,
      };
    };
    const before = await page.$eval('pds-sortable', layout);

    await page.$eval('pds-sortable', (el) => el.setAttribute('class', 'consumer'));
    await page.waitForChanges();

    expect(await page.$eval('pds-sortable', layout)).toEqual(before);
    expect(await page.find('pds-sortable')).toHaveClasses([
      'consumer',
      'hydrated',
      'sc-pds-sortable-h',
      'pds-sortable',
      'pds-sortable--bordered',
      'pds-sortable--divided',
    ]);
  });

  it('sets sortable item show-handle prop to true when handleType is set to "handle"', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-sortable handle-type="handle">
        <pds-sortable-item>Item 1</pds-sortable-item>
        <pds-sortable-item>Item 2</pds-sortable-item>
        <pds-sortable-item>Item 3</pds-sortable-item>
      </pds-sortable>`);

    const item = await page.find('.pds-sortable-item');
    expect(await item.getProperty('showHandle')).toBe(true);
  });

  it('reorders items when an item is dragged and dropped', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-sortable component-id="test">
        <pds-sortable-item>Item 1</pds-sortable-item>
        <pds-sortable-item>Item 2</pds-sortable-item>
        <pds-sortable-item>Item 3</pds-sortable-item>
      </pds-sortable>`);

    // Find and store references to sortable items.
    let items = await page.findAll('.pds-sortable-item');
    const items2 = await page.$$('.pds-sortable-item');

    // Get initial order by extracting text content of each item.
    const initialOrder = await Promise.all(items.map(async (item) => (await item.textContent).trim()));

    // Create references to the first and second items.
    const item1 = items2[0];
    const item2 = items2[1];

    // Get bounding box information for the first and second items.
    const item1BoundingBox = (await item1.boundingBox()) as any;
    const item2BoundingBox = (await item2.boundingBox()) as any;

    await page.setDragInterception(true); // Enable drag interception.

    // Simulate drag-and-drop interaction between the first and second items.
    await page.mouse.dragAndDrop({ x: item1BoundingBox.x + 5, y: item1BoundingBox.y + 5 }, { x: item2BoundingBox.x + 5, y: item2BoundingBox.y + 5 });

    // Replace waitForTimeout with a Promise-based delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.waitForChanges();

    // Update references to items after the interaction.
    items = await page.findAll('.pds-sortable-item');

    // Get updated order by extracting text content of each item.
    const updatedOrder = await Promise.all(items.map(async (item) => (await item.textContent).trim()));

    expect(updatedOrder).not.toEqual(initialOrder);
  });

  it('renders with disabled class when disabled prop is set', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-sortable component-id="test-disabled" disabled>
        <pds-sortable-item>Item 1</pds-sortable-item>
        <pds-sortable-item>Item 2</pds-sortable-item>
        <pds-sortable-item>Item 3</pds-sortable-item>
      </pds-sortable>`);

    const element = await page.find('pds-sortable');
    expect(element).toHaveClass('pds-sortable--disabled');
    expect(element).toHaveAttribute('disabled');
  });
});

describe('pds-sortable keyboard reordering', () => {
  const setup = async (attrs = '') => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-sortable component-id="list" ${attrs}>
        <pds-sortable-item>Alpha</pds-sortable-item>
        <pds-sortable-item>Bravo</pds-sortable-item>
        <pds-sortable-item>Charlie</pds-sortable-item>
      </pds-sortable>`);
    // The detail holds elements, which don't serialize out of the page, so keep the indexes.
    await page.$eval('pds-sortable', (el) => {
      const recorded: Record<string, unknown>[] = [];
      (window as unknown as { moves: Record<string, unknown>[] }).moves = recorded;
      el.addEventListener('pdsSortableItemMoved', (ev: CustomEvent) => {
        const { oldIndex, newIndex, oldDraggableIndex, newDraggableIndex, item, from, to } = ev.detail;
        recorded.push({
          oldIndex,
          newIndex,
          oldDraggableIndex,
          newDraggableIndex,
          item: item.textContent.trim(),
          fromList: from === el && to === el,
        });
      });
    });
    const moved = () =>
      page.evaluate(() => (window as unknown as { moves: Record<string, unknown>[] }).moves);
    const order = () => page.$$eval('pds-sortable-item', (items) => items.map((item) => item.textContent?.trim()));
    const announcement = () => page.$eval('.pds-sortable__live-region', (region) => region.textContent?.trim());
    const focusedText = () =>
      page.evaluate(() => document.activeElement?.closest('pds-sortable-item')?.textContent?.trim());
    return { page, moved, order, announcement, focusedText };
  };

  it('reorders a row with Space, the arrow keys and Enter, keeping focus on it', async () => {
    const { page, moved, order, announcement, focusedText } = await setup();

    await page.keyboard.press('Tab');
    expect(await focusedText()).toBe('Alpha');

    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).not.toBeNull();
    expect(await announcement()).toContain('Alpha, picked up. Position 1 of 3.');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await order()).toEqual(['Bravo', 'Charlie', 'Alpha']);
    expect(await announcement()).toBe('Alpha, moved to position 3 of 3');
    expect(await focusedText()).toBe('Alpha');

    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await announcement()).toBe('Alpha, dropped at position 3 of 3');
    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).toBeNull();
    expect(await moved()).toEqual([
      { oldIndex: 0, newIndex: 2, oldDraggableIndex: 0, newDraggableIndex: 2, item: 'Alpha', fromList: true },
    ]);
    expect(await focusedText()).toBe('Alpha');
  });

  it('stays put at the first and last positions', async () => {
    const { page, order } = await setup();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowUp');
    await page.waitForChanges();
    expect(await order()).toEqual(['Alpha', 'Bravo', 'Charlie']);

    await page.keyboard.press('End');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await order()).toEqual(['Bravo', 'Charlie', 'Alpha']);
  });

  it('cancels with Escape and restores the original order', async () => {
    const { page, moved, order, announcement, focusedText } = await setup();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(await order()).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(await announcement()).toBe('Reorder canceled. Alpha returned to position 1 of 3');
    expect(await moved()).toEqual([]);
    expect(await focusedText()).toBe('Alpha');
  });

  it('reorders from the handle with handle-type="handle"', async () => {
    const { page, moved, order } = await setup('handle-type="handle"');

    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toBe('Reorder Alpha');

    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(await order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
    expect(await moved()).toHaveLength(1);
  });

  it('keeps the last row without a divider after a keyboard reorder starts', async () => {
    const { page } = await setup('dividers border');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await page.$('.pds-sortable__live-region')).not.toBeNull();

    const lastBorder = await page.$eval('pds-sortable-item:last-of-type', (el) => getComputedStyle(el).borderBottomWidth);
    expect(lastBorder).toBe('0px');
  });

  it('marks the handle pressed while the item is picked up', async () => {
    const { page } = await setup();
    const pressed = () => page.evaluate(() => document.activeElement?.getAttribute('aria-pressed'));

    await page.keyboard.press('Tab');
    expect(await pressed()).toBe('false');
    await page.keyboard.press('Space');
    expect(await pressed()).toBe('true');
    await page.keyboard.press('Escape');
    expect(await pressed()).toBe('false');
  });

  it('scrolls the picked-up item into view as it moves', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 600, height: 300 });
    const rows = Array.from({ length: 30 }, (_, i) => `<pds-sortable-item>Row ${i + 1}</pds-sortable-item>`).join('');
    await page.setContent(`<pds-sortable component-id="long">${rows}</pds-sortable>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('End');
    await page.waitForChanges();

    const inView = await page.evaluate(() => {
      const rect = document.activeElement?.closest('pds-sortable-item')?.getBoundingClientRect();
      return !!rect && rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(inView).toBe(true);
  });

  it('is not reachable from the keyboard when disabled', async () => {
    const { page } = await setup('disabled');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
  });

  it('keeps the live region in the host\'s named slot', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="host-slot-parent">
        <pds-sortable component-id="slotted" slot="footer">
          <pds-sortable-item>Alpha</pds-sortable-item>
          <pds-sortable-item>Bravo</pds-sortable-item>
        </pds-sortable>
      </div>`);
    await page.waitForChanges();

    const regionSlot = await page.$eval('.pds-sortable__live-region', (region) => region.getAttribute('slot'));
    expect(regionSlot).toBe('footer');
  });

  it('drops a picked-up item when focus moves into an iframe, unlike a real window switch', async () => {
    const { page } = await setup();
    await page.$eval('pds-sortable', (el) => {
      const frame = document.createElement('iframe');
      frame.id = 'escape-frame';
      frame.src = 'about:blank';
      el.insertAdjacentElement('afterend', frame);
    });

    // Focus moving into an iframe: `relatedTarget` is null and `document.hasFocus()` goes false too,
    // but the iframe becomes `document.activeElement` rather than nothing taking focus.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).not.toBeNull();

    await page.$eval('#escape-frame', (frame: HTMLIFrameElement) => frame.focus());
    await page.waitForChanges();

    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).toBeNull();
  });

  it('keeps an item grabbed when nothing else in the document takes focus', async () => {
    const { page } = await setup();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).not.toBeNull();

    // A real window/app switch: the handle loses focus with nothing else taking it, and
    // `document.hasFocus()` goes false, which is what distinguishes it from the iframe case above.
    await page.evaluate(() => {
      const original = document.hasFocus;
      document.hasFocus = () => false;
      (document.activeElement as HTMLElement)?.blur();
      document.hasFocus = original;
    });
    await page.waitForChanges();

    expect(await page.find('pds-sortable-item.pds-sortable-item--grabbed')).not.toBeNull();
  });

  it('still counts drag indexes from the items after the live region is added', async () => {
    const { page, moved } = await setup();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Escape');
    // A consumer appending an item lands it after the live region.
    await page.$eval('pds-sortable', (el) => {
      const item = document.createElement('pds-sortable-item');
      item.textContent = 'Delta';
      el.appendChild(item);
    });
    await page.waitForChanges();

    const items = await page.$$('pds-sortable-item');
    const from = (await items[3].boundingBox()) as { x: number; y: number };
    const to = (await items[0].boundingBox()) as { x: number; y: number };
    await page.setDragInterception(true);
    await page.mouse.dragAndDrop({ x: from.x + 5, y: from.y + 5 }, { x: to.x + 5, y: to.y + 5 });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.waitForChanges();

    const moves = await moved();
    expect(moves).toHaveLength(1);
    expect(moves[0].oldIndex).toBe(3);
  });
});

describe('pds-sortable accessibility', () => {
  it('has no axe violations with an item picked up', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-sortable component-id="list">
        <pds-sortable-item enable-actions>Item 1<a slot="sortable-item-actions" href="#">Edit</a></pds-sortable-item>
        <pds-sortable-item>Item 2</pds-sortable-item>
      </pds-sortable>
    `);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-sortable component-id="list" handle-type="handle">
        <pds-sortable-item>Item 1</pds-sortable-item>
        <pds-sortable-item>Item 2</pds-sortable-item>
        <pds-sortable-item>Item 3</pds-sortable-item>
      </pds-sortable>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-sortable-item wrote, including the ones its CSS selects on.
describe('pds-sortable-item after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable><pds-sortable-item class="consumer">Item</pds-sortable-item></pds-sortable>');

    await expectStylingSurvivesStrip(page, 'pds-sortable-item');
  });
});
