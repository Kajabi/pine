import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip />');

    const element = await page.find('pds-chip');
    expect(element).toHaveClass('hydrated');
  });

  it('renders small size with pds-chip--sm class', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip size="sm">Small</pds-chip>');

    const element = await page.find('pds-chip');
    expect(element).toHaveClass('pds-chip--sm');
  });

  it('renders large size via size prop with pds-chip--lg class', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip size="lg">Large</pds-chip>');

    const element = await page.find('pds-chip');
    expect(element).toHaveClass('pds-chip--lg');
  });

  it('shrinks a bare-text default (text variant) label below its content width when max-width is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip max-width="100px">
        A very long label that would otherwise overflow the chip
      </pds-chip>
    `);

    const width = await page.$eval('pds-chip', (el) => el.getBoundingClientRect().width);

    // border-box, so the cap is the OUTER width incl. padding, not on top of it.
    expect(width).toBeLessThanOrEqual(101);
  });

  it('shrinks a bare-text tag label below its content width when max-width is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip variant="tag" max-width="100px">
        A very long label that would otherwise overflow the chip
      </pds-chip>
    `);

    const width = await page.$eval('pds-chip', (el) => el.getBoundingClientRect().width);

    // border-box, so the cap is the OUTER width incl. padding, not on top of it.
    expect(width).toBeLessThanOrEqual(101);
  });

  it('shrinks a bare-text dropdown label below its content width when max-width is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip variant="dropdown" max-width="100px">
        A very long label that would otherwise overflow the chip
      </pds-chip>
    `);

    const width = await page.$eval('pds-chip', (el) => el.getBoundingClientRect().width);

    // border-box, so the cap is the OUTER width incl. padding, not on top of it.
    expect(width).toBeLessThanOrEqual(101);
  });

  it('does not constrain width when max-width is unset', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip variant="tag">A very long label that would otherwise overflow the chip</pds-chip>
    `);

    const width = await page.$eval('pds-chip', (el) => el.getBoundingClientRect().width);

    expect(width).toBeGreaterThan(300);
  });

  it('wraps rather than truncating a long label in a narrow container when max-width is unset', async () => {
    const page = await newE2EPage();
    // Without max-width the label must not be forced to nowrap/ellipsis — it
    // wraps and the chip stays within its container instead of overflowing.
    await page.setContent(`
      <div style="width: 160px;">
        <pds-chip>Quarterly revenue report final</pds-chip>
      </div>
    `);

    const { width, whiteSpace } = await page.$eval('pds-chip', (el) => ({
      width: el.getBoundingClientRect().width,
      whiteSpace: getComputedStyle(
        el.shadowRoot.querySelector('.pds-chip__label-text'),
      ).whiteSpace,
    }));

    expect(width).toBeLessThanOrEqual(160);
    expect(whiteSpace).toBe('normal');
  });

  it('forces the label to nowrap only when max-width is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip max-width="120px">Quarterly revenue report final</pds-chip>');

    const whiteSpace = await page.$eval(
      'pds-chip',
      (el) => getComputedStyle(el.shadowRoot.querySelector('.pds-chip__label-text')).whiteSpace,
    );

    expect(whiteSpace).toBe('nowrap');
  });

  it('keeps the dot from shrinking when max-width squeezes the label', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-chip dot max-width="120px">A very long label that would otherwise overflow the chip</pds-chip>',
    );

    const dotWidth = await page.$eval(
      'pds-chip',
      (el) => el.shadowRoot.querySelector('.pds-chip__dot').getBoundingClientRect().width,
    );

    // Unconstrained the dot is 6px (4px box + 1px border each side); it must not
    // collapse into an oval when the row is squeezed.
    expect(dotWidth).toBeGreaterThanOrEqual(5);
  });

  // The tab stop only earns its place while there is hidden text to reveal.
  // A chip that sets max-width but whose label fits would otherwise be a dead
  // stop — and chips come in rows, so every one of them would be.
  it('makes the label focusable only while the label is actually clipped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>
      <pds-chip max-width="400px">Short</pds-chip>
      <pds-chip>Plain</pds-chip>
    `);

    const [clipped, fits, plain] = await page.$$eval('pds-chip', (els) =>
      els.map((el) => el.shadowRoot.querySelector('.pds-chip__label-text').getAttribute('tabindex')),
    );

    expect(clipped).toBe('0');
    expect(fits).toBeNull();
    expect(plain).toBeNull();
  });

  it('drops the tab stop when the label stops overflowing', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-chip max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>',
    );

    const labelTabindex = () =>
      page.$eval('pds-chip', (el) => el.shadowRoot.querySelector('.pds-chip__label-text').getAttribute('tabindex'));

    expect(await labelTabindex()).toBe('0');

    const chip = await page.find('pds-chip');
    chip.setProperty('maxWidth', '600px');
    await page.waitForChanges();
    // The ResizeObserver re-measure is debounced by 100ms.
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(await labelTabindex()).toBeNull();
  });

  // The dropdown variant's label span sits inside `<button class="pds-chip__button">`,
  // which is already focusable. Giving the clipped span its own tabindex too
  // would nest a second tab stop inside the button — invalid HTML and an axe
  // nested-interactive violation.
  it('never gives the dropdown label its own tab stop, even while clipped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip variant="dropdown" max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>
    `);

    const labelTabindex = await page.$eval('pds-chip', (el) =>
      el.shadowRoot.querySelector('.pds-chip__label-text').getAttribute('tabindex'),
    );

    expect(labelTabindex).toBeNull();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  // Without a tab stop of its own, the clipped label still needs to be
  // reachable by keyboard: hostEl's focusin listener catches focus bubbling
  // up from the dropdown's own button.
  it('shows the tooltip when the dropdown button itself is focused', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip variant="dropdown" max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>
    `);

    const button = await page.find('pds-chip >>> .pds-chip__button');
    await button.focus();
    await page.waitForChanges();

    const tooltipText = await page.evaluate(() => {
      const portal = document.querySelector('.pds-truncation-tooltip');
      return portal ? portal.textContent.trim() : null;
    });

    expect(tooltipText).toContain('A very long label that would otherwise overflow the chip');
  });

  it('shows a tooltip with the full label on hover when the label is truncated', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-chip max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>',
    );

    await page.hover('pds-chip');
    await page.waitForChanges();

    const tooltipText = await page.evaluate(() => {
      const portal = document.querySelector('.pds-truncation-tooltip');
      return portal ? portal.textContent.trim() : null;
    });

    expect(tooltipText).toContain('A very long label that would otherwise overflow the chip');
  });

  it('re-binds the tooltip to the new label node after the variant changes', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-chip max-width="80px">A very long label that would otherwise overflow the chip</pds-chip>',
    );

    // Switching variant remounts the label span; the tooltip must re-attach to
    // the current node rather than the detached original.
    const chip = await page.find('pds-chip');
    chip.setProperty('variant', 'dropdown');
    await page.waitForChanges();

    await page.hover('pds-chip');
    await page.waitForChanges();

    const tooltipText = await page.evaluate(() => {
      const portal = document.querySelector('.pds-truncation-tooltip');
      return portal ? portal.textContent.trim() : null;
    });

    expect(tooltipText).toContain('A very long label that would otherwise overflow the chip');
  });

  it('emits "pdsTagCloseClick" event when close button is clicked in tag variant', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" label="Tag Chip" />');

    const closeBtn = await page.find('pds-chip >>> .pds-chip__close');
    const eventSpy = await page.spyOnEvent('pdsTagCloseClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('renders close button as link when remove-url is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/filters/remove/1">Filter</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(closeLink.tagName).toBe('A');
    expect(await closeLink.getAttribute('href')).toBe('/filters/remove/1');
  });

  it('adds data-method attributes when remove-http-method is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/tags/1" remove-http-method="delete">Tag</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(await closeLink.getAttribute('data-method')).toBe('delete');
    expect(await closeLink.getAttribute('data-turbo-method')).toBe('delete');
    expect(await closeLink.getAttribute('rel')).toBe('nofollow');
  });

  it('adds target attribute when remove-target is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/clear" remove-target="_blank">Clear</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(await closeLink.getAttribute('target')).toBe('_blank');
  });

  it('emits "pdsTagCloseClick" event when close link is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/filters/remove/1">Filter</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    const eventSpy = await page.spyOnEvent('pdsTagCloseClick');
    await closeLink.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});

describe('pds-chip dot and icon colors', () => {
  const dotBackground = (page, selector: string) =>
    page.$eval(selector, (el) => getComputedStyle(el.shadowRoot.querySelector('[part="dot"]')).backgroundColor);
  const iconColor = (page, selector: string) =>
    page.$eval(selector, (el) => getComputedStyle(el.shadowRoot.querySelector('[part="icon"]')).color);

  it('colors the dot with another sentiment\'s dot token when dot-color is a sentiment name', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip id="custom" dot dot-color="success">Custom</pds-chip>
      <pds-chip id="reference" sentiment="success" dot>Reference</pds-chip>
    `);

    expect(await dotBackground(page, '#custom')).toBe(await dotBackground(page, '#reference'));
  });

  it('colors the dot with a literal color value', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip dot dot-color="rgb(255, 0, 0)">Label</pds-chip>');

    expect(await dotBackground(page, 'pds-chip')).toBe('rgb(255, 0, 0)');
  });

  it('keeps the sentiment dot color when dot-color is unset', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip id="default" sentiment="danger" dot>Default</pds-chip>
      <pds-chip id="explicit" dot dot-color="danger">Explicit</pds-chip>
    `);

    expect(await dotBackground(page, '#default')).toBe(await dotBackground(page, '#explicit'));
  });

  it('colors the icon with a literal color value', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip icon="check" icon-color="rgb(255, 0, 0)">Label</pds-chip>');

    expect(await iconColor(page, 'pds-chip')).toBe('rgb(255, 0, 0)');
  });

  it('keeps the icon on the label text color when icon-color is unset', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip sentiment="info" icon="check">Label</pds-chip>');

    const labelColor = await page.$eval('pds-chip', (el) =>
      getComputedStyle(el.shadowRoot.querySelector('.pds-chip__label')).color,
    );
    expect(await iconColor(page, 'pds-chip')).toBe(labelColor);
  });

  it('lets a ::part() rule override dot-color and icon-color', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        pds-chip::part(dot) { background: rgb(0, 0, 255); }
        pds-chip::part(icon) { color: rgb(0, 0, 255); }
      </style>
      <pds-chip dot dot-color="rgb(255, 0, 0)" icon="check" icon-color="rgb(255, 0, 0)">Label</pds-chip>
    `);

    expect(await dotBackground(page, 'pds-chip')).toBe('rgb(0, 0, 255)');
    expect(await iconColor(page, 'pds-chip')).toBe('rgb(0, 0, 255)');
  });

  it('has no axe violations with a custom dot and icon color', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip dot dot-color="success" icon="check" icon-color="success">Active</pds-chip>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-chip subtle and solid sentiments', () => {
  const colors = (page, selector: string) =>
    page.$eval(selector, (el) => {
      const host = getComputedStyle(el);
      const label = el.shadowRoot.querySelector('.pds-chip__label, .pds-chip__button');
      return { background: host.backgroundColor, border: host.borderTopColor, text: getComputedStyle(label).color };
    });

  const WHITE = 'rgb(255, 255, 255)';
  const GREY_900 = 'rgb(52, 51, 50)';

  it('renders subtle as a white chip with a grey border in light mode', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip sentiment="subtle">Beta</pds-chip>');

    expect(await colors(page, 'pds-chip')).toEqual({ background: WHITE, border: 'rgb(210, 209, 209)', text: GREY_900 });
  });

  it('renders solid as a dark chip with no visible border in light mode', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip sentiment="solid">New</pds-chip>');

    expect(await colors(page, 'pds-chip')).toEqual({ background: GREY_900, border: 'rgba(0, 0, 0, 0)', text: WHITE });
  });

  it('flips subtle and solid in dark mode', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div data-theme="dark">
        <pds-chip id="subtle" sentiment="subtle">Beta</pds-chip>
        <pds-chip id="solid" sentiment="solid">New</pds-chip>
      </div>
    `);

    expect(await colors(page, '#subtle')).toEqual({ background: GREY_900, border: 'rgb(155, 154, 152)', text: WHITE });
    expect(await colors(page, '#solid')).toEqual({ background: WHITE, border: 'rgba(0, 0, 0, 0)', text: GREY_900 });
  });

  it('keeps the solid border invisible while the dropdown is hovered', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip sentiment="solid" variant="dropdown">Menu</pds-chip>');

    await (await page.find('pds-chip')).hover();

    const { background, border } = await colors(page, 'pds-chip');
    expect(background).toBe('rgb(26, 26, 25)');
    expect(border).toBe('rgba(0, 0, 0, 0)');
  });

  it('has no axe violations for subtle and solid chips', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip sentiment="subtle" dot>Beta</pds-chip>
      <pds-chip sentiment="solid" dot>New</pds-chip>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-chip accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip>Active</pds-chip>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
