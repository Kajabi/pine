import { newE2EPage } from '@stencil/core/testing';

describe('doc-args-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<doc-args-table></doc-args-table>');

    const element = await page.find('doc-args-table');
    expect(element).toHaveClass('hydrated');
  });
});
