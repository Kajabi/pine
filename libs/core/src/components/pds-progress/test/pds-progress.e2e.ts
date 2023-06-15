import { newE2EPage } from '@stencil/core/testing';

describe('pds-progress', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress></pds-progress>');

    const element = await page.find('pds-progress');
    expect(element).toHaveClass('hydrated');
  });
});
