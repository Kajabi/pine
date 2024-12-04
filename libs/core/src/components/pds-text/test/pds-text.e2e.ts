import { newE2EPage } from '@stencil/core/testing';

describe('pds-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text></pds-text>');

    const element = await page.find('pds-text');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with italic style when attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text tag="p" italic></pds-text>');

    const el = await page.find('pds-text >>> p');

    expect((await el.getComputedStyle()).getPropertyValue('font-style')).toBe('italic');
  });

  it('renders with truncate style when attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-text tag="h1" truncate></pds-text>');

    const el = await page.find('pds-text >>> h1');

    expect((await el.getComputedStyle()).getPropertyValue('text-overflow')).toBe('ellipsis');
  });
});
