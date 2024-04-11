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
    await page.setContent('<pds-avatar variant="admin"></pds-avatar>');

    const component = await page.find('pds-avatar');
    expect(component).toHaveClass('pds-avatar--admin');
  });

  it('renders avatar with size prop and correct corresponding style', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar size="xl"></pds-avatar>');

    const div = (await page.find('pds-avatar')).shadowRoot.querySelector('div');
    expect(div).toEqualAttribute('style', 'height: 64px; width: 64px;');
  });

  it('should render image when prop is set and not render default icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar image="https://placehold.co/64x64"></pds-avatar>');

    const image = await page.find('pds-avatar >>> img');

    await page.waitForChanges();
    expect(image).not.toBeNull();

    const avatar = await page.find('pds-avatar');
    expect(avatar.shadowRoot.querySelector('pds-icon')).toBeNull();
  })
});
