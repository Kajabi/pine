import { newE2EPage } from '@stencil/core/testing';

describe('pds-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link></pds-link>');
    const element = await page.find('pds-link');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the href', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link"></pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link >>> a');
    expect(element.textContent).toEqual(`#some-bookmark-link`);

    component.setProperty('href', '#my-new-bookmark');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`#my-new-bookmark`);
  });

  it('renders the slot when used', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link">This is slot content</pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link');
    expect(element.textContent).toEqual(`This is slot content`);
  });
});
