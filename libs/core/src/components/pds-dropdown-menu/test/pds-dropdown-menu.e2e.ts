import { newE2EPage } from '@stencil/core/testing';

describe('pds-dropdown-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu></pds-dropdown-menu>');

    const element = await page.find('pds-dropdown');
    expect(element).toHaveClass('hydrated');
  });
});
