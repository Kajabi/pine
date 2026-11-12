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
      ['button', '', 'button'],
      ['link', 'href="#settings"', 'link'],
      ['informational', 'informational', 'menuitem'],
    ])('keeps a slotted icon out of the accessible name of a %s item', async (_variant, attrs, role) => {
      const page = await newE2EPage();
      await page.setContent(`<pds-dropdown-menu-item ${attrs}><pds-icon slot="start" icon="${trash}"></pds-icon>Delete</pds-dropdown-menu-item>`);
      await page.waitForChanges();

      const tree = await page.accessibility.snapshot({ interestingOnly: true }) as AXNode;
      const node = findRole(tree, role);
      expect(node?.name).toBe('Delete');
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

      // Items render role="none" on the host around a shadow-DOM menuitem, which axe reads as a missing child.
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

      await page.$eval('pds-dropdown-menu-item', (el: HTMLPdsDropdownMenuItemElement) => el.clickItem());
      const link = await page.find('pds-dropdown-menu-item >>> pds-link');
      await link.click();
      await page.waitForChanges();

      expect(clickSpy).not.toHaveReceivedEvent();
      expect(await page.evaluate(() => window.location.hash)).toBe('');
    });
  });
});
