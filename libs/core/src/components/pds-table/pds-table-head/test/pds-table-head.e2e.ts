import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-head', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-head></pds-table-head>');

    const element = await page.find('pds-table-head');
    expect(element).toHaveClass('hydrated');
  });
});
