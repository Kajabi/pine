import { newE2EPage } from '@stencil/core/testing';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table></pds-table>');

    const element = await page.find('pds-table');
    expect(element).toHaveClass('hydrated');
  });
});
