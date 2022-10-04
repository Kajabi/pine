import { newE2EPage } from '@stencil/core/testing';

describe('sage-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-link></sage-link>');
    const element = await page.find('sage-link');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the href', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-link href="#some-bookmark-link"></sage-link>');
    const component = await page.find('sage-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-link >>> a');
    expect(element.textContent).toEqual(`#some-bookmark-link`);

    component.setProperty('href', '#my-new-bookmark');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`#my-new-bookmark`);
  });

  it('renders the slot when used', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-link href="#some-bookmark-link"><p slot="text">This is slot content</p></sage-link>');
    const component = await page.find('sage-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-link p[slot="text"]');
    expect(element.textContent).toEqual(`This is slot content`);
  });
});
