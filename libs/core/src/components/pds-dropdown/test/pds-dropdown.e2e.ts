import { newE2EPage } from '@stencil/core/testing';

describe('pds-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown></pds-dropdown>');

    const element = await page.find('pds-dropdown');
    expect(element).toHaveClass('hydrated');
  });
});
