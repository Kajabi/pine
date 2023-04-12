import { newE2EPage } from "@stencil/core/testing";

describe('sage-tooltip', () => {
  // it('toggles the disabled state', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip></sage-tooltip>');
  //   const component = await page.find('sage-tooltip');
  //   expect(component).toHaveClass('hydrated');

  //   let value = await component.getProperty('disabled');
  //   expect(value).toBe(false);

  //   component.setProperty('disabled', 'true');
  //   await page.waitForChanges();
  //   value = await component.getProperty('disabled');
  //   expect(value).toBe(true);
  // });

  // // it('does not show when disabled is true', async () => {
  // //   const page = await newE2EPage();
  // //   await page.setContent('<sage-tooltip></sage-tooltip>');
  // //   const component = await page.find('sage-tooltip');

  // //   let value = await component.getProperty('disabled');
  // //   expect(value).toBe(false);

  // //   component.setProperty('disabled', 'true');
  // //   await page.waitForChanges();

  // //   console.log('component: ', component);
  // //   // how to click on target in slot
  // //   const slot = component.shadowRoot.querySelector('slot');
  // //   const slotContent = slot!.assignedNodes()[0] as HTMLSlotElement;
  // //   console.log('slot: ', slotContent)
  // // });

  // // it('emits the sageTooltipShow event when open is true', async () => {
  // //   const page = await newE2EPage();
  // //   await page.setContent('<sage-tooltip></sage-tooltip>');

  // //   const tooltip = await page.find('sage-tooltip');
  // //   const sageTooltipShow = await page.spyOnEvent('sageTooltipShow');

  // //   let value = await tooltip.getProperty('opened');
  // //   expect(value).toBe(false);

  // //   // TODO: Event firing but test isn't passing
  // //   tooltip.setProperty('open', 'true');
  // //   // tooltip.hover();
  // //   await page.waitForChanges();
  // //   value = await tooltip.getProperty('true');
  // //   expect(sageTooltipShow).toHaveReceivedEventTimes(1);
  // // });


  // it('emits the sageTooltipShow event when open is true', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip disabled="false" content="Tooltip content">Trigger</sage-tooltip>');

  //   const component = await page.find('sage-tooltip');
  //   const sageTooltipShow = await page.spyOnEvent('sageTooltipShow');

  //   await page.$eval('sage-tooltip', (el) => {
  //     el.setAttribute('opened', 'true')
  //   });

  //   const value = await component.getProperty('opened');
  //   await expect(value).toBe(true);
  //   expect(sageTooltipShow).toHaveReceivedEventTimes(1);
  // });

  // it('emits the sageTooltipHide event when open is false', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip disabled="false" opened="true" content="Tooltip content">Trigger</sage-tooltip>');

  //   const component = await page.find('sage-tooltip');
  //   const sageTooltipHide = await page.spyOnEvent('sageTooltipHide');

  //   await page.$eval('sage-tooltip', (el) => {
  //     el.removeAttribute('opened')
  //   });

  //   const value = await component.getProperty('opened');
  //   await expect(value).toBe(false);
  //   expect(sageTooltipHide).toHaveReceivedEventTimes(1);
  // });


  // unit test
  // it('shows the tooltip when the sageTooltipShow function is called', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip></sage-tooltip>');

  //   const component = await page.find('sage-tooltip');
  //   let value = await component.getProperty('opened');

  //   component.callMethod('showTooltip');
  //   await page.waitForChanges();

  //   value = await component.getProperty('opened');
  //   expect(value).toBe(true);
  // });

  // it('hides the tooltip when the sageTooltipHide function is called', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip></sage-tooltip>');

  //   const component = await page.find('sage-tooltip');
  //   let value = await component.getProperty('opened');

  //   // unit test
  //   component.callMethod('showTooltip');
  //   await page.waitForChanges();
  //   component.callMethod('hideTooltip');
  //   await page.waitForChanges();

  //   value = await component.getProperty('opened');
  //   expect(value).toBe(false);
  // });

  // it('on mouseOut in, shows the tooltip', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip disabled="false" content="tooltip content"><a href="#">Trigger</a></sage-tooltip>');

  //   // const trigger = await page.find('sage-tooltip');
  //   // trigger.shadowRoot.querySelector(':first-child');
  //   const trigger = await page.find('sage-tooltip >>> .sage-tooltip__trigger:first-child');
  //   const component = await page.find('sage-tooltip');

  //   await trigger.hover();

  //   // await expect(component).toHaveAttribute
  //   const value = await component.getProperty('opened');
  //   await expect(value).toBe(true);
  // });

  // it(`default trigger (focus)`, async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sage-tooltip disabled="false" content="tooltip content"><a href="#">Trigger</a></sage-tooltip>');
  //   const component = await page.find('sage-tooltip');

  //   await page.keyboard.press('Tab')
  //   await page.waitForChanges();

  //   const value = await component.getProperty('opened');
  //   expect(value).toBe(true);
  // })

  it('calls the showTooltipShow method', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip content="tooltip content"><button>Secondary</button></sage-tooltip>');

    // const component = await page.find('sage-tooltip');

    // const button = await page.find('button');
    // button.focus();
    // await page.waitForChanges();

    // const tooltipClass = await page.find('sage-tooltip >>> .sage-tooltip--is-open');
    // expect(tooltipClass).toBe(true);
    // component.callMethod('showTooltip');

    // const value = component.getProperty('opened');
    // expect(value).toBe(true);


    // await expect(showTooltipMethoValue).toBe(true);
  });
});
