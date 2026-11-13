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

  it('names a selected option by its label alone', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="fruit" label="Fruit" trigger="button" mode="select-only" value="apple">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </pds-combobox>
    `);
    await page.waitForChanges();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();

    const tree = await page.accessibility.snapshot();
    const findOptions = (node) => [node.role === 'option' ? [node.name, !!node.selected] : null, ...(node.children ?? []).flatMap(findOptions)].filter(Boolean);

    expect(findOptions(tree)).toEqual([['Apple', true], ['Banana', false]]);
  });

  // trigger-width sets the trigger's whole box, so 100% fills its container, padding and border included.
  // The brand chip is the one chip trigger that keeps padding (1px) in its dropdown variant.
  it.each([
    ['input', 'trigger="input"', '.pds-combobox__input-wrapper'],
    ['button', 'trigger="button"', '.pds-combobox__button-trigger'],
    ['brand chip', 'trigger="chip" chip-sentiment="brand"', '.pds-combobox__chip-trigger'],
  ])('keeps a %s trigger at trigger-width="100%" inside its container', async (_trigger, attributes, selector) => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 300px">
        <pds-combobox component-id="sized" label="Action" ${attributes} trigger-width="100%">
          <option value="a">A</option>
        </pds-combobox>
      </div>
    `);
    await page.waitForChanges();

    const widths = await page.evaluate(triggerSelector => {
      const host = document.querySelector('pds-combobox')!;
      const trigger = host.shadowRoot!.querySelector(triggerSelector)!;
      return { host: host.getBoundingClientRect().width, trigger: trigger.getBoundingClientRect().width };
    }, selector);

    expect(widths.host).toBe(300);
    expect(widths.trigger).toBe(300);
  });

  describe('option chips', () => {
    const LONG = 'Assessment for the quarterly onboarding cohort of new members';

    const openChips = async (options: string, value: string) => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="status" label="Status" trigger="chip" mode="select-only" value="${value}">
          ${options}
        </pds-combobox>
      `);
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__chip-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    /**
     * Each chip row: the chip's width and its content width, how far the chip and the check sit
     * from the row's padding edges, and how far the chip's own text overflows its boundary --
     * measuring the text itself, not the chip, since a chip can be narrower than its max-content
     * width (min-width: 0 alone does that) while its unwrapped text still runs past its edge.
     */
    const chipRows = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() =>
        Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll<HTMLElement>('.pds-combobox__option--chip')).map(row => {
          const chip = row.querySelector<HTMLElement>('.pds-combobox__option-chip')!;
          const check = row.querySelector('.pds-combobox__option-check');
          const box = row.getBoundingClientRect();
          const { paddingInlineStart, paddingInlineEnd } = getComputedStyle(row);
          const start = box.left + parseFloat(paddingInlineStart);
          const end = box.right - parseFloat(paddingInlineEnd);
          const width = chip.getBoundingClientRect().width;
          chip.style.cssText = 'flex: none; width: max-content';
          const contentWidth = chip.getBoundingClientRect().width;
          chip.style.cssText = '';
          const range = document.createRange();
          range.selectNodeContents(chip);
          const textRight = Math.max(...Array.from(range.getClientRects(), rect => rect.right));
          return {
            width,
            contentWidth,
            chipOffset: chip.getBoundingClientRect().left - start,
            checkOffset: check ? end - check.getBoundingClientRect().right : null,
            textOverflow: textRight - chip.getBoundingClientRect().right,
          };
        }),
      );

    // An option chip sizes to its label, as the trigger chip does, so the selected row's check doesn't
    // make its chip narrower than the rest.
    it('sizes each option chip to its label, with the check at the end of the selected row', async () => {
      const page = await openChips(`
        <option value="high" chip-sentiment="danger" chip-icon="warning">High</option>
        <option value="urgent" chip-sentiment="danger" chip-icon="warning">High</option>
      `, 'high');

      const [selected, other] = await chipRows(page);

      expect(selected.width).toBeCloseTo(selected.contentWidth, 0);
      expect(other.width).toBeCloseTo(other.contentWidth, 0);
      expect(selected.width).toBeCloseTo(other.width, 0);
      expect(selected.chipOffset).toBeCloseTo(0, 0);
      expect(selected.checkOffset).toBeCloseTo(0, 0);
      expect(other.checkOffset).toBeNull();
    });

    it.each([
      ['words', LONG],
      ['one long word', 'https://example.com/onboarding/quarterly-cohort-assessment-for-new-members'],
      ['one unbreakable token with no spaces or hyphens', 'Supercalifragilisticexpialidocioussupercalifragilisticexpialidocious'],
    ])('wraps a long option chip of %s, keeping the check in the row', async (_kind, label) => {
      const page = await openChips(`
        <option value="long" chip-sentiment="info">${label}</option>
        <option value="short" chip-sentiment="info">Event</option>
      `, 'long');

      const [long] = await chipRows(page);

      expect(long.width).toBeLessThan(long.contentWidth);
      expect(long.checkOffset).toBeCloseTo(0, 0);
      expect(long.textOverflow).toBeLessThanOrEqual(0);
    });
  });

  // The button and chip triggers are divs, which take clicks and focus whether or not they're disabled.
  describe.each([
    ['button', 'trigger="button"', '.pds-combobox__button-trigger'],
    ['chip', 'trigger="chip"', '.pds-combobox__chip-trigger'],
  ])('a disabled %s trigger', (_trigger, attributes, selector) => {
    const setUp = async (disabled: boolean) => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="locked" label="Trigger" ${attributes} mode="select-only" ${disabled ? 'disabled' : ''}>
          <option value="a">A</option>
          <option value="b">B</option>
        </pds-combobox>
      `);
      await page.waitForChanges();
      return page;
    };

    const openState = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(triggerSelector => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        return {
          expanded: root.querySelector(triggerSelector)!.getAttribute('aria-expanded'),
          listbox: !!root.querySelector('.pds-combobox__listbox'),
        };
      }, selector);

    it('stays closed when clicked', async () => {
      const page = await setUp(true);
      await (await page.find(`pds-combobox >>> ${selector}`)).click();
      await page.waitForChanges();

      expect(await openState(page)).toEqual({ expanded: 'false', listbox: false });
    });

    it('stays closed on the opening keys once focused through setFocus()', async () => {
      const page = await setUp(true);
      await (await page.find('pds-combobox')).callMethod('setFocus');
      await page.waitForChanges();

      const keys: Array<'Enter' | 'Space' | 'ArrowDown' | 'ArrowUp'> = ['Enter', 'Space', 'ArrowDown', 'ArrowUp'];
      for (const key of keys) {
        await page.keyboard.press(key);
        await page.waitForChanges();
        expect(await openState(page)).toEqual({ expanded: 'false', listbox: false });
      }
    });

    it('closes when disabled while open', async () => {
      const page = await setUp(false);
      await (await page.find(`pds-combobox >>> ${selector}`)).click();
      await page.waitForChanges();
      expect(await openState(page)).toEqual({ expanded: 'true', listbox: true });

      await (await page.find('pds-combobox')).setProperty('disabled', true);
      await page.waitForChanges();
      expect(await openState(page)).toEqual({ expanded: 'false', listbox: false });
    });

    // A dropdown mounted in the body keeps its search field in the portal's own shadow root.
    it.each([
      ['in the field', ''],
      ['in the body', 'body'],
    ])('moves focus from the panel search to the trigger when disabled while open (dropdown %s)', async (_mount, dropdownMount) => {
      const page = await setUp(false);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement, mount) => {
          el.setAttribute('panel-search', '');
          if (mount) el.setAttribute('dropdown-mount', mount);
        },
        dropdownMount,
      );
      await page.waitForChanges();
      await (await page.find(`pds-combobox >>> ${selector}`)).click();
      await page.waitForChanges();
      const searchFocused = () =>
        page.evaluate(() => {
          const roots = [document.querySelector('pds-combobox')!.shadowRoot, document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot];
          return roots.some(root => (root?.activeElement as HTMLElement | null)?.classList.contains('pds-combobox__panel-search-input'));
        });
      const active = () =>
        page.evaluate(() => (document.querySelector('pds-combobox')!.shadowRoot!.activeElement as HTMLElement | null)?.className ?? '');
      expect(await searchFocused()).toBe(true);

      await (await page.find('pds-combobox')).setProperty('disabled', true);
      await page.waitForChanges();
      await page.waitForFunction(
        triggerSelector => document.querySelector('pds-combobox')!.shadowRoot!.activeElement?.matches(triggerSelector),
        {},
        selector,
      );
      expect(await active()).toContain(selector.slice(1));
    });
  });

  // Outside drill-in, showing the highlighted row scrolls whatever holds it, as `scrollIntoView`
  // does: here a container the dropdown runs past. Flyout group rows take the highlight without
  // focus, so nothing else scrolls the container to them.
  it('scrolls a container the dropdown runs past to show the highlighted group row', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(`
      <div id="scroller" style="height: 200px; overflow: auto;">
        <pds-combobox component-id="many" label="Option" trigger="button" mode="select-only" group-display="flyout" dropdown-width="300px">
          ${Array.from({ length: 20 }, (_, i) => `<optgroup label="Group ${i}"><option value="o${i}">Option ${i}</option></optgroup>`).join('')}
        </pds-combobox>
      </div>
    `);
    await page.waitForChanges();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();
    await page.mouse.move(0, 0);

    await page.keyboard.press('End');
    await page.waitForChanges();

    // Wait for the scroll to bring the row in. A regression fails on the timeout.
    const shown = await page
      .waitForFunction(
        () => {
          const scroller = document.getElementById('scroller')!.getBoundingClientRect();
          const row = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row:last-of-type')!.getBoundingClientRect();
          return row.bottom <= scroller.bottom + 0.5;
        },
        { timeout: 3000 },
      )
      .then(() => true)
      .catch(() => false);
    expect(shown).toBe(true);
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

  // The check marks the selection; the fill and the keyboard's ring mark only the current row.
  describe('the selected option and the current row', () => {
    const setUp = async (attrs = '') => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="fruit" label="Fruit" trigger="button" mode="select-only" value="banana" ${attrs}>
          <optgroup label="Fruits">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
          </optgroup>
        </pds-combobox>
      `);
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      // The click leaves the pointer over the trigger; park it away from the panel so a stray
      // mouseenter can't move the highlight or end keyboard navigation.
      await page.mouse.move(0, 0);
      await page.waitForChanges();
      return page;
    };

    // Waits for every fill transition (and any open/drill animation) to finish, so a mid-fade row
    // isn't read as filled. getAnimations() flushes style first, so a transition about to start counts.
    const settle = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.waitForFunction(() => document.querySelector('pds-combobox')!.shadowRoot!.getAnimations().length === 0, {
        timeout: 3000,
      });

    // Each visible option's text, fill and outline style, once the fill's transition has run.
    const rows = async (page: Awaited<ReturnType<typeof newE2EPage>>) => {
      await settle(page);
      return page.evaluate(() =>
        Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__option'))
          .filter(el => el.getClientRects().length > 0)
          .map(el => {
            const { backgroundColor, outlineStyle } = getComputedStyle(el);
            return { text: el.textContent, filled: backgroundColor !== 'rgba(0, 0, 0, 0)', outlineStyle };
          }),
      );
    };

    it.each([['inline', ''], ['flyout', 'group-display="flyout"'], ['drill-in', 'group-display="drill-in"']])(
      'opens on the selection, and leaves it unfilled while another row is hovered (%s)',
      async (_display, attrs) => {
        const page = await setUp(attrs);

        expect((await rows(page)).filter(row => row.filled).map(row => row.text)).toEqual(['Banana']);

        await (await page.find('pds-combobox >>> .pds-combobox__option[data-option-index="2"]')).hover();
        await page.waitForChanges();

        expect((await rows(page)).filter(row => row.filled).map(row => row.text)).toEqual(['Cherry']);
      },
    );

    it('rings an inline option the arrow keys reach, and not one the pointer hovers', async () => {
      const page = await setUp();

      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      expect((await rows(page)).find(row => row.text === 'Cherry')?.outlineStyle).toBe('solid');

      await (await page.find('pds-combobox >>> .pds-combobox__option[data-option-index="0"]')).hover();
      await page.waitForChanges();
      expect((await rows(page)).map(row => row.outlineStyle)).toEqual(['none', 'none', 'none']);
    });

    it("keeps a flyout's open group row filled while an option in its flyout is hovered", async () => {
      const page = await setUp('group-display="flyout"');
      expect(await page.find('pds-combobox >>> .pds-combobox__flyout')).not.toBeNull();

      await (await page.find('pds-combobox >>> .pds-combobox__option[data-option-index="2"]')).hover();
      await page.waitForChanges();
      await settle(page);

      const groupRowFill = await page.evaluate(() => {
        const trigger = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row--open > .pds-combobox__group-row-trigger')!;
        return getComputedStyle(trigger).backgroundColor;
      });
      expect(groupRowFill).not.toBe('rgba(0, 0, 0, 0)');
    });

    it.each([['flyout', 'group-display="flyout"'], ['drill-in', 'group-display="drill-in"']])(
      'rings an option the arrow keys reach (%s)',
      async (_display, attrs) => {
        const page = await setUp(attrs);

        await page.keyboard.press('ArrowDown');
        await page.waitForChanges();

        const cherry = (await rows(page)).find(row => row.text === 'Cherry');
        expect(cherry?.outlineStyle).toBe('solid');
        expect(await page.find('pds-combobox >>> .pds-combobox__option--keyboard')).not.toBeNull();
      },
    );
  });

  describe('group-display="flyout"', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    ];

    const setUp = async (
      wrapperStyle = '',
      trigger: 'button' | 'input' = 'button',
      options: unknown[] = actions,
      viewportHeight = 800,
    ) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: viewportHeight });
      const mode = trigger === 'button' ? 'select-only' : 'filter';
      await page.setContent(`
        <div style="${wrapperStyle}">
          <pds-combobox component-id="actions" label="Action" trigger="${trigger}" mode="${mode}"
            group-display="flyout" dropdown-width="300px"></pds-combobox>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        options,
      );
      await page.waitForChanges();
      const triggerSelector = trigger === 'button' ? '.pds-combobox__button-trigger' : 'input';
      await (await page.find(`pds-combobox >>> ${triggerSelector}`)).click();
      await page.waitForChanges();
      return page;
    };

    const hoverGroup = async (page: Awaited<ReturnType<typeof newE2EPage>>, label: string) => {
      const box = await page.evaluate(text => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const row = Array.from(root.querySelectorAll('.pds-combobox__group-row-trigger')).find(
          el => el.textContent === text,
        )!;
        const rect = row.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      }, label);
      await page.mouse.move(box.x, box.y);
      await page.waitForChanges();
      // autoUpdate positions on the next frame.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };

    const geometry = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        // DOMRect doesn't serialize out of the page; copy the edges we compare.
        const rect = (selector: string) => {
          const { left, right, top } = root.querySelector(selector)!.getBoundingClientRect();
          return { left, right, top };
        };
        return {
          panel: rect('.pds-combobox__listbox'),
          row: rect('.pds-combobox__group-row--open .pds-combobox__group-row-trigger'),
          flyout: rect('.pds-combobox__flyout'),
          first: rect('.pds-combobox__flyout .pds-combobox__option'),
        };
      });

    it("opens a group's flyout on hover beside the panel, its first option level with the row", async () => {
      const page = await setUp('padding: 40px;');
      await hoverGroup(page, 'Tag');

      const { panel, row, flyout, first } = await geometry(page);
      expect(flyout.left - panel.right).toBeGreaterThanOrEqual(2);
      expect(flyout.left - panel.right).toBeLessThanOrEqual(6);
      expect(Math.abs(first.top - row.top)).toBeLessThanOrEqual(2);
    });

    it('selects an option from the flyout', async () => {
      const page = await setUp('padding: 40px;');
      await hoverGroup(page, 'Tag');

      const target = await page.evaluate(() => {
        const option = document
          .querySelector('pds-combobox')!
          .shadowRoot!.querySelector('.pds-combobox__flyout [data-option-index="1"]')!;
        const rect = option.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });
      // Slide right along the row into the flyout, then click.
      await page.mouse.move(target.x, target.y, { steps: 8 });
      await page.mouse.click(target.x, target.y);
      await page.waitForChanges();

      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('tag-remove');
    });

    it('keeps a hovered group open when its row is clicked', async () => {
      const page = await setUp('padding: 40px;');
      await hoverGroup(page, 'Tag');

      const row = await page.evaluate(() => {
        const trigger = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row-trigger')!;
        const rect = trigger.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });
      await page.mouse.click(row.x, row.y);
      await page.waitForChanges();

      const flyoutOpen = await page.evaluate(
        () => !!document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__flyout'),
      );
      expect(flyoutOpen).toBe(true);
    });

    it('keeps a long group on screen and scrolls it', async () => {
      const longGroup = Array.from({ length: 30 }, (_, i) => ({ id: `item-${i}`, text: `Item ${i}`, group: 'Many' }));
      const page = await setUp('padding: 40px;', 'button', longGroup, 400);
      await hoverGroup(page, 'Many');

      const fit = await page.evaluate(() => {
        const flyout = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__flyout') as HTMLElement;
        const { top, bottom } = flyout.getBoundingClientRect();
        return { top, bottom, viewport: window.innerHeight, scrolls: flyout.scrollHeight > flyout.clientHeight };
      });
      expect(fit.top).toBeGreaterThanOrEqual(0);
      expect(fit.bottom).toBeLessThanOrEqual(fit.viewport);
      expect(fit.scrolls).toBe(true);
    });

    it('flips the flyout to the left when there is no room on the right', async () => {
      const page = await setUp('display: flex; justify-content: flex-end; padding: 40px 8px;');
      await hoverGroup(page, 'Tag');
      // The flyout is placed a frame after it opens; under load, a single read can land first.
      await page
        .waitForFunction(
          () => {
            const root = document.querySelector('pds-combobox')!.shadowRoot!;
            const flyout = root.querySelector('.pds-combobox__flyout');
            return !!flyout && flyout.getBoundingClientRect().right <= root.querySelector('.pds-combobox__listbox')!.getBoundingClientRect().left;
          },
          { timeout: 3000 },
        )
        .catch(() => undefined);

      const { panel, flyout } = await geometry(page);
      expect(flyout.right).toBeLessThanOrEqual(panel.left);
    });

    const activeDescendant = (page: Awaited<ReturnType<typeof newE2EPage>>, selector: string) =>
      page.evaluate(sel => document.querySelector('pds-combobox')!.shadowRoot!.querySelector(sel)!.getAttribute('aria-activedescendant'), selector);

    it('has no axe violations as a tree with the button trigger and a group opened from the keyboard', async () => {
      const page = await setUp('padding: 40px;');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('opens a group from the keyboard and selects in its flyout, focus staying on the trigger', async () => {
      const page = await setUp('padding: 40px;');
      const trigger = '.pds-combobox__button-trigger';
      const tagRowId = await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row')!.id);
      expect(await activeDescendant(page, trigger)).toBe(tagRowId);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(await activeDescendant(page, trigger)).toBe('actions-option-2');
      expect(await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.activeElement?.className)).toContain('pds-combobox__button-trigger');

      await page.keyboard.press('Enter');
      await page.waitForChanges();
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('email-send');
    });

    it('has no axe violations as a tree with a group opened from the keyboard', async () => {
      const page = await setUp('padding: 40px;', 'input');
      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(await activeDescendant(page, 'input')).toBe('actions-option-0');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('lists disabled options in a flyout without choosing them, and passes axe', async () => {
      const page = await setUp('padding: 40px;', 'input', [
        { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
        { id: 'tag-score', text: 'Score a contact', group: 'Tag', disabled: true },
        { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
      ]);
      await hoverGroup(page, 'Tag');

      const target = await page.evaluate(() => {
        const option = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__flyout [data-option-index="1"]')!;
        const rect = option.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, disabled: option.getAttribute('aria-disabled') };
      });
      expect(target.disabled).toBe('true');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');

      await page.mouse.move(target.x, target.y, { steps: 8 });
      await page.mouse.click(target.x, target.y);
      await page.waitForChanges();
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBeFalsy();
    });

    it('reaches a disabled option from the keyboard without choosing it', async () => {
      const page = await setUp('padding: 40px;', 'input', [
        { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
        { id: 'tag-score', text: 'Score a contact', group: 'Tag', disabled: true },
      ]);
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      expect(await activeDescendant(page, 'input')).toBe('actions-option-1');

      await page.keyboard.press('Enter');
      await page.waitForChanges();
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBeFalsy();
      expect(await page.evaluate(() => !!document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__flyout'))).toBe(true);
    });

    // Email, not Tag: the highlight starts on the Tag row, so this checks aria-activedescendant
    // stays on a rendered row while another group's flyout is open.
    it('has no axe violations with a flyout open', async () => {
      const page = await setUp('padding: 40px;', 'input');
      await hoverGroup(page, 'Email');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('drill-in and panel-search', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    ];

    const setUp = async (attrs: string, viewportWidth = 1200) => {
      const page = await newE2EPage();
      await page.setViewport({ width: viewportWidth, height: 800 });
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="actions" label="Action" trigger="button" mode="select-only"
            dropdown-width="300px" ${attrs}></pds-combobox>
          <button id="after">After</button>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        actions,
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    const activeClass = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => (document.querySelector('pds-combobox')!.shadowRoot!.activeElement as HTMLElement | null)?.className ?? '');

    it('searches from the panel by keyboard and returns focus to the trigger', async () => {
      const page = await setUp('panel-search search-placeholder="Search actions"');
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');

      await page.keyboard.type('tag');
      await page.waitForChanges();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('tag-remove');
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');
    });

    // A flyout with room beside it searches from the panel too, so its results are listed under group labels.
    it.each([
      ['inline', 'uppercase', ''],
      ['drill-in', 'none', 'group-display="drill-in"'],
      ['flyout', 'none', 'group-display="flyout"'],
    ])("heads %s search results' groups with text-transform: %s", async (_display, textTransform, attrs) => {
      const page = await setUp(`panel-search ${attrs}`);
      await page.keyboard.type('a');
      await page.waitForChanges();

      const transform = await page.evaluate(() => {
        const label = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-label');
        return label === null ? null : getComputedStyle(label).textTransform;
      });
      expect(transform).not.toBeNull();
      expect(transform).toBe(textTransform);
    });

    it('drills into a group and back', async () => {
      const page = await setUp('group-display="drill-in"');
      const rows = () =>
        page.evaluate(() =>
          Array.from(
            document
              .querySelector('pds-combobox')!
              .shadowRoot!.querySelectorAll('.pds-combobox__group-row-trigger, .pds-combobox__group-back-trigger, .pds-combobox__option'),
          ).map(el => el.textContent),
        );

      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      expect(await rows()).toEqual(['Back: Tag', 'Add a tag', 'Remove a tag']);

      await (await page.find('pds-combobox >>> .pds-combobox__group-back-trigger')).click();
      await page.waitForChanges();
      expect(await rows()).toEqual(['Tag', 'Email']);
    });

    it('drills in from flyout mode when the viewport has no room beside the dropdown', async () => {
      const page = await setUp('group-display="flyout" dropdown-width="340px"', 420);
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      const shape = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        return { flyout: !!root.querySelector('.pds-combobox__flyout'), back: !!root.querySelector('.pds-combobox__group-back') };
      });
      expect(shape).toEqual({ flyout: false, back: true });
    });

    const isOpen = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => !!document.querySelector('.pds-combobox__listbox, pds-combobox')?.shadowRoot?.querySelector('.pds-combobox__listbox') || !!document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot?.querySelector('.pds-combobox__listbox'));

    // The portal carries the combobox's styles in its own shadow root; no global CSS styles it.
    it('styles a dropdown mounted in the body like one in the field', async () => {
      const page = await setUp('panel-search dropdown-mount="body" group-display="drill-in"');

      const styles = await page.evaluate(() => {
        const root = document.querySelector('.pds-combobox-dropdown-portal')!.shadowRoot!;
        const panel = getComputedStyle(root.querySelector('.pds-combobox__listbox')!);
        const list = getComputedStyle(root.querySelector('.pds-combobox__listbox-options')!);
        return { radius: panel.borderTopLeftRadius, background: panel.backgroundColor, listStyle: list.listStyleType };
      });

      // Values only the copied stylesheet supplies; Floating UI sets the position inline.
      expect(styles.radius).not.toBe('0px');
      expect(styles.background).not.toBe('rgba(0, 0, 0, 0)');
      expect(styles.listStyle).toBe('none');
    });

    it('carries a custom property set around the combobox over to a dropdown in the body', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="--pine-color-background-overlay: rgb(1, 2, 3)">
          <pds-combobox component-id="themed" label="Action" trigger="button" mode="select-only"
            panel-search dropdown-mount="body"></pds-combobox>
        </div>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = [{ id: 'a', text: 'A' }];
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();

      const background = await page.evaluate(() => {
        const root = document.querySelector('.pds-combobox-dropdown-portal')!.shadowRoot!;
        return getComputedStyle(root.querySelector('.pds-combobox__listbox')!).backgroundColor;
      });
      expect(background).toBe('rgb(1, 2, 3)');
    });

    it('closes a portaled panel-search dropdown on a click outside', async () => {
      const page = await setUp('panel-search dropdown-mount="body"');
      expect(await isOpen(page)).toBe(true);

      await page.mouse.click(1100, 700);
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

      expect(await isOpen(page)).toBe(false);
    });

    // In body mode the search field sits in the portal's shadow root, so focus crosses a boundary
    // both ways: into the portal from the trigger, and back out to it.
    describe.each([
      ['in the field', ''],
      ['in the body', ' dropdown-mount="body"'],
    ])('with the dropdown %s', (_where, mount) => {
      it('closes when the trigger is clicked while the search field has focus', async () => {
        const page = await setUp(`panel-search${mount}`);
        expect(await isOpen(page)).toBe(true);

        await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
        await page.waitForChanges();

        expect(await isOpen(page)).toBe(false);
      });

      it('lands on the trigger when Tab leaves the search field, then tabs on from there', async () => {
        const page = await setUp(`panel-search${mount}`);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Tab');
        await page.waitForChanges();
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

        expect(await isOpen(page)).toBe(false);
        expect(await activeClass(page)).toContain('pds-combobox__button-trigger');

        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => document.activeElement?.id ?? '')).toBe('after');
      });
    });

    it('focuses the search field in the field when the dropdown opens', async () => {
      const page = await setUp('panel-search');
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');
    });

    // The keyboard's ring reads the same on every layer: a group row, the row back and an option.
    it('marks the keyboard with the same ring on the groups, the row back and the options', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      const ring = (selector: string, pseudo?: string) =>
        page.evaluate(
          (sel, pse) => {
            const el = document.querySelector('pds-combobox')!.shadowRoot!.querySelector(sel);
            if (!el) return null;
            const { outlineStyle, outlineWidth, outlineColor, outlineOffset } = getComputedStyle(el, pse);
            return { outlineStyle, outlineWidth, outlineColor, outlineOffset };
          },
          selector,
          pseudo,
        );

      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();
      const groupRow = await ring('.pds-combobox__group-row--keyboard > .pds-combobox__group-row-trigger');
      expect(groupRow?.outlineStyle).toBe('solid');

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(await ring('.pds-combobox__option--keyboard')).toEqual(groupRow);

      await page.keyboard.press('ArrowUp');
      await page.waitForChanges();
      expect(await ring('.pds-combobox__group-back--keyboard > .pds-combobox__group-back-trigger', '::before')).toEqual(groupRow);

      // The pointer shades a row without the ring.
      await page.keyboard.press('ArrowDown');
      await (await page.find('pds-combobox >>> .pds-combobox__drill-in-options .pds-combobox__option')).hover();
      await page.waitForChanges();
      expect(await ring('.pds-combobox__option--keyboard')).toBeNull();
    });

    describe('the slide between the groups and a group', () => {
      type Page = Awaited<ReturnType<typeof newE2EPage>>;

      // Animations held at their first frame, so the test reads where each row starts from. The hold
      // alone can take too late on a slow runner, so the motion tokens are stretched too, unless
      // reduced motion is on: then they're 0ms, which those tests check.
      const holdAnimations = async (page: Page) => {
        await page.addStyleTag({
          content: '@media (prefers-reduced-motion: no-preference) { :root { --pine-motion-duration-base: 600s; --pine-motion-duration-slow: 600s; } }',
        });
        const client = await page.target().createCDPSession();
        await client.send('Animation.enable');
        await client.send('Animation.setPlaybackRate', { playbackRate: 0 });
      };

      // Each matching row's start: which way it's offset, or `still` when it doesn't move. Adds up the
      // offsets of the row and every element above it, so a sliding parent counts too.
      const starts = (page: Page, selector: string) =>
        page.evaluate(sel => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          return Array.from(root.querySelectorAll(sel)).map(el => {
            let x = 0;
            for (let node: Element | null = el; node; node = node.parentElement) {
              const { transform } = getComputedStyle(node);
              if (transform !== 'none') x += new DOMMatrixReadOnly(transform).m41;
            }
            return x > 0 ? 'from-right' : x < 0 ? 'from-left' : 'still';
          });
        }, selector);

      // Waits for the click's own slide to start before reading where rows start from: under load,
      // a read can land before the drill class and its animation are applied, and every row reads
      // `still`. Animations from an earlier click are held too, so only a new one counts.
      const click = async (page: Page, selector: string, { slides = true } = {}) => {
        await page.evaluate(() => {
          (window as unknown as { heldAnimations: Set<Animation> }).heldAnimations = new Set(
            document.querySelector('pds-combobox')!.shadowRoot!.getAnimations(),
          );
        });
        await (await page.find(`pds-combobox >>> ${selector}`)).click();
        await page.waitForChanges();
        if (!slides) return;
        await page.waitForFunction(
          () => {
            const held = (window as unknown as { heldAnimations: Set<Animation> }).heldAnimations;
            return document
              .querySelector('pds-combobox')!
              .shadowRoot!.getAnimations()
              .some(a => !held.has(a) && (a as CSSAnimation).animationName === 'pds-combobox-drill');
          },
          { timeout: 3000 },
        );
      };

      it("slides a group's options and its row back in from the right, and the groups and search field back from the left", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['from-right']);
        // The row back's content moves with the options; the row, which holds the header in place and
        // draws its divider, doesn't.
        expect(await starts(page, '.pds-combobox__group-back-trigger > *')).toEqual(['from-right']);
        expect(await starts(page, '.pds-combobox__group-back-trigger')).toEqual(['still']);
        expect(await starts(page, '.pds-combobox__group-back')).toEqual(['still']);

        await click(page, '.pds-combobox__group-back-trigger');
        expect(await starts(page, '.pds-combobox__group-row')).toEqual(['from-left', 'from-left']);
        // The header moves with the content both ways: the search field comes back with the groups,
        // while its row and divider stay put.
        expect(await starts(page, '.pds-combobox__panel-search > *')).toEqual(['from-left', 'from-left']);
        expect(await starts(page, '.pds-combobox__panel-search')).toEqual(['still']);
      });

      // Showing the highlighted option mustn't scroll the list sideways to reach a row the slide
      // still offsets past its edge: that scroll eats the slide, so entering looks faster than leaving.
      it("doesn't scroll the list sideways while a group slides in", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');

        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['from-right']);
        expect(await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('[role="tree"]')!.scrollLeft)).toBe(0);
      });

      it('slides the row back in with the options when there is no panel search', async () => {
        const page = await setUp('group-display="drill-in"');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(1) .pds-combobox__group-row-trigger');

        expect(await starts(page, '.pds-combobox__group-back-trigger > *')).toEqual(['from-right']);
        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['from-right', 'from-right']);
      });

      it('mirrors the slide right to left', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['from-left']);

        await click(page, '.pds-combobox__group-back-trigger');
        expect(await starts(page, '.pds-combobox__group-row')).toEqual(['from-right', 'from-right']);
        expect(await starts(page, '.pds-combobox__panel-search > *')).toEqual(['from-right', 'from-right']);
      });

      it("doesn't slide with reduced motion", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);
        // The same page slides before reduced motion is on, so stillness below is down to it.
        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['from-right']);
        await click(page, '.pds-combobox__group-back-trigger');

        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const duration = await page.evaluate(() =>
          getComputedStyle(document.querySelector('pds-combobox')!.shadowRoot!.querySelector('[role="tree"]')!).getPropertyValue('--pine-motion-duration-base').trim(),
        );
        expect(duration).toBe('0ms');

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger', { slides: false });
        expect(await starts(page, '.pds-combobox__drill-in-options > li')).toEqual(['still']);

        await click(page, '.pds-combobox__group-back-trigger', { slides: false });
        expect(await starts(page, '.pds-combobox__group-row')).toEqual(['still', 'still']);
        expect(await starts(page, '.pds-combobox__panel-search > *')).toEqual(['still', 'still']);
      });

      // The dropdown's height and its glide: the heights it eases between (empty once it's cleaned up),
      // whether the options list can scroll meanwhile, and the glide's duration.
      const glide = async (page: Page) => {
        const state = await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const panel = root.querySelector('.pds-combobox__listbox') as HTMLElement;
          const animation = root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide');
          return {
            gliding: panel.classList.contains('pds-combobox__listbox--height-glide'),
            from: panel.style.getPropertyValue('--pds-combobox-glide-from'),
            to: panel.style.getPropertyValue('--pds-combobox-glide-to'),
            height: panel.getBoundingClientRect().height,
            listScrolls: getComputedStyle(root.querySelector('.pds-combobox__listbox-options')!).overflowY,
            // Drilled in, the group's options are what scrolls, under the row back.
            optionsScroll: (el => (el ? getComputedStyle(el).overflowY : null))(root.querySelector('.pds-combobox__drill-in-options')),
            duration: animation?.effect?.getTiming().duration ?? null,
          };
        });
        return { ...state, from: parseFloat(state.from), to: parseFloat(state.to), cleared: state.from === '' && state.to === '' };
      };

      // Seeks the held glide back to its first frame before it's read: on a slow runner it can get a
      // few frames in before the hold takes.
      const seekGlideStart = (page: Page) =>
        page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const animation = root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide');
          if (animation) animation.currentTime = 0;
        });

      // Runs the held glide to its end, as if its time had passed.
      const finishGlide = (page: Page) =>
        page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide')?.finish();
        });

      it("glides the dropdown's height from the groups to a group, and leaves nothing behind", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        const groupsHeight = (await glide(page)).height;
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        await seekGlideStart(page);
        const start = await glide(page);
        expect(start.gliding).toBe(true);
        expect(start.from).toBeCloseTo(groupsHeight, 0);
        expect(start.to).not.toBeCloseTo(groupsHeight, 0);
        // Held at its first frame, the dropdown is still the groups' height, and its rows can't scroll.
        expect(start.height).toBeCloseTo(groupsHeight, 0);
        expect(start.listScrolls).toBe('hidden');
        expect(start.optionsScroll).toBe('hidden');

        await finishGlide(page);
        await page.waitForChanges();
        const end = await glide(page);
        expect(end.gliding).toBe(false);
        expect(end.height).toBeCloseTo(start.to, 0);
        expect(end.cleared).toBe(true);
        expect(end.listScrolls).toBe('auto');
        expect(end.optionsScroll).toBe('auto');
      });

      it('glides the padded panel without a panel search, with no jump and no scroll meanwhile', async () => {
        const page = await setUp('group-display="drill-in" max-height="400px"');
        // Without a panel search the panel itself is the list: its height, glide and own scroll.
        const panel = () =>
          page.evaluate(() => {
            const el = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox') as HTMLElement;
            const options = el.querySelector('.pds-combobox__drill-in-options');
            return {
              height: el.getBoundingClientRect().height,
              width: el.getBoundingClientRect().width,
              gliding: el.classList.contains('pds-combobox__listbox--height-glide'),
              scrolls: getComputedStyle(el).overflowY,
              optionsScroll: options ? getComputedStyle(options).overflowY : null,
            };
          });
        const groups = await panel();
        expect(groups.scrolls).toBe('auto');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(1) .pds-combobox__group-row-trigger');
        await seekGlideStart(page);
        const start = await panel();
        expect(start.gliding).toBe(true);
        // The first frame is the groups' height exactly (the padding isn't added on top), and the
        // width doesn't change while the height glides.
        expect(start.height).toBeCloseTo(groups.height, 0);
        expect(start.width).toBeCloseTo(groups.width, 0);
        expect(start.scrolls).toBe('hidden');
        expect(start.optionsScroll).toBe('hidden');

        // The last frame is the group's settled height: nothing snaps when the glide ends.
        const last = await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const animation = root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide')!;
          animation.currentTime = (animation.effect!.getTiming().duration as number) - 1;
          const el = root.querySelector('.pds-combobox__listbox') as HTMLElement;
          return el.getBoundingClientRect().height;
        });
        await finishGlide(page);
        await page.waitForChanges();
        const end = await panel();
        expect(end.gliding).toBe(false);
        expect(end.height).toBeCloseTo(last, 0);
        expect(end.width).toBeCloseTo(groups.width, 0);
        expect(end.scrolls).toBe('auto');
        expect(end.optionsScroll).toBe('auto');
      });

      it('leaves nothing behind when the dropdown closes mid-glide', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect((await glide(page)).gliding).toBe(true);
        // Kept, so the closed panel itself is checked, not only the new one the reopen renders.
        await page.evaluate(() => {
          (window as unknown as { closedPanel: Element }).closedPanel = document
            .querySelector('pds-combobox')!
            .shadowRoot!.querySelector('.pds-combobox__listbox')!;
        });

        const trigger = await page.find('pds-combobox >>> .pds-combobox__button-trigger');
        await trigger.click();
        await page.waitForChanges();
        const closed = await page.evaluate(() => {
          const el = (window as unknown as { closedPanel: HTMLElement }).closedPanel;
          return {
            gliding: el.classList.contains('pds-combobox__listbox--height-glide'),
            from: el.style.getPropertyValue('--pds-combobox-glide-from'),
            to: el.style.getPropertyValue('--pds-combobox-glide-to'),
          };
        });
        expect(closed).toEqual({ gliding: false, from: '', to: '' });
        await trigger.click();
        await page.waitForChanges();

        const reopened = await glide(page);
        expect(reopened.gliding).toBe(false);
        expect(reopened.cleared).toBe(true);
        expect(reopened.listScrolls).toBe('auto');
      });

      it('leaves nothing behind when the glide is cut short mid-way', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect((await glide(page)).gliding).toBe(true);

        // Cancelled without ending, as when the panel is hidden mid-way. Cancelled directly: hiding the
        // panel can take focus from the search field and close the dropdown first.
        await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide')!.cancel();
        });
        await page.waitForFunction(
          () => !document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox')?.classList.contains('pds-combobox__listbox--height-glide'),
        );
        const cut = await glide(page);
        expect(cut.gliding).toBe(false);
        expect(cut.cleared).toBe(true);
      });

      it('holds the dropdown at its height from the moment a group opens until it renders', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        const groupsHeight = (await glide(page)).height;

        // Read in the same task as the click, before the group's rows render. The hold is a pinned
        // height, not an animation, so it lasts however long the render takes.
        const held = await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          (root.querySelector('.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger') as HTMLElement).click();
          root.getAnimations().forEach(a => a.finish());
          const panel = root.querySelector('.pds-combobox__listbox') as HTMLElement;
          return {
            holding: panel.classList.contains('pds-combobox__listbox--height-hold'),
            height: panel.getBoundingClientRect().height,
            pinned: parseFloat(panel.style.height),
          };
        });
        expect(held.holding).toBe(true);
        expect(held.pinned).toBeCloseTo(groupsHeight, 0);
        expect(held.height).toBeCloseTo(groupsHeight, 0);

        // Once the group renders, the hold hands over to the glide and leaves nothing behind.
        await page.waitForChanges();
        const after = await page.evaluate(() => {
          const panel = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox') as HTMLElement;
          return { holding: panel.classList.contains('pds-combobox__listbox--height-hold'), pinned: panel.style.height };
        });
        expect(after).toEqual({ holding: false, pinned: '' });
      });

      it("doesn't glide after a drill that's cancelled before it renders", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        // Typing in the same task as the click replaces the list, which ends the drill before it renders.
        await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const field = root.querySelector('.pds-combobox__panel-search-input') as HTMLInputElement;
          (root.querySelector('.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger') as HTMLElement).click();
          field.value = 's';
          field.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });
        await page.waitForChanges();

        const after = await glide(page);
        expect(after.gliding).toBe(false);
        expect(after.cleared).toBe(true);
      });

      it('reopens with a max-height without an error', async () => {
        const page = await setUp('group-display="drill-in" max-height="400px"');
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(String(error)));

        const trigger = await page.find('pds-combobox >>> .pds-combobox__button-trigger');
        await trigger.click();
        await page.waitForChanges();
        await trigger.click();
        await page.waitForChanges();

        expect(errors).toEqual([]);
        const scrolls = await page.evaluate(
          () => (document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox') as HTMLElement).style.overflowY,
        );
        expect(scrolls).toBe('auto');
      });

      it('leaves nothing behind when typing replaces the list mid-glide', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        expect((await glide(page)).gliding).toBe(true);

        // Typing in a drilled-in group searches the whole list, which replaces the group's rows.
        await page.keyboard.type('s');
        await page.waitForChanges();

        const searched = await glide(page);
        expect(searched.gliding).toBe(false);
        expect(searched.cleared).toBe(true);
      });

      it('turns a glide around from wherever it is', async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        const groupsHeight = (await glide(page)).height;
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger');
        const groupHeight = (await glide(page)).to;
        // Halfway into the group, the dropdown is between the two heights.
        await page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const animation = root.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-height-glide')!;
          animation.currentTime = (animation.effect!.getTiming().duration as number) / 2;
        });
        const halfway = (await glide(page)).height;
        expect(halfway).toBeGreaterThan(Math.min(groupsHeight, groupHeight) + 1);
        expect(halfway).toBeLessThan(Math.max(groupsHeight, groupHeight) - 1);

        await click(page, '.pds-combobox__group-back-trigger');
        await seekGlideStart(page);
        const back = await glide(page);
        expect(back.gliding).toBe(true);
        expect(back.from).toBeCloseTo(halfway, 0);
        expect(back.to).toBeCloseTo(groupsHeight, 0);
        expect(back.height).toBeCloseTo(halfway, 0);
      });

      it("doesn't glide with reduced motion", async () => {
        const page = await setUp('group-display="drill-in" panel-search');
        const groupsHeight = (await glide(page)).height;
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await holdAnimations(page);

        await click(page, '.pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger', { slides: false });
        // Even with animations held, the dropdown is already the group's height: there's no glide to hold.
        const { duration, height } = await glide(page);
        expect(duration ?? 0).toBe(0);
        expect(height).not.toBeCloseTo(groupsHeight, 0);
        await finishGlide(page);
        await page.waitForChanges();
        expect((await glide(page)).height).toBeCloseTo(height, 0);
      });
    });

    it('drills in from the search field by keyboard, and back to it, then closes with Escape', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      const listAD = () =>
        page.evaluate(() =>
          document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox-options')!.getAttribute('aria-activedescendant'),
        );
      const searchAD = () =>
        page.evaluate(() =>
          document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__panel-search-input')!.getAttribute('aria-activedescendant'),
        );

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      // Inside the group the search field is gone and the list has focus in its place.
      expect(await page.find('pds-combobox >>> .pds-combobox__panel-search-input')).toBeNull();
      expect(await activeClass(page)).toContain('pds-combobox__listbox-options');
      expect(await listAD()).toBe('actions-option-0');

      await page.keyboard.press('ArrowLeft');
      await page.waitForChanges();
      const tagRowId = await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row')!.id);
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');
      expect(await searchAD()).toBe(tagRowId);

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('');
      expect(await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox'))).toBeNull();
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');
    });

    it('puts the row back where the search field was when a group is clicked, and the field back on return', async () => {
      const page = await setUp('group-display="drill-in" panel-search');

      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      const drilled = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const panel = root.querySelector('.pds-combobox__listbox--with-search')!;
        const back = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
        return {
          search: !!root.querySelector('.pds-combobox__panel-search'),
          backAtTop: Math.round(back.top - panel.getBoundingClientRect().top),
          divider: getComputedStyle(root.querySelector('.pds-combobox__group-back-trigger')!).borderBottomStyle,
        };
      });
      expect(drilled).toEqual({ search: false, backAtTop: 0, divider: 'solid' });
      expect(await activeClass(page)).toContain('pds-combobox__listbox-options');

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('tag-remove');
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');
    });

    it('returns to the search field from the row back and with Backspace', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      const drillIn = async () => {
        await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
        await page.waitForChanges();
      };

      await drillIn();
      await (await page.find('pds-combobox >>> .pds-combobox__group-back-trigger')).click();
      await page.waitForChanges();
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');

      await drillIn();
      await page.keyboard.press('Backspace');
      await page.waitForChanges();
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');
      expect(await page.find('pds-combobox >>> .pds-combobox__group-back')).toBeNull();
    });

    it('searches the whole list when typing inside a group, and keeps typing in the search field', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      await page.keyboard.type('send');
      await page.waitForChanges();

      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');
      expect(
        await page.evaluate(() => (document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__panel-search-input') as HTMLInputElement).value),
      ).toBe('send');
      const options = await page.evaluate(() =>
        Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__option')).map(el => el.textContent),
      );
      expect(options).toEqual(['Send an email']);
    });

    it('reopens inside the selected group with focus on the list', async () => {
      const page = await setUp('group-display="drill-in" panel-search value="email-send"');
      expect(await page.find('pds-combobox >>> .pds-combobox__panel-search')).toBeNull();
      expect(await (await page.find('pds-combobox >>> .pds-combobox__group-back-trigger')).textContent).toBe('Back: Email');
      expect(await activeClass(page)).toContain('pds-combobox__listbox-options');
    });

    // The row back is the header above the scrolling options, always in view, so highlighting it
    // mustn't scroll them.
    it("doesn't scroll the options when the keys reach the row back in a group that scrolls", async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="long" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" panel-search max-height="160px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}`, group: 'Many' }));
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      await page.mouse.move(0, 0);

      const scrollTop = () =>
        page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__drill-in-options')!.scrollTop);

      // Down to the last option, then let the smooth scroll settle.
      await page.keyboard.press('End');
      await page.waitForChanges();
      let settled = await scrollTop();
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const now = await scrollTop();
        if (now === settled && now > 0) break;
        settled = now;
      }
      expect(settled).toBeGreaterThan(0);

      // Home highlights the row back, in view above the options however far they've scrolled.
      await page.keyboard.press('Home');
      await page.waitForChanges();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(await page.find('pds-combobox >>> .pds-combobox__group-back--highlighted')).not.toBeNull();
      expect(await scrollTop()).toBe(settled);
    });

    // Every layer is a header above the rows that scroll: drilled in, the row back sits above the
    // group's options, as the search field sits above the groups, so the scrollbar starts below it.
    it.each([
      ['with panel search', 'panel-search'],
      ['without panel search', ''],
    ])("scrolls only the group's options, below the row back, %s", async (_name, search) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="long" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" ${search} max-height="160px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}`, group: 'Many' }));
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 600)));

      const measure = () =>
        page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const header = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
          const options = root.querySelector('.pds-combobox__drill-in-options') as HTMLElement;
          const scrolling = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(
            el => el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY),
          );
          return {
            scrolling: scrolling.map(el => el.classList[0]),
            gap: Math.round(options.getBoundingClientRect().top - header.bottom),
            headerTop: Math.round(header.top),
          };
        });

      const before = await measure();
      expect(before.scrolling).toEqual(['pds-combobox__drill-in-options']);
      expect(before.gap).toBe(0);

      await page.evaluate(() => {
        (document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__drill-in-options') as HTMLElement).scrollTop = 120;
      });
      const after = await measure();
      expect(after.headerTop).toBe(before.headerTop);
      expect(after.gap).toBe(0);
    });

    // The drill-in slide offsets the rows past the options' edge; they mustn't scroll sideways.
    it.each([
      ['with panel search', 'panel-search'],
      ['without panel search', ''],
    ])("doesn't let a drilled-in group's options scroll sideways while they slide in, %s", async (_name, search) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="long" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" ${search} max-height="160px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}`, group: 'Many' }));
      });
      // Stretched, so the slide is still running when it's measured, however slow the runner.
      await page.addStyleTag({ content: ':root { --pine-motion-duration-base: 600s; --pine-motion-duration-slow: 600s; }' });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      const options = await page.evaluate(() => {
        const list = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__drill-in-options') as HTMLElement;
        return {
          sliding: (list.firstElementChild as HTMLElement).getAnimations().length > 0,
          sideways: getComputedStyle(list).overflowX,
        };
      });
      expect(options).toEqual({ sliding: true, sideways: 'hidden' });
    });

    // Opening places the dropdown a tick later; it must still get its size if it renders after that.
    it.each([
      ['in the field', ''],
      ['mounted in the body', 'dropdown-mount="body"'],
    ])('opens at its dropdown-width and max-height, %s', async (_name, mount) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="sized" label="Action" trigger="button" mode="select-only"
          dropdown-width="300px" max-height="160px" ${mount}></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}` }));
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));

      const size = await page.evaluate(() => {
        const host = document.querySelector('.pds-combobox-dropdown-portal') ?? document.querySelector('pds-combobox');
        const rect = host!.shadowRoot!.querySelector('.pds-combobox__listbox')!.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      });
      expect(size).toEqual({ width: 300, height: 160 });
    });

    it.each([
      ['with panel search', 'panel-search'],
      ['without panel search', ''],
    ])('keeps the highlighted option below the row back in a group that scrolls, %s', async (_name, search) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="long" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" ${search} max-height="160px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}`, group: 'Many' }));
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      // Off the panel: as the list scrolls, an option sliding under a resting pointer takes the
      // highlight, which isn't what this test is about.
      await page.mouse.move(0, 0);

      // Down to the last option, then Home (the row back, first in the group's column) and down to
      // the first option, which scrolls up to meet the header.
      await page.keyboard.press('End');
      await page.waitForChanges();
      await page.keyboard.press('Home');
      await page.waitForChanges();
      await page.keyboard.press('ArrowDown');
      await page.waitForChanges();

      // The scroll is smooth, so wait for it to settle rather than for a fixed time: on a slow
      // runner it's still moving after 600ms. A regression still fails, on the timeout.
      const gap = () =>
        page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const header = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
          const option = root.querySelector('[data-option-index="0"]')!.getBoundingClientRect();
          return Math.round(option.top - header.bottom);
        });
      await page
        .waitForFunction(
          () => {
            const root = document.querySelector('pds-combobox')!.shadowRoot!;
            const header = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
            const option = root.querySelector('[data-option-index="0"]')!.getBoundingClientRect();
            return option.top - header.bottom >= -0.5;
          },
          { timeout: 3000 },
        )
        .catch(() => undefined);
      expect(await gap()).toBeGreaterThanOrEqual(0);
    });

    it('steps back to the search field with Escape from a drilled-in group, and stays open', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      await page.keyboard.press('Escape');
      await page.waitForChanges();

      const state = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        return {
          open: !!root.querySelector('.pds-combobox__listbox'),
          back: !!root.querySelector('.pds-combobox__group-back'),
          ad: root.querySelector('.pds-combobox__panel-search-input')?.getAttribute('aria-activedescendant'),
          tagRow: root.querySelector('.pds-combobox__group-row')?.id,
        };
      });
      expect(state.open).toBe(true);
      expect(state.back).toBe(false);
      expect(state.ad).toBe(state.tagRow);
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');
    });

    // The row back's list item wraps the group's options, so it's taller than a list that scrolls;
    // showing the item's bottom edge would scroll the highlighted row back out of view.
    it('shows the highlighted row back, not the end of its group, in a group taller than the list', async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="long" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" max-height="160px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, i) => ({ id: `o${i}`, text: `Option ${i}`, group: 'Many' }));
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      await page.mouse.move(0, 0);

      await page.keyboard.press('Home');
      await page.waitForChanges();

      const shown = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const list = root.querySelector('.pds-combobox__listbox')!.getBoundingClientRect();
        const back = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
        return back.top >= list.top - 0.5 && back.bottom <= list.bottom + 0.5;
      });
      expect(await page.find('pds-combobox >>> .pds-combobox__group-back--highlighted')).not.toBeNull();
      expect(shown).toBe(true);
    });

    it('stays open when a flyout with panel search drills in for lack of room, on a selection', async () => {
      const page = await setUp('group-display="flyout" panel-search dropdown-width="340px" value="email-send"', 420);
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 100)));

      expect(await page.find('pds-combobox >>> .pds-combobox__group-back')).not.toBeNull();
      expect(await activeClass(page)).toContain('pds-combobox__listbox-options');
    });

    it('keeps the first option clear of the row back when drilling in from a scrolled list', async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <pds-combobox component-id="groups" label="Action" trigger="button" mode="select-only"
          group-display="drill-in" panel-search max-height="200px" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }) => {
        el.options = Array.from({ length: 12 }, (_, g) =>
          Array.from({ length: g === 11 ? 10 : 3 }, (_, i) => ({ id: `g${g}-${i}`, text: `Option ${g}.${i}`, group: `Group ${g}` })),
        ).flat();
      });
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();

      // Scroll the groups to the end and drill into the last, long group; the list keeps its offset.
      await page.evaluate(() => {
        const list = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox-options') as HTMLElement;
        list.scrollTop = list.scrollHeight;
      });
      await page.evaluate(() => {
        const rows = document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__group-row-trigger');
        (rows[rows.length - 1] as HTMLElement).click();
      });
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 600)));

      const gap = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const header = root.querySelector('.pds-combobox__group-back-trigger')!.getBoundingClientRect();
        const option = root.querySelector('.pds-combobox__drill-in-options [role="treeitem"]')!.getBoundingClientRect();
        return Math.round(option.top - header.bottom);
      });
      expect(gap).toBeGreaterThanOrEqual(0);
    });

    it('lands on the trigger when Tab leaves a drilled-in group', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      await page.keyboard.press('Tab');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));
      expect(await page.find('pds-combobox >>> .pds-combobox__listbox')).toBeNull();
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');
    });

    it('keeps a portaled panel-search dropdown open when a group is clicked', async () => {
      const page = await setUp('group-display="drill-in" panel-search dropdown-mount="body"');
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 50)));

      await (await page.$('.pds-combobox-dropdown-portal >>> .pds-combobox__group-row-trigger'))!.click();
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

      const state = await page.evaluate(() => ({
        back: !!document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot?.querySelector('.pds-combobox__group-back'),
        // The portal's shadow root holds the focus; the document sees its host.
        focusInList: !!document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot?.activeElement?.closest('.pds-combobox__listbox-options'),
      }));
      expect(state).toEqual({ back: true, focusInList: true });
    });

    it('drills in when a portaled dropdown at the right edge has no room for a flyout', async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 520, height: 800 });
      await page.setContent(`
        <div style="display: flex; justify-content: flex-end; padding: 40px 8px;">
          <pds-combobox component-id="actions" label="Action" trigger="button" mode="select-only"
            group-display="flyout" dropdown-mount="body" dropdown-width="300px"></pds-combobox>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        actions,
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 50)));

      const row = await page.$('.pds-combobox-dropdown-portal >>> .pds-combobox__group-row-trigger');
      await row!.click();
      await page.waitForChanges();

      const shape = await page.evaluate(() => ({
        flyout: !!document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot?.querySelector('.pds-combobox__flyout'),
        back: !!document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot?.querySelector('.pds-combobox__group-back'),
      }));
      expect(shape).toEqual({ flyout: false, back: true });
    });

    it('has no axe violations with panel search and a drilled-in group open', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('the opening motion', () => {
    type Page = Awaited<ReturnType<typeof newE2EPage>>;

    const options = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email' },
    ];

    // Animations held at their first frame, so the test reads where the dropdown starts from. The
    // open runs for minutes here, so a slow runner can't finish it before the test looks; `hold`
    // off keeps Pine's own duration (and its reduced-motion 0ms).
    const setUp = async (attrs: string, wrapperStyle = 'padding: 40px;', hold = true) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <div style="${wrapperStyle}">
          <pds-combobox component-id="actions" label="Action" trigger="button" mode="select-only"
            dropdown-width="300px" ${attrs}></pds-combobox>
        </div>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }, opts) => (el.options = opts), options);
      if (hold) await page.addStyleTag({ content: ':root { --pine-motion-duration-base: 600s; }' });
      await page.waitForChanges();
      const client = await page.target().createCDPSession();
      await client.send('Animation.enable');
      await client.send('Animation.setPlaybackRate', { playbackRate: 0 });
      return page;
    };

    const toggle = async (page: Page) => {
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
    };

    // The dropdown, in the combobox or its body portal: null when it's gone. `opening` while the open
    // animation is held at its start; `placement` once Floating UI has placed it.
    const panel = (page: Page) =>
      page.evaluate(() => {
        const roots = [document.querySelector('pds-combobox')!.shadowRoot, document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot];
        const el = roots.map(root => root?.querySelector('.pds-combobox__listbox')).find(Boolean) as HTMLElement | undefined;
        if (!el) return null;
        // Read the open animation's first frame itself, wherever the runner got to.
        const open = el.getAnimations().find(a => (a as CSSAnimation).animationName === 'pds-combobox-open');
        if (open) {
          open.pause();
          open.currentTime = 0;
        }
        const { opacity, marginTop } = getComputedStyle(el);
        const opening = open !== undefined;
        return { opacity, marginTop, opening, placement: el.dataset.placement ?? null };
      });

    const placed = async (page: Page) => {
      await page.waitForFunction(
        () => {
          const roots = [document.querySelector('pds-combobox')!.shadowRoot, document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot];
          return roots.some(root => (root?.querySelector('.pds-combobox__listbox') as HTMLElement | null)?.dataset.placement);
        },
        { timeout: 3000 },
      );
      return panel(page);
    };

    // The portal's teardown is deferred with a setTimeout, so wait for the dropdown to go.
    const gone = (page: Page) =>
      page.waitForFunction(
        () => {
          const roots = [document.querySelector('pds-combobox')!.shadowRoot, document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot];
          return !roots.some(root => root?.querySelector('.pds-combobox__listbox'));
        },
        { timeout: 3000 },
      );

    it.each([
      ['inline groups', ''],
      ['group-display="flyout"', 'group-display="flyout"'],
      ['group-display="drill-in" with panel search', 'group-display="drill-in" panel-search'],
      ['a body portal', 'dropdown-mount="body"'],
    ])('fades in a few pixels below the field on every open, and closes at once, with %s', async (_name, attrs) => {
      const page = await setUp(attrs);

      for (let open = 0; open < 2; open++) {
        await toggle(page);
        expect(await placed(page)).toEqual({ opacity: '0', marginTop: '-4px', opening: true, placement: 'bottom-start' });

        // Closing doesn't animate: the dropdown is gone as soon as it closes.
        await toggle(page);
        await gone(page);
        expect(await panel(page)).toBeNull();
      }
    });

    it('rises away from the field when it flips above it', async () => {
      const page = await setUp('', 'position: absolute; bottom: 20px; left: 40px;');
      await toggle(page);
      expect(await placed(page)).toEqual({ opacity: '0', marginTop: '4px', opening: true, placement: 'top-start' });
    });

    // The listbox is rendered only while open, so each open gets a new node with no placement from
    // the last one. Flipped, closed, moved to where it fits below, reopened: it must not still rise.
    it.each([
      ['inline', ''],
      ['a body portal', 'dropdown-mount="body"'],
    ])("doesn't keep a previous open's flipped placement, %s", async (_name, attrs) => {
      const page = await setUp(attrs, 'position: absolute; bottom: 20px; left: 40px;');
      await toggle(page);
      expect(await placed(page)).toMatchObject({ marginTop: '4px', placement: 'top-start' });
      await toggle(page);
      await gone(page);

      await page.$eval('pds-combobox', el => {
        const wrapper = el.parentElement!;
        wrapper.style.bottom = '';
        wrapper.style.top = '20px';
      });
      await toggle(page);
      expect(await placed(page)).toEqual({ opacity: '0', marginTop: '-4px', opening: true, placement: 'bottom-start' });
    });

    it("doesn't replay when a drill's height glide ends", async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      await toggle(page);
      await placed(page);
      const finish = (name: string) =>
        page.evaluate(n => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          root.getAnimations().forEach(a => (a as CSSAnimation).animationName === n && a.finish());
        }, name);
      await finish('pds-combobox-open');

      // The second group is shorter than the groups, so the dropdown glides.
      await (await page.find('pds-combobox >>> .pds-combobox__group-row:nth-of-type(2) .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      await page.waitForFunction(() =>
        document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox--height-glide'),
      );
      expect((await panel(page))?.opening).toBe(false);

      await finish('pds-combobox-height-glide');
      await page.waitForChanges();
      expect(await panel(page)).toMatchObject({ opacity: '1', marginTop: '0px', opening: false });
    });

    it("doesn't move or fade with reduced motion, since the motion tokens drop to 0ms", async () => {
      const page = await setUp('', undefined, false);
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await toggle(page);
      expect(await placed(page)).toMatchObject({ opacity: '1', marginTop: '0px' });
    });
  });

  // Matches pds-select's field, and the Figma filter panel's search field and drilled-in header.
  describe('field and panel sizes', () => {
    const options = [
      { id: 'broadcast', text: 'Broadcast', group: 'Email', groupIcon: 'mail' },
      { id: 'sequence', text: 'Sequence', group: 'Email' },
    ];

    const setUp = async (attrs = '') => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="sizes" label="Category" hide-label trigger="button" trigger-shape="input"
            mode="select-only" placeholder="Select category" group-display="drill-in" panel-search
            dropdown-width="300px" ${attrs}></pds-combobox>
          <pds-select component-id="select" label="Select" hide-label><option value="a">A</option></pds-select>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, data) => {
          el.options = data;
        },
        options,
      );
      await page.waitForChanges();
      return page;
    };

    it("keeps the panel as wide as dropdown-width, and the row back a header, without panel search", async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="no-search" label="Category" hide-label trigger="button" mode="select-only"
            placeholder="Select category" group-display="drill-in" dropdown-width="300px"></pds-combobox>
        </div>
      `);
      await page.$eval('pds-combobox', (el: HTMLElement & { options?: unknown }, data) => (el.options = data), options);
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      const panelWidth = () =>
        page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox')!.getBoundingClientRect().width);
      // The width includes the panel's padding, so it's the width asked for.
      expect(await panelWidth()).toBeCloseTo(300, 0);

      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      const header = await page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const back = getComputedStyle(root.querySelector('.pds-combobox__group-back-trigger')!);
        return {
          divider: back.borderBottomWidth,
          panelTop: getComputedStyle(root.querySelector('.pds-combobox__listbox')!).paddingTop,
        };
      });
      // Like the search field's place with panel search: a divider under it, flush with the top.
      expect(header).toEqual({ divider: '1px', panelTop: '0px' });
      expect(await panelWidth()).toBeCloseTo(300, 0);
    });

    it('draws the input-shaped trigger as a pds-select field', async () => {
      const page = await setUp();

      const field = await page.evaluate(() => {
        const trigger = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger')!;
        const label = trigger.querySelector('.pds-combobox__button-trigger-label')!;
        const select = document.querySelector('pds-select')!.shadowRoot!.querySelector('select')!;
        const probe = document.createElement('span');
        probe.style.color = 'var(--pine-color-text-muted)';
        document.body.appendChild(probe);
        const placeholder = getComputedStyle(probe).color;
        probe.remove();
        const [t, s] = [getComputedStyle(trigger), getComputedStyle(select)];
        return {
          height: trigger.getBoundingClientRect().height,
          selectHeight: select.getBoundingClientRect().height,
          type: [t.paddingBlockStart, t.paddingInlineStart, t.fontWeight, t.fontSize, t.letterSpacing],
          selectType: [s.paddingBlockStart, s.paddingInlineStart, s.fontWeight, s.fontSize, s.letterSpacing],
          labelColor: getComputedStyle(label).color,
          placeholder,
        };
      });

      expect(field.height).toBe(36);
      expect(field.height).toBe(field.selectHeight);
      expect(field.type).toEqual(field.selectType);
      expect(field.labelColor).toBe(field.placeholder);
    });

    // Other variants keep their fill's text colour; a disabled trigger keeps its disabled colour.
    it.each([
      ['an accent trigger', 'trigger-variant="accent"'],
      ['a disabled trigger', 'disabled'],
    ])('leaves the placeholder colour of %s alone', async (_case, attrs) => {
      const page = await setUp(attrs);

      const colors = await page.evaluate(() => {
        const trigger = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger')!;
        const label = trigger.querySelector('.pds-combobox__button-trigger-label--placeholder')!;
        return [getComputedStyle(label).color, getComputedStyle(trigger).color];
      });

      expect(colors[0]).toBe(colors[1]);
    });

    const heights = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const box = (selector: string) => root.querySelector(selector)?.getBoundingClientRect().height ?? null;
        const search = root.querySelector('.pds-combobox__panel-search');
        return {
          search: box('.pds-combobox__panel-search'),
          searchPadding: search ? getComputedStyle(search).paddingBlockStart : null,
          back: box('.pds-combobox__group-back-trigger'),
        };
      });

    it('makes the drilled-in header the same size as the search field it replaces', async () => {
      const page = await setUp();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      const { search, searchPadding } = await heights(page);

      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();
      const { back } = await heights(page);

      // 12px above and below a line of body text, so the header is as compact as the rows below it.
      expect(searchPadding).toBe('12px');
      expect(back).toBe(search);
    });
  });

  describe('option icons', () => {
    // A category list: ungrouped options with icons, with groups listed between them.
    const categories = [
      { id: 'assessment', text: 'Assessment', icon: 'assessment' },
      { id: 'broadcast', text: 'Broadcast', group: 'Email', groupIcon: 'mail' },
      { id: 'sequence', text: 'Sequence', group: 'Email' },
      { id: 'event', text: 'Event', icon: 'calendar-date' },
    ];

    const setUp = async (display = 'drill-in') => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="categories" label="Category" trigger="button" mode="select-only"
            group-display="${display}" panel-search search-placeholder="Search categories" dropdown-width="300px"></pds-combobox>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        categories,
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    const highlighted = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
      page.evaluate(() => {
        const row = document
          .querySelector('pds-combobox')!
          .shadowRoot!.querySelector('.pds-combobox__option--highlighted, .pds-combobox__group-row--highlighted');
        return row?.classList.contains('pds-combobox__group-row')
          ? `group:${row.querySelector('.pds-combobox__group-row-label')!.textContent}`
          : row?.textContent ?? null;
      });

    it.each(['flyout', 'drill-in'])('moves through group-display="%s" rows by keyboard in the order they are drawn', async display => {
      const page = await setUp(display);

      // Opening highlights the first row.
      const visited = [await highlighted(page)];
      for (let step = 0; step < 2; step++) {
        await page.keyboard.press('ArrowDown');
        await page.waitForChanges();
        visited.push(await highlighted(page));
      }

      expect(visited).toEqual(['Assessment', 'group:Email', 'Event']);
    });

    it('shows the picked option with its icon in the trigger', async () => {
      const page = await setUp();

      // Assessment, the first row, is highlighted on opening.
      await page.keyboard.press('Enter');
      await page.waitForChanges();

      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('assessment');
      const icon = await page.find('pds-combobox >>> .pds-combobox__button-trigger-label pds-icon');
      expect(icon.getAttribute('name')).toBe('assessment');
    });

    it('wraps a long picked label beside its icon within the trigger width', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="long" label="Category" trigger="button" mode="select-only" trigger-width="160px" value="long">
          <option value="long" data-icon="assessment">Assessment for the quarterly onboarding cohort</option>
          <option value="word" data-icon="assessment">Supercalifragilisticexpialidocious</option>
        </pds-combobox>
      `);
      await page.waitForChanges();

      const overflow = () =>
        page.evaluate(() => {
          const root = document.querySelector('pds-combobox')!.shadowRoot!;
          const trigger = root.querySelector('.pds-combobox__button-trigger')!.getBoundingClientRect();
          const label = root.querySelector('.pds-combobox__button-trigger-label')!;
          const range = document.createRange();
          range.selectNodeContents(label);
          return Math.max(0, Math.ceil(range.getBoundingClientRect().right - trigger.right));
        });

      expect(await overflow()).toBe(0);

      const combobox = await page.find('pds-combobox');
      combobox.setProperty('value', 'word');
      await page.waitForChanges();

      expect(await overflow()).toBe(0);
    });

    it('has no axe violations with option icons open', async () => {
      const page = await setUp();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('truncate', () => {
    const LONG = 'Assessment for the quarterly onboarding cohort of new members';

    type Page = Awaited<ReturnType<typeof newE2EPage>>;

    const setUp = async (attributes: string, { open = false, value = 'long' } = {}) => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="long" label="Category" mode="select-only" value="${value}"
            trigger-width="200px" dropdown-width="200px" ${attributes}>
            <option value="long">${LONG}</option>
            <option value="icon" data-icon="assessment">${LONG} with an icon</option>
            <option value="short">Event</option>
          </pds-combobox>
        </div>
      `);
      await page.waitForChanges();
      if (open) {
        const trigger = attributes.includes('trigger="input"') ? 'input' : '.pds-combobox__button-trigger';
        await (await page.find(`pds-combobox >>> ${trigger}`)).click();
        await page.waitForChanges();
        // Positioning gives the panel its dropdown-width; until then it's as wide as its widest label.
        await page.waitForFunction(() =>
          [document.querySelector('pds-combobox')!.shadowRoot, document.querySelector('.pds-combobox-dropdown-portal')?.shadowRoot].some(
            root => root?.querySelector<HTMLElement>('.pds-combobox__listbox')?.style.width === '200px',
          ),
        );
      }
      return page;
    };

    /** The trigger's text: whether it's on one line, clipped, with an ellipsis, and the trigger's width. */
    const triggerText = (page: Page) =>
      page.evaluate(() => {
        const root = document.querySelector('pds-combobox')!.shadowRoot!;
        const triggerEl = root.querySelector<HTMLElement>('.pds-combobox__button-trigger')!;
        const text = root.querySelector<HTMLElement>('.pds-combobox__button-trigger-text');
        const label = root.querySelector<HTMLElement>('.pds-combobox__button-trigger-label')!;
        const style = text ? getComputedStyle(text) : null;
        const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
        return {
          hasTextSpan: !!text,
          whiteSpace: style?.whiteSpace ?? getComputedStyle(label).whiteSpace,
          textOverflow: style?.textOverflow ?? null,
          clipped: text ? text.scrollWidth > text.clientWidth : false,
          oneLine: (text ?? label).getBoundingClientRect().height <= lineHeight + 1,
          fits: triggerEl.getBoundingClientRect().width <= 200,
        };
      });

    it.each([
      ['button', 'trigger="button"'],
      ['input-shape button', 'trigger="button" trigger-shape="input"'],
    ])('wraps a long label in a %s trigger without truncate, as before', async (_trigger, attributes) => {
      const page = await setUp(attributes);
      const text = await triggerText(page);

      expect(text.hasTextSpan).toBe(false);
      expect(text.whiteSpace).toBe('normal');
      expect(text.oneLine).toBe(false);
    });

    it.each([
      ['button', 'trigger="button"', 'long'],
      ['input-shape button', 'trigger="button" trigger-shape="input"', 'long'],
      ['button with an icon', 'trigger="button" trigger-shape="input"', 'icon'],
      ['primary button', 'trigger="button" trigger-variant="primary"', 'long'],
    ])('keeps a long label in a %s trigger on one line with an ellipsis', async (_trigger, attributes, value) => {
      const page = await setUp(`${attributes} truncate`, { value });
      const text = await triggerText(page);

      expect(text).toEqual({
        hasTextSpan: true,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        clipped: true,
        oneLine: true,
        fits: true,
      });
    });

    it('keeps the trigger within a narrower container at its default fit-content width', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="width: 160px">
          <pds-combobox component-id="long" label="Category" trigger="button" mode="select-only" value="long" truncate>
            <option value="long">${LONG}</option>
          </pds-combobox>
        </div>
      `);
      await page.waitForChanges();

      const width = await page.evaluate(
        () => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger')!.getBoundingClientRect().width,
      );
      expect(width).toBeLessThanOrEqual(160);
    });

    // A flex item's default min-width is auto (its content size), not 0, so a block host alone
    // wouldn't shrink below the label here the way it does in a non-flex narrow container above;
    // truncate needs to reflect so :host([truncate]) can set min-width: 0 for this case.
    it('keeps the trigger within a narrower flex container at its default fit-content width', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="display: flex; width: 160px">
          <pds-combobox component-id="long" label="Category" trigger="button" mode="select-only" value="long" truncate>
            <option value="long">${LONG}</option>
          </pds-combobox>
        </div>
      `);
      await page.waitForChanges();

      const width = await page.evaluate(
        () => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger')!.getBoundingClientRect().width,
      );
      expect(width).toBeLessThanOrEqual(160);
    });

    const hoverTriggerTitle = async (page: Page) => {
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).hover();
      await page.waitForChanges();
      return page.evaluate(
        () => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger-text')!.getAttribute('title'),
      );
    };

    it('gives a cut trigger label its full text as a title on hover', async () => {
      const page = await setUp('trigger="button" truncate');
      expect(await hoverTriggerTitle(page)).toBe(LONG);
    });

    it("drops the trigger's title when the label changes under the pointer", async () => {
      const page = await setUp('trigger="button" truncate');
      expect(await hoverTriggerTitle(page)).toBe(LONG);

      await page.$eval('pds-combobox', (el: HTMLElement & { value: string }) => {
        el.value = 'short';
      });
      await page.waitForChanges();

      const title = await page.evaluate(
        () => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger-text')!.getAttribute('title'),
      );
      expect(title).toBeNull();
    });

    it('gives a trigger label that fits no title', async () => {
      const page = await setUp('trigger="button" truncate', { value: 'short' });
      expect(await hoverTriggerTitle(page)).toBeNull();
    });

    /** Each option's text: on one line with an ellipsis, clipped, and its `title`. */
    const optionTexts = (page: Page, inPortal: boolean) =>
      page.evaluate(portal => {
        const root = portal
          ? document.querySelector('.pds-combobox-dropdown-portal')!.shadowRoot!
          : document.querySelector('pds-combobox')!.shadowRoot!;
        return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]')).map(option => {
          const text = option.querySelector<HTMLElement>('.pds-combobox__option-text');
          const style = getComputedStyle(text ?? option);
          return {
            whiteSpace: style.whiteSpace,
            textOverflow: text ? style.textOverflow : null,
            clipped: text ? text.scrollWidth > text.clientWidth : false,
            title: text?.getAttribute('title') ?? null,
          };
        });
      }, inPortal);

    it('wraps long option labels without truncate, as before', async () => {
      const page = await setUp('trigger="button"', { open: true });
      const texts = await optionTexts(page, false);

      expect(texts.map(text => text.textOverflow)).toEqual([null, null, null]);
      // The long labels wrap: their options are taller than the short one's.
      const heights = await page.evaluate(() =>
        Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('[role="option"]')).map(option => option.getBoundingClientRect().height),
      );
      expect(heights[0]).toBeGreaterThan(heights[2]);
      expect(texts.map(text => text.whiteSpace)).toEqual(['normal', 'normal', 'normal']);
    });

    it.each([
      ['in the field', 'trigger="button"', false],
      ['in the body', 'trigger="button" dropdown-mount="body"', true],
      ['with panel search', 'trigger="button" panel-search', false],
      ['with an input trigger', 'trigger="input"', false],
    ])('keeps long option labels on one line with an ellipsis %s', async (_where, attributes, inPortal) => {
      const page = await setUp(`${attributes} truncate`, { open: true });
      const texts = await optionTexts(page, inPortal);

      expect(texts.map(({ whiteSpace, textOverflow, clipped }) => ({ whiteSpace, textOverflow, clipped }))).toEqual([
        { whiteSpace: 'nowrap', textOverflow: 'ellipsis', clipped: true },
        { whiteSpace: 'nowrap', textOverflow: 'ellipsis', clipped: true },
        { whiteSpace: 'nowrap', textOverflow: 'ellipsis', clipped: false },
      ]);
    });

    it('gives a cut option label its full text as a title on hover, and a label that fits none', async () => {
      const page = await setUp('trigger="button" truncate', { open: true });

      for (const index of [0, 1, 2]) {
        await (await page.find(`pds-combobox >>> [data-option-index="${index}"]`)).hover();
        await page.waitForChanges();
      }

      expect((await optionTexts(page, false)).map(text => text.title)).toEqual([LONG, `${LONG} with an icon`, null]);
    });

    it('names the options and the trigger by their full labels', async () => {
      const page = await setUp('trigger="button" truncate', { open: true });

      const tree = await page.accessibility.snapshot();
      const find = (node, role) => [node.role === role ? node : null, ...(node.children ?? []).flatMap(child => find(child, role))].filter(Boolean);

      expect(find(tree, 'option').map(option => option.name)).toEqual([LONG, `${LONG} with an icon`, 'Event']);
      const [combobox] = find(tree, 'combobox');
      expect(combobox.name).toBe('Category');
      expect(combobox.value).toBe(LONG);
    });

    it('has no axe violations with truncated labels open', async () => {
      const page = await setUp('trigger="button" truncate', { open: true });

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('option badges', () => {
    const setUp = async (value = '', badge: Record<string, string> = { label: 'New', sentiment: 'accent', icon: 'star' }) => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="badges" label="Category" trigger="button" mode="select-only"
            dropdown-width="300px" value="${value}"></pds-combobox>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        [
          { id: 'broadcast', text: 'Broadcast' },
          { id: 'new-thing', text: 'Example new thing', badge },
          { id: 'long', text: 'Averyveryverylongcategorynamewithoutanyspaces', badge: { label: 'New' } },
          { id: 'off', text: 'Unavailable', badge: { label: 'New' }, disabled: true },
        ],
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    // A row's box, and its text, badge and check edges, by the row's position.
    const layout = (page: Awaited<ReturnType<typeof newE2EPage>>, position: number) =>
      page.evaluate(index => {
        const rows = Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('[role="option"]')) as HTMLElement[];
        const row = rows[index];
        const rowBox = row.getBoundingClientRect();
        const chip = row.querySelector('.pds-combobox__option-badge') as HTMLElement;
        const badge = chip.getBoundingClientRect();
        const text = row.querySelector('.pds-combobox__option-label')!.getBoundingClientRect();
        const check = row.querySelector('.pds-combobox__option-check')?.getBoundingClientRect() ?? null;
        return {
          rowHeight: rowBox.height,
          rowWidth: rowBox.width,
          plainRowHeight: rows[0].getBoundingClientRect().height,
          rowEnd: rowBox.right,
          contentEnd: rowBox.right - parseFloat(getComputedStyle(row).paddingInlineEnd),
          textEnd: text.right,
          badgeStart: badge.left,
          badgeEnd: badge.right,
          badgePaddingStart: getComputedStyle(chip).paddingInlineStart,
          badgeOpacity: getComputedStyle(chip).opacity,
          checkStart: check?.left ?? null,
          checkEnd: check?.right ?? null,
        };
      }, position);

    it('puts the badge at the end of the row, without growing it', async () => {
      const box = await layout(await setUp(), 1);

      expect(Math.abs(box.badgeEnd - box.contentEnd)).toBeLessThan(1);
      expect(box.rowHeight).toBe(box.plainRowHeight);
    });

    it('keeps the selected check after the badge, at its usual distance', async () => {
      const box = await layout(await setUp('new-thing'), 1);

      expect(Math.round(box.checkStart! - box.badgeEnd)).toBe(12);
      expect(Math.abs(box.checkEnd! - box.contentEnd)).toBeLessThan(1);
    });

    it('keeps a gap between long text and the badge, inside the row', async () => {
      const box = await layout(await setUp(), 2);

      expect(box.badgeStart - box.textEnd).toBeGreaterThanOrEqual(8);
      expect(box.badgeEnd).toBeLessThanOrEqual(box.rowEnd);
    });

    // The chip's own padding draws its border; a brand chip's is the 1px gradient ring.
    it("leaves the chip's own padding alone", async () => {
      const box = await layout(await setUp('', { label: 'New', sentiment: 'brand' }), 1);

      expect(box.badgePaddingStart).toBe('1px');
    });

    it("mutes a disabled option's badge", async () => {
      const box = await layout(await setUp(), 3);

      expect(box.badgeOpacity).toBe('0.5');
    });

    // The docs promise "Responsive emails, New"; the chip's icon must add nothing to the name.
    it("names an option by its text, then its badge's label", async () => {
      const page = await setUp();

      const tree = await page.accessibility.snapshot();
      const findNames = (node) => [node.role === 'option' ? node.name : null, ...(node.children ?? []).flatMap(findNames)].filter(Boolean);

      expect(findNames(tree)).toContain('Example new thing, New');
    });

    it('truncates a long badge label at half the row, keeping the text readable', async () => {
      const box = await layout(
        await setUp('', { label: 'Recientemente añadido a la colección de plantillas', sentiment: 'accent' }),
        1,
      );

      expect(box.badgeEnd - box.badgeStart).toBeLessThanOrEqual(box.rowWidth / 2 + 0.5);
      expect(box.badgeStart - box.textEnd).toBeGreaterThanOrEqual(8);
    });

    // Flyout and drill-in rows are treeitems; a clipped badge there must not add a tab stop either.
    it('gives a truncated badge in a drill-in group no tab stop of its own', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="tree-badges" label="Category" trigger="button" mode="select-only"
          group-display="drill-in" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        [{ id: 'long', text: 'Example', group: 'Tag', badge: { label: 'Recientemente añadido a la colección de plantillas' } }],
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__group-row-trigger')).click();
      await page.waitForChanges();

      const badge = await page.evaluate(() => {
        const chip = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__option-badge')!;
        const label = chip.shadowRoot!.querySelector('.pds-chip__label-text') as HTMLElement;
        return {
          row: chip.closest('.pds-combobox__option')!.getAttribute('role'),
          clipped: label.scrollWidth > label.clientWidth,
          tabindex: label.getAttribute('tabindex'),
        };
      });

      expect(badge).toEqual({ row: 'treeitem', clipped: true, tabindex: null });
    });

    it('has no axe violations with a badge open', async () => {
      const page = await setUp();

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

  describe('group badges', () => {
    const premium = { label: 'Premium', sentiment: 'brand', icon: 'premium' };

    const setUp = async (groupDisplay: string) => {
      const page = await newE2EPage();
      await page.setContent(`
        <div style="padding: 40px;">
          <pds-combobox component-id="group-badges" label="Action" trigger="button" mode="select-only"
            placeholder="Choose an action" group-display="${groupDisplay}" dropdown-width="300px"></pds-combobox>
        </div>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        [
          { id: 'email', text: 'Send an email', group: 'Email' },
          { id: 'fb-dm', text: 'Send a Facebook message', group: 'Facebook', groupBadge: premium, disabled: true },
          { id: 'ig-dm', text: 'Send an Instagram message', group: 'Instagram', groupBadge: premium, disabled: true },
        ],
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();
      return page;
    };

    // A group row's box, and its label, badge and chevron edges, beside the unbadged first row.
    const rowLayout = (page: Awaited<ReturnType<typeof newE2EPage>>, position: number) =>
      page.evaluate(index => {
        const triggers = Array.from(
          document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__group-row > .pds-combobox__group-row-trigger'),
        ) as HTMLElement[];
        const trigger = triggers[index];
        const box = trigger.getBoundingClientRect();
        const chip = trigger.querySelector('.pds-combobox__group-badge') as HTMLElement;
        const badge = chip.getBoundingClientRect();
        const label = trigger.querySelector('.pds-combobox__group-row-label')!.getBoundingClientRect();
        const caret = trigger.querySelector('.pds-combobox__group-row-caret')!.getBoundingClientRect();
        const plainCaret = triggers[0].querySelector('.pds-combobox__group-row-caret')!.getBoundingClientRect();
        return {
          rowHeight: box.height,
          plainRowHeight: triggers[0].getBoundingClientRect().height,
          labelEnd: label.right,
          badgeStart: badge.left,
          badgeEnd: badge.right,
          caretStart: caret.left,
          caretEnd: caret.right,
          plainCaretEnd: plainCaret.right,
          badgeOpacity: getComputedStyle(chip).opacity,
        };
      }, position);

    for (const display of ['drill-in', 'flyout']) {
      it(`puts a ${display} group row's badge at the end, before the chevron, without growing the row`, async () => {
        const box = await rowLayout(await setUp(display), 1);

        expect(box.badgeStart - box.labelEnd).toBeGreaterThanOrEqual(8);
        expect(Math.round(box.caretStart - box.badgeEnd)).toBe(8);
        // The chevron stays where an unbadged row has it.
        expect(Math.abs(box.caretEnd - box.plainCaretEnd)).toBeLessThan(1);
        expect(box.rowHeight).toBe(box.plainRowHeight);
      });

      it(`mutes a disabled ${display} group's badge`, async () => {
        const box = await rowLayout(await setUp(display), 1);

        expect(box.badgeOpacity).toBe('0.5');
      });

      it(`names a ${display} group row by its label, then its badge's label, with no axe violations`, async () => {
        const page = await setUp(display);

        const tree = await page.accessibility.snapshot();
        const findNames = node => [node.role === 'treeitem' ? node.name : null, ...(node.children ?? []).flatMap(findNames)].filter(Boolean);
        expect(findNames(tree)).toEqual(expect.arrayContaining(['Email', 'Facebook, Premium', 'Instagram, Premium']));

        const violations = await runAxe(page);
        expect(formatViolations(violations)).toBe('');
      });
    }

    for (const display of ['drill-in', 'flyout']) {
      // Measures the text itself, not its span: a word that can't wrap overflows the span.
      it(`wraps a long one-word ${display} group label before the badge`, async () => {
        const page = await newE2EPage();
        await page.setContent(`
          <pds-combobox component-id="long-row" label="Action" trigger="button" mode="select-only"
            placeholder="Choose an action" group-display="${display}" dropdown-width="240px"></pds-combobox>
        `);
        await page.$eval(
          'pds-combobox',
          (el: HTMLElement & { options?: unknown }, options) => {
            el.options = options;
          },
          [{ id: 'x', text: 'Send it', group: 'Supercalifragilisticexpialidocious', groupBadge: premium }],
        );
        await page.waitForChanges();
        await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
        await page.waitForChanges();

        const box = await page.evaluate(() => {
          const trigger = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row-trigger')!;
          const label = trigger.querySelector('.pds-combobox__group-row-label')!;
          const range = document.createRange();
          range.selectNodeContents(label);
          const rects = Array.from(range.getClientRects());
          return {
            lines: new Set(rects.map(rect => Math.round(rect.top))).size,
            textEnd: Math.max(...rects.map(rect => rect.right)),
            badgeStart: trigger.querySelector('.pds-combobox__group-badge')!.getBoundingClientRect().left,
          };
        });

        expect(box.lines).toBeGreaterThan(1);
        expect(box.textEnd).toBeLessThanOrEqual(box.badgeStart);
      });
    }

    it("leaves the badge off a drilled-in group's row back", async () => {
      const page = await setUp('drill-in');
      const rows = await page.findAll('pds-combobox >>> .pds-combobox__group-row-trigger');
      await rows[1].click();
      await page.waitForChanges();

      const back = await page.find('pds-combobox >>> .pds-combobox__group-back');
      expect(back).not.toBeNull();
      expect(await page.find('pds-combobox >>> .pds-combobox__group-back .pds-combobox__group-badge')).toBeNull();
      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it("puts an inline group's badge at the end of its caption, without growing it", async () => {
      const page = await setUp('inline');

      const box = await page.evaluate(() => {
        const labels = Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__group-label')) as HTMLElement[];
        const label = labels[1];
        const chip = label.querySelector('.pds-combobox__group-badge') as HTMLElement;
        const text = label.querySelector('.pds-combobox__group-label-text')!.getBoundingClientRect();
        const rect = label.getBoundingClientRect();
        return {
          height: rect.height,
          plainHeight: labels[0].getBoundingClientRect().height,
          contentEnd: rect.right - parseFloat(getComputedStyle(label).paddingInlineEnd),
          textEnd: text.right,
          badgeStart: chip.getBoundingClientRect().left,
          badgeEnd: chip.getBoundingClientRect().right,
          badgeTransform: getComputedStyle(chip).textTransform,
          badgeOpacity: getComputedStyle(chip).opacity,
        };
      });

      expect(Math.abs(box.badgeEnd - box.contentEnd)).toBeLessThan(1);
      expect(box.badgeStart - box.textEnd).toBeGreaterThanOrEqual(8);
      expect(box.height).toBe(box.plainHeight);
      expect(box.badgeTransform).toBe('none');
      expect(box.badgeOpacity).toBe('0.5');
    });

    // The caption is hidden from assistive tech, and the group's name carries the badge; a clipped
    // badge there must not add a tab stop, or an aria-hidden one. Hover still shows its full label.
    it("gives a truncated inline group badge no tab stop, a tooltip on hover, and no axe violations", async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-combobox component-id="inline-long-badge" label="Action" trigger="button" mode="select-only"
          placeholder="Choose an action" dropdown-width="300px"></pds-combobox>
      `);
      await page.$eval(
        'pds-combobox',
        (el: HTMLElement & { options?: unknown }, options) => {
          el.options = options;
        },
        [{ id: 'fb-dm', text: 'Send a Facebook message', group: 'Facebook', groupBadge: { label: 'Disponible con el plan Premium y superiores' } }],
      );
      await page.waitForChanges();
      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();

      const badge = await page.evaluate(() => {
        const chip = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-badge')!;
        const label = chip.shadowRoot!.querySelector('.pds-chip__label-text') as HTMLElement;
        label.focus();
        return { clipped: label.scrollWidth > label.clientWidth, focused: chip.shadowRoot!.activeElement === label };
      });

      expect(badge).toEqual({ clipped: true, focused: false });

      await (await page.find('pds-combobox >>> .pds-combobox__group-badge')).hover();
      await page.waitForChanges();
      const tooltip = await page.evaluate(() => document.querySelector('.pds-truncation-tooltip--visible')?.textContent ?? null);
      expect(tooltip).toBe('Disponible con el plan Premium y superiores');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });

    it('names an inline group by its label, then its badge, with no axe violations', async () => {
      const page = await setUp('inline');

      const names = await page.evaluate(() =>
        Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('[role="group"]')).map(group => group.getAttribute('aria-label')),
      );
      expect(names).toEqual(['Email', 'Facebook, Premium', 'Instagram, Premium']);
      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });
});

describe('pds-combobox in a disabled fieldset', () => {
  it('is disabled while the fieldset is, and comes back when it is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form>
        <fieldset disabled>
          <pds-combobox component-id="in-fieldset" name="choice" label="Choice" trigger="button" mode="select-only">
            <option value="a">A</option>
          </pds-combobox>
        </fieldset>
      </form>
    `);
    await page.waitForChanges();
    const state = () =>
      page.evaluate(() => {
        const host = document.querySelector('pds-combobox') as HTMLElement & { disabled: boolean };
        const trigger = host.shadowRoot!.querySelector('.pds-combobox__button-trigger')!;
        return { disabled: host.disabled, expanded: trigger.getAttribute('aria-expanded') };
      });

    expect((await state()).disabled).toBe(true);
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();
    expect(await state()).toEqual({ disabled: true, expanded: 'false' });

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');

    await page.evaluate(() => document.querySelector('fieldset')!.removeAttribute('disabled'));
    await page.waitForChanges();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();
    expect(await state()).toEqual({ disabled: false, expanded: 'true' });
  });
});

describe('pds-combobox selection on first paint', () => {
  /**
   * Builds a combobox with `value` and slotted options, as a form re-rendered after a pick does,
   * and returns what its field shows at its very first render: read in a mutation observer
   * callback, which runs before any later render (and before `slotchange`).
   */
  const firstPaint = (page: Awaited<ReturnType<typeof newE2EPage>>, attributes: Record<string, string>, options: string) =>
    page.evaluate(
      async (attrs, optionsHtml) => {
        await customElements.whenDefined('pds-combobox');
        const el = document.createElement('pds-combobox');
        Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
        el.innerHTML = optionsHtml;
        const root = el.shadowRoot!;
        const snapshot = new Promise<{ text: string; placeholder: boolean; inputValue: string | null; chips: number; icon: string | null; layoutRendered: boolean }>((resolve, reject) => {
          const observer = new MutationObserver(() => {
            const trigger = root.querySelector('.pds-combobox__button-trigger, .pds-combobox__chip-trigger, .pds-combobox__input');
            if (!trigger) return;
            observer.disconnect();
            clearTimeout(timeout);
            resolve({
              text: trigger.textContent?.trim() ?? '',
              placeholder: !!root.querySelector('.pds-combobox__button-trigger-label--placeholder'),
              inputValue: trigger instanceof HTMLInputElement ? trigger.value : null,
              chips: trigger.querySelectorAll('pds-chip').length,
              icon: (trigger.querySelector('pds-icon.pds-combobox__button-trigger-icon') as HTMLElement & { name?: string } | null)?.name ?? null,
              layoutRendered: !!trigger.querySelector('.pds-combobox__button-trigger-layout-wrapper'),
            });
          });
          const timeout = setTimeout(() => {
            observer.disconnect();
            reject(new Error('The combobox never rendered a trigger'));
          }, 5000);
          observer.observe(root, { childList: true, subtree: true, characterData: true });
        });
        document.body.appendChild(el);
        return snapshot;
      },
      attributes,
      options,
    );

  const categories = `
    <option value="tags">Tags</option>
    <option value="automation">Automation</option>
  `;

  it('shows the selected option in a button trigger, not the placeholder', async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(page, { 'component-id': 'first-paint-button', label: 'Category', placeholder: 'Select a category', trigger: 'button', mode: 'select-only', value: 'automation' }, categories);

    expect(shown).toMatchObject({ text: 'Automation', placeholder: false });
  });

  it('shows the selected option in a chip trigger', async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(page, { 'component-id': 'first-paint-chip', label: 'Status', trigger: 'chip', mode: 'select-only', value: 'published' }, `
      <option value="draft">Draft</option>
      <option value="published">Published</option>
    `);

    expect(shown.text).toBe('Published');
  });

  it('shows the first option of a chip trigger without a value', async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(page, { 'component-id': 'first-paint-chip-default', label: 'Status', trigger: 'chip', mode: 'select-only' }, `
      <option value="draft">Draft</option>
      <option value="published">Published</option>
    `);

    expect(shown.text).toBe('Draft');
  });

  it('shows the selected option in an input trigger', async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(page, { 'component-id': 'first-paint-input', label: 'Category', placeholder: 'Select a category', value: 'automation' }, categories);

    expect(shown.inputValue).toBe('Automation');
  });

  it("shows a selected layout option's content", async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(
      page,
      { 'component-id': 'first-paint-layout', label: 'Category', placeholder: 'Select a category', trigger: 'button', mode: 'select-only', 'custom-option-layouts': '', value: 'automation' },
      `<option value="tags" label="Tags" data-layout><span>Tags</span></option>
       <option value="automation" label="Automation" data-layout><span>Automation</span></option>`,
    );

    // Text alone can't tell a rendered layout from the plain-label fallback here, since the
    // layout's own text is the same as the label -- the wrapper actually rendering is the proof.
    expect(shown).toMatchObject({ text: 'Automation', placeholder: false, layoutRendered: true });
  });

  it("shows a badged option's icon and label, and leaves its badge to the list", async () => {
    const page = await newE2EPage();
    await page.setContent('<main></main>');

    const shown = await firstPaint(
      page,
      { 'component-id': 'first-paint-badge', label: 'Category', placeholder: 'Select a category', trigger: 'button', mode: 'select-only', value: 'automation' },
      `<option value="tags" data-icon="hashtag">Tags</option>
       <option value="automation" data-icon="automations" data-badge="New" data-badge-sentiment="accent">Automation</option>`,
    );

    expect(shown).toEqual({ text: 'Automation', placeholder: false, inputValue: null, chips: 0, icon: 'automations', layoutRendered: false });
  });
});

describe('pds-combobox selected field and option badges', () => {
  const setUp = async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="badged-categories" label="Category" trigger="button" trigger-shape="input" mode="select-only"
        group-display="drill-in" panel-search value="automation">
        <option value="tags" data-icon="hashtag" data-search-text="Tags has any tag">Tags</option>
        <option value="automation" data-icon="automations" data-badge="New" data-badge-sentiment="accent"
          data-search-text="Automation started finished">Automation</option>
      </pds-combobox>
    `);
    await page.waitForChanges();
    return page;
  };

  it('keeps the badge on the list row and out of the filled field', async () => {
    const page = await setUp();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();

    const shown = await page.evaluate(() => {
      const root = document.querySelector('pds-combobox')!.shadowRoot!;
      const trigger = root.querySelector('.pds-combobox__button-trigger')!;
      const row = Array.from(root.querySelectorAll('.pds-combobox__option')).find(option => option.textContent?.startsWith('Automation'))!;
      return {
        field: trigger.textContent?.trim(),
        fieldChips: trigger.querySelectorAll('pds-chip').length,
        rowBadge: row.querySelector('pds-chip.pds-combobox__option-badge')?.textContent,
      };
    });

    expect(shown).toEqual({ field: 'Automation', fieldChips: 0, rowBadge: 'New' });
  });

  it("finds an option by its data-search-text, without a custom layout", async () => {
    const page = await setUp();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();

    const search = await page.find('pds-combobox >>> .pds-combobox__panel-search input');
    await search.type('finished');
    await page.waitForChanges();

    const rows = await page.evaluate(() =>
      Array.from(document.querySelector('pds-combobox')!.shadowRoot!.querySelectorAll('.pds-combobox__option')).map(option => option.querySelector('.pds-combobox__option-label')?.textContent?.trim()),
    );
    expect(rows).toEqual(['Automation']);
  });

  it('has no axe violations', async () => {
    const page = await setUp();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-combobox value fade', () => {
  const setUp = async (value = '') => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-combobox component-id="fade" label="Action" trigger="button" mode="select-only" ${value ? `value="${value}"` : ''}>
        <option value="tags" data-icon="hashtag">Tags</option>
        <option value="automation" data-icon="automations">Automation</option>
      </pds-combobox>
    `);
    await page.waitForChanges();
    return page;
  };

  // Whether the field's value fades in: its class, and an animation running on it.
  const fades = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
    page.evaluate(() => {
      const label = document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__button-trigger-label')!;
      return label.classList.contains('pds-combobox__button-trigger-label--value-in') || label.getAnimations().length > 0;
    });

  it('paints a value it loads with at rest', async () => {
    const page = await setUp('tags');
    expect(await fades(page)).toBe(false);
  });

  it('fades in a pick from the placeholder', async () => {
    const page = await setUp();
    await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
    await page.waitForChanges();
    await (await page.find('pds-combobox >>> [role="option"]')).click();
    await page.waitForChanges();
    expect(await fades(page)).toBe(true);
  });
});
