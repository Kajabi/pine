import { newE2EPage } from '@stencil/core/testing';

describe('sage-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const element = await page.find('sage-button');
    expect(element).toHaveClass('hydrated');
  });

  it('renders when slot is used', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button>Test Content</sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button');
    // Question: When should I use `toBe` and when should I use `toEqual`?
    expect(element.textContent).toBe('Test Content');
  });

  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button >>> button');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders toggle of icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-button></sage-button>');
    const component = await page.find('sage-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('sage-button >>> button');
    let icon = await element.find('svg');
    expect(icon).toBeNull();

    component.setProperty('icon', 'trashIcon');
    await page.waitForChanges();
    icon = await element.find('svg');
    expect(icon).not.toBeNull();
  });
});
