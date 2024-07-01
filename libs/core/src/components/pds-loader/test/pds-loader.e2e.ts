import { newE2EPage } from '@stencil/core/testing';

describe('pds-loader', () => {
  it('is not visible when isLoading prop is false', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-loader is-loading="false"></pds-loader>');

    const element = await page.find('pds-loader');
    expect(element).toHaveClass('pds-loader--hidden');
  });
});
