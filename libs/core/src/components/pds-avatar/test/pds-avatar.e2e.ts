import { newE2EPage } from '@stencil/core/testing';

describe('pds-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar></pds-avatar>');

    const element = await page.find('pds-avatar');
    expect(element).toHaveClass('hydrated');
  });

  it('renders admin variant with correct class', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-avatar variant="admin"></sage-avatar>');
    const component = await page.find('sage-avatar');
    expect(component).toHaveClass('sage-avatar--admin');
  });

  it('renders avatar with size prop and correct class', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-avatar size="xl"></sage-avatar>');
    const component = await page.find('sage-avatar');
    expect(component).toHaveClass('sage-avatar--xl');
  });

  it('should render image when prop is set and not render default icon', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-avatar image="https://placehold.co/64x64"></sage-avatar>');
    const image = await page.find('sage-avatar >>> img');
    expect(image).toBeTruthy();

    const defaultIcon = await page.find('sage-avatar >>> .sage-avatar[name="user-fulfilled"]');
    expect(defaultIcon).toBeNull();
  })
});
