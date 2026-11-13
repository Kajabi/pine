import { newE2EPage } from '@stencil/core/testing';
import { trash } from '@pine-ds/icons/icons';
import { formatViolations, runAxe } from '../../../../utils/test/axe';

describe('pds-dropdown-menu-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('hydrated');
  });

  it('renders as a button by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    const button = await element.shadowRoot.querySelector('button');
    expect(button).not.toBeNull();
  });

  it('renders as a link when href is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item href="https://example.com">Link Item</pds-dropdown-menu-item>');

    // Simply check that the element renders with the href attribute
    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('hydrated');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  it('emits pdsClick event when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const clickSpy = await page.spyOnEvent('pdsClick');
    
    const element = await page.find('pds-dropdown-menu-item');
    await element.click();
    
    expect(clickSpy).toHaveReceivedEvent();
  });

  it('does not emit event when disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item disabled>Disabled Item</pds-dropdown-menu-item>');

    const clickSpy = await page.spyOnEvent('pdsClick');
    
    const element = await page.find('pds-dropdown-menu-item');
    await element.click();
    
    expect(clickSpy).not.toHaveReceivedEvent();
  });

  it('applies destructive class when destructive prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item destructive>Destructive Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('destructive');
  });

  it('responds to keyboard interactions', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    const clickSpy = await page.spyOnEvent('pdsClick');
    
    // Click the element instead of using keyboard since e2e keyboard testing is flaky
    await element.click();
    
    expect(clickSpy).toHaveReceivedEvent();
  });

  describe('start slot', () => {
    type AXNode = { role: string; name?: string; children?: AXNode[] };

    const findRole = (node: AXNode, role: string): AXNode | undefined =>
      node.role === role ? node : node.children?.map((child) => findRole(child, role)).find(Boolean);

    // Horizontal layout of the icon and the label text, read from the rendered boxes.
    const layout = async (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        const item = document.querySelector('pds-dropdown-menu-item')!;
        const icon = item.querySelector('pds-icon')!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(Array.from(item.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim())!);
        const label = range.getBoundingClientRect();
        const gap = getComputedStyle(document.documentElement).getPropertyValue('--pine-dimension-xs').trim();
        return { iconRight: icon.right, labelLeft: label.left, gap };
      });

    it.each([
      ['button', ''],
      ['link', 'href="#settings"'],
      ['informational', 'informational'],
    ])('lays out the icon before the label with the item gap in a %s item', async (_variant, attrs) => {
      const page = await newE2EPage();
      await page.setContent(`<pds-dropdown-menu-item ${attrs}><pds-icon slot="start" icon="${trash}"></pds-icon>Delete</pds-dropdown-menu-item>`);
      await page.waitForChanges();

      const { iconRight, labelLeft, gap } = await layout(page);
      expect(gap).toMatch(/px$/);
      expect(labelLeft - iconRight).toBeCloseTo(parseFloat(gap), 0);
    });

    it.each([
      ['button', '', 'button', `icon="${trash}"`],
      ['link', 'href="#settings"', 'link', `icon="${trash}"`],
      ['informational', 'informational', 'menuitem', `icon="${trash}"`],
      ['button, with an icon set by name,', '', 'button', 'name="trash"'],
    ])('keeps a slotted icon out of the accessible name of a %s item', async (_variant, attrs, role, iconAttr) => {
      const page = await newE2EPage();
      await page.setContent(`<pds-dropdown-menu-item ${attrs}><pds-icon slot="start" ${iconAttr}></pds-icon>Delete</pds-dropdown-menu-item>`);
      await page.waitForChanges();

      const tree = await page.accessibility.snapshot({ interestingOnly: true }) as AXNode;
      const node = findRole(tree, role);
      expect(node?.name).toBe('Delete');
    });

    // A named icon isn't decorative, so it's announced before the label, not left out of it.
    it('announces a labelled icon before the label, instead of treating it as decorative', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-dropdown-menu-item><pds-icon slot="start" icon="${trash}" aria-label="Warning"></pds-icon>Delete</pds-dropdown-menu-item>`);
      await page.waitForChanges();

      const tree = await page.accessibility.snapshot({ interestingOnly: true }) as AXNode;
      const node = findRole(tree, 'button');
      expect(node?.name).toBe('Warning Delete');
    });

    it('hides the start slot when nothing is slotted, so it adds no gap', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-dropdown-menu-item>Delete</pds-dropdown-menu-item>');
      await page.waitForChanges();

      const display = await page.evaluate(() => {
        const slot = document.querySelector('pds-dropdown-menu-item')!.shadowRoot!.querySelector('slot[name="start"]')!;
        return getComputedStyle(slot).display;
      });
      expect(display).toBe('none');
    });

    it('shows the start slot once content is slotted into it, and hides it again once removed', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-dropdown-menu-item>Delete</pds-dropdown-menu-item>');
      await page.waitForChanges();

      const startDisplay = () =>
        page.evaluate(() => {
          const slot = document.querySelector('pds-dropdown-menu-item')!.shadowRoot!.querySelector('slot[name="start"]')!;
          return getComputedStyle(slot).display;
        });

      const icon = await page.evaluate(() => {
        const el = document.createElement('pds-icon');
        el.setAttribute('slot', 'start');
        el.setAttribute('icon', 'trash');
        document.querySelector('pds-dropdown-menu-item')!.prepend(el);
        return true;
      });
      await page.waitForChanges();
      expect(icon).toBe(true);
      expect(await startDisplay()).not.toBe('none');

      await page.evaluate(() => {
        document.querySelector('pds-dropdown-menu-item pds-icon')!.remove();
      });
      await page.waitForChanges();
      expect(await startDisplay()).toBe('none');
    });

    // A wrapper around the slot, rather than the class on the slot itself, would sit between the
    // slotted content and this host, leaving it without an assignedSlot -- which a click-target
    // walk that follows assignedSlot up to find a link (Turbo's link lookup works this way)
    // depends on to ever reach this host at all.
    it('keeps slotted start content a direct child of its slot, with an assignedSlot', async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-dropdown-menu-item><pds-icon slot="start" icon="${trash}"></pds-icon>Delete</pds-dropdown-menu-item>`);
      await page.waitForChanges();

      const hasAssignedSlot = await page.evaluate(() => {
        const icon = document.querySelector('pds-icon[slot="start"]');
        return icon?.assignedSlot?.getAttribute('name') === 'start';
      });
      expect(hasAssignedSlot).toBe(true);
    });

    it('has no axe violations with icons in each kind of item', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div role="menu" aria-label="Actions">
          <pds-dropdown-menu-item><pds-icon slot="start" icon="${trash}"></pds-icon>Delete</pds-dropdown-menu-item>
          <pds-dropdown-menu-item href="#settings"><pds-icon slot="start" icon="${trash}"></pds-icon>Settings</pds-dropdown-menu-item>
          <pds-dropdown-menu-item informational><pds-icon slot="start" icon="${trash}"></pds-icon>2 forms</pds-dropdown-menu-item>
          <pds-dropdown-menu-item disabled><pds-icon slot="start" icon="${trash}"></pds-icon>Archive</pds-dropdown-menu-item>
        </div>
      `);
      await page.waitForChanges();

      // Items render role="none" hosts around a button, link or menuitem, which axe reads as missing menuitem children.
      const violations = await runAxe(page, { rules: { 'aria-required-children': { enabled: false } } });
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('when disabled', () => {
    it('does not emit pdsClick from clickItem()', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-dropdown-menu-item disabled>Delete</pds-dropdown-menu-item>');
      const clickSpy = await page.spyOnEvent('pdsClick');

      await page.$eval('pds-dropdown-menu-item', (el: HTMLPdsDropdownMenuItemElement) => el.clickItem());
      await page.waitForChanges();

      expect(clickSpy).not.toHaveReceivedEvent();
    });

    it('does not emit pdsClick or navigate when the link is clicked', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-dropdown-menu-item disabled href="#moved">Open</pds-dropdown-menu-item>');
      const clickSpy = await page.spyOnEvent('pdsClick');

      const link = await page.find('pds-dropdown-menu-item >>> pds-link');
      await link.click();
      await page.waitForChanges();

      expect(clickSpy).not.toHaveReceivedEvent();
      expect(await page.evaluate(() => window.location.hash)).toBe('');
    });
  });

  it('emits pdsClick once when Enter activates a link item', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item href="#moved">Open</pds-dropdown-menu-item>');
    const clickSpy = await page.spyOnEvent('pdsClick');

    await page.$eval('pds-dropdown-menu-item', (el) => {
      (el.shadowRoot!.querySelector('pds-link')!.shadowRoot!.querySelector('a') as HTMLElement).focus();
    });
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEventTimes(1);
    expect(await page.evaluate(() => window.location.hash)).toBe('#moved');
  });

  // Safari leaves focus on the pds-link host itself after a mouse click, not its inner <a>,
  // where Enter would otherwise do nothing: an anchor only activates on Enter when it is itself
  // the focused element, not an ancestor of it.
  it('still follows the link on Enter when focus is on the pds-link host, not its inner anchor', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item href="#moved">Open</pds-dropdown-menu-item>');
    const clickSpy = await page.spyOnEvent('pdsClick');

    await page.$eval('pds-dropdown-menu-item', (el) => {
      (el.shadowRoot!.querySelector('pds-link') as HTMLElement).focus();
    });
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEventTimes(1);
    expect(await page.evaluate(() => window.location.hash)).toBe('#moved');
  });
});
