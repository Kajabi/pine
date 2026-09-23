import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');
  });

  it('renders vertically when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider vertical="true" />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector('hr');
    expect(hr).toHaveClass('pds-divider--vertical');
  });

  it('renders with offset applied when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider offset="lg" />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector('hr');
    expect(hr).toHaveClass('pds-divider--offset-lg');
  });

  it('renders the label between two lines of equal width', async () => {
    const page = await newE2EPage();
    await page.setContent('<div style="width: 400px"><pds-divider label="Today"></pds-divider></div>');

    const layout = await page.evaluate(() => {
      const divider = document.querySelector('pds-divider').shadowRoot.querySelector('.pds-divider');
      const before = getComputedStyle(divider, '::before');
      const after = getComputedStyle(divider, '::after');
      return {
        dividerWidth: divider.getBoundingClientRect().width,
        beforeWidth: parseFloat(before.width),
        afterWidth: parseFloat(after.width),
        lineHeight: before.height,
      };
    });

    expect(layout.dividerWidth).toBe(400);
    expect(layout.beforeWidth).toBeGreaterThan(0);
    expect(layout.beforeWidth).toBeCloseTo(layout.afterWidth, 0);
    expect(layout.lineHeight).toBe('1px');
  });

  it('bleeds the labeled divider past its container when offset is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<div style="width: 400px"><pds-divider label="Today" offset="lg"></pds-divider></div>');

    const dividerWidth = await page.evaluate(() => {
      const divider = document.querySelector('pds-divider').shadowRoot.querySelector('.pds-divider');
      return divider.getBoundingClientRect().width;
    });

    expect(dividerWidth).toBe(464);
  });

  it('allows the label color to be customized through the label part', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>pds-divider::part(label) { color: rgb(255, 0, 0); }</style>
      <pds-divider label="Today"></pds-divider>
    `);

    const color = await page.evaluate(() => {
      const label = document.querySelector('pds-divider').shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).color;
    });

    expect(color).toBe('rgb(255, 0, 0)');
  });
});

describe('pds-divider accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider></pds-divider>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with a label', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider label="Today"></pds-divider>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
