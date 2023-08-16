import { newE2EPage } from '@stencil/core/testing';

describe('pds-sortable', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable></pds-sortable>');

    const element = await page.find('pds-sortable');
    expect(element).toHaveClass('hydrated');
  });
});
