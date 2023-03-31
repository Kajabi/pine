import { newE2EPage } from "@stencil/core/testing";

describe('sage-tooltip', () => {
  it('toggles the opened state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-tooltip></sage-tooltip>');
    const component = await page.find('sage-tooltip');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-tooltip');
    let value = await element.getProperty('opened');
    expect(value).toBe(false);

    component.setProperty('opened', 'true');
    await page.waitForChanges();
    value = await element.getProperty('opened');
    expect(value).toBe(true);
  });
});
