import { newE2EPage } from '@stencil/core/testing';

describe('pds-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-icon role="img" style="height: 16px; width: 16px;"></pds-icon>');
    const element = await page.find('pds-icon');
    expect(element).toHaveClass('hydrated');
  });
});
