import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-box per-side borders', () => {
  it('applies a border only to the side that is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-block-end="true">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-block-end-width')).toBe('1px');
    expect(styles.getPropertyValue('border-block-start-width')).toBe('0px');
    expect(styles.getPropertyValue('border-inline-start-width')).toBe('0px');
    expect(styles.getPropertyValue('border-inline-end-width')).toBe('0px');
  });

  it('removes a single side when it is set to false alongside border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border="true" border-block-end="false">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-block-end-width')).toBe('0px');
    expect(styles.getPropertyValue('border-block-start-width')).toBe('1px');
    expect(styles.getPropertyValue('border-inline-start-width')).toBe('1px');
    expect(styles.getPropertyValue('border-inline-end-width')).toBe('1px');
  });

  it('uses border-color on a per-side border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-inline-start="true" border-color="#0072ef">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-inline-start-color')).toBe('rgb(0, 114, 239)');
  });

  it('has no accessibility violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box border-block-end="true">Box</pds-box>');

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
