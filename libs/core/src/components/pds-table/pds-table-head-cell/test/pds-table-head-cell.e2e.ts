import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-head-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-head-cell></pds-table-head-cell>');

    const element = await page.find('pds-table-head-cell');
    expect(element).toHaveClass('hydrated');
  });
});
