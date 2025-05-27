import { newE2EPage } from '@stencil/core/testing';

describe('pds-modal-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal-content></pds-modal-content>');

    const element = await page.find('pds-modal-content');
    expect(element).toHaveClass('hydrated');
  });
});