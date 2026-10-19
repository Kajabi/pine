import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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
    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch('true');
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

    // Wait for initial render to complete
    await page.waitForChanges();

    // Setup event spy before clicking
    const event = await page.spyOnEvent('pdsTabClick');

    // Find and click the inactive tab
    const inactiveTabButton = await page.find(`pds-tab[name="one"] > button`);
    await inactiveTabButton.click();

    // Wait for click event and component updates
    await event.next();
    await page.waitForChanges();

    // Wait for specific attribute/class changes
    await page.waitForSelector('pds-tab[name="one"] > button[aria-selected="true"]');
    await page.waitForSelector('pds-tabpanel[name="one"] > div.is-active');

    // Verify final state
    const expectedActiveButton = await page.find(`pds-tab[name="one"] > button`);
    const expectedActivePanel = await page.find(`pds-tabpanel[name="one"] > div`);

    expect(expectedActiveButton.getAttribute('aria-selected')).toMatch('true');
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
    page.keyboard.down('ArrowRight');
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    // Move focus to past end of tabs forcing a loop to first tab
    page.keyboard.down('ArrowRight');
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find(`pds-tab[name="one"] > button`);
    expect(tab.getAttribute('aria-selected')).toMatch('true');
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
    page.keyboard.down('ArrowLeft');
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    // Move focus to past end of tabs forcing a loop to last tab
    page.keyboard.down('ArrowLeft');
    await page.waitForChanges();
    // Confirm focus on second tab
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
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
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    // Click inactive tab
    tab = await page.find('pds-tab[name="two"] > button');
    tab.click();
    await page.waitForChanges();

    // Add a small wait to ensure state updates are complete
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Move focus to first tab
    page.keyboard.down('Home');
    await page.waitForChanges();
    // Confirm focus on first tab
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    // Move focus to last tab
    page.keyboard.down('End');
    await page.waitForChanges();
    // Confirm focus on last tab
    tab = await page.find('pds-tab[name="three"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
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
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    expect(tab.getAttribute('role')).toMatch('tab');
    expect(tab.getAttribute('aria-controls')).toMatch('two-panel');
    expect(tab.getAttribute('tabindex')).toMatch('0');

    //Confirm active tabpanel a11y
    let tabpanel = await page.find('pds-tabpanel[name="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch('two');
    expect(tabpanel.getAttribute('role')).toMatch('tabpanel');

    // Confirm inactive tab a11y
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('false');
    expect(tab.getAttribute('aria-controls')).toMatch('one-panel');
    expect(tab.getAttribute('tabindex')).toMatch('-1');

    //Confirm inactive tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch('one');
    expect(tabpanel.getAttribute('role')).toMatch('tabpanel');

    // Click inactive tab and wait for event
    const event = await page.spyOnEvent('pdsTabClick');
    await tab.click();
    await page.waitForChanges();
    await event.next();

    // Add explicit wait for attribute changes
    await page.waitForSelector('pds-tab[name="one"] > button[aria-selected="true"]');
    await page.waitForSelector('pds-tab[name="two"] > button[aria-selected="false"]');

    // Confirm previously active tab a11y
    tab = await page.find('pds-tab[name="two"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('false');
    expect(tab.getAttribute('aria-controls')).toMatch('two-panel');
    expect(tab.getAttribute('tabindex')).toMatch('-1');

    //Confirm previously active tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="two"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch('two');
    expect(tabpanel.getAttribute('role')).toMatch('tabpanel');

    // Confirm new active tab a11y
    tab = await page.find('pds-tab[name="one"] > button');
    expect(tab.getAttribute('aria-selected')).toMatch('true');
    expect(tab.getAttribute('aria-controls')).toMatch('one-panel');
    expect(tab.getAttribute('tabindex')).toMatch('0');

    //Confirm new active tabpanel a11y
    tabpanel = await page.find('pds-tabpanel[name="one"] > div');
    expect(tabpanel.getAttribute('aria-labelledby')).toMatch('one');
    expect(tabpanel.getAttribute('role')).toMatch('tabpanel');
  });
});

describe('pds-tabs accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="one" tablist-label="Account settings" component-id="settings" variant="primary">
        <pds-tab name="one">Profile</pds-tab>
        <pds-tab name="two">Security</pds-tab>
        <pds-tabpanel name="one">Profile content</pds-tabpanel>
        <pds-tabpanel name="two">Security content</pds-tabpanel>
      </pds-tabs>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-tabs wrote, including the ones its CSS selects on.
describe('pds-tabs after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tabs class="consumer" component-id="tabs" active-tab-name="one" variant="filter" divider tablist-label="Tabs"><pds-tab name="one" slot="tabs">One</pds-tab><pds-tabpanel name="one">Panel</pds-tabpanel></pds-tabs>');

    await expectStylingSurvivesStrip(page, 'pds-tabs');
  });

  it("doesn't put back an active-tab-name that was removed", async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tabs component-id="tabs" active-tab-name="two" variant="filter" tablist-label="Tabs"><pds-tab name="one" slot="tabs">One</pds-tab><pds-tab name="two" slot="tabs">Two</pds-tab><pds-tabpanel name="one">One</pds-tabpanel><pds-tabpanel name="two">Two</pds-tabpanel></pds-tabs>');

    await page.$eval('pds-tabs', (el) => el.removeAttribute('active-tab-name'));
    await page.waitForChanges();

    expect(await (await page.find('pds-tabs')).getProperty('activeTabName')).not.toBe('two');
  });
});

// The initial child collection only sees what's present at load (componentWillLoad). A tab or
// panel added, removed or replaced afterwards — including by a DOM morph swapping in a fresh
// copy of the server's HTML — needs to be re-collected the same way, or it's never reached.
describe('pds-tabs re-collecting children after a slot change', () => {
  it('shows a tabpanel that was replaced with a fresh copy after load', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test5" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    // Replace the active panel with a fresh, identical element — what a DOM morph
    // does when the server re-sends the same markup.
    await page.$eval('pds-tabs', (el) => {
      const oldPanel = el.querySelector('pds-tabpanel[name="two"]');
      const newPanel = document.createElement('pds-tabpanel');
      newPanel.setAttribute('name', 'two');
      newPanel.textContent = 'Content 2';
      oldPanel.replaceWith(newPanel);
    });
    await page.waitForChanges();

    const panel = await page.find('pds-tabpanel[name="two"] > div');
    expect(panel).toHaveClass('is-active');
  });

  it('makes a tab added after load clickable', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test6" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      el.appendChild(newTab);

      const newPanel = document.createElement('pds-tabpanel');
      newPanel.setAttribute('name', 'two');
      newPanel.textContent = 'Content 2';
      el.appendChild(newPanel);
    });
    await page.waitForChanges();

    const event = await page.spyOnEvent('pdsTabClick');
    const newTabButton = await page.find('pds-tab[name="two"] > button');
    await newTabButton.click();
    await event.next();
    await page.waitForChanges();

    expect(newTabButton.getAttribute('aria-selected')).toMatch('true');
    const panel = await page.find('pds-tabpanel[name="two"] > div');
    expect(panel).toHaveClass('is-active');
  });

  it('keeps the active tab selected when an unrelated tab is added', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test7" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'three');
      newTab.textContent = 'Test 3';
      el.appendChild(newTab);
    });
    await page.waitForChanges();

    const activeButton = await page.find('pds-tab[name="two"] > button');
    expect(activeButton.getAttribute('aria-selected')).toMatch('true');
    const activePanel = await page.find('pds-tabpanel[name="two"] > div');
    expect(activePanel).toHaveClass('is-active');
  });

  it('falls back to another tab when the active one is removed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test8" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      el.querySelector('pds-tab[name="two"]').remove();
      el.querySelector('pds-tabpanel[name="two"]').remove();
    });
    await page.waitForChanges();

    const tabsElement = await page.find('pds-tabs');
    expect(await tabsElement.getProperty('activeTabName')).toBe('one');
    const remainingButton = await page.find('pds-tab[name="one"] > button');
    expect(remainingButton.getAttribute('aria-selected')).toMatch('true');
  });

  // `variant` is optional and renders the primary style when omitted. Exercising
  // that path directly guards the fix for a latent bug: propGeneration previously
  // called `this.variant.toString()` unconditionally, which threw when variant was
  // unset — silently swallowed by Stencil's own render-cycle error boundary on a
  // normal render, but surfaced as an uncaught exception from this slotchange path.
  it('re-collects without erroring when nav mode has no variant set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs nav component-id="test9" tablist-label="test label">
        <pds-tab href="/a" name="a">A</pds-tab>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('href', '/b');
      newTab.setAttribute('name', 'b');
      newTab.textContent = 'B';
      el.appendChild(newTab);
    });
    await page.waitForChanges();

    // If propGeneration had thrown, the forEach loop would stop before setting
    // parentComponentId/variant on the remaining tabs, and this id (built from
    // parentComponentId) wouldn't be present.
    const newAnchor = await page.find('pds-tab[name="b"] #test9__b');
    expect(newAnchor).not.toBeNull();
    expect(newAnchor.getAttribute('href')).toBe('/b');
  });

  // Moving the same element (disconnect, then reconnect) mustn't lose the slotchange
  // listeners: componentDidLoad, which first attaches them, doesn't run again.
  it('still re-collects after the element is moved to another container', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="first">
        <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test12" variant="primary">
          <pds-tab name="one">Test 1</pds-tab>
          <pds-tab name="two">Test 2</pds-tab>
          <pds-tabpanel name="one">Content 1</pds-tabpanel>
          <pds-tabpanel name="two">Content 2</pds-tabpanel>
        </pds-tabs>
      </div>
      <div id="second"></div>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      document.getElementById('second').appendChild(el);
    });
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      const oldPanel = el.querySelector('pds-tabpanel[name="two"]');
      const newPanel = document.createElement('pds-tabpanel');
      newPanel.setAttribute('name', 'two');
      newPanel.textContent = 'Content 2';
      oldPanel.replaceWith(newPanel);
    });
    await page.waitForChanges();

    const panel = await page.find('#second pds-tabpanel[name="two"] > div');
    expect(panel).toHaveClass('is-active');
  });

  // The move test above reattaches before mutating, so the listeners are already back.
  // Mutating while still detached — no listener to see it — is the gap a reconnect that
  // only re-attaches listeners, without also re-collecting, would miss.
  it('re-collects content that changed while the element was detached', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test13" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await page.$eval('pds-tabs', (el) => {
      const detached = el.parentElement.removeChild(el);
      const oldPanel = detached.querySelector('pds-tabpanel[name="two"]');
      const newPanel = document.createElement('pds-tabpanel');
      newPanel.setAttribute('name', 'two');
      newPanel.textContent = 'Content 2';
      oldPanel.replaceWith(newPanel);
      document.body.appendChild(detached);
    });
    await page.waitForChanges();

    const panel = await page.find('pds-tabpanel[name="two"] > div');
    expect(panel).toHaveClass('is-active');
  });
});

// A focused tab's button can be removed out from under the user — a DOM morph
// replacing it with a fresh copy is one way, but it's the same scenario for any
// DOM mutation. The browser silently drops focus to <body> when that happens;
// pds-tabs should restore it to the new active tab instead.
describe('pds-tabs restoring focus after the focused tab is replaced', () => {
  it('moves focus to the new active tab when the focused tab is replaced', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test10" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    const activeButton = await page.find('pds-tab[name="two"] > button');
    await activeButton.focus();

    await page.$eval('pds-tabs', (el) => {
      const oldTab = el.querySelector('pds-tab[name="two"]');
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      oldTab.replaceWith(newTab);
    });
    await page.waitForChanges();

    await page.waitForFunction(() => {
      const button = document.querySelector('pds-tab[name="two"] > button');
      return !!button && document.activeElement === button;
    });

    const isFocused = await page.$eval('pds-tab[name="two"] > button', (button) => button === document.activeElement);
    expect(isFocused).toBe(true);
  });

  it('does not take focus back once it has left the tabs', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test13" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
      <button id="outside">Outside</button>
    `);
    await page.waitForChanges();

    await (await page.find('pds-tab[name="two"] > button')).focus();
    await (await page.find('#outside')).focus();

    await page.$eval('pds-tabs', (el) => {
      const oldTab = el.querySelector('pds-tab[name="two"]');
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      oldTab.replaceWith(newTab);
    });
    await page.waitForChanges();

    // Give a wrongly-scheduled focus restoration a chance to run before asserting it didn't.
    await new Promise((resolve) => setTimeout(resolve, 50));

    const outsideFocused = await page.$eval('#outside', (button) => button === document.activeElement);
    expect(outsideFocused).toBe(true);
  });

  // Focus that leaves for nowhere (a click on the page) mustn't be pulled back either.
  // Focus in a panel has left the tablist too, though it's still inside pds-tabs: a morph that
  // replaces the tab and the panel's focused content mustn't move focus to the tab.
  it('does not move focus to the tab once it has moved into a panel', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test15" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two"><button id="in-panel">In panel</button></pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    await (await page.find('pds-tab[name="two"] > button')).focus();
    await (await page.find('#in-panel')).focus();

    await page.$eval('pds-tabs', (el) => {
      const oldTab = el.querySelector('pds-tab[name="two"]');
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      oldTab.replaceWith(newTab);

      const oldPanel = el.querySelector('pds-tabpanel[name="two"]');
      const newPanel = document.createElement('pds-tabpanel');
      newPanel.setAttribute('name', 'two');
      newPanel.innerHTML = '<button id="in-panel">In panel</button>';
      oldPanel.replaceWith(newPanel);
    });
    await page.waitForChanges();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  });

  it('does not take focus back after a click elsewhere on the page', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test14" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tab name="two">Test 2</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
        <pds-tabpanel name="two">Content 2</pds-tabpanel>
      </pds-tabs>
      <p id="text" style="margin-top: 200px;">Some text</p>
    `);
    await page.waitForChanges();

    await (await page.find('pds-tab[name="two"] > button')).focus();
    await (await page.find('#text')).click();
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);

    await page.$eval('pds-tabs', (el) => {
      const oldTab = el.querySelector('pds-tab[name="two"]');
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      oldTab.replaceWith(newTab);
    });
    await page.waitForChanges();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
  });

  it('does not move focus when the change is unrelated to the focused tab', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test11" variant="primary">
        <pds-tab name="one">Test 1</pds-tab>
        <pds-tabpanel name="one">Content 1</pds-tabpanel>
      </pds-tabs>
    `);
    await page.waitForChanges();

    const activeButton = await page.find('pds-tab[name="one"] > button');
    await activeButton.focus();

    await page.$eval('pds-tabs', (el) => {
      const newTab = document.createElement('pds-tab');
      newTab.setAttribute('name', 'two');
      newTab.textContent = 'Test 2';
      el.appendChild(newTab);
    });
    await page.waitForChanges();

    // Give a wrongly-scheduled focus restoration a chance to run before asserting
    // it didn't — the guard should see focus is still within and no-op.
    await new Promise((resolve) => setTimeout(resolve, 50));

    const stillFocused = await page.$eval('pds-tab[name="one"] > button', (button) => button === document.activeElement);
    expect(stillFocused).toBe(true);
  });
});
