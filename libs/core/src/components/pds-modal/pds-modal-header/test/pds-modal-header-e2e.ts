import { newE2EPage } from '@stencil/core/testing';

describe('pds-modal-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal-header></pds-modal-header>');

    const element = await page.find('pds-modal-header');
    expect(element).toHaveClass('hydrated');
  });
});