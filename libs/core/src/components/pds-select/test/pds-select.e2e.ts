import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-select></pds-select>');

    const element = await page.find('pds-select');
    expect(element).toHaveClass('hydrated');
  });
});
