
import { newE2EPage } from "@stencil/core/testing";

describe('sage-input', () => {
  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-input></sage-input>');
    const component = await page.find('sage-input');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-input >>> input');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('toggles an error state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-input></sage-input>');
    const component = await page.find('sage-input');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-input >>> input');
    let value = await element.getProperty('error-text');
    expect(value).toBe(false);

    component.setProperty('error-text', 'true');
    await page.waitForChanges();
    value = await element.getProperty('error-text');
    expect(value).toBe(true);
  });
});
