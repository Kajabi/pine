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

    it("keeps the highlighted option clear of the sticky row back in a group that scrolls", async () => {
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

      // 16px above and below a line of body text: 52px where body text is 14px, as in the designs.
      expect(searchPadding).toBe('16px');
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
});
