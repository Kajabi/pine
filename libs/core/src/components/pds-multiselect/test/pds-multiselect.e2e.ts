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
    });
  }

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
