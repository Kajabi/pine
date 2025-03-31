import { newE2EPage } from '@stencil/core/testing';

describe('pds-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
  `);
    const element = await page.find(`pds-tabs`);
    expect(element).toHaveClass('hydrated');
    const tabEdges = await page.find(`.pds-tab-edge`);
    expect(tabEdges).toBeNull();
  });

  it('renders availability variant', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="availability">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
  `);
    const element = await page.find(`pds-tabs`);
    expect(element).toHaveClass('pds-tabs--availability');
    const tabEdges = await page.find(`.pds-tab-edge`);
    expect(tabEdges).not.toBeNull();
  });

  it('renders filter variant', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="filter">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
  `);
    const element = await page.find(`pds-tabs`);
    expect(element).toHaveClass('pds-tabs--filter');
    const tabEdges = await page.find(`.pds-tab-edge`);
    expect(tabEdges).toBeNull();
  });

  it('renders passed activeTabName on page load', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="testthree" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    const expectedActiveButton = await page.find(`pds-tab[name="two"] > button`);
    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch("true");
    const expectedActivePanel = await page.find(`pds-tabpanel[name="two"] > div`);
    expect(expectedActivePanel).toHaveClass('is-active');
  });

  it('renders new activeTabName on button click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test3" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    const inactiveTabButton = await page.find(`pds-tab[name="one"] > button`);
    const event = await page.spyOnEvent('pdsTabClick');
    inactiveTabButton.click();
    await page.waitForChanges();
    expect(event).toHaveReceivedEvent();
    const expectedActiveButton = await page.find(`pds-tab[name="one"] > button`);
    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch("true");
    const expectedActivePanel = await page.find(`pds-tabpanel[name="one"] > div`);
    expect(expectedActivePanel).toHaveClass('is-active');
  });

  it('renders new activeTabName when arrows move focus to right', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test3" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    // Click inactive tab
    let tab = await page.find('pds-tab[name="one"] > button');
    tab.click();
    await page.waitForChanges();
    // Move focus to second tab
    page.keyboard.down("ArrowRight");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to past end of tabs forcing a loop to first tab
    page.keyboard.down("ArrowRight");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find(`pds-tab[name="one"] > button`);
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders new activeTab when arrows move focus to left', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test3" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    // Click inactive tab
    let tab = await page.find('pds-tab[name="two"] > button');
    tab.click();
    await page.waitForChanges();
    // Move focus to first tab
    page.keyboard.down("ArrowLeft");
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to past end of tabs forcing a loop to last tab
    page.keyboard.down("ArrowLeft");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders new activeTab when Home and End keys are pressed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test4" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tab name="three">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
        <pds-tabpanel name="three">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    // Check that second tab is active
    let tab = await page.find(`pds-tab[name="one"] > button`);
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Click inactive tab
    tab = await page.find('pds-tab[name="two"] > button');
    tab.click();
    await page.waitForChanges();

    // Add a small wait to ensure state updates are complete
    await new Promise(resolve => setTimeout(resolve, 300));

    // Move focus to first tab
    page.keyboard.down("Home");
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to last tab
    page.keyboard.down("End");
    await page.waitForChanges();
    // Confirm focus on last tab
    tab = await page.find('pds-tab[name="three"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders a11y correctly', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test4" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
      </pds-tabs>
    `);
    // Confirm active tab a11y
    let tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    expect(tab.getAttribute('role')).toMatch("tab");
    expect(tab.getAttribute('aria-controls')).toMatch("two-panel");
    expect(tab.getAttribute('tabindex')).toMatch("0");

    //Confirm active tabpanel a11y
    let tabpanel = await page.find('pds-tabpanel[name="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("two");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");

    // Confirm inactive tab a11y
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("false");
    expect(tab.getAttribute('aria-controls')).toMatch("one-panel");
    expect(tab.getAttribute('tabindex')).toMatch("-1");

    //Confirm inactive tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("one");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");

    // Click inactive tab
    tab.click();
    await page.waitForChanges();

    // Add a small wait to ensure state updates are complete
    await new Promise(resolve => setTimeout(resolve, 300));

    // Confirm previously active tab a11y
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("false");
    expect(tab.getAttribute('aria-controls')).toMatch("two-panel");
    expect(tab.getAttribute('tabindex')).toMatch("-1");

    //Confirm previously active tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("two");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");

    // Confirm new active tab a11y
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    expect(tab.getAttribute('aria-controls')).toMatch("one-panel");
    expect(tab.getAttribute('tabindex')).toMatch("0");

    //Confirm new active tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("one");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");
  });
});
