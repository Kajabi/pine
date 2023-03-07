import { newE2EPage } from '@stencil/core/testing';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
  `);
    const element = await page.find(`sage-tabs`);
    expect(element).toHaveClass('hydrated');
    const tabEdges = await page.find(`.sage-tab-edge`);
    expect(tabEdges).toBeNull();
  });

  it('renders availability variant', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test" variant="availability">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
  `);
    const element = await page.find(`sage-tabs`);
    expect(element).toHaveClass('sage-tabs--availability');
    const tabEdges = await page.find(`.sage-tab-edge`);
    expect(tabEdges).not.toBeNull();
  });

  it('renders filter variant', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test" variant="filter">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
  `);
    const element = await page.find(`sage-tabs`);
    expect(element).toHaveClass('sage-tabs--filter');
    const tabEdges = await page.find(`.sage-tab-edge`);
    expect(tabEdges).toBeNull();
  });

  it('renders passed activeTab on page load', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="testthree" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
    `);
    const expectedActiveButton = await page.find(`sage-tab[tab="two"] > button`);
    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch("true");
    const expectedActivePanel = await page.find(`sage-tabpanel[tab="two"] > div`);
    expect(expectedActivePanel).toHaveClass('is-active');
  });

  it('renders new activeTab on button click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test3" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
    `);
    const inactiveTabButton = await page.find(`sage-tab[tab="one"] > button`);
    const event = await page.spyOnEvent('tabClick');
    inactiveTabButton.click();
    await page.waitForChanges();
    expect(event).toHaveReceivedEvent();
    const expectedActiveButton = await page.find(`sage-tab[tab="one"] > button`);
    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch("true");
    const expectedActivePanel = await page.find(`sage-tabpanel[tab="one"] > div`);
    expect(expectedActivePanel).toHaveClass('is-active');
  });

  it('renders new activeTab when arrows move focus to right', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test3" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
    `);
    // Click inactive tab
    let tab = await page.find('sage-tab[tab="one"] > button');
    tab.click();
    await page.waitForChanges();
    // Move focus to second tab
    page.keyboard.down("ArrowRight");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('sage-tab[tab="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to past end of tabs forcing a loop to first tab
    page.keyboard.down("ArrowRight");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find(`sage-tab[tab="one"] > button`);
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders new activeTab when arrows move focus to left', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="one" tablist-label="test label" component-id="test3" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
      </sage-tabs>
    `);
    // Click inactive tab
    let tab = await page.find('sage-tab[tab="two"] > button');
    tab.click();
    await page.waitForChanges();
    // Move focus to first tab
    page.keyboard.down("ArrowLeft");
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('sage-tab[tab="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to past end of tabs forcing a loop to last tab
    page.keyboard.down("ArrowLeft");
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('sage-tab[tab="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders new activeTab when Home and End keys are pressed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="one" tablist-label="test label" component-id="test4" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tab tab="three">Test 2</sage-tab>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
        <sage-tabpanel tab="three">Content 2</sage-tabpanel>
      </sage-tabs>
    `);
    // Check that second tab is active
    let tab = await page.find(`sage-tab[tab="one"] > button`);
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Click inactive tab
    tab = await page.find('sage-tab[tab="two"] > button');
    tab.click();
    await page.waitForChanges();
    // Move focus to first tab
    page.keyboard.down("Home");
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('sage-tab[tab="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    // Move focus to last tab
    page.keyboard.down("End");
    await page.waitForChanges();
    // Confirm focus on last tab
    tab = await page.find('sage-tab[tab="three"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
  });

  it('renders a11y correctly', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label" component-id="test4" variant="primary">
        <sage-tab tab="one">Test 1</sage-tab>
        <sage-tab tab="two">Test 2</sage-tab>
        <sage-tabpanel tab="two">Content 2</sage-tabpanel>
        <sage-tabpanel tab="one">Content 1</sage-tabpanel>
      </sage-tabs>
    `);
    // Confirm active tab a11y
    let tab = await page.find('sage-tab[tab="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    expect(tab.getAttribute('role')).toMatch("tab");
    expect(tab.getAttribute('aria-controls')).toMatch("two-panel");
    expect(tab.getAttribute('tabindex')).toMatch("0");

    //Confirm active tabpanel a11y
    let tabpanel = await page.find('sage-tabpanel[tab="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("two");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");

    // Confirm inactive tab a11y
    tab = await page.find('sage-tab[tab="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("false");
    expect(tab.getAttribute('aria-controls')).toMatch("one-panel");
    expect(tab.getAttribute('tabindex')).toMatch("-1");

    //Confirm inactive tabpanel a11y
    tabpanel = await page.find('sage-tabpanel[tab="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("one");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");
    
    // Click inactive tab
    tab.click();
    await page.waitForChanges();

    // Confirm previously active tab a11y
    tab = await page.find('sage-tab[tab="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("false");
    expect(tab.getAttribute('aria-controls')).toMatch("two-panel");
    expect(tab.getAttribute('tabindex')).toMatch("-1");

    //Confirm previously active tabpanel a11y
    tabpanel = await page.find('sage-tabpanel[tab="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("two");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");

    // Confirm new active tab a11y
    tab = await page.find('sage-tab[tab="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch("true");
    expect(tab.getAttribute('aria-controls')).toMatch("one-panel");
    expect(tab.getAttribute('tabindex')).toMatch("0");

    //Confirm new active tabpanel a11y
    tabpanel = await page.find('sage-tabpanel[tab="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch("one");
    expect(tabpanel.getAttribute('role')).toMatch("tabpanel");
  });
});
