import { newE2EPage } from '@stencil/core/testing';

describe('pds-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar></pds-avatar>');

    const element = await page.find('pds-avatar');
    expect(element).toHaveClass('hydrated');
  });
});
