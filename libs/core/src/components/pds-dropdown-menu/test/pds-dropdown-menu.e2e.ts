import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-dropdown-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu></pds-dropdown-menu>');

    const element = await page.find('pds-dropdown-menu');
    expect(element).toHaveClass('hydrated');
  });

  it('opens and closes the dropdown when trigger is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);

    // Get the trigger button
    const triggerButton = await page.find('button[slot="trigger"]');

    // Initial state: dropdown should be closed
    const isInitiallyHidden = await page.evaluate(() => {
      const dropdown = document.querySelector('pds-dropdown-menu');
      const panel = dropdown.shadowRoot.querySelector('pds-box');
      return panel.classList.contains('is-hidden');
    });
    expect(isInitiallyHidden).toBe(true);

    // Click to open
    await triggerButton.click();

    // After click: dropdown should be open
    const isOpenAfterClick = await page.evaluate(() => {
      const dropdown = document.querySelector('pds-dropdown-menu');
      const panel = dropdown.shadowRoot.querySelector('pds-box');
      return !panel.classList.contains('is-hidden');
    });
    expect(isOpenAfterClick).toBe(true);

    // Check ARIA attributes after opening
    const ariaExpandedAfterOpen = await triggerButton.getAttribute('aria-expanded');
    expect(ariaExpandedAfterOpen).toBe('true');

    // Click again to close
    await triggerButton.click();

    // After second click: dropdown should be closed
    const isClosedAfterSecondClick = await page.evaluate(() => {
      const dropdown = document.querySelector('pds-dropdown-menu');
      const panel = dropdown.shadowRoot.querySelector('pds-box');
      return panel.classList.contains('is-hidden');
    });
    expect(isClosedAfterSecondClick).toBe(true);

    // Check ARIA attributes after closing
    const ariaExpandedAfterClose = await triggerButton.getAttribute('aria-expanded');
    expect(ariaExpandedAfterClose).toBe('false');
  });

  // Anything can rewrite the trigger's attributes; a Turbo morph matches it to server HTML that has
  // none of Pine's ARIA.
  it("puts the trigger's ARIA back when it's removed or changed", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);
    const aria = () =>
      page.$eval('#trigger', (el) => [el.getAttribute('aria-haspopup'), el.getAttribute('aria-expanded')]);
    const rewrite = async (change: (el: Element) => void) => {
      await page.$eval('#trigger', change);
      await page.waitForChanges();
    };

    await rewrite((el) => {
      el.removeAttribute('aria-haspopup');
      el.removeAttribute('aria-expanded');
    });
    expect(await aria()).toEqual(['menu', 'false']);

    // aria-expanded follows the menu's real state, not the value written.
    await rewrite((el) => el.setAttribute('aria-expanded', 'true'));
    expect(await aria()).toEqual(['menu', 'false']);

    await page.click('#trigger');
    await page.waitForChanges();
    await rewrite((el) => el.removeAttribute('aria-expanded'));
    expect(await aria()).toEqual(['menu', 'true']);

    await page.click('#trigger');
    await page.waitForChanges();
    expect(await aria()).toEqual(['menu', 'false']);
  });

  it('watches a swapped-in trigger, and keeps watching after the menu is moved', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="first-parent">
        <pds-dropdown-menu>
          <button slot="trigger" id="old-trigger">Old</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      </div>
      <div id="second-parent"></div>
    `);
    const strip = async (selector: string) => {
      await page.$eval(selector, (el) => {
        el.removeAttribute('aria-haspopup');
        el.removeAttribute('aria-expanded');
      });
      await page.waitForChanges();
    };
    const aria = (selector: string) =>
      page.$eval(selector, (el) => [el.getAttribute('aria-haspopup'), el.getAttribute('aria-expanded')]);

    await page.$eval('pds-dropdown-menu', (menu) => {
      const trigger = document.createElement('button');
      trigger.slot = 'trigger';
      trigger.id = 'new-trigger';
      trigger.textContent = 'New';
      menu.querySelector('#old-trigger').replaceWith(trigger);
    });
    await page.waitForChanges();
    await strip('#new-trigger');
    expect(await aria('#new-trigger')).toEqual(['menu', 'false']);

    // Changed while detached, so only the reconnect can put it back.
    await page.$eval('pds-dropdown-menu', (menu) => {
      menu.remove();
      menu.querySelector('#new-trigger').removeAttribute('aria-haspopup');
      document.querySelector('#second-parent').appendChild(menu);
    });
    await page.waitForChanges();
    expect(await aria('#new-trigger')).toEqual(['menu', 'false']);

    await strip('#new-trigger');
    expect(await aria('#new-trigger')).toEqual(['menu', 'false']);
  });

  // The restored host attributes only reach a screen reader once pds-button forwards them.
  it("puts a pds-button trigger's ARIA back on its inner button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <pds-button slot="trigger">Toggle Menu</pds-button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);

    await page.$eval('pds-button', (el) => {
      el.removeAttribute('aria-haspopup');
      el.removeAttribute('aria-expanded');
    });
    await page.waitForChanges();

    const inner = await page.find('pds-button >>> button');
    expect(inner).toEqualAttribute('aria-haspopup', 'menu');
    expect(inner).toEqualAttribute('aria-expanded', 'false');
  });

  it('closes the dropdown when Escape key is pressed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);

    // Open the dropdown
    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();

    // Verify it's open
    const isOpen = await page.evaluate(() => {
      const dropdown = document.querySelector('pds-dropdown-menu');
      const panel = dropdown.shadowRoot.querySelector('pds-box');
      return !panel.classList.contains('is-hidden');
    });
    expect(isOpen).toBe(true);

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify it's closed
    const isClosed = await page.evaluate(() => {
      const dropdown = document.querySelector('pds-dropdown-menu');
      const panel = dropdown.shadowRoot.querySelector('pds-box');
      return panel.classList.contains('is-hidden');
    });
    expect(isClosed).toBe(true);
  });

  // This test is removed because keyboard focus testing in E2E tests is flaky
  // We'll rely on the component tests for keyboard navigation testing
  it('supports item selection and emits click event', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item id="item1">Item 1</pds-dropdown-menu-item>
        <pds-dropdown-menu-item id="item2">Item 2</pds-dropdown-menu-item>
        <pds-dropdown-menu-item id="item3">Item 3</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);

    // Open the dropdown
    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();

    // Wait for the dropdown to be fully open
    await page.waitForChanges();

    // Verify the dropdown is open
    const ariaExpandedAfterOpen = await triggerButton.getAttribute('aria-expanded');
    expect(ariaExpandedAfterOpen).toBe('true');

    // Find an item and click it
    const firstItem = await page.find('#item1');
    const clickSpy = await page.spyOnEvent('pdsClick');

    await firstItem.click();
    await page.waitForChanges();

    // Verify the item emitted a click event
    expect(clickSpy).toHaveReceivedEvent();

    // The dropdown remains open after clicking an item (this is the actual behavior)
    const ariaExpandedAfterClick = await triggerButton.getAttribute('aria-expanded');
    expect(ariaExpandedAfterClick).toBe('true');

    // Close the dropdown by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    // Verify the dropdown is now closed
    const ariaExpandedAfterEscape = await triggerButton.getAttribute('aria-expanded');
    expect(ariaExpandedAfterEscape).toBe('false');
  });

  describe('focus return', () => {
    const openMenu = async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-dropdown-menu>
          <button slot="trigger" id="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        </pds-dropdown-menu>
        <input id="outside" aria-label="Outside" style="display: block; margin-top: 300px;" />
      `);
      await page.click('#trigger');
      await page.waitForChanges();
      return page;
    };

    const activeElementId = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => document.activeElement?.id);

    it('returns focus to the trigger when Escape closes the menu from an item', async () => {
      const page = await openMenu();
      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      expect(await activeElementId(page)).not.toBe('trigger');

      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await activeElementId(page)).toBe('trigger');
    });

    it('leaves focus on an outside element clicked to close the menu', async () => {
      const page = await openMenu();

      await page.click('#outside');
      await page.waitForChanges();

      expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('false');
      expect(await activeElementId(page)).toBe('outside');
    });

    it('does not focus the trigger when a script toggles the menu with nothing focused', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-dropdown-menu>
          <button slot="trigger" id="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `);

      await page.$eval('#trigger', (el: HTMLElement) => el.click());
      await page.waitForChanges();
      await page.$eval('#trigger', (el: HTMLElement) => el.click());
      await page.waitForChanges();

      expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('false');
      expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
    });
  });
});

describe('pds-dropdown-menu accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
        <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);
    const triggerButton = await page.find('button[slot="trigger"]');
    await triggerButton.click();
    await page.waitForChanges();
    await page.waitForFunction(
      () => {
        const dropdown = document.querySelector('pds-dropdown-menu');
        const panel = dropdown?.shadowRoot?.querySelector('pds-box');
        return panel !== null && !panel.classList.contains('is-hidden');
      },
      { timeout: 2000 },
    );
    // `aria-required-children` is disabled here: the menu uses `role="menu"` but
    // slotted `pds-dropdown-menu-item` elements render `role="none"` — remove once
    // menu items expose `role="menuitem"`.
    const violations = await runAxe(page, {
      rules: { 'aria-required-children': { enabled: false } },
    });
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-dropdown-menu header slot', () => {
  type AXNode = { role: string; name?: string; children?: AXNode[] };

  const findRole = (node: AXNode, role: string): AXNode | undefined =>
    node.role === role ? node : node.children?.map((child) => findRole(child, role)).find(Boolean);

  const textIn = (node: AXNode): string[] => [
    ...(node.role === 'StaticText' && node.name ? [node.name] : []),
    ...(node.children ?? []).flatMap(textIn),
  ];

  const openMenuWithHeader = async () => {
    const page = await newE2EPage();
    const warnings: string[] = [];
    page.on('console', (message) => warnings.push(message.text()));
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Account</button>
        <div slot="header">
          <span>Jane Doe</span>
          <span>jane@example.com</span>
        </div>
        <pds-dropdown-menu-item>Account settings</pds-dropdown-menu-item>
        <pds-dropdown-menu-item>Log out</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);
    await page.click('#trigger');
    await page.waitForChanges();
    return { page, warnings };
  };

  it('exposes header content outside the menu, without warning', async () => {
    const { page, warnings } = await openMenuWithHeader();

    const tree = (await page.accessibility.snapshot({ interestingOnly: false })) as AXNode;
    const menu = findRole(tree, 'menu');

    expect(textIn(tree)).toContain('jane@example.com');
    expect(textIn(menu)).toEqual(['Account settings', 'Log out']);
    expect(warnings.filter((text) => text.includes('Unexpected element'))).toEqual([]);
  });

  it('moves focus from the trigger past the header to the first item', async () => {
    const { page } = await openMenuWithHeader();

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(await page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Account settings');
  });

  it('start-aligns header content inside a centered container', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="text-align: center">
        <pds-dropdown-menu>
          <button slot="trigger">Account</button>
          <div slot="header" id="header">Jane Doe</div>
          <pds-dropdown-menu-item>Account settings</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      </div>
    `);

    expect(await page.$eval('#header', (el) => getComputedStyle(el).textAlign)).toBe('start');
  });

  it('keeps raw item styles off header elements', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Account</button>
        <a slot="header" id="header" href="#profile">Jane Doe</a>
        <a href="#settings" id="item">Account settings</a>
      </pds-dropdown-menu>
    `);
    const display = (selector: string) => page.$eval(selector, (el) => getComputedStyle(el).display);

    expect(await display('#header')).toBe('inline');
    expect(await display('#item')).toBe('flex');
    expect(await display('#trigger')).toBe('flex');
  });

  it('has no axe violations', async () => {
    const { page } = await openMenuWithHeader();

    // Same exclusion as above: `aria-required-children` fails on the items, not the header.
    const violations = await runAxe(page, {
      rules: { 'aria-required-children': { enabled: false } },
    });
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-dropdown-menu informational items', () => {
  type AXNode = { role: string; name?: string; disabled?: boolean; children?: AXNode[] };

  const findAll = (node: AXNode, role: string): AXNode[] => [
    ...(node.role === role ? [node] : []),
    ...(node.children ?? []).flatMap((child) => findAll(child, role)),
  ];

  const openMenu = async (items: string) => {
    const page = await newE2EPage();
    const warnings: string[] = [];
    page.on('console', (message) => warnings.push(message.text()));
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Used on</button>
        ${items}
      </pds-dropdown-menu>
      <div style="height: 3000px"></div>
    `);
    await page.click('#trigger');
    await page.waitForChanges();
    return { page, warnings };
  };

  const usedOnItems = `
    <pds-dropdown-menu-item href="#offers">3 offers</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational>2 forms</pds-dropdown-menu-item>
    <pds-dropdown-menu-item disabled>1 coupon</pds-dropdown-menu-item>
    <pds-dropdown-menu-item informational href="#products">4 products</pds-dropdown-menu-item>
  `;

  const focusedItem = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
    page.evaluate(() => {
      const host = document.activeElement;
      let inner = host;
      while (inner?.shadowRoot?.activeElement) inner = inner.shadowRoot.activeElement;
      return { text: host?.textContent?.trim(), role: inner?.getAttribute('role') ?? inner?.tagName.toLowerCase() };
    });

  it('reaches informational items with the arrow keys and skips disabled ones, without warning', async () => {
    const { page, warnings } = await openMenu(usedOnItems);

    const visited = [];
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      visited.push(await focusedItem(page));
    }

    expect(visited).toEqual([
      { text: '3 offers', role: 'a' },
      { text: '2 forms', role: 'menuitem' },
      { text: '4 products', role: 'menuitem' },
      { text: '3 offers', role: 'a' },
    ]);
    expect(warnings.filter((text) => text.includes('Unexpected element'))).toEqual([]);
  });

  it('does nothing on Enter or Space', async () => {
    const { page } = await openMenu(usedOnItems);
    const clickSpy = await page.spyOnEvent('pdsClick');
    const url = page.url();
    for (let i = 0; i < 3; i += 1) await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await focusedItem(page)).toEqual({ text: '4 products', role: 'menuitem' });

    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(clickSpy).not.toHaveReceivedEvent();
    expect(page.url()).toBe(url);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');
    expect(await focusedItem(page)).toEqual({ text: '4 products', role: 'menuitem' });
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { page } = await openMenu(usedOnItems);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await focusedItem(page)).toEqual({ text: '2 forms', role: 'menuitem' });

    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('false');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('trigger');
  });

  describe('in a menu of only informational items', () => {
    const onlyInformational = `
      <pds-dropdown-menu-item informational>3 offers</pds-dropdown-menu-item>
      <pds-dropdown-menu-item informational>2 forms</pds-dropdown-menu-item>
      <pds-dropdown-menu-item informational disabled>1 coupon</pds-dropdown-menu-item>
    `;

    it.each(['Tab', 'ArrowDown'] as const)('moves focus from the trigger into the menu with %s', async (key) => {
      const { page } = await openMenu(onlyInformational);

      await page.keyboard.press(key);
      await page.waitForChanges();

      expect(await focusedItem(page)).toEqual({ text: '3 offers', role: 'menuitem' });
    });

    it('has no axe violations', async () => {
      const { page } = await openMenu(onlyInformational);

      expect(formatViolations(await runAxe(page))).toBe('');
    });
  });

  it('renders undimmed, with no hover background', async () => {
    const { page } = await openMenu(`
      <pds-dropdown-menu-item id="action">Remove tag</pds-dropdown-menu-item>
      <pds-dropdown-menu-item id="info" informational>2 forms</pds-dropdown-menu-item>
    `);
    const hoveredBackground = async (selector: string) => {
      await page.hover(selector);
      return page.$eval(selector, (el) =>
        getComputedStyle(el.shadowRoot!.querySelector('.pds-dropdown-menu-item__content')!).backgroundColor,
      );
    };

    expect(await page.$eval('#info', (el) => getComputedStyle(el).opacity)).toBe('1');
    expect(await page.$eval('#info', (el) => getComputedStyle(el).cursor)).toBe('default');
    expect(await hoveredBackground('#action')).not.toBe('rgba(0, 0, 0, 0)');
    expect(await hoveredBackground('#info')).toBe('rgba(0, 0, 0, 0)');
  });

  it('exposes informational items to assistive tech as disabled menu items', async () => {
    const { page } = await openMenu(usedOnItems);

    const tree = (await page.accessibility.snapshot({ interestingOnly: false })) as AXNode;
    const [menu] = findAll(tree, 'menu');
    const menuItems = findAll(menu, 'menuitem').map(({ name, disabled }) => ({ name, disabled }));

    expect(menuItems).toEqual([
      { name: '2 forms', disabled: true },
      { name: '4 products', disabled: true },
    ]);
  });

  it('has no axe violations in a mixed menu', async () => {
    const { page } = await openMenu(usedOnItems);

    // `aria-required-children` is disabled here for the linked and button items, which still render
    // `role="none"` hosts around a link or button. The informational-only menu above runs it.
    const violations = await runAxe(page, {
      rules: { 'aria-required-children': { enabled: false } },
    });
    expect(formatViolations(violations)).toBe('');
  });
});

// A script that keeps changing what the menu puts back would keep both running forever in
// microtasks; the menu gives up after a few rounds instead of hanging the page.
describe('pds-dropdown-menu with a script fighting its trigger ARIA', () => {
  it('gives up, and keeps the page responsive', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);
    await page.evaluate(() => {
      const w = window as unknown as { pineWarnings: string[] };
      w.pineWarnings = [];
      const warn = console.warn;
      console.warn = (...args: unknown[]) => {
        w.pineWarnings.push(String(args[0] === '%s' ? args[1] : args[0]));
        warn(...args);
      };
    });

    await page.$eval('#trigger', (el) => {
      new MutationObserver(() => {
        if (el.getAttribute('aria-expanded') !== 'true') el.setAttribute('aria-expanded', 'true');
      }).observe(el, { attributes: true, attributeFilter: ['aria-expanded'] });
      el.setAttribute('aria-expanded', 'true');
    });
    await page.waitForChanges();

    expect(await page.evaluate(() => 'responsive')).toBe('responsive');
    expect((await page.evaluate(() => (window as unknown as { pineWarnings: string[] }).pineWarnings)).filter((text) => text.startsWith('pds-dropdown-menu: stopped restoring'))).toHaveLength(1);
    // The other script wins.
    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');
  });
});

describe('pds-dropdown-menu in ordinary use', () => {
  it("doesn't warn about restoring its trigger ARIA", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-dropdown-menu>
        <button slot="trigger" id="trigger">Toggle Menu</button>
        <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
      </pds-dropdown-menu>
    `);
    const warnings: string[] = [];
    page.on('console', (message) => warnings.push(message.text()));

    for (let i = 0; i < 4; i += 1) {
      await page.click('#trigger');
      await page.waitForChanges();
    }
    await page.$eval('#trigger', (el) => el.removeAttribute('aria-expanded'));
    await page.waitForChanges();

    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('false');
    expect(warnings.filter((text) => text.includes('stopped restoring'))).toEqual([]);
  });
});
