import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-select></pds-select>');
    const component = await page.find('pds-select');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-select >>> select');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('toggles an error state', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-select error-message="This is error message"></pds-select>');
    const component = await page.find('pds-select');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-select >>> .pds-select__error-message');
    expect(element.textContent).toEqual('This is error message');
  });

  it('renders with options', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-select><option value="0">Option 1</option><option value="1">Option 2</option></pds-select>');
    const select = await page.find('pds-select >>> select');

    const options = await select.findAll('option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toBe('Option 1');
    expect(options[1].textContent).toBe('Option 2');
  });
});
