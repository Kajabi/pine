import { newE2EPage } from "@stencil/core/testing";

describe('pds-tooltip', () => {
  it('fires event on focus', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tooltip content="tooltip content"><button id="trigger">Secondary</button></pds-tooltip>');

    const trigger = await page.find('#trigger');
    const component = await page.find('pds-tooltip >>> pds-popover'); 
    const overlay = await page.find('pds-tooltip >>> pds-popover >>> .pds-popover__content'); 

    trigger.focus(); 
    await page.waitForChanges();

    expect(component).toHaveClass('pds-popover--is-open');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(overlay.getAttribute('aria-live')).toBe('polite');

    const c = await page.find('pds-tooltip');
    expect(await c.getProperty('opened')).toEqual(true);
  })
}); 
