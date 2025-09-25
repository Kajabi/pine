import { newE2EPage } from '@stencil/core/testing';

describe('pds-filter e2e', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-filter component-id="test" text="Test Filter"></pds-filter>');

    const element = await page.find('pds-filter');
    expect(element).toHaveClass('hydrated');
  });

  it('shows and hides popover on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test Filter">
        <p>Popover content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Initially no popover
    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();

    // Click to open
    await trigger.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();

    // Click again to close
    await trigger.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('emits pds-filter-open and pds-filter-close events', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');
    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    // Click to open
    await trigger.click();
    expect(openEventSpy).toHaveReceivedEvent();

    // Click to close
    await trigger.click();
    expect(closeEventSpy).toHaveReceivedEvent();
  });

  it('emits pds-filter-clear event when clear variant is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" variant="clear" text="Clear">
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');
    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    const clearEventSpy = await filter.spyOnEvent('pdsFilterClear');

    // Click clear variant
    await trigger.click();
    expect(clearEventSpy).toHaveReceivedEventDetail({
      componentId: 'test-filter',
      text: 'Clear'
    });
  });

  it('clear variant does not open popover', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" variant="clear" text="Clear">
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Click clear variant
    await trigger.click();
    await page.waitForChanges();

    // Should not have popover
    const popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('supports keyboard navigation', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Focus the trigger
    await trigger.focus();

    // Press Enter to open
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('supports Space key activation', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    await trigger.focus();
    await page.keyboard.press(' ');
    await page.waitForChanges();

    const popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
  });

  it('closes on outside click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div>
        <pds-filter component-id="test" text="Test">
          <p>Content</p>
        </pds-filter>
        <div id="outside">Outside element</div>
      </div>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');
    const outside = await page.find('#outside');

    // Open popover
    await trigger.click();
    await page.waitForChanges();

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();

    // Click outside
    await outside.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('opens and closes programmatically', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');

    // Open programmatically
    await filter.callMethod('showFilter');
    await page.waitForChanges();

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();

    // Close programmatically
    await filter.callMethod('hideFilter');
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('shows different variants correctly', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div>
        <pds-filter id="default" component-id="default" variant="default" text="Default">
          <p>Default content</p>
        </pds-filter>
        <pds-filter id="selected" component-id="selected" variant="selected" text="Selected">
          <p>Selected content</p>
        </pds-filter>
        <pds-filter id="more" component-id="more" variant="more" text="More">
          <p>More content</p>
        </pds-filter>
        <pds-filter id="clear" component-id="clear" variant="clear" text="Clear">
          <p>Clear content</p>
        </pds-filter>
      </div>
    `);

    // Check default variant
    const defaultTrigger = await page.find('#default >>> .pds-filter__trigger');
    expect(defaultTrigger).toHaveClass('pds-filter__trigger--default');

    // Check selected variant has dropdown icon
    const selectedTrigger = await page.find('#selected >>> .pds-filter__trigger');
    expect(selectedTrigger).toHaveClass('pds-filter__trigger--selected');
    const dropdownIcon = await page.find('#selected >>> .pds-filter__dropdown-icon');
    expect(dropdownIcon).toBeTruthy();

    // Check more variant
    const moreTrigger = await page.find('#more >>> .pds-filter__trigger');
    expect(moreTrigger).toHaveClass('pds-filter__trigger--more');

    // Check clear variant has trash icon
    const clearTrigger = await page.find('#clear >>> .pds-filter__trigger');
    expect(clearTrigger).toHaveClass('pds-filter__trigger--clear');
    const trashIcon = await page.find('#clear >>> pds-icon');
    expect(trashIcon).toBeTruthy();
  });

  it('only allows one popover open at a time', async () => {
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

    const trigger1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__trigger');
    const trigger2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__trigger');

    // Open first popover
    await trigger1.click();
    await page.waitForChanges();

    let popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    let popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(popover2).toBeFalsy();

    // Open second popover - should close first
    await trigger2.click();
    await page.waitForChanges();

    popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');

    expect(popover1).toBeFalsy();
    expect(popover2).toBeTruthy();
  });

  it('has proper ARIA attributes', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Check initial ARIA attributes
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    expect(await trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(await trigger.getAttribute('aria-controls')).toBe('test-popover');

    // Open and check updated attributes
    await trigger.click();
    await page.waitForChanges();

    expect(await trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('displays slotted content in popover', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <h3>Custom Title</h3>
        <p>Custom content with <strong>formatting</strong></p>
        <button>Custom Button</button>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Open popover
    await trigger.click();
    await page.waitForChanges();

    // Check that slotted content is present
    const customTitle = await page.find('pds-filter h3');
    const customButton = await page.find('pds-filter button');

    expect(customTitle).toBeTruthy();
    expect(await customTitle.textContent).toBe('Custom Title');
    expect(customButton).toBeTruthy();
    expect(await customButton.textContent).toBe('Custom Button');
  });
});
