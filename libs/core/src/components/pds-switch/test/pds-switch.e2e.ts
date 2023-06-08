import { newE2EPage } from '@stencil/core/testing';

describe('pds-switch', () => {
  it('renders a checked input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = await el.getProperty('checked');
    expect(value).toBe(false);

    component.setProperty('checked', 'true');
    await page.waitForChanges();

    value = await el.getProperty('checked');
    expect(value).toBe(true);
  });

  it('renders a disabled input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = await el.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();

    value = await el.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders an invalid input when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    let value = el.getAttribute('aria-invalid');
    expect(value).toBe(null);

    component.setProperty('invalid', 'true');
    await page.waitForChanges();

    value = el.getAttribute('aria-invalid');
    expect(value).toBe("true");
  });

  it('renders an invalid input with error message when toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch invalid="true" error-message="Please correct this item"></pds-switch>');

    const component = await page.find('pds-switch');
    expect(component).toHaveClass('hydrated');

    const el = await page.find('pds-switch >>> input');
    const errText = await page.find('pds-switch >>> .pds-switch__message--error');
    const ariaDesc = el.getAttribute('aria-describedby');
    const ariaInvalid = el.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe("true");
    expect(ariaDesc).toBeNull();
    expect(errText.textContent).toEqual(`Please correct this item`);
  });

  it('renders a helper and error message and assigns the aria-description to the input', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-switch component-id="switch-with-description" invalid="true" helper-message="This is a helper message" error-message="This is an error message"></pds-switch>');

    const component = await page.find('pds-switch');
    const el = await page.find('pds-switch >>> input');
    expect(component).toHaveClass('hydrated');

    const helperMessage = await page.find('pds-switch >>> #switch-with-description__helper-message');
    const errorMessage = await page.find('pds-switch >>> #switch-with-description__error-message');

    const ariaDesc = el.getAttribute('aria-describedby');
    const ariaInvalid = el.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe("true");
    expect(ariaDesc).toBe('switch-with-description__error-message');
    expect(helperMessage.textContent).toEqual(`This is a helper message`);
    expect(errorMessage.textContent).toEqual(`This is an error message`);
  });
});
