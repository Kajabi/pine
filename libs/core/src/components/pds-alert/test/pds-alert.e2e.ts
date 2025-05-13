import { newE2EPage } from '@stencil/core/testing';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert></pds-alert>');

    const element = await page.find('pds-alert');
    expect(element).toHaveClass('hydrated');
  });
});
