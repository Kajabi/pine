import { newE2EPage } from '@stencil/core/testing';

describe('pds-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion></pds-accordion>');

    const element = await page.find('pds-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
