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


  it('fires event on focus', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip content="tooltip content"><button id="trigger">Secondary</button></sage-tooltip>');

    const component = await page.find('sage-tooltip');
    const trigger = await page.find('#trigger');
    const overlay = await page.find('sage-tooltip >>> .sage-tooltip');
    // console.log('page: ', page);
    // const eventSpy = await page.spyOnEvent('sageTooltipShow');

    console.log('component: ', component);
    component.focus();
    trigger.focus();
    await page.waitForChanges();

    // const medthodSpy = await component.callMethod('showTooltip');

    // expect(eventSpy).toHaveReceivedEventTimes(1);
    console.log('component: ', component);
    expect(overlay).toHaveClass('sage-tooltip--is-open');
    expect(component).toHaveAttribute('opened');


    // const el = await page.find('sage-tooltip');

    // let isFocused = await el.evaluate((el) => el === document.activeElement)
    // expect(isFocused).toBeFalsy()

    // await el.evaluate(async (e) => {
    //     await (e as HTMLRuxInputElement).setFocus()
    // })

    // isFocused = await el.evaluate((el) => el === document.activeElement)
    // expect(isFocused).toBeTruthy()
  })
});
