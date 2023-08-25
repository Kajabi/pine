import { newE2EPage } from '@stencil/core/testing';

describe('pds-sortable', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable></pds-sortable>');

    const element = await page.find('pds-sortable');
    expect(element).toHaveClass('hydrated');
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
    await page.mouse.dragAndDrop(
      { x: item1BoundingBox.x + 5, y: item1BoundingBox.y + 5 },
      { x: item2BoundingBox.x + 5, y: item2BoundingBox.y + 5 }
    );
    // Wait for sorting animation and changes to complete.
    await page.waitForTimeout(300);
    await page.waitForChanges();

    // Update references to items after the interaction.
    items = await page.findAll('.pds-sortable-item');

    // Get updated order by extracting text content of each item.
    const updatedOrder = await Promise.all(items.map(async (item) => (await item.textContent).trim()));

    expect(updatedOrder).not.toEqual(initialOrder);
  });
});
