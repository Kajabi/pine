import { newE2EPage } from '@stencil/core/testing';

describe('pds-box per-side borders', () => {
  const widthOf = async (page, selector, side) => {
    const el = await page.find(selector);
    return (await el.getComputedStyle()).getPropertyValue(`border-${side}-width`);
  };

  it('applies a border only to the side that is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-block-end="true">Box</pds-box>');

    expect(await widthOf(page, '#target', 'block-end')).toBe('1px');
    expect(await widthOf(page, '#target', 'block-start')).toBe('0px');
    expect(await widthOf(page, '#target', 'inline-start')).toBe('0px');
    expect(await widthOf(page, '#target', 'inline-end')).toBe('0px');
  });

  it('removes a single side when it is set to false alongside border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border="true" border-block-end="false">Box</pds-box>');

    expect(await widthOf(page, '#target', 'block-end')).toBe('0px');
    expect(await widthOf(page, '#target', 'block-start')).toBe('1px');
    expect(await widthOf(page, '#target', 'inline-start')).toBe('1px');
    expect(await widthOf(page, '#target', 'inline-end')).toBe('1px');
  });

  it('uses border-color on a per-side border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-inline-start="true" border-color="#0072ef">Box</pds-box>');

    const el = await page.find('#target');
    const styles = await el.getComputedStyle();

    expect(styles.getPropertyValue('border-inline-start-color')).toBe('rgb(0, 114, 239)');
  });
});
