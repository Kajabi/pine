import { newE2EPage } from '@stencil/core/testing';

describe('pds-copytext', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-copytext></pds-copytext>');

    const element = await page.find('pds-copytext');
    expect(element).toHaveClass('hydrated');
  });
});
