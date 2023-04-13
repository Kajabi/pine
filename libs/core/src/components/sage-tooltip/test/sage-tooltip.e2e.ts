import { newE2EPage } from "@stencil/core/testing";

describe('sage-tooltip', () => {
  it('fires event on focus', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip content="tooltip content"><button id="trigger">Secondary</button></sage-tooltip>');

    const trigger = await page.find('#trigger');
    const overlay = await page.find('sage-tooltip >>> .sage-tooltip');

    trigger.focus();
    await page.waitForChanges();

    expect(overlay).toHaveClass('sage-tooltip--is-open');

    const c = await page.find('sage-tooltip');
    expect(await c.getProperty('opened')).toEqual(true);
  })
});
