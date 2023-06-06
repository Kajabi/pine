import { newE2EPage } from '@stencil/core/testing';

describe('pds-tabpanel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tabpanel></pds-tabpanel>');

    const element = await page.find('pds-tabpanel');
    expect(element).toHaveClass('hydrated');
  });
});
