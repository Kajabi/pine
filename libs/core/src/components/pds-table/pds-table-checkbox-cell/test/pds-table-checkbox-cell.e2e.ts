import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-checkbox-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-checkbox-cell></pds-table-checkbox-cell>');

    const element = await page.find('pds-table-checkbox-cell');
    expect(element).toHaveClass('hydrated');
  });
});
