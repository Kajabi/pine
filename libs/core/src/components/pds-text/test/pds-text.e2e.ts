import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

const LONG_TEXT = 'A very long sentence that cannot possibly fit';

const CLIPPED_TEXT = `<pds-text truncate style="width: 60px;">${LONG_TEXT}</pds-text>`;

const truncationTooltipText = (page: E2EPage) =>
  page.evaluate(() => document.querySelector('.pds-truncation-tooltip')?.textContent.trim() ?? null);

// The hide is delayed 100ms.
const waitOutHideDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

const contentHasFocus = (page: E2EPage) =>
  page.$eval('pds-text', (el) => el.shadowRoot.activeElement === el.shadowRoot.querySelector('[part="content"]'));

describe('pds-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text></pds-text>');

    const element = await page.find('pds-text');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with italic style when attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text tag="p" italic></pds-text>');

    const el = await page.find('pds-text >>> p');

    expect((await el.getComputedStyle()).getPropertyValue('font-style')).toBe('italic');
  });

  it('renders with truncate style when attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text tag="h1" truncate></pds-text>');

    const el = await page.find('pds-text >>> h1');

    expect((await el.getComputedStyle()).getPropertyValue('text-overflow')).toBe('ellipsis');
  });

  it('actually truncates a plain (non-flex) width-constrained host, not just when it happens to be blockified by a flex/grid parent', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-text truncate style="width: 100px;">
        A very long sentence that would otherwise wrap across several lines
      </pds-text>
    `);

    // overflow: hidden lives on the internal rendered tag (:host([truncate]) > *),
    // not the host itself, so that's what has to be measured.
    const isTruncated = await page.$eval('pds-text', (el) => {
      const inner = el.shadowRoot.querySelector('p');
      return inner.scrollWidth > inner.clientWidth;
    });
    expect(isTruncated).toBe(true);
  });

  it('does not constrain width when truncate is unset, even with an explicit width style', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-text style="width: 100px;">
        A very long sentence that would otherwise wrap across several lines
      </pds-text>
    `);

    const width = await page.$eval('pds-text', (el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(100);
  });

  // The tab stop is there to reach the tooltip, and the tooltip only appears
  // when there is hidden text — so text that fits stays out of the tab order
  // even though it opted into truncate.
  it('is focusable only while the text is actually clipped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-text truncate style="width: 60px;">A very long sentence that cannot possibly fit</pds-text>
      <pds-text truncate style="width: 600px;">Short</pds-text>
      <pds-text style="width: 60px;">A very long sentence that cannot possibly fit</pds-text>
    `);

    const [clipped, fits, plain] = await page.$$eval('pds-text', (els) =>
      els.map((el) => el.shadowRoot.querySelector('[part="content"]').getAttribute('tabindex')),
    );

    expect(clipped).toBe('0');
    expect(fits).toBeNull();
    expect(plain).toBeNull();
  });

  // Moving an element disconnects and reconnects it without a re-render, so the
  // tooltip torn down on disconnect has to come back on reconnect.
  it('keeps the tooltip and tab stop after it moves in the DOM', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="from"><pds-text truncate style="width: 60px;">A very long sentence that cannot possibly fit</pds-text></div>
      <div id="to"></div>
    `);

    await page.$eval('#to', (to) => to.append(document.querySelector('pds-text')));
    await page.waitForChanges();

    const tabindex = await page.$eval('pds-text', (el) =>
      el.shadowRoot.querySelector('[part="content"]').getAttribute('tabindex'),
    );
    expect(tabindex).toBe('0');

    await page.hover('pds-text');
    await page.waitForChanges();

    const tooltips = await page.$$eval('.pds-truncation-tooltip', (els) => els.map((el) => el.textContent.trim()));
    expect(tooltips).toEqual(['A very long sentence that cannot possibly fit']);
  });

  it('shows the tooltip when Tab reaches the clipped text', async () => {
    const page = await newE2EPage();
    await page.setContent(CLIPPED_TEXT);

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(await contentHasFocus(page)).toBe(true);
    expect(await truncationTooltipText(page)).toBe(LONG_TEXT);
  });

  // Clicking focuses the text too, but only keyboard focus holds the tooltip open.
  it('hides the tooltip once the pointer leaves after a click, though the text keeps focus', async () => {
    const page = await newE2EPage();
    await page.setContent(CLIPPED_TEXT);

    await page.click('pds-text');
    await page.waitForChanges();
    expect(await truncationTooltipText(page)).toBe(LONG_TEXT);

    await page.mouse.move(0, 0);
    await waitOutHideDelay();

    expect(await contentHasFocus(page)).toBe(true);
    expect(await truncationTooltipText(page)).toBeNull();
  });

  it('hides the tooltip once the pointer leaves after a hover', async () => {
    const page = await newE2EPage();
    await page.setContent(CLIPPED_TEXT);

    await page.hover('pds-text');
    await page.waitForChanges();
    expect(await truncationTooltipText(page)).toBe(LONG_TEXT);

    await page.mouse.move(0, 0);
    await waitOutHideDelay();

    expect(await truncationTooltipText(page)).toBeNull();
  });
});

describe('pds-text inside a focusable control', () => {
  const WRAPPERS = [
    ['link', '<a href="#">', '</a>'],
    ['button', '<button type="button">', '</button>'],
    ['pds-button', '<pds-button variant="unstyled">', '</pds-button>'],
    ['pds-link', '<pds-link href="#">', '</pds-link>'],
  ];

  const contentTabindex = (page: E2EPage) =>
    page.$eval('pds-text', (el) => el.shadowRoot.querySelector('[part="content"]').getAttribute('tabindex'));

  it.each([
    ...WRAPPERS,
    ['pds-dropdown-menu-item', '<pds-dropdown-menu-item>', '</pds-dropdown-menu-item>'],
  ])('gives clipped text no tab stop of its own inside a %s', async (_name, open, close) => {
    const page = await newE2EPage();
    await page.setContent(`${open}${CLIPPED_TEXT}${close}`);

    expect(await contentTabindex(page)).toBeNull();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it.each(WRAPPERS)(
    'shows the tooltip while a wrapping %s has keyboard focus, and Tab moves straight on',
    async (_name, open, close) => {
      const page = await newE2EPage();
      await page.setContent(`${open}${CLIPPED_TEXT}${close}<button type="button" id="after">After</button>`);

      await page.keyboard.press('Tab');
      await page.waitForChanges();

      expect(await page.evaluate(() => document.activeElement === document.querySelector('pds-text').parentElement)).toBe(
        true,
      );
      expect(await truncationTooltipText(page)).toBe(LONG_TEXT);

      await page.keyboard.press('Tab');
      await waitOutHideDelay();

      expect(await page.evaluate(() => document.activeElement.id)).toBe('after');
      expect(await truncationTooltipText(page)).toBeNull();
    },
  );

  it('hides the tooltip once the pointer leaves after clicking the wrapping control', async () => {
    const page = await newE2EPage();
    await page.setContent(`<button type="button">${CLIPPED_TEXT}</button>`);

    await page.click('pds-text');
    await page.waitForChanges();
    expect(await truncationTooltipText(page)).toBe(LONG_TEXT);

    await page.mouse.move(0, 0);
    await waitOutHideDelay();

    expect(await truncationTooltipText(page)).toBeNull();
  });

  it('keeps its own tab stop inside a link with no href, which takes no focus', async () => {
    const page = await newE2EPage();
    await page.setContent(`<a>${CLIPPED_TEXT}</a>`);

    expect(await contentTabindex(page)).toBe('0');
  });

  it('keeps a tab stop on each clipped text when one control holds several, so their tooltips never stack', async () => {
    const page = await newE2EPage();
    await page.setContent(`<a href="#">${CLIPPED_TEXT}${CLIPPED_TEXT}</a>`);

    const tabindexes = await page.$$eval('pds-text', (els) =>
      els.map((el) => el.shadowRoot.querySelector('[part="content"]').getAttribute('tabindex')),
    );
    expect(tabindexes).toEqual(['0', '0']);

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(await page.$$eval('.pds-truncation-tooltip', (els) => els.length)).toBe(0);
  });

  it.each(['added to', 'switched on inside'])(
    'hands the stop back when a second clipped text is %s the control later, so their tooltips never stack',
    async (change) => {
      const addsText = change === 'added to';
      const page = await newE2EPage();
      const plainText = addsText ? '' : `<pds-text style="width: 60px;">${LONG_TEXT}</pds-text>`;
      await page.setContent(`<a href="#">${CLIPPED_TEXT}${plainText}</a>`);

      await page.evaluate((shouldAdd) => {
        const link = document.querySelector('a');
        if (shouldAdd) {
          const text = document.createElement('pds-text');
          text.setAttribute('truncate', '');
          text.style.width = '60px';
          text.textContent = link.querySelector('pds-text').textContent;
          link.append(text);
        } else {
          (link.querySelectorAll('pds-text')[1] as HTMLPdsTextElement).truncate = true;
        }
      }, addsText);
      await page.waitForChanges();
      await waitOutHideDelay();

      const tabindexes = await page.$$eval('pds-text', (els) =>
        els.map((el) => el.shadowRoot.querySelector('[part="content"]').getAttribute('tabindex')),
      );
      expect(tabindexes).toEqual(['0', '0']);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await waitOutHideDelay();

      expect(await page.$$eval('.pds-truncation-tooltip', (els) => els.length)).toBe(1);
    },
  );
});

describe('pds-text accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text>Body text</pds-text>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
