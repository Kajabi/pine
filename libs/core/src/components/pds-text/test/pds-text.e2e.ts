import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

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
});

describe('pds-text accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text>Body text</pds-text>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
