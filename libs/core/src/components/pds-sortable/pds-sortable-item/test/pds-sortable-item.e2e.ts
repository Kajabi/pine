import { newE2EPage } from '@stencil/core/testing';

describe('pds-sortable-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-sortable-item></pds-sortable-item>');

    const element = await page.find('pds-sortable-item');
    expect(element).toHaveClass('hydrated');
  });
});
