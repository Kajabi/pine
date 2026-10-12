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

      const { panel, flyout } = await geometry(page);
      expect(flyout.right).toBeLessThanOrEqual(panel.left);
    });

    // Email, not Tag: the highlight starts on the first option (in Tag), so this catches an
    // aria-activedescendant left pointing at an option that isn't rendered.
    const activeDescendant = (page: Awaited<ReturnType<typeof newE2EPage>>, selector: string) =>
      page.evaluate(sel => document.querySelector('pds-combobox')!.shadowRoot!.querySelector(sel)!.getAttribute('aria-activedescendant'), selector);

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
      page.evaluate(() => !!document.querySelector('.pds-combobox__listbox, pds-combobox')?.shadowRoot?.querySelector('.pds-combobox__listbox') || !!document.querySelector('.pds-combobox-dropdown-portal .pds-combobox__listbox'));

    it('closes a portaled panel-search dropdown on a click outside', async () => {
      const page = await setUp('panel-search dropdown-mount="body"');
      expect(await isOpen(page)).toBe(true);

      await page.mouse.click(1100, 700);
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

      expect(await isOpen(page)).toBe(false);
    });

    it('closes when the trigger is clicked while the search field has focus', async () => {
      const page = await setUp('panel-search');
      expect(await activeClass(page)).toContain('pds-combobox__panel-search-input');

      await (await page.find('pds-combobox >>> .pds-combobox__button-trigger')).click();
      await page.waitForChanges();

      expect(await isOpen(page)).toBe(false);
    });

    it('lands on the trigger when Tab leaves the search field, then tabs on from there', async () => {
      const page = await setUp('panel-search');

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Tab');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));

      expect(await isOpen(page)).toBe(false);
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');

      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.id ?? '')).toBe('after');
    });

    it('drills in and back from the search field by keyboard, then closes with Escape', async () => {
      const page = await setUp('group-display="drill-in" panel-search');
      const searchAD = () =>
        page.evaluate(() =>
          document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__panel-search-input')!.getAttribute('aria-activedescendant'),
        );

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();
      expect(await searchAD()).toBe('actions-option-0');

      await page.keyboard.press('ArrowLeft');
      await page.waitForChanges();
      const tagRowId = await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__group-row')!.id);
      expect(await searchAD()).toBe(tagRowId);

      await page.keyboard.press('Escape');
      await page.waitForChanges();
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 20)));
      expect(await (await page.find('pds-combobox')).getProperty('value')).toBe('');
      expect(await page.evaluate(() => document.querySelector('pds-combobox')!.shadowRoot!.querySelector('.pds-combobox__listbox'))).toBeNull();
      expect(await activeClass(page)).toContain('pds-combobox__button-trigger');
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

      const row = await page.$('.pds-combobox-dropdown-portal .pds-combobox__group-row-trigger');
      await row!.click();
      await page.waitForChanges();

      const shape = await page.evaluate(() => ({
        flyout: !!document.querySelector('.pds-combobox-dropdown-portal .pds-combobox__flyout'),
        back: !!document.querySelector('.pds-combobox-dropdown-portal .pds-combobox__group-back'),
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
});

