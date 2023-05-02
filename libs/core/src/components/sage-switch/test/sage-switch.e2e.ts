import { newE2EPage } from '@stencil/core/testing';

describe('sage-switch', () => {
  it('renders a checked input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-switch></sage-switch>');
    const component = await page.find('sage-switch');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-switch >>> input');
    let value = await element.getProperty('checked');
    expect(value).toBe(false);

    component.setProperty('checked', 'true');
    await page.waitForChanges();
    value = await element.getProperty('checked');
    expect(value).toBe(true);
  });

  it('renders a disabled input', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-switch></sage-switch>');
    const component = await page.find('sage-switch');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-switch >>> input');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders an invalid input', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-switch></sage-switch>');
    const component = await page.find('sage-switch');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-switch >>> input');
    let value = await element.getAttribute('aria-invalid');
    expect(value).toBe(null);

    component.setProperty('invalid', 'true');
    await page.waitForChanges();
    value = await element.getAttribute('aria-invalid');
    expect(value).toBe("true");
  });

  it('renders an invalid input with error message', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-switch invalid="true" error-message="Please correct this item"></sage-switch>');
    const component = await page.find('sage-switch');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-switch >>> input');
    const errorText = await page.find('sage-switch >>> .sage-switch__error-message');
    const value = element.getAttribute('aria-invalid');
    expect(value).toBe("true");
    expect(errorText.textContent).toEqual(`Please correct this item`);
  });
});
