import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-cell></pds-table-cell>');

    const element = await page.find('pds-table-cell');
    expect(element).toHaveClass('hydrated');
  });
});
