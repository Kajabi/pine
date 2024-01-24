import { newE2EPage } from "@stencil/core/testing";

describe('pds-popover E2E', () => {
  it('toggles popover visibility on trigger click', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="default"><pds-button variant="secondary">Toggle Popover</pds-button></pds-popover>');

    const popover = await page.find('pds-popover');
    expect(popover).toHaveClass('hydrated');

    // open popover
    const triggerButton = await page.find('pds-popover pds-button');
    await triggerButton.click();

    const popoverContent = await page.find('pds-popover >>> .pds-popover__content');
    expect(await popoverContent.isVisible()).toBeTruthy();
    expect(await popover.getProperty('opened')).toEqual(true);

    // close popover
    await triggerButton.click();
    expect(await popover.getProperty('opened')).toEqual(false);
    expect(await popoverContent.isVisible()).toBeFalsy();
  });

  it('emits "pdsPopoverShow" event when popover is shown', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="default"><pds-button variant="secondary">Toggle Popover</pds-button></pds-popover>');

    const triggerButton = await page.find('pds-popover pds-button');
    const eventSpy = await page.spyOnEvent('pdsPopoverShow');

    // open popover
    await triggerButton.click();
    expect(eventSpy).toHaveReceivedEvent();
  });

  it('emits "pdsPopoverHide" event when popover is hidden', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="default"><pds-button variant="secondary">Toggle Popover</pds-button></pds-popover>');

    const triggerButton = await page.find('pds-popover pds-button');
    const eventSpy = await page.spyOnEvent('pdsPopoverHide');

    // open popover
    await triggerButton?.click();
    
    // close popover
    await triggerButton?.click();
    expect(eventSpy).toHaveReceivedEvent();
  });
});