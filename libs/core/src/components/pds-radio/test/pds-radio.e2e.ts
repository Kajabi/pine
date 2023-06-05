import { newE2EPage } from '@stencil/core/testing';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio></pds-radio>');

    const element = await page.find('pds-radio');
    expect(element).toHaveClass('hydrated');
  });
});
