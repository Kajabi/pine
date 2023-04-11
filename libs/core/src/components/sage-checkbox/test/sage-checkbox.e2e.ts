import { newE2EPage } from '@stencil/core/testing';

describe('sage-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with id when checkboxId prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input');
    expect(checkbox?.id).toEqual('default');
  });

  it('renders checkbox as checked', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" checked />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input#default');
    const checked = await checkbox.getProperty('checked');
    expect(await checked).toEqual(true);
  });

  it('renders checkbox as unchecked', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input#default');
    const checked = await checkbox.getProperty('checked');
    expect(await checked).toEqual(false);
  });

  it('renders checkbox in disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" disabled />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input#default');
    const disabled = await checkbox.getProperty('disabled');
    expect(await disabled).toEqual(true);
  });

  it('renders checkbox in invalid state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" invalid />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> div');
    expect(await checkbox).toHaveClass('sage-checkbox--invalid');
  });

  it('renders checkbox in indeterminate state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" indeterminate />');

    const element = await page.find('sage-checkbox');
    expect(await element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> div');
    expect(await checkbox).toHaveClass('sage-checkbox--indeterminate');
  });

  it('renders label text', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" label="Label text" />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const label = await page.find('sage-checkbox >>> label');
    expect(await label.innerText).toBe('Label text');
  });

  it('renders message text', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" message="This is short message text" />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const message = await page.find('sage-checkbox >>> .sage-checkbox__message');
    expect(await message.innerText).toBe('This is short message text');
  });

  it('renders checkbox as required', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" required />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input#default');
    const required = await checkbox.getProperty('required');
    expect(await required).toEqual(true);
  });

  it('sets input value attribute', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-checkbox checkbox-id="default" value="This is the input value" />');

    const element = await page.find('sage-checkbox');
    expect(element).toHaveClass('hydrated');

    const checkbox = await page.find('sage-checkbox >>> input#default');
    const value = await checkbox.getProperty('value');
    expect(await value).toBe('This is the input value');
  });
});
