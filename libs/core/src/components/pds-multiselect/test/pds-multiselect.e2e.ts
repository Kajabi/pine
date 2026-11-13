import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

type Page = Awaited<ReturnType<typeof newE2EPage>>;

const tagOptions = [
  { id: '1', text: 'Bestsellers', dotColor: '--pine-color-purple-600' },
  { id: '2', text: 'Webinar', dotColor: '--pine-color-red-600' },
];

const actionOptions = tagOptions.map(option => ({ ...option, actionIcon: 'pen' }));

const isPanelOpen = (page: Page) =>
  page.evaluate(() => !!document.querySelector('pds-multiselect')?.shadowRoot?.querySelector('.pds-multiselect__panel'));

const waitForSearchFocus = (page: Page) =>
  page.waitForFunction(() =>
    document
      .querySelector('pds-multiselect')
      ?.shadowRoot?.activeElement?.classList.contains('pds-multiselect__search-input')
  );

// Focus-out closes the panel from a zero-delay timeout, so give it a beat before asserting.
const settle = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id);

const openBuiltInTrigger = async (page: Page) => {
  await (await page.find('pds-multiselect >>> .pds-multiselect__trigger')).click();
  await waitForSearchFocus(page);
};

const setOptions = async (page: Page, options: unknown) => {
  await page.$eval(
    'pds-multiselect',
    (el: HTMLElement & { options?: unknown }, value) => {
      el.options = value;
    },
    options,
  );
  await page.waitForChanges();
};

// Headless Chrome on Linux has no hover-capable pointer and can't emulate one, so pin `(hover: none)` before load.
const pinHover = (page: Page, canHover: boolean) =>
  page.evaluateOnNewDocument(canHover => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = query =>
      query === '(hover: none)' ? ({ matches: !canHover, media: query } as MediaQueryList) : matchMedia(query);
  }, canHover);

const openWith = async (attributes: string, options: unknown, { canHover = true } = {}) => {
  const page = await newE2EPage();
  await pinHover(page, canHover);
  await page.setContent(`<pds-multiselect component-id="tags" label="Tags" ${attributes}></pds-multiselect>`);
  await setOptions(page, options);
  await openBuiltInTrigger(page);
  return page;
};

const axOptions = async (page: Page) => {
  const client = await page.createCDPSession();
  const { nodes } = await client.send('Accessibility.getFullAXTree');
  return nodes
    .filter(node => !node.ignored && node.role?.value === 'option')
    .map(node => [node.name?.value, node.description?.value]);
};

// Every open panel nests pds-checkbox's focusable input inside each role="option", which axe
// reports as nested-interactive. That predates these features, so the rule is off here.
const axeViolations = async (page: Page) =>
  formatViolations(await runAxe(page, { rules: { 'nested-interactive': { enabled: false } } }));

describe('pds-multiselect', () => {
  for (const [name, disable] of [
    ['a fieldset around it is disabled', "document.querySelector('fieldset').disabled = true"],
    ['its disabled property is set', "document.querySelector('pds-multiselect').disabled = true"],
  ]) {
    it(`closes when ${name} while open`, async () => {
      const page = await newE2EPage();
      await page.setContent('<fieldset><pds-multiselect component-id="tags" label="Tags"></pds-multiselect></fieldset>');
      await setOptions(page, tagOptions);
      await page.waitForChanges();
      await openBuiltInTrigger(page);
      expect(await isPanelOpen(page)).toBe(true);

      await page.evaluate(disable);
      await page.waitForChanges();
      expect(await isPanelOpen(page)).toBe(false);

      expect(await axeViolations(page)).toBe('');
    });
  }

  // The built-in trigger goes natively disabled and can't take focus back (falls to <body>, as a
  // disabled <select> would). A slotted trigger without its own `disabled` property only gets
  // aria-disabled and stays focusable, so it should get focus back rather than leave it stranded.
  it('returns focus to a slotted trigger when it is disabled while open', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-multiselect component-id="tags" label="Tags">
        <div slot="trigger" id="custom-trigger" tabindex="0" role="button">Pick tags</div>
      </pds-multiselect>
    `);
    await setOptions(page, tagOptions);
    await page.waitForChanges();

    await page.click('#custom-trigger');
    await waitForSearchFocus(page);
    expect(await isPanelOpen(page)).toBe(true);

    await page.evaluate(() => ((document.querySelector('pds-multiselect') as HTMLElement & { disabled: boolean }).disabled = true));
    await page.waitForChanges();

    expect(await isPanelOpen(page)).toBe(false);
    expect(await activeId(page)).toBe('custom-trigger');
  });

  it('renders the built-in trigger and text-only options, ignoring dot colors and action icons, and closes on Tab by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-multiselect component-id="tags" label="Tags">
        <option value="1" data-dot-color="--pine-color-purple-600">Bestsellers</option>
        <option value="2" data-action-icon="pen">Webinar</option>
      </pds-multiselect>
    `);
    await openBuiltInTrigger(page);

    const panel = await page.evaluate(() => {
      const root = document.querySelector('pds-multiselect')!.shadowRoot!;
      return {
        triggerSlot: !!root.querySelector('slot[name="trigger"]'),
        footer: !!root.querySelector('.pds-multiselect__footer'),
        chips: root.querySelectorAll('.pds-multiselect__option pds-chip').length,
        actions: root.querySelectorAll('.pds-multiselect__option-action').length,
        describedOptions: root.querySelectorAll('.pds-multiselect__option[aria-describedby]').length,
      };
    });
    expect(panel).toEqual({ triggerSlot: false, footer: false, chips: 0, actions: 0, describedOptions: 0 });

    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await isPanelOpen(page)).toBe(false);
  });

  describe('trigger slot', () => {
    const setContent = async (page: Page) => {
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" hide-label>
          <option value="1">Bestsellers</option>
          <option value="2">Webinar</option>
          <button slot="trigger" type="button" id="cell">Add tag</button>
        </pds-multiselect>
      `);
      await page.waitForChanges();
    };

    const triggerState = (page: Page) =>
      page.$eval('#cell', el => [el.getAttribute('aria-haspopup'), el.getAttribute('aria-expanded')]);

    it('opens from a click and returns focus to the slotted trigger on Escape', async () => {
      const page = await newE2EPage();
      await setContent(page);
      expect(await triggerState(page)).toEqual(['listbox', 'false']);

      await page.click('#cell');
      await waitForSearchFocus(page);
      expect(await triggerState(page)).toEqual(['listbox', 'true']);

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await isPanelOpen(page)).toBe(false);
      expect(await triggerState(page)).toEqual(['listbox', 'false']);
      expect(await activeId(page)).toBe('cell');
    });

    it('opens from Enter on the focused slotted trigger', async () => {
      const page = await newE2EPage();
      await setContent(page);

      await page.focus('#cell');
      await page.keyboard.press('Enter');
      await waitForSearchFocus(page);

      expect(await isPanelOpen(page)).toBe(true);
    });

    it('closes, rather than closing and reopening, when the open slotted trigger is clicked', async () => {
      const page = await newE2EPage();
      await setContent(page);
      await page.click('#cell');
      await waitForSearchFocus(page);
      // Focus-out is ignored while the panel is opening; click once that window has passed.
      await settle(100);

      // Hold the button like a person does, so focus-out runs between mousedown and click.
      await page.click('#cell', { delay: 100 });
      await page.waitForChanges();
      await settle();

      expect(await isPanelOpen(page)).toBe(false);
    });

    it('wires a trigger added after load, and brings back the built-in trigger when it is removed', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" hide-label>
          <option value="1">Bestsellers</option>
        </pds-multiselect>
      `);
      await page.waitForChanges();
      const builtInTriggerShown = (shown: boolean) =>
        page.waitForFunction(
          expected =>
            !!document.querySelector('pds-multiselect')!.shadowRoot!.querySelector('.pds-multiselect__trigger') === expected,
          {},
          shown
        );

      await page.evaluate(() => {
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.id = 'cell';
        trigger.slot = 'trigger';
        trigger.textContent = 'Add tag';
        document.querySelector('pds-multiselect')!.appendChild(trigger);
      });
      await builtInTriggerShown(false);
      expect(await triggerState(page)).toEqual(['listbox', 'false']);

      await page.click('#cell');
      await waitForSearchFocus(page);
      expect(await triggerState(page)).toEqual(['listbox', 'true']);
      await page.keyboard.press('Escape');
      await page.waitForChanges();

      await page.evaluate(() => document.getElementById('cell')!.remove());
      await builtInTriggerShown(true);
    });

    it('anchors the panel below the slotted trigger', async () => {
      const page = await newE2EPage();
      await setContent(page);
      await page.click('#cell');
      await waitForSearchFocus(page);
      await page.waitForFunction(
        () =>
          (document.querySelector('pds-multiselect')!.shadowRoot!.querySelector('.pds-multiselect__panel') as HTMLElement)
            .style.top !== ''
      );

      const rects = await page.evaluate(() => {
        const trigger = document.getElementById('cell')!.getBoundingClientRect();
        const panel = document
          .querySelector('pds-multiselect')!
          .shadowRoot!.querySelector('.pds-multiselect__panel')!
          .getBoundingClientRect();
        return { triggerLeft: trigger.left, triggerBottom: trigger.bottom, panelLeft: panel.left, panelTop: panel.top };
      });

      expect(rects.panelLeft).toBeCloseTo(rects.triggerLeft, 0);
      expect(rects.panelTop).toBeGreaterThan(rects.triggerBottom);
    });

    it('disables a custom element trigger that is defined after the multiselect loads', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" hide-label disabled>
          <option value="1">Bestsellers</option>
          <late-trigger slot="trigger">Add tag</late-trigger>
        </pds-multiselect>
      `);
      const isDisabled = () => page.$eval('late-trigger', (el: HTMLElement & { disabled?: boolean }) => el.disabled);
      expect(await isDisabled()).toBeUndefined();

      await page.evaluate(() => {
        customElements.define(
          'late-trigger',
          class extends HTMLElement {
            disabled = false;
          }
        );
      });
      await settle();
      expect(await isDisabled()).toBe(true);
    });
  });

  describe('footer slot', () => {
    const openWithFooter = async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags">
          <option value="1">Bestsellers</option>
          <option value="2">Webinar</option>
          <button slot="footer" type="button" id="manage">Manage tags</button>
        </pds-multiselect>
        <button type="button" id="after">After</button>
      `);
      await openBuiltInTrigger(page);
      return page;
    };

    it('runs a footer click without dismissing the panel first', async () => {
      const page = await openWithFooter();
      const dismiss = await page.spyOnEvent('pdsMultiselectDismiss');
      const manageClicks = await (await page.find('#manage')).spyOnEvent('click');

      await page.click('#manage');
      await page.waitForChanges();
      await settle();

      expect(manageClicks).toHaveReceivedEventTimes(1);
      expect(await isPanelOpen(page)).toBe(true);
      expect(dismiss).not.toHaveReceivedEvent();
    });

    it('tabs from the search input to the footer and back, and closes without a dismiss when Tab leaves it', async () => {
      const page = await openWithFooter();
      const dismiss = await page.spyOnEvent('pdsMultiselectDismiss');

      await page.keyboard.press('Tab');
      await settle();
      expect(await activeId(page)).toBe('manage');
      expect(await isPanelOpen(page)).toBe(true);

      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
      await waitForSearchFocus(page);
      expect(await isPanelOpen(page)).toBe(true);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.waitForChanges();
      await settle();
      expect(await activeId(page)).toBe('after');
      expect(await isPanelOpen(page)).toBe(false);
      expect(dismiss).not.toHaveReceivedEvent();
    });

    it('skips hidden footer controls when tabbing to and from the footer', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags">
          <option value="1">Bestsellers</option>
          <div slot="footer">
            <button type="button" id="create" hidden>Create tag</button>
            <button type="button" id="manage">Manage tags</button>
          </div>
        </pds-multiselect>
      `);
      await openBuiltInTrigger(page);

      await page.keyboard.press('Tab');
      await settle();
      expect(await activeId(page)).toBe('manage');
      expect(await isPanelOpen(page)).toBe(true);

      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
      await waitForSearchFocus(page);
      expect(await isPanelOpen(page)).toBe(true);
    });
  });

  it('tabs into and back out of a pds-link footer, whose link lives in its own shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-multiselect component-id="tags" label="Tags">
        <option value="1">Bestsellers</option>
        <pds-link slot="footer" href="#manage" variant="plain" font-size="md">Manage tags</pds-link>
      </pds-multiselect>
      <button type="button" id="after">After</button>
    `);
    await openBuiltInTrigger(page);
    const dismiss = await page.spyOnEvent('pdsMultiselectDismiss');
    const focusedTag = () => page.evaluate(() => document.activeElement?.tagName.toLowerCase());

    await page.keyboard.press('Tab');
    await settle();
    expect(await focusedTag()).toBe('pds-link');
    expect(await isPanelOpen(page)).toBe(true);

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await waitForSearchFocus(page);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    await settle();
    expect(await activeId(page)).toBe('after');
    expect(await isPanelOpen(page)).toBe(false);
    expect(dismiss).not.toHaveReceivedEvent();
  });

  describe('open list spacing', () => {
    it('spaces the list and its rows as pds-combobox does', async () => {
      const page = await openWith('', [
        { id: '1', text: 'Bestsellers', group: 'Tags' },
        { id: '2', text: 'Webinar', group: 'Tags' },
      ]);

      const spacing = await page.evaluate(() => {
        const root = document.querySelector('pds-multiselect')!.shadowRoot!;
        const pad = (selector: string) => {
          const style = getComputedStyle(root.querySelector(selector)!);
          return [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].join(' ');
        };
        return {
          listbox: pad('.pds-multiselect__listbox'),
          option: pad('.pds-multiselect__option'),
          groupHeader: pad('.pds-multiselect__group-header'),
        };
      });

      expect(spacing).toEqual({
        listbox: '8px 8px 8px 8px',
        option: '8px 16px 8px 16px',
        // The first header's top padding is tighter; its sides line up with the options' text.
        groupHeader: '8px 16px 4px 16px',
      });
    });
  });

  describe('single selection in the trigger', () => {
    const longText = `Contact_${'x'.repeat(120)}`;

    const renderWith = async (value: string[]) => {
      const page = await newE2EPage();
      await page.setContent('<pds-multiselect component-id="tags" label="Tags" style="width: 240px"></pds-multiselect>');
      await setOptions(page, [
        { id: '1', text: longText },
        { id: '2', text: 'Webinar' },
      ]);
      await page.$eval('pds-multiselect', (el: HTMLElement & { value?: string[] }, v) => { el.value = v; }, value);
      await page.waitForChanges();
      return page;
    };

    const measure = (page: Page) =>
      page.evaluate(() => {
        const root = document.querySelector('pds-multiselect')!.shadowRoot!;
        const trigger = root.querySelector('.pds-multiselect__trigger')!;
        const text = root.querySelector('.pds-multiselect__trigger-text')!;
        const rect = trigger.getBoundingClientRect();
        return {
          text: text.textContent,
          clipped: text.scrollWidth > text.clientWidth,
          width: rect.width,
          height: rect.height,
        };
      });

    it('truncates a long name instead of growing the trigger, with no axe violations', async () => {
      const empty = await measure(await renderWith([]));
      const page = await renderWith(['1']);
      const single = await measure(page);

      expect(single.text).toBe(longText);
      expect(single.clipped).toBe(true);
      expect(single.width).toBe(empty.width);
      expect(single.height).toBe(empty.height);
      expect(formatViolations(await runAxe(page))).toBe('');
    });

    it('names an unlabeled trigger by the selected item, and a labeled one by its label', async () => {
      const triggerName = async (labelAttribute: string) => {
        const page = await newE2EPage();
        await page.setContent(`<pds-multiselect component-id="tags" ${labelAttribute}></pds-multiselect>`);
        await setOptions(page, [{ id: '1', text: 'Marketing' }]);
        await page.$eval('pds-multiselect', (el: HTMLElement & { value?: string[] }) => { el.value = ['1']; });
        await page.waitForChanges();
        const client = await page.createCDPSession();
        const { nodes } = await client.send('Accessibility.getFullAXTree');
        return nodes.find(node => !node.ignored && node.role?.value === 'button')?.name?.value;
      };

      expect(await triggerName('')).toBe('Marketing');
      expect(await triggerName('label="Tags"')).toBe('Tags');
    });

    it('shows the count again once a second item is selected', async () => {
      const page = await renderWith(['1', '2']);
      expect((await measure(page)).text).toBe('2 items');
    });
  });

  describe('chip display', () => {
    it('colors each option dot with its dotColor', async () => {
      const page = await openWith('option-display="chip"', [{ id: '1', text: 'Bestsellers', dotColor: 'rgb(128, 0, 128)' }]);

      const dot = await page.evaluate(() => {
        const chip = document
          .querySelector('pds-multiselect')!
          .shadowRoot!.querySelector('.pds-multiselect__option pds-checkbox pds-chip[slot="label"]')!;
        return {
          color: getComputedStyle(chip.shadowRoot!.querySelector('.pds-chip__dot')!).backgroundColor,
          text: chip.textContent,
        };
      });

      expect(dot).toEqual({ color: 'rgb(128, 0, 128)', text: 'Bestsellers' });
    });

    it('keeps each option named by its text', async () => {
      const page = await openWith('option-display="chip"', tagOptions);

      expect((await axOptions(page)).map(([name]) => name)).toEqual(['Bestsellers', 'Webinar']);
    });

    describe('with a name too long for the panel', () => {
      const longText = `Tag_${'x'.repeat(96)}`;

      const openNarrow = (attributes = '') =>
        openWith(`option-display="chip" style="width: 250px" ${attributes}`, [{ id: '1', text: longText, actionIcon: 'pen' }]);

      it('truncates the chip and keeps the option action inside the panel, with no axe violations', async () => {
        const page = await openNarrow('option-actions');
        await page.keyboard.press('ArrowDown');
        await page.waitForChanges();

        const layout = await page.evaluate(() => {
          const root = document.querySelector('pds-multiselect')!.shadowRoot!;
          const listbox = root.querySelector('.pds-multiselect__listbox')!;
          const label = root.querySelector('pds-chip')!.shadowRoot!.querySelector('.pds-chip__label-text')!;
          return {
            clipped: label.scrollWidth > label.clientWidth,
            listboxOverflow: listbox.scrollWidth - listbox.clientWidth,
            actionOverflow:
              root.querySelector('.pds-multiselect__option-action pds-icon')!.getBoundingClientRect().right -
              listbox.getBoundingClientRect().right,
          };
        });

        expect(layout.clipped).toBe(true);
        expect(layout.listboxOverflow).toBe(0);
        expect(layout.actionOverflow).toBeLessThan(0);
        expect(await axeViolations(page)).toBe('');
      });

      it('shows the full name beside the panel on hover, without adding a tab stop', async () => {
        const page = await openNarrow();
        await (await page.find('pds-multiselect >>> pds-chip')).hover();
        await page.waitForSelector('.pds-truncation-tooltip--visible');

        const result = await page.evaluate(() => {
          const root = document.querySelector('pds-multiselect')!.shadowRoot!;
          const chip = root.querySelector('pds-chip')!;
          const tooltip = document.querySelector('.pds-truncation-tooltip')!;
          const tip = tooltip.getBoundingClientRect();
          const row = chip.closest('li')!.getBoundingClientRect();
          return {
            tabindex: chip.shadowRoot!.querySelector('.pds-chip__label-text')!.getAttribute('tabindex'),
            text: tooltip.textContent?.trim(),
            besidePanel: tip.left >= root.querySelector('.pds-multiselect__panel')!.getBoundingClientRect().right,
            rowOffset: Math.abs(tip.top + tip.height / 2 - (row.top + row.height / 2)),
          };
        });

        expect(result).toEqual(expect.objectContaining({ tabindex: null, text: longText, besidePanel: true }));
        expect(result.rowOffset).toBeLessThan(1);
      });

      it('toggles once on a chip click, keeping the checkbox in step', async () => {
        const page = await openNarrow();
        const state = () =>
          page.$eval('pds-multiselect', (el: HTMLElement & { value?: string[] }) => ({
            value: el.value,
            checked: el.shadowRoot!.querySelector('pds-checkbox')!.shadowRoot!.querySelector('input')!.checked,
          }));

        await (await page.find('pds-multiselect >>> pds-chip')).click();
        await page.waitForChanges();
        expect(await state()).toEqual({ value: ['1'], checked: true });

        await (await page.find('pds-multiselect >>> pds-chip')).click();
        await page.waitForChanges();
        expect(await state()).toEqual({ value: [], checked: false });
      });
    });
  });

  describe('option actions', () => {
    const actionIcons = (page: Page) =>
      page.evaluate(() =>
        Array.from(
          document.querySelector('pds-multiselect')!.shadowRoot!.querySelectorAll('.pds-multiselect__option-action')
        ).map(action => action.querySelector<HTMLElement & { name?: string }>('pds-icon')?.name ?? null)
      );

    it('shows the action icon only on the highlighted or hovered option', async () => {
      const page = await openWith('option-actions', actionOptions);
      expect(await actionIcons(page)).toEqual([null, null]);

      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      expect(await actionIcons(page)).toEqual(['pen', null]);

      const options = await page.findAll('pds-multiselect >>> .pds-multiselect__option');
      await options[1].hover();
      await page.waitForChanges();
      expect(await actionIcons(page)).toEqual([null, 'pen']);
    });

    it('shows every action icon on a device without hover', async () => {
      const page = await openWith('option-actions', actionOptions, { canHover: false });

      expect(await actionIcons(page)).toEqual(['pen', 'pen']);
    });

    it("keeps each option named by its text and describes the option's own action", async () => {
      const page = await openWith('option-actions', [
        { id: '1', text: 'Bestsellers', actionIcon: 'pen' },
        { id: '2', text: 'Archived', actionIcon: 'info-circle', actionLabel: 'View {text}' },
      ]);

      expect(await axOptions(page)).toEqual([
        ['Bestsellers', 'Press Right Arrow to Edit Bestsellers'],
        ['Archived', 'Press Right Arrow to View Archived'],
      ]);
    });

    it('emits pdsMultiselectOptionAction on click without toggling the option, and focuses the trigger', async () => {
      const page = await openWith('option-actions', actionOptions);
      const action = await page.spyOnEvent('pdsMultiselectOptionAction');
      const change = await page.spyOnEvent('pdsMultiselectChange');
      const dismiss = await page.spyOnEvent('pdsMultiselectDismiss');

      const options = await page.findAll('pds-multiselect >>> .pds-multiselect__option');
      await options[0].hover();
      await page.waitForChanges();
      await (await page.find('pds-multiselect >>> .pds-multiselect__option-action')).click();
      await page.waitForChanges();
      await settle();

      expect(action).toHaveReceivedEventTimes(1);
      expect(action.firstEvent.detail.option).toEqual(expect.objectContaining({ id: '1', text: 'Bestsellers' }));
      expect(change).not.toHaveReceivedEvent();
      expect(dismiss).not.toHaveReceivedEvent();
      expect(await isPanelOpen(page)).toBe(false);
      expect(
        await page.evaluate(() =>
          document.querySelector('pds-multiselect')!.shadowRoot!.activeElement?.classList.contains('pds-multiselect__trigger')
        )
      ).toBe(true);
    });

    it('runs the action from Right Arrow on the highlighted option', async () => {
      const page = await openWith('option-actions', actionOptions);
      const action = await page.spyOnEvent('pdsMultiselectOptionAction');

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      expect(action).toHaveReceivedEventTimes(1);
      expect(action.firstEvent.detail.option.id).toBe('2');
    });

    it('moves the caret on Right Arrow inside typed text, and runs the action from the end', async () => {
      const page = await openWith('option-actions', actionOptions);
      const action = await page.spyOnEvent('pdsMultiselectOptionAction');

      await page.keyboard.type('Best');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(action).not.toHaveReceivedEvent();

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(action).toHaveReceivedEventTimes(1);
    });
  });

  describe('Tab out of the open panel', () => {
    // The innermost id on the focus path into shadow roots, so a pds-button reports its own id; a
    // built-in trigger's id is its component-id.
    const focusedId = (page: Page) =>
      page.evaluate(() => {
        let el = document.activeElement;
        let id = el?.id;
        while (el?.shadowRoot?.activeElement) {
          el = el.shadowRoot.activeElement;
          id = el.id || id;
        }
        return id || el?.localName;
      });

    // Pauses between keys as a person does, so the closed panel has re-rendered before the next one.
    const pressTabs = async (page: Page, keys: Array<'Tab' | 'Shift+Tab'>) => {
      const order: string[] = [];
      for (const key of keys) {
        if (key === 'Shift+Tab') await page.keyboard.down('Shift');
        await page.keyboard.press('Tab');
        if (key === 'Shift+Tab') await page.keyboard.up('Shift');
        await settle(300);
        order.push(await focusedId(page));
      }
      return order;
    };

    const waitForSearchFocusIn = (page: Page, componentId: string) =>
      page.waitForFunction(
        id =>
          document
            .querySelector(`pds-multiselect[component-id="${id}"]`)
            ?.shadowRoot?.activeElement?.classList.contains('pds-multiselect__search-input'),
        {},
        componentId,
      );

    for (const [name, attributes, trigger, triggerId] of [
      ['the built-in trigger', '', '', 'tags'],
      ['the inline-pill trigger', 'selected-display="pill" pill-position="inline"', '', 'tags'],
      ['a slotted trigger', '', '<button slot="trigger" type="button" id="slotted">Add tag</button>', 'slotted'],
      ['a slotted pds-button trigger', '', '<pds-button slot="trigger" id="slotted">Add tag</pds-button>', 'slotted'],
    ]) {
      describe(`with ${name}`, () => {
        const openFromKeyboard = async () => {
          const page = await newE2EPage();
          await page.setContent(`
            <button type="button" id="before">Before</button>
            <pds-multiselect component-id="tags" label="Tags" ${attributes}>
              ${trigger}
              <option value="1">Bestsellers</option>
              <option value="2">Webinar</option>
            </pds-multiselect>
            <button type="button" id="after">After</button>
          `);
          await page.focus('#before');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Enter');
          await waitForSearchFocus(page);
          return page;
        };

        it('returns focus to the trigger on Tab, and the next Tab moves on', async () => {
          const page = await openFromKeyboard();
          const dismiss = await page.spyOnEvent('pdsMultiselectDismiss');

          expect(await pressTabs(page, ['Tab', 'Tab'])).toEqual([triggerId, 'after']);
          expect(await isPanelOpen(page)).toBe(false);
          expect(dismiss).not.toHaveReceivedEvent();
          expect(await axeViolations(page)).toBe('');
        });

        it('returns focus to the trigger on Shift+Tab, and the next Shift+Tab moves back', async () => {
          const page = await openFromKeyboard();

          expect(await pressTabs(page, ['Shift+Tab', 'Shift+Tab'])).toEqual([triggerId, 'before']);
          expect(await isPanelOpen(page)).toBe(false);
          expect(await axeViolations(page)).toBe('');
        });
      });
    }

    describe('in a pds-popover', () => {
      const footer = '<a slot="footer" href="#manage" id="manage">Manage tags</a>';

      const popover = (footerOn?: 'tags' | 'location') => `
        <pds-popover component-id="filters">
          <button type="button" slot="trigger" id="trigger">Filters</button>
          <div>
            <pds-multiselect component-id="tags" label="Tags">
              <option value="1">Bestsellers</option>${footerOn === 'tags' ? footer : ''}
            </pds-multiselect>
            <pds-multiselect component-id="location" label="Location">
              <option value="1">Course</option>${footerOn === 'location' ? footer : ''}
            </pds-multiselect>
          </div>
        </pds-popover>
        <button type="button" id="after">After</button>
      `;

      const openInPanel = async (page: Page, componentId: 'tags' | 'location') => {
        await page.focus('#trigger');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.getElementById('filters-portal')?.style.display === 'block');
        await pressTabs(page, componentId === 'tags' ? ['Tab'] : ['Tab', 'Tab']);
        await page.keyboard.press('Enter');
        await waitForSearchFocusIn(page, componentId);
      };

      for (const [where, inModal] of [
        ['at the end of the page', false],
        ['inside a pds-modal', true],
      ] as const) {
        describe(where, () => {
          const setUp = async (footerOn?: 'tags' | 'location') => {
            const page = await newE2EPage();
            await page.setContent(
              inModal
                ? `<pds-modal component-id="modal"><div slot="header">Filters</div><div>${popover(footerOn)}</div></pds-modal>`
                : popover(footerOn),
            );
            if (inModal) {
              await (await page.find('pds-modal')).callMethod('showModal');
              await page.waitForChanges();
            }
            return page;
          };

          it('goes from an open multiselect to its trigger, then on to the next control', async () => {
            const page = await setUp();
            await openInPanel(page, 'tags');

            expect(await pressTabs(page, ['Tab', 'Tab', 'Tab'])).toEqual(['tags', 'location', 'after']);
            expect(await axeViolations(page)).toBe('');
          });

          it('leaves the panel on the second Tab when the open multiselect is its last control', async () => {
            const page = await setUp();
            await openInPanel(page, 'location');

            expect(await pressTabs(page, ['Tab', 'Tab'])).toEqual(['location', 'after']);
            expect(await axeViolations(page)).toBe('');
          });

          it('moves on from the last footer control to the next control', async () => {
            const page = await setUp('tags');
            await openInPanel(page, 'tags');

            expect(await pressTabs(page, ['Tab', 'Tab', 'Tab'])).toEqual(['manage', 'location', 'after']);
            expect(await axeViolations(page)).toBe('');
          });

          it('leaves the panel from the last footer control when the open multiselect is its last control', async () => {
            const page = await setUp('location');
            await openInPanel(page, 'location');

            expect(await pressTabs(page, ['Tab', 'Tab'])).toEqual(['manage', 'after']);
            expect(await axeViolations(page)).toBe('');
          });
        });
      }
    });
  });

  describe('axe', () => {
    it('finds no violations when open from the built-in trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" value='["1"]'>
          <option value="1">Bestsellers</option>
          <option value="2">Webinar</option>
        </pds-multiselect>
      `);
      await openBuiltInTrigger(page);

      expect(await axeViolations(page)).toBe('');
    });

    it('finds no violations when open with an error message', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" invalid error-message="Choose at least one tag">
          <option value="1">Bestsellers</option>
        </pds-multiselect>
      `);
      await openBuiltInTrigger(page);

      expect(await axeViolations(page)).toBe('');
    });

    it('finds no violations when open from a slotted trigger', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" hide-label>
          <option value="1">Bestsellers</option>
          <button slot="trigger" type="button" id="cell">Add tag</button>
        </pds-multiselect>
      `);
      await page.click('#cell');
      await waitForSearchFocus(page);

      expect(await axeViolations(page)).toBe('');
    });

    it('finds no violations with chip display, a highlighted option action and a footer', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-multiselect component-id="tags" label="Tags" hide-label option-display="chip" option-actions>
          <button slot="trigger" type="button" id="cell">Add tag</button>
          <button slot="footer" type="button">Manage tags</button>
        </pds-multiselect>
      `);
      await setOptions(page, [
        ...actionOptions,
        { id: '3', text: 'Archived', actionIcon: 'info-circle', actionLabel: 'View {text}' },
        { id: '4', text: 'Free' },
      ]);
      await page.click('#cell');
      await waitForSearchFocus(page);
      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();

      expect(await axeViolations(page)).toBe('');
    });
  });
});

describe('pds-multiselect truncation', () => {
  const longPlaceholder = 'Choose the tags that apply to this product';
  const firstTag = `First_${'x'.repeat(60)}`;
  const secondTag = `Second_${'x'.repeat(60)}`;

  const tooltips = (page: Page) =>
    page.$$eval('.pds-truncation-tooltip', els => els.map(el => el.textContent.trim()));

  const narrow = async (value: string[] = []) => {
    const page = await newE2EPage();
    await pinHover(page, true);
    await page.setContent(
      `<pds-multiselect component-id="tags" label="Tags" style="width: 180px" placeholder="${longPlaceholder}"></pds-multiselect>`,
    );
    await setOptions(page, [{ id: '1', text: firstTag }, { id: '2', text: secondTag }]);
    if (value.length > 0) {
      await page.$eval('pds-multiselect', (el: HTMLElement & { value?: string[] }, ids) => { el.value = ids; }, value);
      await page.waitForChanges();
    }
    return page;
  };

  describe('trigger text', () => {
    // Shown while nothing is selected, and permanently when pills sit below the trigger, so it is
    // the field's only visible description rather than filler over a field being typed into.
    it('reveals the whole placeholder on hover while the trigger clips it', async () => {
      const page = await narrow();

      expect(
        await page.$eval('pds-multiselect', el => {
          const text = el.shadowRoot.querySelector('.pds-multiselect__trigger-text');
          return text.scrollWidth > text.clientWidth;
        }),
      ).toBe(true);

      await (await page.find('pds-multiselect >>> .pds-multiselect__trigger')).hover();
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      expect(await tooltips(page)).toEqual([longPlaceholder]);
    });

    // The trigger button is the tab stop; a second one on the text inside it would be nameless.
    it('reveals it on keyboard focus, adding no tab stop of its own', async () => {
      const page = await narrow();

      // Focus the way a key press does, not with one: every worker's page shares one browser, and a page
      // another worker just opened takes window focus, so a Tab here can land nowhere.
      await page.$eval('pds-multiselect', el =>
        el.shadowRoot.querySelector<HTMLElement>('button.pds-multiselect__trigger').focus({ focusVisible: true } as FocusOptions),
      );
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      expect(await tooltips(page)).toEqual([longPlaceholder]);
      expect(
        await page.$eval('pds-multiselect', el =>
          el.shadowRoot.querySelector('.pds-multiselect__trigger-text').getAttribute('tabindex'),
        ),
      ).toBeNull();
    });

    it('follows the text the trigger shows now, so a count that fits reveals nothing', async () => {
      const page = await narrow(['1', '2']);

      expect(
        await page.$eval('pds-multiselect', el =>
          el.shadowRoot.querySelector('.pds-multiselect__trigger-text').textContent,
        ),
      ).toBe('2 items');

      await (await page.find('pds-multiselect >>> .pds-multiselect__trigger')).hover();
      await settle(200);

      expect(await tooltips(page)).toEqual([]);
    });

    // There the placeholder sits beside the chevron button rather than inside it, so the
    // surface around both is what hover and the chevron's focus have in common.
    it('reveals the placeholder the inline pill trigger clips, on hover and on focus', async () => {
      const page = await newE2EPage();
      await pinHover(page, true);
      await page.setContent(
        `<pds-multiselect component-id="tags" label="Tags" style="width: 180px" selected-display="pill" placeholder="${longPlaceholder}"></pds-multiselect>`,
      );
      await setOptions(page, [{ id: '1', text: firstTag }]);

      await (await page.find('pds-multiselect >>> .pds-multiselect__trigger--pill-inline')).hover();
      await page.waitForSelector('.pds-truncation-tooltip--visible');
      expect(await tooltips(page)).toEqual([longPlaceholder]);

      await page.mouse.move(0, 0);
      await settle(300);
      // The chevron is the tab stop here; focused as a key press would, for the reason given above.
      await page.$eval('pds-multiselect', el =>
        el.shadowRoot.querySelector<HTMLElement>('.pds-multiselect__pill-toggle').focus({ focusVisible: true } as FocusOptions),
      );
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      expect(await tooltips(page)).toEqual([longPlaceholder]);
      expect(
        await page.$eval('pds-multiselect', el =>
          el.shadowRoot.querySelector('.pds-multiselect__trigger-text').getAttribute('tabindex'),
        ),
      ).toBeNull();
    });

    it('shows nothing while the pointer is in the open panel, a child of the same host', async () => {
      const page = await narrow();
      await openBuiltInTrigger(page);

      await (await page.find('pds-multiselect >>> .pds-multiselect__option')).hover();
      await settle(200);

      expect(await tooltips(page)).toEqual([]);
    });
  });

  describe('selected items list', () => {
    const openWithSelections = async () => {
      const page = await narrow(['1', '2']);
      await openBuiltInTrigger(page);
      return page;
    };

    const rows = (page: Page) => page.$$('pds-multiselect >>> .pds-multiselect__selected-item');

    // Nothing around them takes focus, so each clipped row carries the tab stop its tooltip needs.
    it('gives every clipped row its own tab stop', async () => {
      const page = await openWithSelections();

      expect(
        await page.$eval('pds-multiselect', el =>
          Array.from(el.shadowRoot.querySelectorAll('.pds-multiselect__selected-item')).map(item => ({
            clipped: item.scrollWidth > item.clientWidth,
            tabindex: item.getAttribute('tabindex'),
          })),
        ),
      ).toEqual([
        { clipped: true, tabindex: '0' },
        { clipped: true, tabindex: '0' },
      ]);
    });

    it('reveals the hovered row beside that row, not the list', async () => {
      const page = await openWithSelections();

      await (await rows(page))[1].hover();
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      // It opens above its anchor, so an anchor on the hovered row leaves it between the two
      // rows; anchored to the list instead it would clear the first row's top edge as well.
      const placement = await page.evaluate(() => {
        const items = document
          .querySelector('pds-multiselect')
          .shadowRoot.querySelectorAll('.pds-multiselect__selected-item');
        const tip = document.querySelector('.pds-truncation-tooltip').getBoundingClientRect();
        return {
          aboveHoveredRow: tip.bottom <= items[1].getBoundingClientRect().top,
          belowFirstRowTop: tip.bottom > items[0].getBoundingClientRect().top,
        };
      });

      expect(await tooltips(page)).toEqual([secondTag]);
      expect(placement).toEqual({ aboveHoveredRow: true, belowFirstRowTop: true });
    });

    it('rebinds the rows a changed selection renders', async () => {
      const page = await openWithSelections();

      await page.$eval('pds-multiselect', (el: HTMLElement & { value?: string[] }) => { el.value = ['2']; });
      await page.waitForChanges();

      const remaining = await rows(page);
      expect(remaining).toHaveLength(1);

      await remaining[0].hover();
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      expect(await tooltips(page)).toEqual([secondTag]);
    });

    // The panel re-renders on every keystroke, and re-binding then would tear down a tooltip the
    // pointer is still inside.
    it('keeps the rows bound while searching re-renders the panel', async () => {
      const page = await openWithSelections();

      await page.keyboard.type('First');
      await page.waitForChanges();

      await (await rows(page))[0].hover();
      await page.waitForSelector('.pds-truncation-tooltip--visible');

      expect(await tooltips(page)).toEqual([firstTag]);
    });

    // The rows sit between the search input and the options, whose checkboxes Tab jumps past.
    describe('by keyboard', () => {
      const focused = (page: Page) =>
        page.evaluate(() => {
          const inner = document.querySelector('pds-multiselect').shadowRoot.activeElement;
          if (inner?.classList.contains('pds-multiselect__selected-item')) return inner.textContent;
          if (inner?.classList.contains('pds-multiselect__search-input')) return 'search';
          if (inner?.classList.contains('pds-multiselect__trigger')) return 'trigger';
          return document.activeElement?.id;
        });

      const press = async (page: Page, key: 'Tab' | 'Shift+Tab') => {
        if (key === 'Shift+Tab') await page.keyboard.down('Shift');
        await page.keyboard.press('Tab');
        if (key === 'Shift+Tab') await page.keyboard.up('Shift');
        await page.waitForChanges();
        await settle();
        return focused(page);
      };

      it('tabs from the search input through each clipped row to the footer, and back', async () => {
        const page = await narrow(['1', '2']);
        await page.$eval('pds-multiselect', el => {
          el.insertAdjacentHTML('beforeend', '<div slot="footer"><button type="button" id="manage">Manage tags</button></div>');
        });
        await page.waitForChanges();
        await openBuiltInTrigger(page);

        expect(await press(page, 'Tab')).toBe(firstTag);
        await page.waitForSelector('.pds-truncation-tooltip--visible');
        expect(await tooltips(page)).toEqual([firstTag]);

        expect(await press(page, 'Tab')).toBe(secondTag);
        expect(await press(page, 'Tab')).toBe('manage');
        expect(await press(page, 'Shift+Tab')).toBe(secondTag);
        expect(await press(page, 'Shift+Tab')).toBe(firstTag);
        expect(await press(page, 'Shift+Tab')).toBe('search');
        expect(await isPanelOpen(page)).toBe(true);
      });

      it('closes onto the trigger when Tab leaves the last row with no footer', async () => {
        const page = await openWithSelections();

        expect(await press(page, 'Tab')).toBe(firstTag);
        expect(await press(page, 'Tab')).toBe(secondTag);
        expect(await press(page, 'Tab')).toBe('trigger');
        expect(await isPanelOpen(page)).toBe(false);
      });
    });

    it('has no axe violations while the rows are clipped', async () => {
      const page = await openWithSelections();

      expect(await axeViolations(page)).toBe('');
    });
  });
});
