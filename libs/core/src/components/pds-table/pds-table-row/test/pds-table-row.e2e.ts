import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-row></pds-table-row>');

    const element = await page.find('pds-table-row');
    expect(element).toHaveClass('hydrated');
  });
});
