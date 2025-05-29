import { newE2EPage } from '@stencil/core/testing';

describe('pds-toast', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-toast></pds-toast>');

    const element = await page.find('pds-toast');
    expect(element).toHaveClass('hydrated');
  });
});
