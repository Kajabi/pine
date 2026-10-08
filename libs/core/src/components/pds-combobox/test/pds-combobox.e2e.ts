import { newE2EPage } from '@stencil/core/testing';

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
});

describe('pds-combobox chip trigger sentiments', () => {
  it.each(['neutral', 'accent', 'success', 'warning', 'danger', 'info'])('matches pds-chip colors for the %s sentiment', async (sentiment) => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="combo" trigger="chip" chip-sentiment="${sentiment}" placeholder="Status"></pds-combobox>
      <pds-chip sentiment="${sentiment}" variant="dropdown">Status</pds-chip>
    `);

    const trigger = await page.$eval('pds-combobox', (el) => {
      const s = getComputedStyle(el.shadowRoot.querySelector('.pds-combobox__chip-trigger'));
      return { background: s.backgroundColor, border: s.borderTopColor };
    });
    const chip = await page.$eval('pds-chip', (el) => {
      const host = getComputedStyle(el);
      return { background: host.backgroundColor, border: host.borderTopColor };
    });

    expect(trigger).toEqual(chip);
  });
});
