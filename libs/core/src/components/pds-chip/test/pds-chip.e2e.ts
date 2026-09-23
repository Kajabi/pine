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

  it('renders large size via deprecated large prop with pds-chip--lg class', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip large>Large</pds-chip>');

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

  it('makes the label focusable only when max-width is set, so a focus tooltip can fire', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-chip max-width="120px">Truncated</pds-chip>
      <pds-chip>Plain</pds-chip>
    `);

    const [truncated, plain] = await page.$$eval('pds-chip', (els) =>
      els.map((el) => el.shadowRoot.querySelector('.pds-chip__label-text').getAttribute('tabindex')),
    );

    expect(truncated).toBe('0');
    expect(plain).toBeNull();
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

describe('pds-chip accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip>Active</pds-chip>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
