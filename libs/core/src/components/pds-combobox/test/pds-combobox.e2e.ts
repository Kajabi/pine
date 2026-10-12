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
          first: rect('.pds-combobox__flyout [role="option"]'),
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
    it('has no axe violations with a flyout open', async () => {
      const page = await setUp('padding: 40px;', 'input');
      await hoverGroup(page, 'Email');

      const violations = await runAxe(page);
      expect(formatViolations(violations)).toBe('');
    });
  });

});
