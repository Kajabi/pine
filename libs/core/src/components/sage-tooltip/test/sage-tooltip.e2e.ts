import { newE2EPage } from "@stencil/core/testing";

describe('sage-tooltip', () => {
  it('toggles the disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip></sage-tooltip>');
    const component = await page.find('sage-tooltip');
    expect(component).toHaveClass('hydrated');

    let value = await component.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await component.getProperty('disabled');
    expect(value).toBe(true);
  });

  // it('does not show when disabled is true', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip></sage-tooltip>');
  //   const component = await page.find('sage-tooltip');

  //   let value = await component.getProperty('disabled');
  //   expect(value).toBe(false);

  //   component.setProperty('disabled', 'true');
  //   await page.waitForChanges();

  //   console.log('component: ', component);
  //   // how to click on target in slot
  //   const slot = component.shadowRoot.querySelector('slot');
  //   const slotContent = slot!.assignedNodes()[0] as HTMLSlotElement;
  //   console.log('slot: ', slotContent)
  // });

  it('emits the sageTooltipShow event when open is true', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip></sage-tooltip>');

    const tooltip = await page.find('sage-tooltip');
    const sageTooltipShow = await page.spyOnEvent('sageTooltipShow');

    let value = await tooltip.getProperty('opened');
    expect(value).toBe(false);

    // TODO: Event firing but test isn't passing
    tooltip.setProperty('open', 'true');
    // tooltip.hover();
    await page.waitForChanges();
    value = await tooltip.getProperty('true');
    expect(sageTooltipShow).toHaveReceivedEventTimes(1);
  });

  // unit test
  it('shows the tooltip when the sageTooltipShow function is called', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip></sage-tooltip>');

    const component = await page.find('sage-tooltip');
    let value = await component.getProperty('opened');

    component.callMethod('showTooltip');
    await page.waitForChanges();

    value = await component.getProperty('opened');
    expect(value).toBe(true);
  });

  it('hides the tooltip when the sageTooltipHide function is called', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip></sage-tooltip>');

    const component = await page.find('sage-tooltip');
    let value = await component.getProperty('opened');

    // unit test
    component.callMethod('showTooltip');
    await page.waitForChanges();
    component.callMethod('hideTooltip');
    await page.waitForChanges();

    value = await component.getProperty('opened');
    expect(value).toBe(false);
  });

  it('on focus in, shows the tooltip', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip><a href="#">Trigger</a></sage-tooltip>');

    const body = document.querySelector('body');
    console.log('body: ', body?.shadowRoot);
    body?.click();
    await page.waitForChanges();
    console.log('document: ', await page.evaluate(() => document.activeElement));

    // const component = await page.find('sage-tooltip');
    // const trigger = await page.find('sage-tooltip >>> .sage-tooltip__trigger:first-child');

    // await component.focus();
    // await page.waitForChanges();
    // console.log('component: ', component);
    // page.keyboard.down("Tab");
    // expect(component).toHaveProperty('opened');
  });
});
