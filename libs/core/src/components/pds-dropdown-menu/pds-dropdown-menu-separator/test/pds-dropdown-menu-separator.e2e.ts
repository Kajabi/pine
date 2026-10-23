import { newE2EPage } from '@stencil/core/testing';

describe('pds-dropdown-menu-separator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-separator></pds-dropdown-menu-separator>');

    const element = await page.find('pds-dropdown-menu-separator');
    expect(element).toHaveClass('hydrated');
  });

  it('renders properly', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-separator></pds-dropdown-menu-separator>');

    const element = await page.find('pds-dropdown-menu-separator');
    
    // Simply check that the component renders properly
    expect(element).toHaveClass('hydrated');
    expect(element).toBeDefined();
  });

  it('does not apply component-id as the id attribute', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-separator component-id="test-separator"></pds-dropdown-menu-separator>');

    const element = await page.find('pds-dropdown-menu-separator');
    expect(element.id).toBe('');
  });

  it('keeps an author-set id even when component-id is also set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-separator id="author-id" component-id="test-separator"></pds-dropdown-menu-separator>');

    const element = await page.find('pds-dropdown-menu-separator');
    expect(element.id).toBe('author-id');
  });
});
