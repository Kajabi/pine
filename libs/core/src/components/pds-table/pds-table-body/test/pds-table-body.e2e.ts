import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-body', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-body></pds-table-body>');

    const element = await page.find('pds-table-body');
    expect(element).toHaveClass('hydrated');
  });
});
