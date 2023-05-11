import { newE2EPage } from "@stencil/core/testing";

describe('sage-tooltip', () => {
  it('fires event on focus', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip content="tooltip content"><button id="trigger">Secondary</button></sage-tooltip>');

    const trigger = await page.find('#trigger');
    const component = await page.find('sage-tooltip >>> .sage-tooltip');
    const overlay = await page.find('sage-tooltip >>> .sage-tooltip__content');

    trigger.focus();
    await page.waitForChanges();

    expect(component).toHaveClass('sage-tooltip--is-open');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(overlay.getAttribute('aria-live')).toBe('polite');

    const c = await page.find('sage-tooltip');
    expect(await c.getProperty('opened')).toEqual(true);
  })
});
