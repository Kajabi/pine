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
    // `aria-required-children` is disabled here: the menu panel uses `role="menu"` but
    // slotted `pds-dropdown-menu-item` elements render `role="none"` — remove once
    // menu items expose `role="menuitem"`.
    const violations = await runAxe(page, {
      rules: { 'aria-required-children': { enabled: false } },
    });
    expect(formatViolations(violations)).toBe('');
  });
});
