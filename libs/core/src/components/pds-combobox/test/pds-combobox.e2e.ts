import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-combobox', () => {
  it('keeps the input icon one step below the open listbox', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-combobox component-id="animals" label="Animal">
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </pds-combobox>
    `);
    await page.waitForChanges();

    const input = await page.find('pds-combobox >>> input');
    await input.click();
    await page.waitForChanges();

    const stacking = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.setProperty('z-index', 'var(--pine-z-index-raised)');
      document.body.appendChild(probe);
      const raised = getComputedStyle(probe).zIndex;
      probe.remove();

      const root = document.querySelector('pds-combobox')?.shadowRoot;
      const icon = root?.querySelector('.pds-combobox__input-icon');
      const listbox = root?.querySelector('.pds-combobox__listbox');

      return {
        hasIcon: !!icon,
        hasListbox: !!listbox,
        icon: icon ? getComputedStyle(icon).zIndex : '',
        listbox: listbox ? getComputedStyle(listbox).zIndex : '',
        raised,
      };
    });

    expect(stacking.hasListbox).toBe(true);
    expect(stacking.hasIcon).toBe(true);
    expect(Number(stacking.listbox)).toBe(Number(stacking.raised));
    expect(Number(stacking.icon)).toBe(Number(stacking.raised) - 1);
  });

  // A div trigger can't be named by <label for>; it's named by aria-labelledby instead.
  it.each([
    ['button', '.pds-combobox__button-trigger'],
    ['chip', '.pds-combobox__chip-trigger'],
  ])('has no axe violations when open with a %s trigger and a visible label', async (trigger, selector) => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="named" label="Action" trigger="${trigger}" mode="select-only">
        <option value="a">A</option>
        <option value="b">B</option>
      </pds-combobox>
    `);
    await page.waitForChanges();
    await (await page.find(`pds-combobox >>> ${selector}`)).click();
    await page.waitForChanges();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
