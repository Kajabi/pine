import { newE2EPage } from '@stencil/core/testing';

describe('pds-filters e2e', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-filters></pds-filters>');

    const element = await page.find('pds-filters');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with child pds-filter components', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="filter1" text="Filter 1">
          <p>Content 1</p>
        </pds-filter>
        <pds-filter component-id="filter2" text="Filter 2">
          <p>Content 2</p>
        </pds-filter>
      </pds-filters>
    `);

    const filters = await page.find('pds-filters');
    const childFilters = await page.findAll('pds-filter');

    expect(filters).toHaveClass('hydrated');
    expect(childFilters).toHaveLength(2);
  });

  it('manages layout with proper spacing', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="filter1" text="Filter 1">Content</pds-filter>
        <pds-filter component-id="filter2" text="Filter 2">Content</pds-filter>
        <pds-filter component-id="filter3" text="Filter 3">Content</pds-filter>
      </pds-filters>
    `);

    const filtersContainer = await page.find('pds-filters >>> .pds-filters');

    // Check that container has flex layout
    const containerStyles = await filtersContainer.getComputedStyle();
    expect(containerStyles.display).toBe('flex');
    expect(containerStyles.flexWrap).toBe('wrap');
  });

  it('ensures only one popover is open at a time', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="filter1" text="Filter 1">
          <p>Content 1</p>
        </pds-filter>
        <pds-filter component-id="filter2" text="Filter 2">
          <p>Content 2</p>
        </pds-filter>
        <pds-filter component-id="filter3" text="Filter 3">
          <p>Content 3</p>
        </pds-filter>
      </pds-filters>
    `);

    const trigger1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__trigger');
    const trigger2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__trigger');
    const trigger3 = await page.find('pds-filter[component-id="filter3"] >>> .pds-filter__trigger');

    // Open first filter
    await trigger1.click();
    await page.waitForChanges();

    let popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    let popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');
    let popover3 = await page.find('pds-filter[component-id="filter3"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(await popover1.isVisible()).toBe(true);
    expect(popover2).toBeTruthy();
    expect(await popover2.isVisible()).toBe(false);
    expect(popover3).toBeTruthy();
    expect(await popover3.isVisible()).toBe(false);

    // Open second filter - should close first
    await trigger2.click();
    await page.waitForChanges();

    popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');
    popover3 = await page.find('pds-filter[component-id="filter3"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(await popover1.isVisible()).toBe(false);
    expect(popover2).toBeTruthy();
    expect(await popover2.isVisible()).toBe(true);
    expect(popover3).toBeTruthy();
    expect(await popover3.isVisible()).toBe(false);

    // Open third filter - should close second
    await trigger3.click();
    await page.waitForChanges();

    popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');
    popover3 = await page.find('pds-filter[component-id="filter3"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(await popover1.isVisible()).toBe(false);
    expect(popover2).toBeTruthy();
    expect(await popover2.isVisible()).toBe(false);
    expect(popover3).toBeTruthy();
    expect(await popover3.isVisible()).toBe(true);
  });

  it('works with different filter variants', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="default" variant="default" text="Default">Content</pds-filter>
        <pds-filter component-id="selected" variant="selected" text="Selected">Content</pds-filter>
        <pds-filter component-id="more" variant="more" text="More">Content</pds-filter>
        <pds-filter component-id="clear" variant="clear" text="Clear">Content</pds-filter>
      </pds-filters>
    `);

    // Check that all variants render correctly
    const defaultTrigger = await page.find('pds-filter[component-id="default"] >>> .pds-filter__trigger');
    const selectedTrigger = await page.find('pds-filter[component-id="selected"] >>> .pds-filter__trigger');
    const moreTrigger = await page.find('pds-filter[component-id="more"] >>> .pds-filter__trigger');
    const clearTrigger = await page.find('pds-filter[component-id="clear"] >>> .pds-filter__trigger');

    expect(defaultTrigger).toHaveClass('pds-filter__trigger--default');
    expect(selectedTrigger).toHaveClass('pds-filter__trigger--selected');
    expect(moreTrigger).toHaveClass('pds-filter__trigger--more');
    expect(clearTrigger).toHaveClass('pds-filter__trigger--clear');

    // Test that they can all open/close
    await defaultTrigger.click();
    await page.waitForChanges();
    let popover = await page.find('pds-filter[component-id="default"] >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);

    await selectedTrigger.click();
    await page.waitForChanges();
    popover = await page.find('pds-filter[component-id="selected"] >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);
  });

  it('handles responsive behavior', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 300px;">
        <pds-filters>
          <pds-filter component-id="filter1" text="Very Long Filter Name 1">Content</pds-filter>
          <pds-filter component-id="filter2" text="Very Long Filter Name 2">Content</pds-filter>
          <pds-filter component-id="filter3" text="Very Long Filter Name 3">Content</pds-filter>
          <pds-filter component-id="filter4" text="Very Long Filter Name 4">Content</pds-filter>
        </pds-filters>
      </div>
    `);

    const filtersContainer = await page.find('pds-filters >>> .pds-filters');
    const containerStyles = await filtersContainer.getComputedStyle();

    // Container should use flex-wrap to handle overflow
    expect(containerStyles.flexWrap).toBe('wrap');
  });

  it('maintains accessibility across multiple filters', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="filter1" text="Filter 1">Content 1</pds-filter>
        <pds-filter component-id="filter2" text="Filter 2">Content 2</pds-filter>
      </pds-filters>
    `);

    const trigger1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__trigger');
    const trigger2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__trigger');

    // Both triggers should be focusable and have proper ARIA
    await trigger1.focus();
    expect(await trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(await trigger1.getAttribute('aria-haspopup')).toBe('true');

    await trigger2.focus();
    expect(await trigger2.getAttribute('aria-expanded')).toBe('false');
    expect(await trigger2.getAttribute('aria-haspopup')).toBe('true');

    // Keyboard navigation should work
    await page.keyboard.press('Tab'); // Should move focus
    await page.keyboard.press('Enter'); // Should activate focused filter
    await page.waitForChanges();

    // One popover should be open
    const allPopovers = await page.findAll('pds-filter >>> .pds-filter__popover');
    const visiblePopovers = [];
    for (const popover of allPopovers) {
      if (await popover.isVisible()) {
        visiblePopovers.push(popover);
      }
    }
    expect(visiblePopovers.length).toBeLessThanOrEqual(1);
  });
});
