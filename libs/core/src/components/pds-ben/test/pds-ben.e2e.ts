import { newE2EPage } from '@stencil/core/testing';

describe('pds-ben', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-ben></pds-ben>');

    const element = await page.find('pds-ben');
    expect(element).toHaveClass('hydrated');
  });
});
