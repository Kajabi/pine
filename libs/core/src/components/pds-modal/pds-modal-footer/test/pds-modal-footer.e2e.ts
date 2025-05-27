import { newE2EPage } from '@stencil/core/testing';

describe('pds-modal-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal-footer></pds-modal-footer>');

    const element = await page.find('pds-modal-footer');
    expect(element).toHaveClass('hydrated');
  });
});