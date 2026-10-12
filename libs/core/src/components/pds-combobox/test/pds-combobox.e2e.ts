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

  // A div trigger can't be named by <label for>; it's named by aria-labelledby instead. The chip
  // case uses plain options, so it covers the default chip content, not an option rendered as a
  // pds-chip (that chip's nested button is tracked separately).
  it.each([
    ['button', '.pds-combobox__button-trigger'],
    ['chip (default content)', '.pds-combobox__chip-trigger'],
  ])('has no axe violations when open with a %s trigger and a visible label', async (trigger, selector) => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="named" label="Action" trigger="${trigger.split(' ')[0]}" mode="select-only">
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

  describe('grouped options', () => {
    const groupedOptions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
    ];

    const openWithOptions = async () => {
      const page = await newE2EPage();
      await page.setContent(`<pds-combobox component-id="actions" label="Action"></pds-combobox>`);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        groupedOptions,
      );
      await page.waitForChanges();
      const input = await page.find('pds-combobox >>> input');
      await input.click();
      await page.waitForChanges();
      return { page, input };
    };

    const listboxRows = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() =>
        Array.from(
          document
            .querySelector('pds-combobox')!
            .shadowRoot!.querySelectorAll('.pds-combobox__group-label, [role="option"]'),
        ).map(row =>
          row.classList.contains('pds-combobox__group-label')
            ? `group:${row.textContent}:${row.querySelector('pds-icon')?.getAttribute('name') ?? ''}`
            : row.textContent,
        ),
      );

    it("renders a slotted optgroup's data-icon beside its label", async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="slotted" label="Action">
          <optgroup label="Tag" data-icon="hashtag">
            <option value="tag-add">Add a tag</option>
          </optgroup>
          <optgroup label="Fruits">
            <option value="apple">Apple</option>
          </optgroup>
        </pds-combobox>
      `);
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> input')).click();
      await page.waitForChanges();

      expect(await listboxRows(page)).toEqual(['group:Tag:hashtag', 'Add a tag', 'group:Fruits:', 'Apple']);
    });

    it('renders each group from the options prop together, where it first appears', async () => {
      const { page } = await openWithOptions();

      expect(await listboxRows(page)).toEqual([
        'group:Tag:hashtag',
        'Add a tag',
        'Remove a tag',
        'group:Email:mail',
        'Send an email',
      ]);
    });

    it('arrows from the last option of one group into the next group', async () => {
      const { page } = await openWithOptions();

      for (let i = 0; i < 3; i += 1) {
        await page.keyboard.press('ArrowDown');
      }
      await page.waitForChanges();

      const highlighted = await page.evaluate(
        () =>
          document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__option--highlighted')
            ?.textContent,
      );
      expect(highlighted).toBe('Send an email');
    });

    it('has no axe violations with grouped options open', async () => {
      const { page } = await openWithOptions();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });
});
