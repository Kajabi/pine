import { newE2EPage } from '@stencil/core/testing';

describe('pds-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tab></pds-tab>');

    const element = await page.find('pds-tab');
    expect(element).toHaveClass('hydrated');
  });
});
